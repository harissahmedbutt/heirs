import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

export const vaultConfigured = !!(
  process.env.VAULT_ACCESS_KEY_ID &&
  process.env.VAULT_SECRET_ACCESS_KEY &&
  process.env.VAULT_BUCKET &&
  process.env.VAULT_ENCRYPTION_KEY
)

// Lazily create the S3 client so the module is importable even without vault
// env vars (they'll fail at call-time if missing, not import-time).
function s3() {
  const region = process.env.VAULT_REGION ?? 'me-central-1'
  return new S3Client({
    region,
    // DigitalOcean Spaces endpoint — the AWS SDK speaks the same S3 REST protocol.
    endpoint: `https://${region}.digitaloceanspaces.com`,
    credentials: {
      accessKeyId: process.env.VAULT_ACCESS_KEY_ID!,
      secretAccessKey: process.env.VAULT_SECRET_ACCESS_KEY!,
    },
  })
}

function encKey(): Buffer {
  return Buffer.from(process.env.VAULT_ENCRYPTION_KEY!, 'base64')
}

// ── Encryption ───────────────────────────────────────────────────────────────
// Format: IV (12 bytes) | auth-tag (16 bytes) | ciphertext
// AES-256-GCM provides authenticated encryption: wrong key or tampered bytes
// cause decipher.final() to throw, so we never serve corrupted data.

function encrypt(data: Buffer): Buffer {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', encKey(), iv)
  const ciphertext = Buffer.concat([cipher.update(data), cipher.final()])
  const tag = cipher.getAuthTag() // 16 bytes
  return Buffer.concat([iv, tag, ciphertext])
}

function decrypt(blob: Buffer): Buffer {
  const iv = blob.subarray(0, 12)
  const tag = blob.subarray(12, 28)
  const ciphertext = blob.subarray(28)
  const decipher = createDecipheriv('aes-256-gcm', encKey(), iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(ciphertext), decipher.final()])
}

// ── Storage key ──────────────────────────────────────────────────────────────
// Pattern: {applicationId}/{kind}-{timestamp}.enc
// The .enc extension signals "this is encrypted ciphertext, not a raw PDF".
function makeKey(applicationId: string, kind: string): string {
  return `${applicationId}/${kind}-${Date.now()}.enc`
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Encrypt and upload a document to the vault. Returns the storage key to
 *  persist in the WillDocument row. */
export async function uploadDocument(
  applicationId: string,
  kind: string,
  data: Buffer,
): Promise<string> {
  const key = makeKey(applicationId, kind)
  const encrypted = encrypt(data)
  await s3().send(
    new PutObjectCommand({
      Bucket: process.env.VAULT_BUCKET!,
      Key: key,
      Body: encrypted,
      // Always store as octet-stream — the bytes are opaque ciphertext, not a PDF.
      ContentType: 'application/octet-stream',
    }),
  )
  return key
}

/** Download and decrypt a document from the vault. */
export async function downloadDocument(storageKey: string): Promise<Buffer> {
  const res = await s3().send(
    new GetObjectCommand({
      Bucket: process.env.VAULT_BUCKET!,
      Key: storageKey,
    }),
  )
  if (!res.Body) throw new Error('Vault: empty response body')
  const chunks: Uint8Array[] = []
  for await (const chunk of res.Body as AsyncIterable<Uint8Array>) {
    chunks.push(chunk)
  }
  return decrypt(Buffer.concat(chunks))
}
