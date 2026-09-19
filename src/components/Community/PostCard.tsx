"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  Share2,
  Flag,
  Pin,
  MoreVertical,
  ExternalLink,
  FileText,
  Play,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  Calendar,
  Tag,
  Check,
  BookOpen,
  Feather,
  Sparkles,
  X,
} from 'lucide-react';
import { CommunityPost, AlumniProfile } from '@/types';
import { toggleCommunityPostLike, getAllPostLikes, getAlumniList } from '@/lib/store';

interface PostCardProps {
  post: CommunityPost;
  currentUser: AlumniProfile | null;
  isAdmin?: boolean;
  isLiked?: boolean;
  onOpenLightbox: (post: CommunityPost) => void;
  onReport: (post: CommunityPost) => void;
  onEdit?: (post: CommunityPost) => void;
  onDelete?: (post: CommunityPost) => void;
  onTogglePin?: (post: CommunityPost) => void;
  onToggleHide?: (post: CommunityPost) => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Photos: { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
  Videos: { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
  Research: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
  Articles: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
  Poems: { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800' },
  Artwork: { bg: 'bg-pink-50 dark:bg-pink-950/40', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-800' },
  Documents: { bg: 'bg-cyan-50 dark:bg-cyan-950/40', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800' },
  Memories: { bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
  Other: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-300 dark:border-slate-700' },
};

export default function PostCard({
  post,
  currentUser,
  isAdmin,
  isLiked = false,
  onOpenLightbox,
  onReport,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleHide,
}: PostCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedText, setExpandedText] = useState(false);
  const [showLikersModal, setShowLikersModal] = useState(false);
  const [likersList, setLikersList] = useState<AlumniProfile[]>([]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getAllPostLikes(), getAlumniList()]).then(([likes, allAlumni]) => {
      if (!isMounted) return;
      const postLikes = likes.filter((l) => l.postId === post.id);
      const userIds = new Set(postLikes.map((l) => l.userId));
      const list = allAlumni.filter((a) => userIds.has(a.id));
      setLikersList(list);
    });
    return () => {
      isMounted = false;
    };
  }, [post.id, likesCount]);

  const isAuthor = currentUser?.id === post.userId;
  const canManage = isAuthor || isAdmin;

  const categoryStyle = CATEGORY_COLORS[post.category] || CATEGORY_COLORS['Other'];

  const handleLike = async () => {
    if (!currentUser) {
      alert('Please login to like this post / कृपया पोस्ट को लाइक करने के लिए लॉगिन करें');
      return;
    }

    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const res = await toggleCommunityPostLike(post.id, currentUser.id, currentUser);
      setLiked(res.liked);
      setLikesCount(res.likesCount);
    } catch {
      setLiked(liked);
      setLikesCount(post.likesCount || 0);
    }
  };

  const handleShare = async () => {
    const postUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/community#post-${post.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `Check out "${post.title}" shared by ${post.authorName} on Rishikul Alumni Showcase`,
          url: postUrl,
        });
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <article
      id={`post-${post.id}`}
      className={`group relative bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 hover:shadow-xl overflow-hidden flex flex-col ${
        post.isPinned
          ? 'border-amber-400/70 dark:border-amber-500/50 shadow-md ring-1 ring-amber-400/30'
          : 'border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
      } ${post.isHidden ? 'opacity-60 bg-slate-50 dark:bg-slate-900/60' : ''}`}
    >
      {/* Pinned Ribbon */}
      {post.isPinned && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-bold px-3 py-1 flex items-center justify-between tracking-wide">
          <span className="flex items-center gap-1">
            <Pin className="w-3 h-3 fill-white" />
            PINNED SHOWCASE / मुख्य पोस्ट
          </span>
          {post.pinOrder !== undefined && post.pinOrder > 0 && (
            <span className="text-[10px] bg-amber-700/60 px-1.5 py-0.5 rounded">#{post.pinOrder}</span>
          )}
        </div>
      )}

      {/* Hidden indicator for Admin */}
      {post.isHidden && (
        <div className="bg-red-500 text-white text-[10px] font-bold px-3 py-0.5 flex items-center gap-1">
          <EyeOff className="w-3 h-3" /> HIDDEN FROM PUBLIC VIEW
        </div>
      )}

      {/* Author & Header */}
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0 overflow-hidden">
            {post.authorAvatar ? (
              <img src={post.authorAvatar} alt={post.authorName} className="w-full h-full object-cover" />
            ) : (
              post.authorName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
              {post.authorName}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              {post.authorBatch && (
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-medium">
                  {post.authorBatch}
                </span>
              )}
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 relative">
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
          >
            {post.category}
          </span>

          {/* More actions menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-8 z-30 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 text-xs animate-fadeIn"
              onMouseLeave={() => setMenuOpen(false)}
            >
              {canManage && onEdit && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(post);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Post
                </button>
              )}

              {isAdmin && onTogglePin && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onTogglePin(post);
                  }}
                  className="w-full text-left px-3 py-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2"
                >
                  <Pin className="w-3.5 h-3.5" /> {post.isPinned ? 'Unpin Post' : 'Pin to Top'}
                </button>
              )}

              {isAdmin && onToggleHide && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onToggleHide(post);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  {post.isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {post.isHidden ? 'Unhide Post' : 'Hide Post'}
                </button>
              )}

              {canManage && onDelete && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
                      onDelete(post);
                    }
                  }}
                  className="w-full text-left px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Post
                </button>
              )}

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onReport(post);
                }}
                className="w-full text-left px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700 mt-1"
              >
                <Flag className="w-3.5 h-3.5 text-red-500" /> Report Content
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Media / Visual Section */}
      {post.contentType === 'photo' && post.fileUrl && (
        <div
          onClick={() => onOpenLightbox(post)}
          className="relative bg-slate-900 cursor-pointer overflow-hidden group/media max-h-96 flex items-center justify-center"
        >
          <img
            src={post.fileUrl}
            alt={post.title}
            className="w-full h-auto object-cover max-h-96 transition-transform duration-500 group-hover/media:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> View Fullscreen
            </span>
          </div>
        </div>
      )}

      {post.contentType === 'video' && (
        <div
          onClick={() => onOpenLightbox(post)}
          className="relative aspect-video bg-slate-900 cursor-pointer overflow-hidden group/video flex items-center justify-center"
        >
          {post.thumbnailUrl ? (
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/video:scale-105"
            />
          ) : post.fileUrl ? (
            <video src={post.fileUrl} className="w-full h-full object-cover" preload="metadata" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-slate-900 flex items-center justify-center">
              <Play className="w-12 h-12 text-purple-400/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover/video:bg-black/50 transition">
            <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg group-hover/video:scale-110 transition-transform">
              <Play className="w-6 h-6 ml-0.5 fill-white" />
            </div>
          </div>
        </div>
      )}

      {post.contentType === 'poem' && (
        <div
          onClick={() => onOpenLightbox(post)}
          className="p-6 bg-gradient-to-br from-amber-50/50 via-rose-50/30 to-amber-100/40 dark:from-slate-800/80 dark:via-slate-900/80 dark:to-rose-950/20 border-y border-amber-200/50 dark:border-slate-800 cursor-pointer hover:bg-amber-100/40 transition relative"
        >
          <Feather className="w-8 h-8 text-amber-500/20 dark:text-amber-400/20 absolute top-3 right-3" />
          <p className="font-serif italic text-sm sm:text-base text-slate-800 dark:text-slate-200 line-clamp-4 whitespace-pre-line leading-relaxed">
            {post.description || post.title}
          </p>
          <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold mt-3 inline-block">
            Read complete poem →
          </span>
        </div>
      )}

      {(post.contentType === 'research' || post.contentType === 'document') && (
        <div
          onClick={() => onOpenLightbox(post)}
          className="p-4 mx-4 my-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500 transition"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {post.fileName || post.title}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {post.fileSize ? `${(post.fileSize / (1024 * 1024)).toFixed(2)} MB • ` : ''}
                Click to view / download
              </p>
            </div>
          </div>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex-shrink-0">
            Open →
          </span>
        </div>
      )}

      {post.contentType === 'link' && post.externalUrl && (
        <a
          href={post.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-4 my-2 p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/50 flex items-center justify-between gap-3 hover:bg-blue-100/60 transition group/link"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span className="text-xs text-blue-700 dark:text-blue-300 font-medium truncate">
              {post.externalUrl}
            </span>
          </div>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold group-hover/link:underline flex-shrink-0">
            Visit ↗
          </span>
        </a>
      )}

      {/* Body / Title & Description */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onOpenLightbox(post)}
            className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-white cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition mb-1.5"
          >
            {post.title}
          </h3>

          {post.description && post.contentType !== 'poem' && (
            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              <p className={expandedText ? '' : 'line-clamp-3'}>
                {post.description}
              </p>
              {post.description.length > 150 && (
                <button
                  onClick={() => setExpandedText(!expandedText)}
                  className="text-amber-600 dark:text-amber-400 font-semibold text-[11px] mt-1 hover:underline"
                >
                  {expandedText ? 'Show less' : 'Read more...'}
                </button>
              )}
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="text-[10px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md"
                >
                  #{t.replace(/^#/, '')}
                </span>
              ))}
            </div>
          )}

          {/* Related batch tag */}
          {post.relatedBatch && (
            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-2">
              <Calendar className="w-3 h-3 text-amber-500" />
              <span>Related to: {post.relatedBatch}</span>
            </div>
          )}
        </div>

        {/* Likers Summary */}
        {likersList.length > 0 && (
          <div className="pt-2.5 pb-1 max-w-full overflow-hidden">
            <button
              type="button"
              onClick={() => setShowLikersModal(true)}
              className="w-full flex items-start gap-2 text-[11px] text-slate-500 hover:text-rose-600 transition-colors text-left group"
            >
              <div className="flex -space-x-1.5 overflow-hidden shrink-0 pt-0.5">
                {likersList.slice(0, 3).map((u) => (
                  <img
                    key={u.id}
                    src={u.avatarUrl || "/images/default-avatar.png"}
                    alt={u.fullName}
                    className="w-4 h-4 rounded-full border border-white object-cover"
                  />
                ))}
              </div>
              <div className="flex-1 min-w-0 break-words leading-snug">
                ❤️ Liked by{" "}
                {likersList.length === 1 && (
                  <strong className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-rose-600">{likersList[0].fullName}</strong>
                )}
                {likersList.length === 2 && (
                  <>
                    <strong className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-rose-600">{likersList[0].fullName}</strong> and{" "}
                    <strong className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-rose-600">{likersList[1].fullName}</strong>
                  </>
                )}
                {likersList.length > 2 && (
                  <>
                    <strong className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-rose-600">{likersList[0].fullName}</strong>,{" "}
                    <strong className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-rose-600">{likersList[1].fullName}</strong> and{" "}
                    <span className="underline decoration-dotted font-medium">{likersList.length - 2} others</span>
                  </>
                )}
              </div>
            </button>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition ${
                liked
                  ? 'text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/30'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{liked ? 'Liked' : 'Like'}</span>
            </button>

            {likesCount > 0 && (
              <button
                type="button"
                onClick={() => setShowLikersModal(true)}
                className="text-[11px] font-medium text-slate-500 hover:text-rose-600 hover:underline"
                title="लाईक करने वाले सदस्य देखें"
              >
                ({likesCount})
              </button>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition relative"
              title="Share"
            >
              {copied ? (
                <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                  <Check className="w-3.5 h-3.5" /> Copied
                </span>
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => onReport(post)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition"
              title="Report content"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Liked By Modal */}
      {showLikersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0F172A] dark:text-slate-100">
                    लाईक करने वाले सदस्य ({likersList.length})
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate max-w-[240px]">
                    {post.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLikersModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800">
              {likersList.length === 0 ? (
                <p className="text-center text-xs text-slate-500 py-6">
                  अभी इस पोस्ट पर कोई लाइक नहीं है।
                </p>
              ) : (
                likersList.map((user) => (
                  <div key={user.id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatarUrl || "/images/default-avatar.png"}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-[#0F172A] dark:text-slate-100">
                          {user.fullName}
                        </h4>
                        <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                          {user.ugBatchYear ? `BAMS Batch ${user.ugBatchYear}` : user.designation || "Alumnus"}
                        </p>
                        {user.city && (
                          <p className="text-[9px] text-slate-400">{user.city}</p>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/directory?id=${user.id}`}
                      onClick={() => setShowLikersModal(false)}
                      className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#2D5A43] hover:text-white text-slate-700 dark:text-slate-300 text-[11px] font-bold transition-colors"
                    >
                      Profile
                    </Link>
                  </div>
                ))
              )}
            </div>

            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowLikersModal(false)}
                className="px-4 py-1.5 rounded-full bg-[#0F172A] text-white text-xs font-bold"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
