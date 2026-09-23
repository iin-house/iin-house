import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT || undefined,
  region: process.env.S3_REGION || "auto",
  credentials: process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY ? {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  } : undefined,
} as any);

const BUCKET = process.env.S3_BUCKET;
const PUBLIC_URL = process.env.S3_PUBLIC_URL;

function isConfigured(): boolean {
  return !!(BUCKET && process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY && process.env.S3_ENDPOINT);
}

/**
 * Generate a signed PUT URL for direct client upload
 */
export async function getSignedUploadUrl(key: string, contentType: string, ttl = 3600): Promise<string | null> {
  if (!isConfigured()) return null;

  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
    ACL: "public-read",
  });
  return getSignedUrl(s3Client, cmd, { expiresIn: ttl });
}

/**
 * Generate a signed GET URL for private objects
 */
export async function getSignedDownloadUrl(key: string, ttl = 3600): Promise<string | null> {
  if (!isConfigured()) return null;

  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  try {
    return getSignedUrl(s3Client, cmd, { expiresIn: ttl });
  } catch {
    return null;
  }
}

/**
 * Get a readable stream from S3 (for serving media)
 */
export async function getObjectStream(key: string): Promise<ReadableStream | null> {
  if (!isConfigured()) return null;

  const signedUrl = await getSignedDownloadUrl(key);
  if (!signedUrl) return null;

  const res = await fetch(signedUrl);
  if (!res.ok || !res.body) return null;
  return res.body;
}

/**
 * Delete an object from storage
 */
export async function deleteObject(key: string): Promise<void> {
  if (!isConfigured()) return;
  await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

/**
 * Check if an object exists
 */
export async function objectExists(key: string): Promise<boolean> {
  if (!isConfigured()) return false;
  try {
    await s3Client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

/**
 * Get public URL for an object
 */
export function getPublicUrl(key: string): string {
  if (PUBLIC_URL) return `${PUBLIC_URL}/${key}`;
  return key;
}

/**
 * Generate a storage key for a user upload
 */
export function generateKey(userId: string, filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "bin";
  return `uploads/${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
}

export function isStorageConfigured(): boolean {
  return isConfigured();
}
export { isConfigured };
