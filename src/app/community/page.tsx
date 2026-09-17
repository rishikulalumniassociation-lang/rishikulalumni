"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  PlusCircle,
  Search,
  Filter,
  Pin,
  Image as ImageIcon,
  Video,
  FileText,
  Feather,
  Palette,
  BookOpen,
  Calendar,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { CommunityPost, AlumniProfile, PostCategory } from '@/types';
import {
  getCommunityPosts,
  getLoggedInAlumni,
  isAdminAuthenticated,
  deleteCommunityPost,
  pinCommunityPost,
  unpinCommunityPost,
  hideCommunityPost,
  getMyLikedPostIds,
} from '@/lib/store';
import CreatePostModal from '@/components/Community/CreatePostModal';
import MediaLightbox from '@/components/Community/MediaLightbox';
import ReportPostModal from '@/components/Community/ReportPostModal';
import PostCard from '@/components/Community/PostCard';

const CATEGORIES: { label: string; value: PostCategory; icon: React.ElementType }[] = [
  { label: 'All / सभी', value: 'All', icon: Sparkles },
  { label: 'Photos / तस्वीरें', value: 'Photos', icon: ImageIcon },
  { label: 'Videos / वीडियो', value: 'Videos', icon: Video },
  { label: 'Research / शोध पत्र', value: 'Research', icon: BookOpen },
  { label: 'Articles / लेख', value: 'Articles', icon: FileText },
  { label: 'Poems / कविताएँ', value: 'Poems', icon: Feather },
  { label: 'Artwork / कलाकृति', value: 'Artwork', icon: Palette },
  { label: 'Documents / प्रलेख', value: 'Documents', icon: FileText },
  { label: 'Memories / स्मृतियाँ', value: 'Memories', icon: Calendar },
];

export default function CommunityShowcasePage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // User auth state
  const [currentUser, setCurrentUser] = useState<AlumniProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'likes'>('newest');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [lightboxPost, setLightboxPost] = useState<CommunityPost | null>(null);
  const [reportingPost, setReportingPost] = useState<CommunityPost | null>(null);

  // Status message
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    const user = getLoggedInAlumni();
    setCurrentUser(user);
    setIsAdmin(isAdminAuthenticated());

    if (user?.id) {
      getMyLikedPostIds(user.id).then((ids) => setLikedPostIds(new Set(ids)));
    }

    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const isAdm = isAdminAuthenticated();
      const data = await getCommunityPosts({
        includeHidden: isAdm, // Admin can see hidden posts
      });
      setPosts(data);
    } catch (err) {
      console.error('Failed to load community posts:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  // Extract available batches from posts
  const availableBatches = useMemo(() => {
    const batches = new Set<string>();
    posts.forEach((p) => {
      if (p.authorBatch) batches.add(p.authorBatch);
      if (p.relatedBatch) batches.add(p.relatedBatch);
    });
    return Array.from(batches).sort().reverse();
  }, [posts]);

  // Filtered & Sorted posts
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Batch
    if (selectedBatch !== 'All') {
      result = result.filter(
        (p) => p.authorBatch === selectedBatch || p.relatedBatch === selectedBatch
      );
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.authorName?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'likes') {
      result.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
    } else {
      // Default: pinned first, then newest
      result.sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        if (a.isPinned && b.isPinned) {
          return (a.pinOrder || 0) - (b.pinOrder || 0);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }

    return result;
  }, [posts, selectedCategory, selectedBatch, searchQuery, sortBy]);

  // Separate pinned posts for featured view if no search/filter is active
  const isDefaultView = selectedCategory === 'All' && selectedBatch === 'All' && !searchQuery.trim();
  const pinnedPosts = useMemo(() => {
    if (!isDefaultView) return [];
    return posts.filter((p) => p.isPinned);
  }, [posts, isDefaultView]);

  // Non-pinned posts for standard list when in default view
  const regularPosts = useMemo(() => {
    if (!isDefaultView) return filteredPosts;
    return filteredPosts.filter((p) => !p.isPinned);
  }, [filteredPosts, isDefaultView]);

  // Handle Create Post CTA Click
  const handleCreatePostClick = () => {
    if (!currentUser) {
      setStatusMessage({
        type: 'info',
        text: 'Please log in with your verified alumni account to share content. / सामग्री साझा करने के लिए कृपया लॉगिन करें।',
      });
      return;
    }

    // Check if approved alumni
    const isApproved =
      currentUser.isVerified === true &&
      (currentUser.approvalStatus === 'approved' || !currentUser.approvalStatus);

    if (!isApproved && !isAdmin) {
      setStatusMessage({
        type: 'error',
        text: 'Your alumni registration is awaiting verification by college administration. Once approved, you can publish posts here.',
      });
      return;
    }

    setEditingPost(null);
    setIsCreateModalOpen(true);
  };

  // Admin and Author actions
  const handleDeletePost = async (post: CommunityPost) => {
    const res = await deleteCommunityPost(post.id);
    if (res.success) {
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      setStatusMessage({ type: 'success', text: 'Post deleted successfully.' });
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Failed to delete post.' });
    }
  };

  const handleTogglePin = async (post: CommunityPost) => {
    if (post.isPinned) {
      const res = await unpinCommunityPost(post.id);
      if (res.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, isPinned: false, pinOrder: 0 } : p))
        );
        setStatusMessage({ type: 'success', text: 'Post unpinned.' });
      }
    } else {
      const pinOrder = prompt('Enter pin priority order (1 is top):', '1');
      const orderNum = parseInt(pinOrder || '1', 10);
      const res = await pinCommunityPost(post.id, isNaN(orderNum) ? 1 : orderNum, currentUser?.id);
      if (res.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, isPinned: true, pinOrder: isNaN(orderNum) ? 1 : orderNum } : p))
        );
        setStatusMessage({ type: 'success', text: 'Post pinned to top.' });
      }
    }
  };

  const handleToggleHide = async (post: CommunityPost) => {
    const nextHidden = !post.isHidden;
    const res = await hideCommunityPost(post.id, nextHidden);
    if (res.success) {
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, isHidden: nextHidden } : p))
      );
      setStatusMessage({
        type: 'info',
        text: nextHidden ? 'Post hidden from public view.' : 'Post restored to public view.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-900 via-stone-900 to-emerald-950 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />
        <div className="relative max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            Rishikul Alumni Community Showcase
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            ऋषिकुल गैलरी एवं सिर्जनशीलता
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-300 leading-relaxed font-light">
            A vibrant living canvas for Rishikul alumni to preserve college memories, share clinical articles, publish research, poetry, artwork, and cherish our shared Ayurvedic heritage.
          </p>

          {/* Call to Action Button */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleCreatePostClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-900/40 hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <PlusCircle className="w-5 h-5" />
              Share with Rishikul / रचना साझा करें
            </button>

            {!currentUser && (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition"
              >
                Log In to Participate
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Status Notice Toast */}
      {statusMessage && (
        <div className="max-w-4xl mx-auto px-4 mt-4">
          <div
            className={`p-4 rounded-xl flex items-center justify-between gap-3 text-sm shadow-md ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-300'
                : statusMessage.type === 'error'
                ? 'bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-200 border border-red-300'
                : 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-200 border border-blue-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
              {statusMessage.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
              {statusMessage.type === 'info' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-xs font-semibold underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Search, Filter, Batch Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
          {/* Top Row: Search input + Batch Select + Sort By */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, description, tags (#reunion, #ayurveda)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Batch Filter & Sort */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <Calendar className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="bg-transparent text-slate-700 dark:text-slate-300 outline-none cursor-pointer text-xs"
                >
                  <option value="All">All Batches / सभी बैच</option>
                  {availableBatches.map((b) => (
                    <option key={b} value={b}>
                      Batch {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-slate-700 dark:text-slate-300 outline-none cursor-pointer text-xs"
                >
                  <option value="newest">Newest First / नवीनतम</option>
                  <option value="likes">Most Liked / सर्वाधिक पसंद</option>
                </select>
              </div>

              <button
                onClick={handleManualRefresh}
                disabled={refreshing}
                title="Refresh feed"
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-amber-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all font-medium ${
                    active
                      ? 'bg-amber-600 text-white shadow-sm font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-amber-500'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Loading Rishikul community showcase...
            </p>
          </div>
        ) : filteredPosts.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-white">
              No Showcases Found
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {searchQuery || selectedCategory !== 'All' || selectedBatch !== 'All'
                ? 'No contributions match the selected filters. Try resetting the filters or search query.'
                : 'Be the very first alumnus to share a memory, photo, research paper, or article with the Rishikul family!'}
            </p>
            <div className="pt-2">
              <button
                onClick={handleCreatePostClick}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-md transition"
              >
                + Share First Post / पहला पोस्ट साझा करें
              </button>
            </div>
          </div>
        ) : (
          /* Posts Display */
          <div className="space-y-10">
            {/* Pinned Showcase Highlights (Visible in default view) */}
            {isDefaultView && pinnedPosts.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                    <Pin className="w-4 h-4 fill-amber-600" />
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                      Featured Showcases / मुख्य संकलन
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Editorially highlighted contributions from esteemed alumni
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pinnedPosts.map((post) => (
                    <PostCard
                      key={`pinned-${post.id}`}
                      post={post}
                      currentUser={currentUser}
                      isAdmin={isAdmin}
                      isLiked={likedPostIds.has(post.id)}
                      onOpenLightbox={setLightboxPost}
                      onReport={setReportingPost}
                      onEdit={setEditingPost}
                      onDelete={handleDeletePost}
                      onTogglePin={handleTogglePin}
                      onToggleHide={handleToggleHide}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Standard Grid / Masonry Columns */}
            <section className="space-y-4">
              {isDefaultView && pinnedPosts.length > 0 && (
                <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                    All Alumni Contributions / समस्त प्रस्तुतियाँ ({regularPosts.length})
                  </h2>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(isDefaultView && pinnedPosts.length > 0 ? regularPosts : filteredPosts).map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    isAdmin={isAdmin}
                    isLiked={likedPostIds.has(post.id)}
                    onOpenLightbox={setLightboxPost}
                    onReport={setReportingPost}
                    onEdit={setEditingPost}
                    onDelete={handleDeletePost}
                    onTogglePin={handleTogglePin}
                    onToggleHide={handleToggleHide}
                  />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Create / Edit Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen || !!editingPost}
        currentUser={currentUser}
        postToEdit={editingPost || undefined}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingPost(null);
        }}
        onSuccess={() => {
          loadPosts();
          setStatusMessage({
            type: 'success',
            text: editingPost
              ? 'Post updated successfully!'
              : 'Your contribution has been published to the Rishikul Community Showcase!',
          });
        }}
      />

      {/* Media Lightbox */}
      <MediaLightbox
        post={lightboxPost}
        onClose={() => setLightboxPost(null)}
      />

      {/* Report Modal */}
      <ReportPostModal
        isOpen={!!reportingPost}
        post={reportingPost}
        currentUser={currentUser}
        onClose={() => setReportingPost(null)}
        onSuccess={() => {
          setStatusMessage({
            type: 'success',
            text: 'Your report has been submitted to the administrators for review.',
          });
        }}
      />
    </div>
  );
}
