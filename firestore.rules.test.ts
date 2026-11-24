/**
 * Security Rules Verification Specification (Dirty Dozen Adversarial Payloads)
 *
 * Documents all 12 adversarial payloads tested against firestore.rules to ensure
 * every unauthorized, malformed, oversized, spoofed, or shadow-key write/read
 * evaluates to PERMISSION_DENIED.
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  path: string;
  auth: {
    uid: string;
    email?: string;
    email_verified?: boolean;
  } | null;
  payload?: Record<string, unknown>;
  expectedOutcome: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_PAYLOADS: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Unauthenticated write to /appSettings/live',
    operation: 'update',
    path: 'appSettings/live',
    auth: null,
    payload: { appName: 'Hacked' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Non-admin authenticated write to /appSettings/live',
    operation: 'update',
    path: 'appSettings/live',
    auth: { uid: 'student-1', email: 'student@gmail.com', email_verified: true },
    payload: { appName: 'Hacked', configVersion: 99 },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Unverified admin email spoof attack',
    operation: 'update',
    path: 'appSettings/live',
    auth: { uid: 'spoof-1', email: 'mursalimmondal630@gmail.com', email_verified: false },
    payload: { appName: 'Spoofed' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Shadow ghost field injection on /appSettings/live',
    operation: 'update',
    path: 'appSettings/live',
    auth: { uid: 'admin-1', email: 'mursalimmondal630@gmail.com', email_verified: true },
    payload: { isSuperAdmin: true, configVersion: 2 },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Client-provided fake updatedAt timestamp',
    operation: 'update',
    path: 'appSettings/live',
    auth: { uid: 'admin-1', email: 'mursalimmondal630@gmail.com', email_verified: true },
    payload: { updatedAt: '2020-01-01T00:00:00.000Z', configVersion: 2 },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Identity spoofing in updatedByUid',
    operation: 'update',
    path: 'appSettings/live',
    auth: { uid: 'admin-1', email: 'mursalimmondal630@gmail.com', email_verified: true },
    payload: { updatedByUid: 'victim-uid', configVersion: 2 },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Version downgrade attack on configVersion',
    operation: 'update',
    path: 'appSettings/live',
    auth: { uid: 'admin-1', email: 'mursalimmondal630@gmail.com', email_verified: true },
    payload: { configVersion: 0 },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Oversized appName string resource poisoning',
    operation: 'update',
    path: 'appSettings/live',
    auth: { uid: 'admin-1', email: 'mursalimmondal630@gmail.com', email_verified: true },
    payload: { appName: 'A'.repeat(200), configVersion: 2 },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Array bounds & element-type bypass on samplePrompts',
    operation: 'update',
    path: 'appSettings/live',
    auth: { uid: 'admin-1', email: 'mursalimmondal630@gmail.com', email_verified: true },
    payload: { samplePrompts: [123, '2', '3', '4', '5', '6', '7'], configVersion: 2 },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Collection list scraping on /appSettings and /admins',
    operation: 'list',
    path: 'admins',
    auth: { uid: 'student-1', email: 'student@gmail.com', email_verified: true },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Self-assigned admin privilege escalation in /admins',
    operation: 'create',
    path: 'admins/student-1',
    auth: { uid: 'student-1', email: 'student@gmail.com', email_verified: true },
    payload: { uid: 'student-1', email: 'student@gmail.com', role: 'admin' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Unauthorized PII read on /admins/{adminUid}',
    operation: 'get',
    path: 'admins/admin-1',
    auth: { uid: 'student-1', email: 'student@gmail.com', email_verified: true },
    expectedOutcome: 'PERMISSION_DENIED',
  },
];
