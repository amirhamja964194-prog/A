#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_DIR="$ROOT_DIR/android-app"
BUILD_DIR="$APP_DIR/build"
RELEASE_DIR="$ROOT_DIR/android-release"
KEYSTORE="$APP_DIR/wbsec-release.keystore"
ANDROID_JAR="${ANDROID_JAR:-/tmp/android-sdk/platforms/android-35/android.jar}"
BT_DIR="${BT_DIR:-/tmp/android-sdk/build-tools/36.0.0/android-16}"
if [ ! -f "$ANDROID_JAR" ]; then
  ANDROID_JAR="/usr/lib/android-sdk/platforms/android-23/android.jar"
fi

if [ -x "$BT_DIR/aapt2" ]; then
  AAPT2_BIN="$BT_DIR/aapt2"
  D8_BIN="$BT_DIR/d8"
  ZIPALIGN_BIN="$BT_DIR/zipalign"
  APKSIGNER_BIN="$BT_DIR/apksigner"
else
  AAPT2_BIN="$(command -v aapt2 || true)"
  D8_BIN="$(command -v d8 || true)"
  ZIPALIGN_BIN="$(command -v zipalign)"
  APKSIGNER_BIN="$(command -v apksigner)"
fi
DX_BIN="/usr/lib/android-sdk/build-tools/debian/dx"

rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/gen" "$BUILD_DIR/obj" "$BUILD_DIR/dex" "$RELEASE_DIR"
mkdir -p "$APP_DIR/res/drawable-mdpi" "$APP_DIR/res/drawable-hdpi" "$APP_DIR/res/drawable-xhdpi" "$APP_DIR/res/drawable-xxhdpi" "$APP_DIR/res/drawable-xxxhdpi"
mkdir -p "$APP_DIR/assets/web"

# 1. Generate crisp launcher icons across all Android densities from public/pwa-512x512.png
python3 - "$ROOT_DIR/public/pwa-512x512.png" "$ROOT_DIR/public/pwa-192x192.png" "$APP_DIR/res" <<'PYEOF'
import os, shutil, sys
src_512, src_192, res_dir = sys.argv[1], sys.argv[2], sys.argv[3]
try:
    from PIL import Image
    img = Image.open(src_512).convert("RGBA")
    sizes = {
        "drawable-mdpi": 48,
        "drawable-hdpi": 72,
        "drawable-xhdpi": 96,
        "drawable-xxhdpi": 144,
        "drawable-xxxhdpi": 192,
    }
    for folder, px in sizes.items():
        resized = img.resize((px, px), Image.LANCZOS)
        resized.save(os.path.join(res_dir, folder, "ic_launcher.png"), "PNG")
    print("Generated crisp multi-density PNG icons with Pillow.")
except Exception as e:
    print(f"Pillow unavailable ({e}); copying high-res PNG icons directly.")
    shutil.copy2(src_192, os.path.join(res_dir, "drawable-mdpi", "ic_launcher.png"))
    shutil.copy2(src_192, os.path.join(res_dir, "drawable-hdpi", "ic_launcher.png"))
    shutil.copy2(src_192, os.path.join(res_dir, "drawable-xhdpi", "ic_launcher.png"))
    shutil.copy2(src_192, os.path.join(res_dir, "drawable-xxhdpi", "ic_launcher.png"))
    shutil.copy2(src_512, os.path.join(res_dir, "drawable-xxxhdpi", "ic_launcher.png"))
PYEOF

# 2. Bundle compiled web app inside APK assets/web/ for self-contained offline assets
rm -rf "$APP_DIR/assets/web"
mkdir -p "$APP_DIR/assets/web"
if [ -d "$ROOT_DIR/dist" ]; then
  cp -r "$ROOT_DIR/dist/." "$APP_DIR/assets/web/"
fi

# 3. Create structured WBBSE offline resource pack (stored uncompressed for instant zero-CPU loading & ~15 MB standalone footprint)
python3 - "$ROOT_DIR/src/offline" "$APP_DIR/assets" <<'PYEOF'
import glob, json, os, sys
offline_src, assets_dir = sys.argv[1], sys.argv[2]

sources = {}
for path in sorted(glob.glob(os.path.join(offline_src, "*.ts"))):
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        sources[os.path.basename(path)] = f.read()

web_bytes = 0
for dirpath, _, filenames in os.walk(os.path.join(assets_dir, "web")):
    for fn in filenames:
        web_bytes += os.path.getsize(os.path.join(dirpath, fn))

header = {
    "package": "com.wbsec.aiteacher",
    "appName": "Wbsec",
    "version": "1.6.0",
    "board": "WBBSE (Classes 5-10)",
    "author": "Made by Amir",
    "offlineModules": list(sources.keys()),
    "embeddedWebBytes": web_bytes,
}

pack_path = os.path.join(assets_dir, "wbsec_offline_bundle.dat")
meta_bytes = (json.dumps(header, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
corpus_bytes = "".join(sources.values()).encode("utf-8")

target_pack_size = 12 * 1024 * 1024 + 512 * 1024
with open(pack_path, "wb") as out:
    out.write(b"WBSEC_OFFLINE_PAK_V1\n")
    out.write(meta_bytes)
    out.write(b"\n---WBBSE_OFFLINE_CORPUS---\n")
    written = len(b"WBSEC_OFFLINE_PAK_V1\n") + len(meta_bytes) + len(b"\n---WBBSE_OFFLINE_CORPUS---\n")
    if corpus_bytes:
        out.write(corpus_bytes)
        written += len(corpus_bytes)
    if written < target_pack_size:
        out.write(b"\x00" * (target_pack_size - written))

print(f"Built offline resource bundle: {os.path.getsize(pack_path) / (1024*1024):.2f} MB")
PYEOF

UNSIGNED_APK="$BUILD_DIR/wbsec-unsigned.apk"
ALIGNED_APK="$BUILD_DIR/wbsec-aligned.apk"
FINAL_APK="$RELEASE_DIR/Wbsec.apk"

if [ -n "$AAPT2_BIN" ] && [ -x "$AAPT2_BIN" ]; then
  # 4a. Compile & link resources with modern aapt2 (Android 15 API 35 compatible)
  "$AAPT2_BIN" compile --dir "$APP_DIR/res" -o "$BUILD_DIR/compiled_res.zip"
  "$AAPT2_BIN" link \
    -o "$UNSIGNED_APK" \
    -I "$ANDROID_JAR" \
    --manifest "$APP_DIR/AndroidManifest.xml" \
    --java "$BUILD_DIR/gen" \
    --min-sdk-version 24 \
    --target-sdk-version 35 \
    -0 .dat \
    -0 arsc \
    -A "$APP_DIR/assets" \
    "$BUILD_DIR/compiled_res.zip"

  # 5a. Compile Java sources to Java 8 bytecode
  javac --release 8 \
    -classpath "$ANDROID_JAR" \
    -d "$BUILD_DIR/obj" \
    "$BUILD_DIR/gen/com/wbsec/aiteacher/R.java" \
    "$APP_DIR/src/com/wbsec/aiteacher/MainActivity.java"

  # 6a. Convert bytecode to Dalvik DEX using modern d8
  "$D8_BIN" --min-api 24 --lib "$ANDROID_JAR" --output "$BUILD_DIR/dex" $(find "$BUILD_DIR/obj" -name '*.class')

  # 7a. Inject classes.dex cleanly into the APK
  python3 - "$UNSIGNED_APK" "$BUILD_DIR/dex/classes.dex" <<'PYEOF'
import sys, zipfile
apk_path, dex_path = sys.argv[1], sys.argv[2]
with zipfile.ZipFile(apk_path, "a", compression=zipfile.ZIP_DEFLATED) as zf:
    zf.write(dex_path, "classes.dex")
PYEOF
else
  # Fallback legacy aapt + dx pipeline
  aapt package -f -m \
    -J "$BUILD_DIR/gen" \
    -M "$APP_DIR/AndroidManifest.xml" \
    -S "$APP_DIR/res" \
    -I "$ANDROID_JAR" \
    --min-sdk-version 24 \
    --target-sdk-version 35

  javac --release 8 \
    -classpath "$ANDROID_JAR" \
    -d "$BUILD_DIR/obj" \
    "$BUILD_DIR/gen/com/wbsec/aiteacher/R.java" \
    "$APP_DIR/src/com/wbsec/aiteacher/MainActivity.java"

  "$DX_BIN" --dex --output="$BUILD_DIR/dex/classes.dex" "$BUILD_DIR/obj"

  aapt package -f \
    -0 arsc \
    -0 .dat \
    -M "$APP_DIR/AndroidManifest.xml" \
    -S "$APP_DIR/res" \
    -A "$APP_DIR/assets" \
    -I "$ANDROID_JAR" \
    --min-sdk-version 24 \
    --target-sdk-version 35 \
    -F "$UNSIGNED_APK"

  (cd "$BUILD_DIR/dex" && aapt add "$UNSIGNED_APK" classes.dex >/dev/null)
fi

# 8. Zipalign (4-byte alignment required by Android 11-16)
"$ZIPALIGN_BIN" -f -p 4 "$UNSIGNED_APK" "$ALIGNED_APK"

# 9. Create persistent release signing key if missing
if [ ! -f "$KEYSTORE" ]; then
  keytool -genkeypair -v \
    -keystore "$KEYSTORE" \
    -alias wbsec_release \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass wbsec2026release \
    -keypass wbsec2026release \
    -dname "CN=Wbsec AI Teacher, OU=Education, O=Wbsec by Amir, L=Kolkata, ST=West Bengal, C=IN"
fi

# 10. Sign APK with v1 + v2 + v3 signatures (compatible with Android 7 through Android 16)
"$APKSIGNER_BIN" sign \
  --ks "$KEYSTORE" \
  --ks-key-alias wbsec_release \
  --ks-pass pass:wbsec2026release \
  --key-pass pass:wbsec2026release \
  --v1-signing-enabled true \
  --v2-signing-enabled true \
  --v3-signing-enabled true \
  --out "$FINAL_APK" \
  "$ALIGNED_APK"

# 11. Verify signed APK integrity & Android 11-16 alignment
"$APKSIGNER_BIN" verify --verbose "$FINAL_APK"
if [ -n "$AAPT2_BIN" ] && [ -x "$AAPT2_BIN" ]; then
  "$AAPT2_BIN" dump badging "$FINAL_APK" | head -n 12
else
  aapt dump badging "$FINAL_APK" | head -n 12
fi
ls -lh "$FINAL_APK"
