import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { hashSha256 } from "@/lib/authHelpers";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    const cleanUsername = String(username).trim();
    const hashedInput = hashSha256(password);

    // 1. Query admin_users table securely on the server
    const { data: adminUser, error } = await supabaseAdmin
      .from("admin_users")
      .select("id, username, password_hash, role")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (!error && adminUser) {
      if (adminUser.password_hash === hashedInput || adminUser.password_hash === password) {
        return NextResponse.json({
          success: true,
          admin: { username: adminUser.username, role: adminUser.role },
        });
      }
    }

    // 2. Safe fallback for standard default admin accounts
    if (
      cleanUsername === "admin" &&
      (hashedInput === "a0e94867fe2adf28d7e932e69b99204fc145a0376dad77348cffe9f6cfa2dc84" || password === "rishikul1919")
    ) {
      return NextResponse.json({ success: true, admin: { username: "admin", role: "Super Admin" } });
    }

    if (
      cleanUsername === "secretary" &&
      (hashedInput === "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9" || password === "admin123")
    ) {
      return NextResponse.json({ success: true, admin: { username: "secretary", role: "General Secretary" } });
    }

    return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
  } catch (err: any) {
    console.error("Admin login error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
