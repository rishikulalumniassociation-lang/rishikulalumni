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
  NotificationItem
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
  getMembershipSettings
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

  // Initialize data
  useEffect(() => {
    const user = getLoggedInAlumni();
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.approvalStatus !== "approved") {
      router.push("/login?pending=true");
      return;
    }
    setCurrentUser(user);

    // Fetch feed dependencies
    Promise.all([
      getAlumniList(),
      getCommunityPosts(),
      getEvents(),
      getShradhanjaliList(),
      getLifetimeAchievers(),
      getNotifications(user.id),
    ]).then(([alumni, postsData, eventsData, shradhanjaliData, achieversData, notifs]) => {
      setAlumniList(alumni);
      setPosts(postsData);
      setEvents(eventsData);
      setShradhanjali(shradhanjaliData);
      setAchievers(achieversData);
      setNotifications(notifs);
    });

    const handleAuthChange = () => {
      const u = getLoggedInAlumni();
      if (!u) router.push("/login");
      else setCurrentUser(u);
    };

    window.addEventListener("user_auth_changed", handleAuthChange);
    return () => window.removeEventListener("user_auth_changed", handleAuthChange);
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

  // Compute Birthdays for the Month
  const thisMonthBirthdays = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1;
    return alumniList.filter((a) => {
      if (!a.dateOfBirth) return false;
      const parts = a.dateOfBirth.split("-");
      return parts.length >= 2 && parseInt(parts[1], 10) === currentMonth;
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
            {notifications.some((n) => !n.isRead) && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
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
          </aside>

          {/* ============================================================== */}
          {/* MIDDLE COLUMN: Post Composer & Unified Social Feed             */}
          {/* ============================================================== */}
          <main className="lg:col-span-6 space-y-5">
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
                जन्मदिन ({todaysBirthdays.length})
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

              {/* Feed Posts */}
              {posts.map((post) => {
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
          {notifications.some((n) => !n.isRead) && (
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
    </div>
  );
}
