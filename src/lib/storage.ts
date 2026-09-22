import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  endpoint: process.env.S3_ENDPOINT || undefined,
  region: process.env.S3_REGION || "auto",
  credentials: process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY ? {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  } : undefined,
} as any);

const BUCKET = process.env.S3_BUCKET;

function isConfigured(): boolean {
  return !!(BUCKET && process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY);
}

export async function generateUploadUrl(key: string, contentType: string, ttl = 300): Promise<string | null> {
  if (!isConfigured()) return null;

  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(client, cmd, { expiresIn: ttl });
}

export async function getObjectStream(key: string): Promise<ReadableStream | null> {
  if (!isConfigured()) return null;

  const cmd = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  const signedUrl = await getSignedUrl(client, cmd, { expiresIn: 3600 });
  const res = await fetch(signedUrl);
  if (!res.ok || !res.body) return null;
  return res.body;
}

export async function deleteObject(key: string): Promise<void> {
  if (!isConfigured()) return;
  await client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

export function publicUrl(key: string): string {
  const base = process.env.S3_PUBLIC_URL || "";
  return base ? `${base}/${key}` : key;
}
