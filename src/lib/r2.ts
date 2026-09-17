import { S3Client } from "@aws-sdk/client-s3";

// Cache client instance across requests
let s3ClientInstance: S3Client | null = null;

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  );
}

export function getR2BucketName(): string {
  return process.env.R2_BUCKET_NAME || "rishikul-community-showcase";
}

export function getR2PublicUrl(): string {
  const customPublic = process.env.R2_PUBLIC_URL?.replace(/\/+$/, "");
  if (customPublic) return customPublic;

  // Fallback to R2 standard dev url if provided
  const accountId = process.env.R2_ACCOUNT_ID;
  const bucketName = getR2BucketName();
  return `https://${bucketName}.${accountId}.r2.dev`;
}

export function getR2Client(): S3Client {
  if (s3ClientInstance) return s3ClientInstance;

  const accountId = process.env.R2_ACCOUNT_ID || "";
  const accessKeyId = process.env.R2_ACCESS_KEY_ID || "";
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "";
  const endpoint =
    process.env.R2_S3_ENDPOINT ||
    (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : "");

  if (!accessKeyId || !secretAccessKey || !endpoint) {
    throw new Error(
      "Cloudflare R2 is not fully configured. Missing R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, or R2_S3_ENDPOINT/R2_ACCOUNT_ID."
    );
  }

  s3ClientInstance = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return s3ClientInstance;
}
