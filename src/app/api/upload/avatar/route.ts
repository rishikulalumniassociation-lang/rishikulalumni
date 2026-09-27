import { NextRequest, NextResponse } from "next/server";
import { cloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { error: "Cloudinary is not configured." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { image, identifier } = body;

    if (!image) {
      return NextResponse.json({ error: "No image provided." }, { status: 400 });
    }

    const cleanId = (identifier || Date.now()).toString().replace(/[^a-zA-Z0-9_-]/g, "_");

    const res = await cloudinary.uploader.upload(image, {
      folder: "rishikul_alumni/avatars",
      public_id: `avatar_${cleanId}`,
      overwrite: true,
      resource_type: "image",
      transformation: [
        { width: 400, height: 400, crop: "limit", quality: "auto", fetch_format: "auto" },
      ],
    });

    return NextResponse.json({ url: res.secure_url });
  } catch (err: any) {
    console.error("Avatar upload error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to upload avatar" },
      { status: 500 }
    );
  }
}
