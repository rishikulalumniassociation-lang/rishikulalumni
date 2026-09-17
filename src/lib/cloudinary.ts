import { v2 as cloudinary } from "cloudinary";

function getCredentials() {
  let cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
  let apiKey = process.env.CLOUDINARY_API_KEY || "";
  let apiSecret = process.env.CLOUDINARY_API_SECRET || "";

  if ((!cloudName || !apiKey || !apiSecret) && process.env.CLOUDINARY_URL) {
    const match = process.env.CLOUDINARY_URL.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (match) {
      apiKey = apiKey || match[1];
      apiSecret = apiSecret || match[2];
      cloudName = cloudName || match[3];
    }
  }

  return {
    cloudName: cloudName.trim(),
    apiKey: apiKey.trim(),
    apiSecret: apiSecret.trim(),
  };
}

const creds = getCredentials();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: creds.cloudName,
  api_key: creds.apiKey,
  api_secret: creds.apiSecret,
  secure: true,
});

export function isCloudinaryConfigured(): boolean {
  const { cloudName, apiKey, apiSecret } = getCredentials();
  return Boolean(cloudName && apiKey && apiSecret);
}

export function getCloudinaryCloudName(): string {
  return getCredentials().cloudName;
}

export function getCloudinaryApiKey(): string {
  return getCredentials().apiKey;
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
  const { cloudName, apiKey, apiSecret } = getCredentials();

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
