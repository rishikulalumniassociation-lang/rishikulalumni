import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2Client, getR2BucketName, getR2PublicUrl, isR2Configured } from "@/lib/r2";
import { supabase } from "@/lib/supabase";

// Max file sizes (bytes)
const MAX_VIDEO_SIZE = 250 * 1024 * 1024; // 250MB
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

    // 2. Server-side Authorization: Verify user is an approved alumni
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

    // 3. MIME type & extension validation
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

    // 4. File size validation
    const size = Number(fileSize) || 0;
    const isVideo = lowerType.startsWith("video/");
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_GENERAL_SIZE;

    if (size > maxSize) {
      const limitMb = maxSize / (1024 * 1024);
      return NextResponse.json(
        {
          error: `File size exceeds the limit of ${limitMb}MB for this content type.`,
        },
        { status: 400 }
      );
    }

    // 5. Cloudflare R2 check
    if (!isR2Configured()) {
      return NextResponse.json(
        {
          error:
            "Cloudflare R2 storage credentials are not configured on the server. Please set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_URL.",
        },
        { status: 503 }
      );
    }

    // 6. Generate clean unique key
    const s3 = getR2Client();
    const bucket = getR2BucketName();
    const publicBase = getR2PublicUrl();

    const sanitizedBase = fileName
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .replace(/_{2,}/g, "_");
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const objectKey = `community/${userId}/${Date.now()}-${randomSuffix}-${sanitizedBase}`;

    // 7. Create Presigned PUT URL (valid for 60 minutes)
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    const publicUrl = `${publicBase}/${objectKey}`;

    return NextResponse.json({
      success: true,
      uploadUrl,
      publicUrl,
      key: objectKey,
      fileName,
      mimeType: contentType,
      fileSize: size,
    });
  } catch (err: any) {
    console.error("Error generating presigned upload URL:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate presigned upload URL." },
      { status: 500 }
    );
  }
}
