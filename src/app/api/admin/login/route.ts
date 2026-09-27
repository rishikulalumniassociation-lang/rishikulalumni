import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { supabase } from "@/lib/supabase";
import { hashSha256 } from "@/lib/authHelpers";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    const cleanUsername = String(username).trim();
    const internalEmail = `${cleanUsername.toLowerCase()}@system.rishikulsangam.internal`;

    // 1. Query admin_users table securely on the server
    const { data: adminRecord, error: adminErr } = await supabaseAdmin
      .from("admin_users")
      .select("id, username, password_hash, role, auth_user_id, is_migrated")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (adminErr || !adminRecord) {
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }

    // 2. If Admin already migrated: authenticate strictly via Supabase Auth
    if (adminRecord.is_migrated && adminRecord.auth_user_id) {
      const { data: sessionData, error: signInErr } = await supabase.auth.signInWithPassword({
        email: internalEmail,
        password,
      });

      if (signInErr || !sessionData?.session) {
        return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        admin: { username: adminRecord.username, role: adminRecord.role },
        session: sessionData.session,
      });
    }

    // 3. If Admin NOT yet migrated: lazy migration using legacy password hash
    const hashedInput = hashSha256(password);
    const legacyValid =
      adminRecord.password_hash === hashedInput || adminRecord.password_hash === password;

    if (!legacyValid) {
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }

    // Legacy password verified -> Initialize Supabase Auth admin user
    let authUserId: string | null = adminRecord.auth_user_id || null;
    const { data: createData, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: internalEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        username: adminRecord.username,
        role: adminRecord.role,
      },
    });

    if (createErr) {
      const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
      const existing = listData?.users?.find((u) => u.email === internalEmail);
      if (existing) {
        authUserId = existing.id;
        await supabaseAdmin.auth.admin.updateUserById(existing.id, {
          password: password,
          email_confirm: true,
        });
      } else {
        console.error("Failed to create admin Supabase Auth user:", createErr);
        return NextResponse.json({ error: "Failed to initialize admin auth" }, { status: 500 });
      }
    } else if (createData?.user) {
      authUserId = createData.user.id;
    }

    // Verify session creation with the new Supabase Auth credentials
    const { data: sessionData, error: signInErr } = await supabase.auth.signInWithPassword({
      email: internalEmail,
      password,
    });

    if (signInErr || !sessionData?.session) {
      console.error("Admin sign-in verification failed after migration:", signInErr);
      return NextResponse.json(
        { error: "Admin authentication verification failed" },
        { status: 500 }
      );
    }

    // Update admin_users record: link auth_user_id, mark migrated, clear legacy password_hash
    await supabaseAdmin
      .from("admin_users")
      .update({
        is_migrated: true,
        auth_user_id: authUserId,
        password_hash: "",
      })
      .eq("id", adminRecord.id);

    return NextResponse.json({
      success: true,
      admin: { username: adminRecord.username, role: adminRecord.role },
      session: sessionData.session,
    });
  } catch (err: any) {
    console.error("Admin login error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

