import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { hashSha256 } from "@/lib/authHelpers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { requestId, alumniId, username, newPassword } = body;

    if (!newPassword || (!requestId && !alumniId && !username)) {
      return NextResponse.json(
        { error: "Missing required parameters (alumniId/username/requestId and newPassword)" },
        { status: 400 }
      );
    }

    const hashedNewPassword = hashSha256(newPassword);

    // 1. Find profile
    let profileQuery = supabaseAdmin.from("profiles").select("id, auth_user_id, is_migrated, username, mobile");
    if (alumniId && alumniId !== "unmatched") {
      profileQuery = profileQuery.eq("id", alumniId);
    } else if (username) {
      profileQuery = profileQuery.eq("username", username);
    }

    const { data: profiles, error: profileErr } = await profileQuery;
    if (profileErr) {
      console.error("Admin reset profile lookup error:", profileErr);
    }

    const targetProfile = profiles && profiles.length > 0 ? profiles[0] : null;

    if (targetProfile) {
      if (targetProfile.is_migrated && targetProfile.auth_user_id) {
        // Migrated user: update Supabase Auth password directly
        await supabaseAdmin.auth.admin.updateUserById(targetProfile.auth_user_id, {
          password: newPassword,
        });
        // Ensure legacy password_hash remains cleared for migrated users
        await supabaseAdmin
          .from("profiles")
          .update({ password_hash: "" })
          .eq("id", targetProfile.id);
      } else {
        // Non-migrated user: update legacy password_hash in profiles table
        await supabaseAdmin
          .from("profiles")
          .update({ password_hash: hashedNewPassword })
          .eq("id", targetProfile.id);
      }
    }

    // 2. Update password_reset_requests record if requestId is provided (do not store plaintext password)
    if (requestId) {
      await supabaseAdmin
        .from("password_reset_requests")
        .update({
          status: "resolved",
          new_password_assigned: null,
        })
        .eq("id", requestId);
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err: any) {
    console.error("Admin reset password route error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to reset password" },
      { status: 500 }
    );
  }
}
