import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { supabase } from "@/lib/supabase";
import { formatToE164, getCleanDigits, hashSha256 } from "@/lib/authHelpers";

function rowToPrivateProfile(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    fullName: row.full_name as string,
    fullNameHindi: (row.full_name_hindi as string) || undefined,
    username: row.username as string,
    email: (row.email as string) || "",
    mobile: row.mobile as string,
    whatsappNumber: row.whatsapp_number as string,
    dateOfBirth: row.date_of_birth as string,
    gender: (row.gender as "Male" | "Female" | "Other") || "Male",
    avatarUrl: (row.avatar_url as string) || undefined,
    rishikulEducation: row.rishikul_education as "UG" | "PG" | "BOTH",
    ugBatchYear: row.ug_batch_year as number | undefined,
    ugDegree: row.ug_degree as string | undefined,
    pgBatchYear: row.pg_batch_year as number | undefined,
    pgDegree: row.pg_degree as string | undefined,
    specialization: row.specialization as string | undefined,
    isExpert: Boolean(row.is_expert),
    diseaseSpecialty: row.disease_specialty as string | undefined,
    specialtyDescription: row.specialty_description as string | undefined,
    acceptingShishya: Boolean(row.accepting_shishya),
    shishyaRequirement: row.shishya_requirement as string | undefined,
    jobType: row.job_type as any,
    designation: row.designation as string,
    workplace: row.workplace as string,
    city: row.city as string,
    state: row.state as string,
    address: row.address as string | undefined,
    country: row.country as string,
    bio: row.bio as string | undefined,
    bloodGroup: row.blood_group as string | undefined,
    achievements: (row.achievements as string[]) || [],
    specialAchievements: (row.special_achievements as any[]) || [],
    workHistory: (row.work_history as any[]) || [],
    familyAlumniRelations: (row.family_alumni_relations as any[]) || [],
    teacherAlumniIds: (row.teacher_alumni_ids as string[]) || [],
    connectedAlumniIds: (row.connected_alumni_ids as string[]) || [],
    isDeceased: Boolean(row.is_deceased),
    dateOfDemise: row.date_of_demise as string | undefined,
    demiseTribute: row.demise_tribute as string | undefined,
    membershipId: row.membership_id as string,
    membershipTier: row.membership_tier as any,
    isVerified: Boolean(row.is_verified),
    approvalStatus: row.approval_status as any,
    joinedDate: row.joined_date as string,
    authUserId: (row.auth_user_id as string) || undefined,
    isMigrated: Boolean(row.is_migrated),
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Username/Mobile and Password are required." },
        { status: 400 }
      );
    }

    const cleanInput = String(identifier).trim();
    const cleanDigits = getCleanDigits(cleanInput);

    // 1. Look up profile in profiles table
    let query = supabaseAdmin.from("profiles").select("*");
    if (cleanDigits.length >= 10) {
      query = query.or(`username.ilike.${cleanInput},mobile.ilike.%${cleanDigits}%,email.ilike.${cleanInput}`);
    } else {
      query = query.or(`username.ilike.${cleanInput},email.ilike.${cleanInput}`);
    }

    const { data: candidates, error: searchError } = await query;
    if (searchError) {
      console.error("Login profile search error:", searchError);
      return NextResponse.json(
        { error: "Error checking credentials. Please try again." },
        { status: 500 }
      );
    }

    const profile = (candidates && candidates.length > 0) ? candidates[0] : null;
    if (!profile) {
      return NextResponse.json(
        { error: "Invalid username or password. / अमान्य उपयोगकर्ता नाम या पासवर्ड।" },
        { status: 401 }
      );
    }

    // 2. Verification & Approval Check
    if (!profile.is_verified || profile.approval_status === "pending") {
      return NextResponse.json(
        {
          error:
            "Your alumni registration is currently under review by the Association Administrator. You will be able to log in once approved.",
        },
        { status: 403 }
      );
    }

    const e164Phone = formatToE164(profile.mobile);

    // 3. Authenticate Migrated User (Supabase Auth is the ONLY authority)
    if (profile.is_migrated && profile.auth_user_id) {
      const { data: sessionData, error: signInErr } = await supabase.auth.signInWithPassword({
        phone: e164Phone,
        password,
      });

      if (signInErr || !sessionData?.session) {
        return NextResponse.json(
          { error: "Invalid username or password. / अमान्य उपयोगकर्ता नाम या पासवर्ड।" },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        session: sessionData.session,
        profile: rowToPrivateProfile(profile),
      });
    }

    // 4. Authenticate Non-Migrated User (Lazy First-Login Migration)
    const hashedInput = hashSha256(password);
    const legacyPasswordMatch =
      profile.password_hash === hashedInput || profile.password_hash === password;

    if (!legacyPasswordMatch) {
      return NextResponse.json(
        { error: "Invalid username or password. / अमान्य उपयोगकर्ता नाम या पासवर्ड।" },
        { status: 401 }
      );
    }

    // Legacy password verified -> Create Supabase Auth user with Native Phone + Password
    let authUserId: string | null = null;
    const { data: createData, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      phone: e164Phone,
      password: password,
      phone_confirm: true,
      user_metadata: {
        profile_id: profile.id,
        full_name: profile.full_name,
        username: profile.username,
        mobile: profile.mobile,
      },
    });

    if (createErr) {
      // Check if user already exists in auth.users by phone
      const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
      const rawDigits = e164Phone.replace("+", "");
      const existing = listData?.users?.find(
        (u) => u.phone && (u.phone === e164Phone || u.phone.replace("+", "") === rawDigits)
      );
      if (existing) {
        authUserId = existing.id;
        await supabaseAdmin.auth.admin.updateUserById(existing.id, {
          password: password,
          phone_confirm: true,
        });
      } else {
        console.error("Failed to create Supabase Auth user:", createErr);
        return NextResponse.json(
          { error: "Failed to initialize phone auth. Please contact administrator." },
          { status: 500 }
        );
      }
    } else if (createData?.user) {
      authUserId = createData.user.id;
    }

    // Verify session creation with the new Supabase Auth credentials
    const { data: authSession, error: signInErr } = await supabase.auth.signInWithPassword({
      phone: e164Phone,
      password,
    });

    if (signInErr || !authSession?.session) {
      console.error("Post-migration sign-in error:", signInErr);
      return NextResponse.json(
        { error: "Authentication verification failed. Please try again." },
        { status: 500 }
      );
    }

    // Only after verified session creation: update profiles record & clear legacy password_hash
    const updates: Record<string, unknown> = {
      is_migrated: true,
      password_hash: "",
    };
    if (authUserId) {
      updates.auth_user_id = authUserId;
    }

    await supabaseAdmin.from("profiles").update(updates).eq("id", profile.id);

    const updatedProfile = {
      ...profile,
      ...updates,
    };

    return NextResponse.json({
      success: true,
      session: authSession.session,
      profile: rowToPrivateProfile(updatedProfile),
    });
  } catch (err: any) {
    console.error("Login route error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
