package com.wbsec.aiteacher;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.Typeface;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.util.Base64;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.URLUtil;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends Activity {

    private static final String APP_URL =
            "https://ais-pre-gnsfryy7ffvuw7nefvpvq7-452431280303.asia-east1.run.app";
    private static final int FILE_CHOOSER_REQUEST_CODE = 1001;
    private static final int PERMISSION_REQUEST_CODE = 1002;

    private WebView webView;
    private LinearLayout splashOverlay;
    private ProgressBar topProgressBar;
    private ValueCallback<Uri[]> filePathCallback;
    private PermissionRequest pendingWebPermissionRequest;
    private boolean splashDismissed = false;
    private long lastBackPressMs = 0L;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().setStatusBarColor(Color.parseColor("#05060d"));
            getWindow().setNavigationBarColor(Color.parseColor("#05060d"));
        }

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.parseColor("#05060d"));
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT_WATCH) {
            root.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
                @Override
                public android.view.WindowInsets onApplyWindowInsets(View v, android.view.WindowInsets insets) {
                    int top = insets.getSystemWindowInsetTop();
                    int bottom = insets.getSystemWindowInsetBottom();
                    int left = insets.getSystemWindowInsetLeft();
                    int right = insets.getSystemWindowInsetRight();
                    v.setPadding(left, top, right, bottom);
                    return insets;
                }
            });
        }

        // 1. Hardware-accelerated Fullscreen WebView
        webView = new WebView(this);
        webView.setBackgroundColor(Color.parseColor("#05060d"));
        webView.setLayoutParams(new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        }

        // Clean native User-Agent so web app detects standalone APK mode & Google auth works cleanly
        String defaultUa = settings.getUserAgentString();
        if (defaultUa != null) {
            String cleanUa = defaultUa.replace("; wv)", ")").replace("; wv;", ";");
            settings.setUserAgentString(cleanUa + " WbsecNativeApp/1.6.0");
        }

        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            cookieManager.setAcceptThirdPartyCookies(webView, true);
        }

        webView.addJavascriptInterface(new WbsecNativeBridge(), "WbsecNative");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url == null) return false;
                if (url.startsWith("file://")
                        || url.contains("asia-east1.run.app")
                        || url.contains("accounts.google.com")
                        || url.contains("firebaseapp.com")
                        || url.contains("googleapis.com")
                        || url.contains("gstatic.com")) {
                    return false;
                }
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    } catch (Exception ignored) {
                        return false;
                    }
                }
                return false;
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                if (topProgressBar != null) {
                    topProgressBar.setVisibility(View.VISIBLE);
                }
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                if (topProgressBar != null) {
                    topProgressBar.setVisibility(View.GONE);
                }
                CookieManager.getInstance().flush();
                dismissSplash();
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && request != null && request.isForMainFrame()) {
                    if (!isNetworkAvailable()) {
                        view.loadUrl("file:///android_asset/offline.html");
                        dismissSplash();
                    }
                }
            }

            @SuppressWarnings("deprecation")
            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                if (!isNetworkAvailable() && failingUrl != null && failingUrl.startsWith("http")) {
                    view.loadUrl("file:///android_asset/offline.html");
                    dismissSplash();
                }
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                super.onProgressChanged(view, newProgress);
                if (topProgressBar != null) {
                    topProgressBar.setProgress(newProgress);
                    if (newProgress >= 95) {
                        topProgressBar.setVisibility(View.GONE);
                        dismissSplash();
                    }
                }
            }

            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        handleWebPermissionRequest(request);
                    }
                });
            }

            @Override
            public boolean onShowFileChooser(
                    WebView webView,
                    ValueCallback<Uri[]> filePathCallback,
                    FileChooserParams fileChooserParams) {
                if (MainActivity.this.filePathCallback != null) {
                    MainActivity.this.filePathCallback.onReceiveValue(null);
                }
                MainActivity.this.filePathCallback = filePathCallback;

                Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("image/*");
                try {
                    startActivityForResult(
                            Intent.createChooser(intent, "বইয়ের ছবি বাছাই করো"),
                            FILE_CHOOSER_REQUEST_CODE
                    );
                } catch (Exception e) {
                    MainActivity.this.filePathCallback = null;
                    return false;
                }
                return true;
            }
        });

        webView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(
                    String url,
                    String userAgent,
                    String contentDisposition,
                    String mimetype,
                    long contentLength) {
                if (url == null) return;
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    try {
                        DownloadManager.Request req = new DownloadManager.Request(Uri.parse(url));
                        String fileName = URLUtil.guessFileName(url, contentDisposition, mimetype);
                        req.setMimeType(mimetype);
                        req.setTitle(fileName);
                        req.setDescription("Wbsec ডাউনলোড হচ্ছে...");
                        req.setNotificationVisibility(
                                DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                        req.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName);
                        DownloadManager dm = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
                        if (dm != null) {
                            dm.enqueue(req);
                            Toast.makeText(MainActivity.this, "ডাউনলোড শুরু হয়েছে: " + fileName, Toast.LENGTH_SHORT).show();
                        }
                    } catch (Exception e) {
                        try {
                            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                        } catch (Exception ignored) {
                        }
                    }
                }
            }
        });

        root.addView(webView);

        // 2. Slim Top Progress Bar
        topProgressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        topProgressBar.setMax(100);
        topProgressBar.setIndeterminate(false);
        FrameLayout.LayoutParams progressParams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(3)
        );
        progressParams.gravity = Gravity.TOP;
        topProgressBar.setLayoutParams(progressParams);
        root.addView(topProgressBar);

        // 3. Native Standalone Splash Overlay (Facebook / YouTube style launch experience)
        splashOverlay = createSplashOverlay();
        root.addView(splashOverlay);

        setContentView(root);

        if (isNetworkAvailable()) {
            settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        } else {
            settings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
        }

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        } else {
            webView.loadUrl(APP_URL);
        }

        // Safety timer so splash never stays stuck
        mainHandler.postDelayed(new Runnable() {
            @Override
            public void run() {
                dismissSplash();
            }
        }, 4500);
    }

    private LinearLayout createSplashOverlay() {
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setGravity(Gravity.CENTER);
        layout.setBackgroundColor(Color.parseColor("#05060d"));
        layout.setLayoutParams(new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        ImageView icon = new ImageView(this);
        icon.setImageResource(R.drawable.ic_launcher);
        LinearLayout.LayoutParams iconLp = new LinearLayout.LayoutParams(dp(92), dp(92));
        iconLp.bottomMargin = dp(16);
        icon.setLayoutParams(iconLp);
        layout.addView(icon);

        TextView title = new TextView(this);
        title.setText("Wbsec");
        title.setTextColor(Color.WHITE);
        title.setTextSize(26f);
        title.setTypeface(Typeface.DEFAULT_BOLD);
        title.setGravity(Gravity.CENTER);
        layout.addView(title);

        TextView subtitle = new TextView(this);
        subtitle.setText("AI Teacher · Made by Amir");
        subtitle.setTextColor(Color.parseColor("#94a3b8"));
        subtitle.setTextSize(13f);
        subtitle.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams subLp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        subLp.topMargin = dp(4);
        subLp.bottomMargin = dp(24);
        subtitle.setLayoutParams(subLp);
        layout.addView(subtitle);

        ProgressBar spinner = new ProgressBar(this);
        LinearLayout.LayoutParams spinLp = new LinearLayout.LayoutParams(dp(34), dp(34));
        spinner.setLayoutParams(spinLp);
        layout.addView(spinner);

        return layout;
    }

    private void dismissSplash() {
        if (splashDismissed || splashOverlay == null) return;
        splashDismissed = true;
        splashOverlay.animate()
                .alpha(0f)
                .setDuration(260)
                .withEndAction(new Runnable() {
                    @Override
                    public void run() {
                        if (splashOverlay != null) {
                            splashOverlay.setVisibility(View.GONE);
                        }
                    }
                })
                .start();
    }

    private void handleWebPermissionRequest(PermissionRequest request) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            request.grant(request.getResources());
            return;
        }
        String[] resources = request.getResources();
        List<String> needed = new ArrayList<String>();
        for (String r : resources) {
            if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(r)
                    && checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                needed.add(Manifest.permission.RECORD_AUDIO);
            }
            if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(r)
                    && checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                needed.add(Manifest.permission.CAMERA);
            }
        }
        if (needed.isEmpty()) {
            request.grant(resources);
        } else {
            pendingWebPermissionRequest = request;
            requestPermissions(needed.toArray(new String[0]), PERMISSION_REQUEST_CODE);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSION_REQUEST_CODE && pendingWebPermissionRequest != null) {
            PermissionRequest req = pendingWebPermissionRequest;
            pendingWebPermissionRequest = null;
            boolean allGranted = grantResults.length > 0;
            for (int res : grantResults) {
                if (res != PackageManager.PERMISSION_GRANTED) {
                    allGranted = false;
                    break;
                }
            }
            if (allGranted) {
                req.grant(req.getResources());
            } else {
                req.deny();
                Toast.makeText(this, "মাইক/ক্যামেরা চালু করতে পারমিশন Allow করুন।", Toast.LENGTH_SHORT).show();
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILE_CHOOSER_REQUEST_CODE && filePathCallback != null) {
            Uri[] results = null;
            if (resultCode == Activity.RESULT_OK && data != null) {
                Uri uri = data.getData();
                if (uri != null) {
                    results = new Uri[]{uri};
                }
            }
            filePathCallback.onReceiveValue(results);
            filePathCallback = null;
        }
    }

    private boolean isNetworkAvailable() {
        try {
            ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
            if (cm == null) return true;
            NetworkInfo info = cm.getActiveNetworkInfo();
            return info != null && info.isConnected();
        } catch (Exception e) {
            return true;
        }
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }
        long now = System.currentTimeMillis();
        if (now - lastBackPressMs < 2000L) {
            super.onBackPressed();
        } else {
            lastBackPressMs = now;
            Toast.makeText(this, "অ্যাপ বন্ধ করতে আবার ব্যাক চাপুন", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (webView != null) {
            webView.saveState(outState);
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }

    private class WbsecNativeBridge {
        @JavascriptInterface
        public boolean isNativeApp() {
            return true;
        }

        @JavascriptInterface
        public String getAppVersion() {
            return "1.6.0";
        }

        @JavascriptInterface
        public void reloadApp() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (webView != null) {
                        webView.getSettings().setCacheMode(
                                isNetworkAvailable() ? WebSettings.LOAD_DEFAULT : WebSettings.LOAD_CACHE_ELSE_NETWORK
                        );
                        webView.loadUrl(APP_URL);
                    }
                }
            });
        }

        @JavascriptInterface
        public void shareText(final String title, final String text) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        Intent sendIntent = new Intent(Intent.ACTION_SEND);
                        sendIntent.setType("text/plain");
                        sendIntent.putExtra(Intent.EXTRA_SUBJECT, title);
                        sendIntent.putExtra(Intent.EXTRA_TEXT, text);
                        startActivity(Intent.createChooser(sendIntent, "শেয়ার করো"));
                    } catch (Exception ignored) {
                    }
                }
            });
        }

        @JavascriptInterface
        public boolean saveBase64File(final String base64Data, final String filename) {
            try {
                byte[] bytes = Base64.decode(base64Data, Base64.DEFAULT);
                File dir = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
                if (dir == null) dir = getFilesDir();
                File outFile = new File(dir, filename != null && filename.length() > 0 ? filename : "wbsec-note.pdf");
                FileOutputStream fos = new FileOutputStream(outFile);
                fos.write(bytes);
                fos.close();
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Toast.makeText(MainActivity.this, "সেভ হয়েছে: " + outFile.getName(), Toast.LENGTH_LONG).show();
                    }
                });
                return true;
            } catch (Exception e) {
                return false;
            }
        }
    }
}
