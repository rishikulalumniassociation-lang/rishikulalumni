"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  Trash2,
  AlertTriangle,
  Plus,
  Image as ImageIcon,
  Video,
  Award,
  Calendar,
  Cake,
  Flower,
  Crown,
  Search,
  Bell,
  Users,
  Users2,
  CheckCircle2,
  X,
  Sparkles,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Building,
  MapPin,
  Camera,
  Home,
  UserCheck,
  Clock
} from "lucide-react";
import {
  AlumniProfile,
  CommunityPost,
  AssociationEvent,
  ShradhanjaliRecord,
  LifetimeAchiever,
  PostComment,
  NotificationItem,
  ConnectionRequestItem
} from "@/types";
import {
  getLoggedInAlumni,
  getAlumniList,
  getCommunityPosts,
  getEvents,
  getShradhanjaliList,
  getLifetimeAchievers,
  getPostComments,
  addPostComment,
  deletePostComment,
  getNotifications,
  markNotificationRead,
  createFeedTextPost,
  toggleCommunityPostLike,
  reportCommunityPost,
  getMembershipSettings,
  getIncomingConnectionRequests,
  acceptConnectionRequest,
  rejectConnectionRequest
} from "@/lib/store";
import RevealOnScroll from "@/components/Motion/RevealOnScroll";

export default function FeedPage() {
  const router = useRouter();

  // Auth & Core Data
  const [currentUser, setCurrentUser] = useState<AlumniProfile | null>(null);
  const [alumniList, setAlumniList] = useState<AlumniProfile[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [events, setEvents] = useState<AssociationEvent[]>([]);
  const [shradhanjali, setShradhanjali] = useState<ShradhanjaliRecord[]>([]);
  const [achievers, setAchievers] = useState<LifetimeAchiever[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<ConnectionRequestItem[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<"all" | "posts" | "events" | "achievers" | "birthdays" | "shradhanjali">("all");
  const [composerText, setComposerText] = useState("");
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [postCommentsMap, setPostCommentsMap] = useState<Record<string, PostComment[]>>({});
  const [commentInputMap, setCommentInputMap] = useState<Record<string, string>>({});
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedLinkPostId, setCopiedLinkPostId] = useState<string | null>(null);

  // Network group modal: which panel is open + what label to show
  type NetworkGroup = {
    title: string;
    subtitle: string;
    list: (AlumniProfile & { _relationType?: string })[];
    accentColor: string; // tailwind bg class for the header strip
  };
  const [networkModal, setNetworkModal] = useState<NetworkGroup | null>(null);

  // Initialize data
  useEffect(() => {
    const user = getLoggedInAlumni();
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.approvalStatus === "pending") {
      router.push("/login?pending=true");
      return;
    }
    setCurrentUser(user);

    // Fetch feed dependencies resiliently so one failure doesn't block the rest
    Promise.allSettled([
      getAlumniList(),
      getCommunityPosts(),
      getEvents(),
      getShradhanjaliList(),
      getLifetimeAchievers(),
      getNotifications(user.id),
      getIncomingConnectionRequests(user.id),
    ]).then(([alumniRes, postsRes, eventsRes, shradhRes, achieversRes, notifsRes, reqsRes]) => {
      if (alumniRes.status === "fulfilled") setAlumniList(alumniRes.value || []);
      if (postsRes.status === "fulfilled") setPosts(postsRes.value || []);
      if (eventsRes.status === "fulfilled") setEvents(eventsRes.value || []);
      if (shradhRes.status === "fulfilled") setShradhanjali(shradhRes.value || []);
      if (achieversRes.status === "fulfilled") setAchievers(achieversRes.value || []);
      if (notifsRes.status === "fulfilled") setNotifications(notifsRes.value || []);
      if (reqsRes.status === "fulfilled") setIncomingRequests(reqsRes.value || []);
    }).catch((err) => {
      console.error("Feed load error:", err);
    });

    const handleReqUpdate = () => {
      if (user?.id) {
        getIncomingConnectionRequests(user.id).then((r) => setIncomingRequests(r));
        getNotifications(user.id).then((n) => setNotifications(n));
      }
    };

    const handleAuthChange = () => {
      const u = getLoggedInAlumni();
      if (!u) router.push("/login");
      else setCurrentUser(u);
    };

    window.addEventListener("user_auth_changed", handleAuthChange);
    window.addEventListener("connection_requests_updated", handleReqUpdate);
    return () => {
      window.removeEventListener("user_auth_changed", handleAuthChange);
      window.removeEventListener("connection_requests_updated", handleReqUpdate);
    };
  }, [router]);

  // Load comments when drawer is opened for a post
  const toggleComments = async (postId: string) => {
    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null);
      return;
    }
    setActiveCommentPostId(postId);
    if (!postCommentsMap[postId]) {
      const cmts = await getPostComments(postId);
      setPostCommentsMap((prev) => ({ ...prev, [postId]: cmts }));
    }
  };

  // Handle post creation
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !composerText.trim()) return;

    setIsSubmittingPost(true);
    try {
      const newPost = await createFeedTextPost(currentUser, composerText.trim());
      setPosts((prev) => [newPost, ...prev]);
      setComposerText("");
    } catch (err) {
      console.error("Failed to publish post:", err);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Handle adding comment
  const handleAddComment = async (postId: string) => {
    const text = commentInputMap[postId]?.trim();
    if (!currentUser || !text) return;

    const userBatch = currentUser.ugBatchYear ? `UG ${currentUser.ugBatchYear}` : undefined;
    const newComment = await addPostComment(postId, {
      postId,
      userId: currentUser.id,
      authorName: currentUser.fullName,
      authorAvatar: currentUser.avatarUrl,
      authorBatch: userBatch,
      content: text,
    });

    setPostCommentsMap((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));

    setCommentInputMap((prev) => ({ ...prev, [postId]: "" }));
  };

  // Handle deleting comment
  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!currentUser) return;
    await deletePostComment(commentId, currentUser.id);
    setPostCommentsMap((prev) => ({
      ...prev,
      [postId]: (prev[postId] || []).filter((c) => c.id !== commentId),
    }));
  };

  // Handle like toggle
  const handleLike = async (postId: string) => {
    if (!currentUser) return;
    const isLiked = likedPostIds.includes(postId);
    if (isLiked) {
      setLikedPostIds((prev) => prev.filter((id) => id !== postId));
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likesCount: Math.max((p.likesCount || 1) - 1, 0) } : p))
      );
    } else {
      setLikedPostIds((prev) => [...prev, postId]);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likesCount: (p.likesCount || 0) + 1 } : p))
      );
      await toggleCommunityPostLike(postId, currentUser.id);
    }
  };

  // Handle share link copy
  const handleShare = (postId: string) => {
    const shareUrl = `${window.location.origin}/community?post=${postId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLinkPostId(postId);
    setTimeout(() => setCopiedLinkPostId(null), 2500);
  };

  // Compute Birthdays for the Month (today and upcoming this month)
  const thisMonthBirthdays = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    return alumniList
      .filter((a) => {
        if (!a.dateOfBirth) return false;
        const parts = a.dateOfBirth.split("-");
        if (parts.length < 3) return false;
        const m = parseInt(parts[1], 10);
        const d = parseInt(parts[2], 10);
        return m === currentMonth && d >= currentDay;
      })
      .sort((a, b) => {
        const partsA = a.dateOfBirth!.split("-");
        const partsB = b.dateOfBirth!.split("-");
        const dayA = parseInt(partsA[2], 10);
        const dayB = parseInt(partsB[2], 10);
        return dayA - dayB;
      });
  }, [alumniList]);

  // Today's Birthdays
  const todaysBirthdays = useMemo(() => {
    const today = new Date();
    const mmdd = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    return alumniList.filter((a) => {
      if (!a.dateOfBirth) return false;
      const parts = a.dateOfBirth.split("-");
      return parts.length >= 3 && `${parts[1]}-${parts[2]}` === mmdd;
    });
  }, [alumniList]);

  // ── Social Network Groups ──────────────────────────────────────────────────

  // Connections: alumni connected to currentUser
  const myConnections = useMemo(() => {
    if (!currentUser?.connectedAlumniIds?.length) return [];
    const ids = new Set(currentUser.connectedAlumniIds);
    return alumniList.filter((a) => ids.has(a.id));
  }, [currentUser, alumniList]);

  // Family: alumni linked as family members
  const myFamily = useMemo(() => {
    if (!currentUser?.familyAlumniRelations?.length) return [];
    const relMap = new Map(
      (currentUser.familyAlumniRelations || []).map((r) => [r.relatedAlumniId, r.relationType])
    );
    return alumniList
      .filter((a) => relMap.has(a.id))
      .map((a) => ({ ...a, _relationType: relMap.get(a.id)! }));
  }, [currentUser, alumniList]);

  // My Teachers: alumni whose ID is in currentUser.teacherAlumniIds
  const myTeachers = useMemo(() => {
    if (!currentUser?.teacherAlumniIds?.length) return [];
    const ids = new Set(currentUser.teacherAlumniIds);
    return alumniList.filter((a) => ids.has(a.id));
  }, [currentUser, alumniList]);

  // UG Batchmates: same ugBatchYear (excluding self)
  const ugBatchmates = useMemo(() => {
    if (!currentUser?.ugBatchYear) return [];
    return alumniList.filter(
      (a) => a.id !== currentUser.id && a.ugBatchYear === currentUser.ugBatchYear
    );
  }, [currentUser, alumniList]);

  // PG Batchmates: same pgBatchYear (excluding self); if also same specialization, sort first
  const pgBatchmates = useMemo(() => {
    if (!currentUser?.pgBatchYear) return [];
    return alumniList
      .filter(
        (a) => a.id !== currentUser.id && a.pgBatchYear === currentUser.pgBatchYear
      )
      .sort((a, b) => {
        // Same specialization = higher priority
        const aMatch = a.specialization === currentUser.specialization ? -1 : 0;
        const bMatch = b.specialization === currentUser.specialization ? -1 : 0;
        return aMatch - bMatch;
      });
  }, [currentUser, alumniList]);

  // Quick Filtered Global Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return alumniList.filter(
      (a) =>
        a.fullName.toLowerCase().includes(q) ||
        (a.city && a.city.toLowerCase().includes(q)) ||
        (a.ugBatchYear && String(a.ugBatchYear).includes(q)) ||
        (a.designation && a.designation.toLowerCase().includes(q)) ||
        (a.specialization && a.specialization.toLowerCase().includes(q))
    ).slice(0, 10);
  }, [searchQuery, alumniList]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-600">लोड हो रहा है...</span>
        </div>
      </div>
    );
  }

  const isLifetimeMember = currentUser.membershipTier === "Life Member" || currentUser.membershipTier === "Patron Member";
  const membershipSettings = getMembershipSettings();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0F172A] pb-24 lg:pb-12">
      {/* Mobile Top App Bar (< 1024px) */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#0F172A] text-white px-4 py-3 border-b border-[#C5A059]/30 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <img
            src="/images/rishikul-sangam-logo.jpg"
            alt="Logo"
            className="w-8 h-8 rounded-full border border-[#C5A059]"
          />
          <div>
            <h1 className="font-serif-heading text-sm font-bold text-amber-100 leading-none">
              ऋषिकुल संगम
            </h1>
            <span className="text-[10px] text-slate-300 font-light">
              Official Alumni Network
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSearchModal(true)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            aria-label="Search alumni"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowNotificationsDrawer(true)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {(notifications.some((n) => !n.isRead) || incomingRequests.length > 0) && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#0F172A]" />
            )}
          </button>

          <Link href="/profile" className="ml-1">
            <img
              src={currentUser.avatarUrl || "/images/default-avatar.png"}
              alt={currentUser.fullName}
              className="w-8 h-8 rounded-full object-cover border border-[#C5A059]"
            />
          </Link>
        </div>
      </header>

      {/* Main Responsive Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 lg:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ============================================================== */}
          {/* LEFT COLUMN: Mini Profile Card & Shortcuts (Desktop >= 1024px) */}
          {/* ============================================================== */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-4">
            {/* Mini Profile Card */}
            <div className="bg-white rounded-3xl p-5 border-2 border-[#C5A059]/30 shadow-md relative overflow-hidden">
              <div className="h-16 -mx-5 -mt-5 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#2D5A43] relative">
                {currentUser.coverUrl && (
                  <img
                    src={currentUser.coverUrl}
                    alt="Cover"
                    className="w-full h-full object-cover opacity-60"
                  />
                )}
              </div>

              <div className="relative -mt-10 mb-3 flex items-end justify-between">
                <div className="relative">
                  <img
                    src={currentUser.avatarUrl || "/images/default-avatar.png"}
                    alt={currentUser.fullName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md bg-slate-100"
                  />
                  {isLifetimeMember && (
                    <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full shadow-xs" title="Life Member">
                      <Crown className="w-3.5 h-3.5 fill-current" />
                    </span>
                  )}
                </div>

                <Link
                  href="/profile"
                  className="text-[11px] font-bold text-[#2D5A43] hover:underline"
                >
                  Edit Profile
                </Link>
              </div>

              <h2 className="font-serif-heading text-base font-bold text-[#0F172A] leading-tight">
                {currentUser.fullName}
              </h2>

              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {currentUser.ugBatchYear ? `BAMS Batch ${currentUser.ugBatchYear}` : "Rishikul Alumnus"}
                {currentUser.pgBatchYear ? ` • PG ${currentUser.pgBatchYear}` : ""}
              </p>

              <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
                {currentUser.designation && (
                  <div className="truncate flex items-center gap-1">
                    <Building className="w-3 h-3 text-[#C5A059] shrink-0" />
                    <span>{currentUser.designation}</span>
                  </div>
                )}
                {currentUser.city && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C5A059] shrink-0" />
                    <span>{currentUser.city}, {currentUser.state}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Membership:</span>
                <span className="font-bold text-[#0F172A]">
                  {currentUser.membershipTier}
                </span>
              </div>
            </div>

            {/* Community Menu Shortcuts */}
            <nav className="bg-white rounded-3xl p-3 border border-slate-200/80 shadow-sm space-y-1 text-xs">
              <Link
                href="/feed"
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-[#0F172A] text-white font-semibold transition-colors"
              >
                <Home className="w-4 h-4 text-[#C5A059]" />
                <span>Community Feed</span>
              </Link>
              <Link
                href="/directory"
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Users className="w-4 h-4 text-[#2D5A43]" />
                <span>Directory & Batchmates</span>
              </Link>
              <Link
                href="/events"
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Calendar className="w-4 h-4 text-sky-600" />
                <span>Events & Conclaves ({events.length})</span>
              </Link>
              <Link
                href="/birthdays"
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Cake className="w-4 h-4 text-pink-600" />
                <span>Birthdays This Month ({thisMonthBirthdays.length})</span>
              </Link>
              <Link
                href="/achievers"
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Award className="w-4 h-4 text-amber-600" />
                <span>Lifetime Achievers</span>
              </Link>
              <Link
                href="/community"
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Camera className="w-4 h-4 text-purple-600" />
                <span>ऋषिकुल गैलरी (Gallery)</span>
              </Link>
              <Link
                href="/shradhanjali"
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Flower className="w-4 h-4 text-[#C5A059]" />
                <span>श्रद्धांजलि (In Memoriam)</span>
              </Link>
              <Link
                href="/membership/permanent"
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Crown className="w-4 h-4 text-amber-500" />
                <span>आजीवन सदस्यता</span>
              </Link>
            </nav>

            {/* ── My Network Sidebar Cards (Desktop) ─────────────────────── */}

            {/* UG Batchmates */}
            {currentUser.ugBatchYear && (
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-wide">
                    <Users className="w-3.5 h-3.5" />
                    <span>UG Batchmates</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNetworkModal({ title: "UG Batchmates", subtitle: `BAMS Batch ${currentUser.ugBatchYear} • ${ugBatchmates.length} alumni`, list: ugBatchmates, accentColor: "bg-sky-700" })}
                    className="text-[11px] font-semibold text-[#C5A059] hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">BAMS Batch {currentUser.ugBatchYear} • {ugBatchmates.length} alumni</p>
                <div className="space-y-2">
                  {ugBatchmates.slice(0, 4).map((a) => (
                    <div key={a.id} className="flex items-center gap-2.5">
                      <img src={a.avatarUrl || "/images/default-avatar.png"} alt={a.fullName} className="w-7 h-7 rounded-full object-cover border border-sky-200 shrink-0" />
                      <div className="truncate">
                        <span className="font-medium text-[11px] text-[#0F172A] block truncate">{a.fullName}</span>
                        <span className="text-[10px] text-slate-400">{a.city || a.state}</span>
                      </div>
                    </div>
                  ))}
                  {ugBatchmates.length === 0 && (
                    <p className="text-[11px] text-slate-400 text-center py-1">No batchmates registered yet.</p>
                  )}
                </div>
                {ugBatchmates.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setNetworkModal({ title: "UG Batchmates", subtitle: `BAMS Batch ${currentUser.ugBatchYear} • ${ugBatchmates.length} alumni`, list: ugBatchmates, accentColor: "bg-sky-700" })}
                    className="w-full text-[11px] font-semibold text-sky-700 hover:underline text-center pt-1 cursor-pointer"
                  >
                    +{ugBatchmates.length - 4} more batchmates →
                  </button>
                )}
              </div>
            )}

            {/* PG Batchmates */}
            {currentUser.pgBatchYear && (
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-violet-700 uppercase tracking-wide">
                    <Users className="w-3.5 h-3.5" />
                    <span>PG Batchmates</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNetworkModal({ title: "PG Batchmates", subtitle: `PG Batch ${currentUser.pgBatchYear}${currentUser.specialization ? " • " + currentUser.specialization.split(" (")[0] : ""} • ${pgBatchmates.length} alumni`, list: pgBatchmates, accentColor: "bg-violet-700" })}
                    className="text-[11px] font-semibold text-[#C5A059] hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  PG Batch {currentUser.pgBatchYear}
                  {currentUser.specialization ? ` • ${currentUser.specialization.split(" (")[0]}` : ""}
                  {" "}• {pgBatchmates.length} alumni
                </p>
                <div className="space-y-2">
                  {pgBatchmates.slice(0, 4).map((a) => (
                    <div key={a.id} className="flex items-center gap-2.5">
                      <img src={a.avatarUrl || "/images/default-avatar.png"} alt={a.fullName} className="w-7 h-7 rounded-full object-cover border border-violet-200 shrink-0" />
                      <div className="truncate">
                        <span className="font-medium text-[11px] text-[#0F172A] block truncate">{a.fullName}</span>
                        <span className="text-[10px] text-slate-400">
                          {a.specialization ? a.specialization.split(" (")[0] : a.city}
                        </span>
                      </div>
                    </div>
                  ))}
                  {pgBatchmates.length === 0 && (
                    <p className="text-[11px] text-slate-400 text-center py-1">No PG batchmates found.</p>
                  )}
                </div>
                {pgBatchmates.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setNetworkModal({ title: "PG Batchmates", subtitle: `PG Batch ${currentUser.pgBatchYear}${currentUser.specialization ? " • " + currentUser.specialization.split(" (")[0] : ""} • ${pgBatchmates.length} alumni`, list: pgBatchmates, accentColor: "bg-violet-700" })}
                    className="w-full text-[11px] font-semibold text-violet-700 hover:underline text-center pt-1 cursor-pointer"
                  >
                    +{pgBatchmates.length - 4} more batchmates →
                  </button>
                )}
              </div>
            )}

            {/* Connections */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D5A43] uppercase tracking-wide">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Connections</span>
                </div>
                <Link href="/directory" className="text-[11px] font-semibold text-[#C5A059] hover:underline">
                  Find More
                </Link>
              </div>
              {myConnections.length > 0 ? (
                <>
                  <button
                    type="button"
                    onClick={() => setNetworkModal({ title: "Connections", subtitle: `${myConnections.length} connected alumni`, list: myConnections, accentColor: "bg-[#2D5A43]" })}
                    className="flex -space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    {myConnections.slice(0, 6).map((c) => (
                      <img key={c.id} src={c.avatarUrl || "/images/default-avatar.png"} alt={c.fullName} className="w-8 h-8 rounded-full object-cover border-2 border-white" title={c.fullName} />
                    ))}
                  </button>
                  <p className="text-[11px] text-slate-500">{myConnections.length} connected alumni</p>
                </>
              ) : (
                <div className="text-center py-2">
                  <UserCheck className="w-7 h-7 text-slate-300 mx-auto mb-1" />
                  <p className="text-[11px] text-slate-400">Connect with batchmates from the Directory.</p>
                </div>
              )}
            </div>

            {/* Family */}
            {myFamily.length > 0 && (
              <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wide">
                    <Heart className="w-3.5 h-3.5" />
                    <span>Alumni Family</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNetworkModal({ title: "Alumni Family", subtitle: `${myFamily.length} family members registered on Rishikul Sangam`, list: myFamily, accentColor: "bg-rose-700" })}
                    className="text-[11px] font-semibold text-[#C5A059] hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-2">
                  {myFamily.slice(0, 4).map((a) => (
                    <div key={a.id} className="flex items-center gap-2.5">
                      <img src={a.avatarUrl || "/images/default-avatar.png"} alt={a.fullName} className="w-7 h-7 rounded-full object-cover border border-rose-200 shrink-0" />
                      <div className="truncate">
                        <span className="font-medium text-[11px] text-[#0F172A] block truncate">{a.fullName}</span>
                        <span className="text-[10px] text-rose-500 font-medium">
                          {(a as typeof a & { _relationType?: string })._relationType}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* My Teachers */}
            {myTeachers.length > 0 && (
              <div className="bg-white rounded-2xl p-4 border border-amber-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wide">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>My Teachers</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNetworkModal({ title: "My Teachers", subtitle: `${myTeachers.length} teachers linked to your profile`, list: myTeachers, accentColor: "bg-amber-700" })}
                    className="text-[11px] font-semibold text-[#C5A059] hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-2">
                  {myTeachers.slice(0, 4).map((a) => (
                    <div key={a.id} className="flex items-center gap-2.5">
                      <img src={a.avatarUrl || "/images/default-avatar.png"} alt={a.fullName} className="w-7 h-7 rounded-full object-cover border border-amber-200 shrink-0" />
                      <div className="truncate">
                        <span className="font-medium text-[11px] text-[#0F172A] block truncate">{a.fullName}</span>
                        <span className="text-[10px] text-amber-700 font-medium">
                          {a.specialization ? a.specialization.split(" (")[0] : "Faculty"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </aside>

          {/* ============================================================== */}
          {/* MIDDLE COLUMN: Post Composer & Unified Social Feed             */}
          {/* ============================================================== */}
          <main className="lg:col-span-6 space-y-5">
            {/* Incoming Connection Requests Banner */}
            {incomingRequests.length > 0 && (
              <div className="bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-transparent border-2 border-amber-400/60 rounded-3xl p-4 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Users2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0F172A]">
                      {incomingRequests.length} नए कनेक्शन अनुरोध प्राप्त हुए!
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      स्वीकार करने पर आप एक-दूसरे के साथ WhatsApp पर भी कनेक्ट हो सकेंगे।
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNotificationsDrawer(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#0F172A] hover:bg-[#2D5A43] text-white text-xs font-bold shrink-0 transition-colors shadow-xs active:scale-95"
                >
                  अनुरोध देखें
                </button>
              </div>
            )}

            {/* Top Post Composer (X / Twitter Style + Media Shortcut) */}
            <div className="bg-white rounded-3xl p-5 border-2 border-[#C5A059]/30 shadow-md">
              <form onSubmit={handleCreatePost} className="space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={currentUser.avatarUrl || "/images/default-avatar.png"}
                    alt={currentUser.fullName}
                    className="w-10 h-10 rounded-full object-cover border border-[#C5A059] shrink-0"
                  />
                  <div className="flex-1">
                    <textarea
                      value={composerText}
                      onChange={(e) => setComposerText(e.target.value)}
                      placeholder="ऋषिकुल परिवार के साथ कुछ विचार या स्मृति साझा करें..."
                      rows={3}
                      className="w-full bg-slate-50 rounded-2xl p-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 border border-slate-200 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none resize-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link
                      href="/community?action=new"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#FAF7F2] text-slate-700 text-xs font-semibold transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-[#2D5A43]" />
                      <span>फोटो / वीडियो</span>
                    </Link>
                    <Link
                      href="/achievers"
                      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#FAF7F2] text-slate-700 text-xs font-semibold transition-colors"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      <span>उपलब्धि</span>
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingPost || !composerText.trim()}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#0F172A] hover:bg-[#2D5A43] text-[#C5A059] hover:text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40 shadow-sm"
                  >
                    <span>{isSubmittingPost ? "पोस्ट हो रहा..." : "पोस्ट करें"}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* ─────────────────────────────────────────────────────────────── */}
            {/* MY NETWORK — Mobile-first horizontal scroll (visible on all)   */}
            {/* Desktop: collapsed pill row; sidebar has full cards            */}
            {/* ─────────────────────────────────────────────────────────────── */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#2D5A43]" />
                  <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">
                    My Network
                  </span>
                </div>
                <Link
                  href="/directory"
                  className="text-[11px] font-semibold text-[#C5A059] hover:underline flex items-center gap-0.5"
                >
                  Full Directory <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Horizontal scroll group pills */}
              <div className="flex items-stretch gap-3 overflow-x-auto px-5 pb-4 no-scrollbar">

                {/* Connections */}
                <button
                  type="button"
                  onClick={() => setNetworkModal({
                    title: "Connections",
                    subtitle: `${myConnections.length} connected alumni`,
                    list: myConnections,
                    accentColor: "bg-[#2D5A43]",
                  })}
                  className="flex-shrink-0 flex flex-col items-center gap-2 bg-[#FAF7F2] hover:bg-amber-50 border border-[#C5A059]/30 hover:border-[#C5A059] rounded-2xl px-4 py-3 transition-all min-w-[90px] text-center cursor-pointer"
                >
                  <div className="flex -space-x-2">
                    {myConnections.slice(0, 3).map((c) => (
                      <img key={c.id} src={c.avatarUrl || "/images/default-avatar.png"} alt={c.fullName} className="w-8 h-8 rounded-full object-cover border-2 border-white" />
                    ))}
                    {myConnections.length === 0 && (
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                        <UserCheck className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-[#2D5A43] leading-tight">Connections</span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {myConnections.length > 0 ? `${myConnections.length} Connected` : "Find Alumni"}
                  </span>
                </button>

                {/* UG Batchmates */}
                <button
                  type="button"
                  onClick={() => setNetworkModal({
                    title: "UG Batchmates",
                    subtitle: `BAMS Batch ${currentUser.ugBatchYear} • ${ugBatchmates.length} alumni`,
                    list: ugBatchmates,
                    accentColor: "bg-sky-700",
                  })}
                  className="flex-shrink-0 flex flex-col items-center gap-2 bg-sky-50 hover:bg-sky-100 border border-sky-200/60 hover:border-sky-400 rounded-2xl px-4 py-3 transition-all min-w-[90px] text-center cursor-pointer"
                >
                  <div className="flex -space-x-2">
                    {ugBatchmates.slice(0, 3).map((c) => (
                      <img key={c.id} src={c.avatarUrl || "/images/default-avatar.png"} alt={c.fullName} className="w-8 h-8 rounded-full object-cover border-2 border-white" />
                    ))}
                    {ugBatchmates.length === 0 && (
                      <div className="w-8 h-8 rounded-full bg-sky-200 flex items-center justify-center">
                        <Users className="w-4 h-4 text-sky-500" />
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-sky-700 leading-tight">UG Batch</span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {currentUser.ugBatchYear ? `${ugBatchmates.length} Batchmates` : "No UG Batch"}
                  </span>
                </button>

                {/* PG Batchmates */}
                {currentUser.pgBatchYear && (
                  <button
                    type="button"
                    onClick={() => setNetworkModal({
                      title: "PG Batchmates",
                      subtitle: `PG Batch ${currentUser.pgBatchYear}${currentUser.specialization ? " • " + currentUser.specialization.split(" (")[0] : ""} • ${pgBatchmates.length} alumni`,
                      list: pgBatchmates,
                      accentColor: "bg-violet-700",
                    })}
                    className="flex-shrink-0 flex flex-col items-center gap-2 bg-violet-50 hover:bg-violet-100 border border-violet-200/60 hover:border-violet-400 rounded-2xl px-4 py-3 transition-all min-w-[90px] text-center cursor-pointer"
                  >
                    <div className="flex -space-x-2">
                      {pgBatchmates.slice(0, 3).map((c) => (
                        <img key={c.id} src={c.avatarUrl || "/images/default-avatar.png"} alt={c.fullName} className="w-8 h-8 rounded-full object-cover border-2 border-white" />
                      ))}
                      {pgBatchmates.length === 0 && (
                        <div className="w-8 h-8 rounded-full bg-violet-200 flex items-center justify-center">
                          <Users className="w-4 h-4 text-violet-500" />
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-violet-700 leading-tight">PG Batch</span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {pgBatchmates.length} Batchmates
                    </span>
                  </button>
                )}

                {/* Family */}
                <button
                  type="button"
                  onClick={() => setNetworkModal({
                    title: "Alumni Family",
                    subtitle: `${myFamily.length} family members registered on Rishikul Sangam`,
                    list: myFamily,
                    accentColor: "bg-rose-700",
                  })}
                  className="flex-shrink-0 flex flex-col items-center gap-2 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 hover:border-rose-400 rounded-2xl px-4 py-3 transition-all min-w-[90px] text-center cursor-pointer"
                >
                  <div className="flex -space-x-2">
                    {myFamily.slice(0, 3).map((c) => (
                      <img key={c.id} src={c.avatarUrl || "/images/default-avatar.png"} alt={c.fullName} className="w-8 h-8 rounded-full object-cover border-2 border-white" />
                    ))}
                    {myFamily.length === 0 && (
                      <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center">
                        <Heart className="w-4 h-4 text-rose-400" />
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-rose-700 leading-tight">Family</span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {myFamily.length > 0 ? `${myFamily.length} Members` : "Link Alumni"}
                  </span>
                </button>

                {/* My Teachers */}
                <button
                  type="button"
                  onClick={() => setNetworkModal({
                    title: "My Teachers",
                    subtitle: `${myTeachers.length} teacher${myTeachers.length !== 1 ? "s" : ""} linked to your profile`,
                    list: myTeachers,
                    accentColor: "bg-amber-700",
                  })}
                  className="flex-shrink-0 flex flex-col items-center gap-2 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 hover:border-[#C5A059] rounded-2xl px-4 py-3 transition-all min-w-[90px] text-center cursor-pointer"
                >
                  <div className="flex -space-x-2">
                    {myTeachers.slice(0, 3).map((c) => (
                      <img key={c.id} src={c.avatarUrl || "/images/default-avatar.png"} alt={c.fullName} className="w-8 h-8 rounded-full object-cover border-2 border-white" />
                    ))}
                    {myTeachers.length === 0 && (
                      <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-amber-800 leading-tight">My Teachers</span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {myTeachers.length > 0 ? `${myTeachers.length} Gurus` : "Find Experts"}
                  </span>
                </button>

              </div>
            </div>


            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeTab === "all"
                    ? "bg-[#0F172A] text-[#C5A059] shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                सभी (All Feed)
              </button>
              <button
                onClick={() => setActiveTab("posts")}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeTab === "posts"
                    ? "bg-[#0F172A] text-[#C5A059] shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                पोस्ट्स ({posts.length})
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeTab === "events"
                    ? "bg-[#0F172A] text-[#C5A059] shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                आयोजन ({events.length})
              </button>
              <button
                onClick={() => setActiveTab("achievers")}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeTab === "achievers"
                    ? "bg-[#0F172A] text-[#C5A059] shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                उपलब्धियां ({achievers.length})
              </button>
              <button
                onClick={() => setActiveTab("birthdays")}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeTab === "birthdays"
                    ? "bg-[#0F172A] text-[#C5A059] shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                इस माह के जन्मदिन ({thisMonthBirthdays.length})
              </button>
              <button
                onClick={() => setActiveTab("shradhanjali")}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeTab === "shradhanjali"
                    ? "bg-[#0F172A] text-[#C5A059] shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                श्रद्धांजलि
              </button>
            </div>

            {/* ============================================================== */}
            {/* Feed Cards Stream                                              */}
            {/* ============================================================== */}
            <div className="space-y-4">
              {/* Today's Birthdays Banner Card (if any today) */}
              {(activeTab === "all" || activeTab === "birthdays") && todaysBirthdays.length > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-pink-50 rounded-3xl p-5 border-2 border-pink-200 shadow-sm flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shrink-0 shadow-md">
                      <Cake className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 block">
                        Today's Alumni Celebrations 🎉
                      </span>
                      <h3 className="font-serif-heading text-base font-bold text-[#0F172A]">
                        {todaysBirthdays.map((b) => b.fullName).join(", ")}
                      </h3>
                      <p className="text-xs text-slate-600">
                        ऋषिकुल परिवार की ओर से जन्मदिवस की हार्दिक मंगलकामनाएं!
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/birthdays"
                    className="shrink-0 px-3.5 py-1.5 rounded-full bg-pink-600 text-white text-xs font-bold hover:bg-pink-700 transition-colors shadow-xs"
                  >
                    शुभकामनाएं भेजें
                  </Link>
                </div>
              )}

              {/* When Birthday Tab is Active: Show all this month's birthdays */}
              {activeTab === "birthdays" && (
                <div className="bg-white rounded-3xl p-6 border-2 border-pink-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Cake className="w-5 h-5 text-pink-600" />
                      <h3 className="font-serif-heading text-lg font-bold text-[#0F172A]">
                        इस माह के सभी जन्मदिन ({thisMonthBirthdays.length})
                      </h3>
                    </div>
                    <Link
                      href="/birthdays"
                      className="text-xs font-bold text-pink-600 hover:underline"
                    >
                      पूर्ण रडार देखें →
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {thisMonthBirthdays.map((alumnus) => {
                      const bdayDate = alumnus.dateOfBirth ? new Date(alumnus.dateOfBirth) : null;
                      const formattedDate = bdayDate
                        ? bdayDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        : "";
                      return (
                        <div
                          key={alumnus.id}
                          className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-pink-300 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={alumnus.avatarUrl || "/images/default-avatar.png"}
                              alt={alumnus.fullName}
                              className="w-11 h-11 rounded-xl object-cover border border-pink-200 shrink-0"
                            />
                            <div>
                              <span className="text-[10px] font-bold text-pink-600 block uppercase">
                                {formattedDate}
                              </span>
                              <h5 className="font-bold text-xs text-[#0F172A] leading-snug">
                                {alumnus.fullName}
                              </h5>
                              <p className="text-[10px] text-slate-500">
                                {alumnus.ugBatchYear ? `UG ${alumnus.ugBatchYear}` : alumnus.city}
                              </p>
                            </div>
                          </div>
                          <Link
                            href="/birthdays"
                            className="px-2.5 py-1 rounded-full bg-pink-100 text-pink-700 text-[11px] font-bold hover:bg-pink-200 transition-colors shrink-0"
                          >
                            बधाई दें
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Feed Posts */}
              {(activeTab === "all" || activeTab === "posts") && posts.map((post) => {
                const isLiked = likedPostIds.includes(post.id);
                const comments = postCommentsMap[post.id] || [];
                const isCommentOpen = activeCommentPostId === post.id;
                const isAuthor = currentUser.id === post.userId;

                return (
                  <article
                    key={post.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.authorAvatar || "/images/default-avatar.png"}
                          alt={post.authorName}
                          className="w-11 h-11 rounded-2xl object-cover border border-[#C5A059] shrink-0"
                        />
                        <div>
                          <h4 className="font-serif-heading text-sm font-bold text-[#0F172A] leading-snug">
                            {post.authorName}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            {post.authorBatch && (
                              <span className="text-[#2D5A43] font-semibold">
                                {post.authorBatch}
                              </span>
                            )}
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(post.createdAt).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#FAF7F2] text-[#C5A059] border border-[#C5A059]/40">
                        {post.category || post.contentType}
                      </span>
                    </div>

                    {/* Post Content */}
                    <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-light space-y-2">
                      {post.title && post.title !== post.description && (
                        <h5 className="font-bold text-[#0F172A] text-sm sm:text-base">
                          {post.title}
                        </h5>
                      )}
                      {post.description && (
                        <p className="whitespace-pre-line">{post.description}</p>
                      )}
                    </div>

                    {/* Media Attachments */}
                    {post.fileUrl && (post.contentType === "photo" || post.contentType === "artwork") && (
                      <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-96 bg-slate-950">
                        <img
                          src={post.fileUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {post.fileUrl && post.contentType === "video" && (
                      <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-96 bg-black">
                        <video
                          src={post.fileUrl}
                          controls
                          className="w-full max-h-96 object-contain"
                        />
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-1.5 font-semibold transition-colors ${
                            isLiked ? "text-rose-600" : "hover:text-rose-600"
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${isLiked ? "fill-rose-600" : ""}`}
                          />
                          <span>{post.likesCount || 0} Appreciate</span>
                        </button>

                        <button
                          onClick={() => toggleComments(post.id)}
                          className="flex items-center gap-1.5 font-semibold hover:text-[#2D5A43] transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Comments {comments.length > 0 ? `(${comments.length})` : ""}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleShare(post.id)}
                          className="flex items-center gap-1 hover:text-[#0F172A] transition-colors"
                          title="Share post"
                        >
                          <Share2 className="w-4 h-4" />
                          <span className="hidden sm:inline">
                            {copiedLinkPostId === post.id ? "Copied!" : "Share"}
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            reportCommunityPost({
                              postId: post.id,
                              postTitle: post.title,
                              reporterId: currentUser.id,
                              reporterName: currentUser.fullName,
                              reason: "Inappropriate content",
                            });
                            alert("Report submitted to Rishikul association administrators.");
                          }}
                          className="p-1 text-slate-400 hover:text-red-600"
                          title="Report post"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Comments Drawer / Thread */}
                    {isCommentOpen && (
                      <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in">
                        {/* Existing comments list */}
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {comments.length === 0 ? (
                            <p className="text-[11px] text-slate-400 text-center py-2 italic">
                              पहला विचार साझा करें...
                            </p>
                          ) : (
                            comments.map((c) => (
                              <div
                                key={c.id}
                                className="bg-slate-50 rounded-2xl p-2.5 text-xs flex items-start justify-between gap-2"
                              >
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
                                    <span>{c.authorName}</span>
                                    {c.authorBatch && (
                                      <span className="text-[10px] text-[#C5A059] font-normal">
                                        ({c.authorBatch})
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-slate-700">{c.content}</p>
                                </div>

                                {(c.userId === currentUser.id || isAuthor) && (
                                  <button
                                    onClick={() => handleDeleteComment(post.id, c.id)}
                                    className="text-slate-400 hover:text-red-600 p-1"
                                    title="Delete comment"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            ))
                          )}
                        </div>

                        {/* Comment Input */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={commentInputMap[post.id] || ""}
                            onChange={(e) =>
                              setCommentInputMap((prev) => ({
                                ...prev,
                                [post.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleAddComment(post.id);
                            }}
                            placeholder="टिप्पणी लिखें..."
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#C5A059]"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="p-2 rounded-xl bg-[#0F172A] text-[#C5A059] hover:bg-[#2D5A43] hover:text-white transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}

              {/* When Events Tab is Active */}
              {activeTab === "events" && (
                <div className="space-y-4">
                  {events.map((ev) => (
                    <div key={ev.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-xs text-[#2D5A43] font-bold">
                        <span>{ev.eventType}</span>
                        <span>{ev.date} • {ev.city}</span>
                      </div>
                      <h4 className="font-serif-heading text-lg font-bold text-[#0F172A]">{ev.title}</h4>
                      <p className="text-xs text-slate-600 font-light">{ev.description}</p>
                      <div className="pt-2 flex justify-end">
                        <Link href="/events" className="text-xs font-bold text-[#C5A059] hover:underline">
                          RSVP & Details →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* When Achievers Tab is Active */}
              {activeTab === "achievers" && (
                <div className="space-y-4">
                  {achievers.map((ach) => (
                    <div key={ach.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-start gap-4">
                      <img src={ach.photoUrl} alt={ach.name} className="w-16 h-16 rounded-2xl object-cover border border-[#C5A059] shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold text-[#C5A059] uppercase block">Batch {ach.batchYear} • {ach.degree}</span>
                        <h4 className="font-serif-heading text-base font-bold text-[#0F172A]">{ach.name}</h4>
                        <p className="text-xs text-[#2D5A43] font-semibold">{ach.title}</p>
                        <p className="text-xs text-slate-600 mt-1 italic font-light line-clamp-2">"{ach.citation}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* When Shradhanjali Tab is Active */}
              {activeTab === "shradhanjali" && (
                <div className="space-y-4">
                  {shradhanjali.map((sh) => (
                    <div key={sh.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-start gap-4">
                      <img src={sh.photoUrl} alt={sh.name} className="w-16 h-16 rounded-2xl object-cover grayscale border border-slate-300 shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold text-red-600 uppercase block">स्मृति शेष • Batch {sh.batchYear} • {sh.dateOfDemise}</span>
                        <h4 className="font-serif-heading text-base font-bold text-[#0F172A]">{sh.name}</h4>
                        <p className="text-xs text-slate-600 mt-1 italic font-light">"{sh.tribute}"</p>
                        <Link href="/shradhanjali" className="text-xs font-bold text-[#2D5A43] hover:underline inline-block mt-2">
                          श्रद्धा सुमन अर्पित करें ({sh.condolencesCount}) →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>

          {/* ============================================================== */}
          {/* RIGHT COLUMN: Lifetime CTA & Community Widgets (Desktop >= 1280px) */}
          {/* ============================================================== */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-5">
            {/* Lifetime Membership CTA Card */}
            {!isLifetimeMember ? (
              <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#2D5A43] text-white rounded-3xl p-5 border-2 border-[#C5A059] shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-wider mb-2">
                  <Crown className="w-4 h-4 fill-current" />
                  <span>आजीवन सदस्यता</span>
                </div>

                <h3 className="font-serif-heading text-lg font-bold text-amber-100 leading-snug">
                  आजीवन सदस्य बनें
                </h3>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  संस्था से स्थायी रूप से जुड़ें, आजीवन पहचान एवं आधिकारिक डिजिटल स्मार्ट कार्ड प्राप्त करें।
                </p>

                <div className="my-3 p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-[#C5A059]/40 text-center">
                  <span className="text-[10px] uppercase text-amber-200 block font-semibold">
                    शुल्क: ₹{membershipSettings.lifetimeFee.toLocaleString("en-IN")} (एकमुश्त)
                  </span>
                  <span className="text-[11px] font-mono text-white font-bold">
                    UPI: {membershipSettings.upiId}
                  </span>
                </div>

                <Link
                  href="/membership/permanent"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C5A059] hover:bg-amber-300 text-[#0F172A] font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  <span>अभी आजीवन सदस्य बनें</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/80 rounded-3xl p-4 border-2 border-[#C5A059] shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#C5A059] text-[#0F172A] flex items-center justify-center shrink-0 font-bold shadow-xs">
                  <Crown className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="font-serif-heading text-sm font-bold text-amber-950">
                    आप आजीवन सदस्य हैं ✓
                  </h4>
                  <p className="text-[11px] text-amber-900">
                    गोल्डन पहचान एवं स्मार्ट कार्ड सक्रिय
                  </p>
                </div>
              </div>
            )}

            {/* Birthdays This Month Widget */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-pink-600">
                  <Cake className="w-3.5 h-3.5" />
                  <span>इस माह के जन्मदिन</span>
                </div>
                <Link
                  href="/birthdays"
                  className="text-[11px] font-semibold text-[#2D5A43] hover:underline"
                >
                  सभी देखें
                </Link>
              </div>

              <div className="space-y-2.5">
                {thisMonthBirthdays.slice(0, 4).map((b) => (
                  <div key={b.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <img
                        src={b.avatarUrl || "/images/default-avatar.png"}
                        alt={b.fullName}
                        className="w-7 h-7 rounded-full object-cover border border-pink-200 shrink-0"
                      />
                      <div className="truncate">
                        <span className="font-medium text-slate-800 truncate block">
                          {b.fullName}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {b.ugBatchYear ? `Batch ${b.ugBatchYear}` : b.city}
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/birthdays"
                      className="text-[10px] font-bold text-pink-600 hover:underline shrink-0"
                    >
                      शुभकामनाएं
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events Widget */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#2D5A43]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>आगामी आयोजन</span>
                </div>
                <Link
                  href="/events"
                  className="text-[11px] font-semibold text-[#C5A059] hover:underline"
                >
                  इवेंट्स ({events.length})
                </Link>
              </div>

              <div className="space-y-3">
                {events.slice(0, 2).map((ev) => (
                  <div key={ev.id} className="text-xs space-y-1 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-[#2D5A43] block">
                      {ev.date} • {ev.city}
                    </span>
                    <h5 className="font-serif-heading font-bold text-slate-900 leading-snug">
                      {ev.title}
                    </h5>
                    <Link
                      href="/events"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-[#C5A059] hover:underline pt-1"
                    >
                      <span>RSVP Details</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* श्रद्धांजलि (In Memoriam) Remembrance Widget */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-slate-700">
                  <Flower className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>स्मृति शेष • श्रद्धांजलि</span>
                </div>
                <Link
                  href="/shradhanjali"
                  className="text-[11px] font-semibold text-slate-500 hover:underline"
                >
                  श्रद्धा सुमन
                </Link>
              </div>

              <div className="space-y-2">
                {shradhanjali.slice(0, 2).map((rec) => (
                  <div key={rec.id} className="flex items-center gap-2.5 text-xs">
                    <img
                      src={rec.photoUrl}
                      alt={rec.name}
                      className="w-8 h-8 rounded-xl object-cover grayscale border border-slate-300 shrink-0"
                    />
                    <div className="truncate">
                      <span className="font-bold text-slate-800 truncate block">
                        {rec.name}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Batch {rec.batchYear} • {rec.dateOfDemise}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ============================================================== */}
      {/* Mobile Fixed Bottom Navigation (< 1024px)                     */}
      {/* ============================================================== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-2xl">
        <Link
          href="/feed"
          className="flex flex-col items-center gap-0.5 text-xs text-[#2D5A43] font-bold"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Feed</span>
        </Link>

        <Link
          href="/directory"
          className="flex flex-col items-center gap-0.5 text-xs text-slate-500 hover:text-[#0F172A]"
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px]">Alumni</span>
        </Link>

        {/* Floating Create Button */}
        <Link
          href="/community?action=new"
          className="flex items-center justify-center w-11 h-11 -mt-5 rounded-full bg-[#0F172A] text-[#C5A059] border-2 border-[#C5A059] shadow-lg active:scale-95 transition-transform"
          aria-label="Create post"
        >
          <Plus className="w-6 h-6" />
        </Link>

        <button
          onClick={() => setShowNotificationsDrawer(true)}
          className="flex flex-col items-center gap-0.5 text-xs text-slate-500 hover:text-[#0F172A] relative"
        >
          <Bell className="w-5 h-5" />
          {(notifications.some((n) => !n.isRead) || incomingRequests.length > 0) && (
            <span className="absolute top-0 right-3 w-2 h-2 rounded-full bg-red-500" />
          )}
          <span className="text-[10px]">Alerts</span>
        </button>

        <Link
          href="/profile"
          className="flex flex-col items-center gap-0.5 text-xs text-slate-500 hover:text-[#0F172A]"
        >
          <img
            src={currentUser.avatarUrl || "/images/default-avatar.png"}
            alt="Profile"
            className="w-5 h-5 rounded-full object-cover border border-[#C5A059]"
          />
          <span className="text-[10px]">Profile</span>
        </Link>
      </nav>

      {/* ============================================================== */}
      {/* Global Quick Search Modal                                      */}
      {/* ============================================================== */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-4 pt-16 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-5 border-2 border-[#C5A059]/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                <Search className="w-4 h-4 text-[#C5A059]" />
                <span>Search Rishikul Fraternity</span>
              </div>
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                placeholder="Search by doctor name, batch (1995), city, specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {searchResults.length === 0 && searchQuery ? (
                <p className="text-xs text-slate-400 text-center py-4">
                  कोई परिणाम नहीं मिला। बैच या शहर बदलकर खोजें।
                </p>
              ) : (
                searchResults.map((a) => (
                  <Link
                    key={a.id}
                    href={`/directory`}
                    onClick={() => setShowSearchModal(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF7F2] transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={a.avatarUrl || "/images/default-avatar.png"}
                        alt={a.fullName}
                        className="w-8 h-8 rounded-full object-cover border border-[#C5A059]"
                      />
                      <div>
                        <span className="font-bold text-[#0F172A] block">
                          {a.fullName}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {a.ugBatchYear ? `BAMS ${a.ugBatchYear}` : ""} • {a.city}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* Notifications Drawer                                           */}
      {/* ============================================================== */}
      {showNotificationsDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end animate-in fade-in">
          <div className="bg-white w-full max-w-sm h-full p-5 flex flex-col justify-between shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#C5A059]" />
                  <h3 className="font-serif-heading text-base font-bold text-[#0F172A]">
                    Notifications (सूचनाएँ)
                  </h3>
                </div>
                <button
                  onClick={() => setShowNotificationsDrawer(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
                {/* Incoming Connection Requests Section */}
                {incomingRequests.length > 0 && (
                  <div className="mb-4 pb-3 border-b border-amber-200/60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Users2 className="w-3.5 h-3.5 text-amber-600" />
                        कनेक्शन अनुरोध ({incomingRequests.length})
                      </span>
                    </div>
                    <div className="space-y-2">
                      {incomingRequests.map((req) => (
                        <div
                          key={req.id}
                          className="p-3 rounded-2xl bg-amber-50/90 border border-amber-300 shadow-xs flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={req.senderProfile?.avatarUrl || "/images/default-avatar.png"}
                              alt={req.senderProfile?.fullName || "Alumni"}
                              className="w-10 h-10 rounded-full object-cover border border-amber-300 shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-[#0F172A] truncate">
                                {req.senderProfile?.fullName || "Alumni Member"}
                              </h4>
                              <p className="text-[10px] text-slate-500 truncate">
                                {req.senderProfile?.ugBatchYear ? `UG ${req.senderProfile.ugBatchYear}` : ""}{req.senderProfile?.city ? ` • ${req.senderProfile.city}` : ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (!currentUser) return;
                                await acceptConnectionRequest(req.senderId, currentUser.id);
                                const [updatedReqs, freshList] = await Promise.all([
                                  getIncomingConnectionRequests(currentUser.id),
                                  getAlumniList(true),
                                ]);
                                setIncomingRequests(updatedReqs);
                                setAlumniList(freshList);
                                setCurrentUser(getLoggedInAlumni());
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs active:scale-95 transition-all"
                            >
                              स्वीकार करें
                            </button>
                            <button
                              type="button"
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (!currentUser) return;
                                await rejectConnectionRequest(req.senderId, currentUser.id);
                                const updatedReqs = await getIncomingConnectionRequests(currentUser.id);
                                setIncomingRequests(updatedReqs);
                              }}
                              className="px-2 py-1.5 rounded-lg bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 text-[11px] font-semibold transition-colors"
                            >
                              अस्वीकार
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {notifications.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    कोई नई सूचना नहीं है।
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3 rounded-2xl text-xs space-y-1 transition-colors cursor-pointer ${
                        n.isRead ? "bg-slate-50 text-slate-600" : "bg-amber-50/80 border border-amber-200 text-amber-950 font-medium"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0F172A]">{n.title}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(n.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => setShowNotificationsDrawer(false)}
              className="w-full py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* Network Group Modal — filtered alumni panel                    */}
      {/* ============================================================== */}
      {networkModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
          onClick={() => setNetworkModal(null)}
        >
          <div
            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`${networkModal.accentColor} text-white px-5 py-4 flex items-center justify-between shrink-0`}>
              <div>
                <h3 className="font-serif-heading text-base font-bold leading-tight">{networkModal.title}</h3>
                <p className="text-[11px] text-white/75 mt-0.5">{networkModal.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setNetworkModal(null)}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Alumni List */}
            <div className="overflow-y-auto flex-1 p-4 space-y-3">
              {networkModal.list.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Users className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-medium">कोई alumni नहीं मिला।</p>
                  <p className="text-xs mt-1">Update your profile or explore the full Directory.</p>
                  <Link
                    href="/directory"
                    onClick={() => setNetworkModal(null)}
                    className="inline-flex items-center gap-1 mt-3 px-4 py-2 rounded-full bg-[#0F172A] text-[#C5A059] text-xs font-bold hover:bg-[#2D5A43] hover:text-white transition-colors"
                  >
                    Full Directory <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              ) : (
                networkModal.list.map((a) => {
                  const rel = (a as typeof a & { _relationType?: string })._relationType;
                  return (
                    <div key={a.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-[#FAF7F2] border border-slate-100 hover:border-[#C5A059]/30 transition-all">
                      <img
                        src={a.avatarUrl || "/images/default-avatar.png"}
                        alt={a.fullName}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-[#0F172A] truncate">{a.fullName}</h4>
                        <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                          {rel && (
                            <span className="text-[10px] font-bold text-rose-600 uppercase">{rel}</span>
                          )}
                          {a.ugBatchYear && (
                            <span className="text-[10px] text-sky-700 font-medium">BAMS {a.ugBatchYear}</span>
                          )}
                          {a.pgBatchYear && (
                            <span className="text-[10px] text-violet-700 font-medium">PG {a.pgBatchYear}</span>
                          )}
                          {a.specialization && (
                            <span className="text-[10px] text-amber-700">{a.specialization.split(" (")[0]}</span>
                          )}
                          {a.city && (
                            <span className="text-[10px] text-slate-500">{a.city}</span>
                          )}
                        </div>
                        {a.designation && (
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">{a.designation}</p>
                        )}
                      </div>
                      {a.whatsappNumber && currentUser?.connectedAlumniIds?.includes(a.id) && (
                        <a
                          href={`https://wa.me/91${a.whatsappNumber.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 p-2 rounded-xl bg-green-500 hover:bg-green-600 text-white transition-colors"
                          title={`WhatsApp ${a.fullName}`}
                        >
                          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </a>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 px-4 py-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/directory"
                onClick={() => setNetworkModal(null)}
                className="text-xs font-semibold text-[#2D5A43] hover:underline flex items-center gap-1"
              >
                Full Alumni Directory <ExternalLink className="w-3 h-3" />
              </Link>
              <button
                type="button"
                onClick={() => setNetworkModal(null)}
                className="px-4 py-1.5 rounded-full bg-[#0F172A] text-white text-xs font-bold"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
