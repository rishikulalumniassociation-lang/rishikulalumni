import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  generateCloudinaryUploadSignature,
  isCloudinaryConfigured,
  getCloudinaryCloudName,
} from "@/lib/cloudinary";

// Max file sizes (bytes)
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_GENERAL_SIZE = 50 * 1024 * 1024; // 50MB

const ALLOWED_MIME_PREFIXES = [
  "image/",
  "video/",
  "audio/",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "application/rtf",
];

const DISALLOWED_EXTENSIONS = [
  ".exe",
  ".bat",
  ".cmd",
  ".sh",
  ".php",
  ".js",
  ".ts",
  ".html",
  ".htm",
  ".jar",
  ".vbs",
  ".msi",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileName, contentType, fileSize, userId } = body;

    // 1. Basic payload checks
    if (!fileName || !contentType || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: fileName, contentType, and userId are required." },
        { status: 400 }
      );
    }

    // 2. Check if Cloudinary is configured
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        {
          error:
            "Cloudinary storage is not configured yet. Please configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in environment variables.",
        },
        { status: 503 }
      );
    }

    // 3. Server-side Authorization: Verify user is an approved alumni in Supabase
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, is_verified, approval_status, is_deceased")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "User not found. Please log in with a valid alumni account." },
        { status: 401 }
      );
    }

    if (profile.is_deceased) {
      return NextResponse.json(
        { error: "Inactive account." },
        { status: 403 }
      );
    }

    if (!profile.is_verified || profile.approval_status !== "approved") {
      return NextResponse.json(
        {
          error:
            "Access Restricted: Only verified and approved alumni can upload content to Rishikul Community Showcase. Your registration is currently pending review by the Association Administrator.",
        },
        { status: 403 }
      );
    }

    // 4. MIME type & extension validation
    const lowerType = String(contentType).toLowerCase();
    const lowerName = String(fileName).toLowerCase();

    const isAllowedMime = ALLOWED_MIME_PREFIXES.some((prefix) =>
      lowerType.startsWith(prefix)
    );

    const hasDangerousExtension = DISALLOWED_EXTENSIONS.some((ext) =>
      lowerName.endsWith(ext)
    );

    if (!isAllowedMime || hasDangerousExtension) {
      return NextResponse.json(
        {
          error:
            "Unsupported or restricted file type. Supported types include photos, videos, audio, PDF, Word, PowerPoint, and text documents.",
        },
        { status: 400 }
      );
    }

    // 5. File size limits
    const isVideo = lowerType.startsWith("video/");
    const maxAllowedSize = isVideo ? MAX_VIDEO_SIZE : MAX_GENERAL_SIZE;

    if (fileSize && fileSize > maxAllowedSize) {
      const maxMb = Math.round(maxAllowedSize / (1024 * 1024));
      return NextResponse.json(
        {
          error: `File size exceeds the maximum permitted limit of ${maxMb}MB.`,
        },
        { status: 400 }
      );
    }

    // 6. Generate Cloudinary signed upload parameters
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = `rishikul_community/${userId}`;

    // Sign the parameters using server-side CLOUDINARY_API_SECRET
    const { signature, apiKey, cloudName } = generateCloudinaryUploadSignature({
      folder,
      timestamp,
    });

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

    return NextResponse.json({
      uploadUrl,
      cloudName,
      apiKey,
      timestamp,
      signature,
      folder,
    });
  } catch (err: any) {
    console.error("Cloudinary upload-signature error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to generate upload signature." },
      { status: 500 }
    );
  }
}
