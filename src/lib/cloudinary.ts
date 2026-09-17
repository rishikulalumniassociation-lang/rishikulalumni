import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
  secure: true,
});

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

export function getCloudinaryCloudName(): string {
  return process.env.CLOUDINARY_CLOUD_NAME || "";
}

export function getCloudinaryApiKey(): string {
  return process.env.CLOUDINARY_API_KEY || "";
}

/**
 * Generates a signed upload signature for frontend direct uploads to Cloudinary.
 * Keeps CLOUDINARY_API_SECRET strictly on the server.
 */
export function generateCloudinaryUploadSignature(
  paramsToSign: Record<string, string | number>
): {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
} {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  if (!apiSecret || !apiKey || !cloudName) {
    throw new Error(
      "Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are not configured."
    );
  }

  // Use official Cloudinary SDK to sign the request parameters
  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    signature,
    timestamp: Number(paramsToSign.timestamp),
    apiKey,
    cloudName,
  };
}

export { cloudinary };
