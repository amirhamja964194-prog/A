# Firestore Security Specification (`security_spec.md`)

## 1. Data Invariants
1. `/appSettings/live` is a non-PII singleton document readable only by `get` (never `list`).
2. Writes to `/appSettings/live` are strictly restricted to verified admins (`request.auth.token.email == 'mursalimmondal630@gmail.com' && request.auth.token.email_verified == true` or `/admins/$(request.auth.uid)`).
3. `updatedAt` on every create/update must equal `request.time`, and `updatedByUid` must equal `request.auth.uid`.
4. `configVersion` cannot decrease on updates (`incoming().configVersion >= existing().configVersion`).
5. No shadow/ghost keys are permitted (`keys().hasAll(...)` + `keys().hasOnly(...)` + `affectedKeys().hasOnly(...)`).
6. `/admins/{userId}` contains PII (`email`) and is readable only via `get` by `isOwner(userId)` or `isAdmin()`, never via `list`. Self-assignment of admin privileges is blocked.

## 2. The "Dirty Dozen" Payloads (All Must Return `PERMISSION_DENIED`)
1. **Unauthenticated Write to `/appSettings/live`**: `{ "appName": "Hacked" }` with `auth = null`.
2. **Non-Admin Authenticated Write**: `{ "appName": "Hacked", ...validFields }` with `email = "student@gmail.com", email_verified = true`.
3. **Email Spoofing Attack**: `{ ...validFields }` with `email = "mursalimmondal630@gmail.com", email_verified = false`.
4. **Shadow/Ghost Field Injection on `/appSettings/live`**: `{ ...validFields, "isSuperAdmin": true }`.
5. **Client Timestamp Forgery**: `{ ...validFields, "updatedAt": "2020-01-01T00:00:00Z" }` instead of `request.time`.
6. **UID Spoofing in `updatedByUid`**: `{ ...validFields, "updatedByUid": "another_uid" }` when `auth.uid == "admin_uid"`.
7. **Version Downgrade Attack**: Updating `/appSettings/live` with `configVersion: 1` when existing `configVersion` is `5`.
8. **Oversized String DoS / Denial-of-Wallet**: `{ ...validFields, "appName": "A".repeat(500) }` (> 40 chars) or `customTeacherPrompt` > 600 chars.
9. **Array Bounds Bypass**: `{ ...validFields, "samplePrompts": ["1","2","3","4","5","6","7"] }` (> 6 items) or empty `[]` or non-string first element `[123]`.
10. **Collection List Scraping**: `list` query on `/appSettings` or `/admins`.
11. **Self-Assigned Admin Privilege Escalation**: Student creates `/admins/$(studentUid)` with `{ "uid": studentUid, "role": "admin", "email": "student@gmail.com" }`.
12. **PII Leak Attempt on `/admins/{adminUid}`**: Authenticated non-admin student calls `getDoc` on `/admins/admin_uid`.
