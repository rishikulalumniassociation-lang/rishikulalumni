"use client";

import React, { useEffect } from "react";
import {
  X,
  Download,
  Share2,
  ExternalLink,
  Calendar,
  User,
  Tag,
  FileText,
  Video,
  Sparkles,
  Check,
  Pin
} from "lucide-react";
import { CommunityPost } from "@/types";

interface MediaLightboxProps {
  post: CommunityPost | null;
  onClose: () => void;
}

export default function MediaLightbox({ post, onClose }: MediaLightboxProps) {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (post) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [post, onClose]);

  if (!post) return null;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/community?post=${post.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Helper to extract YouTube video ID
  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1` : null;
  };

  const ytEmbed = getYouTubeEmbedUrl(post.externalUrl);
  const isVideoFile = post.contentType === "video" || post.mimeType?.startsWith("video/");
  const isImageFile = post.contentType === "photo" || post.contentType === "artwork" || post.mimeType?.startsWith("image/");
  const isPdf = post.mimeType === "application/pdf" || post.fileName?.toLowerCase().endsWith(".pdf");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-6 animate-in fade-in duration-200">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
        title="Close (Esc)"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="w-full max-w-5xl max-h-[92vh] bg-[#0F172A] rounded-3xl border border-[#C5A059]/40 shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left: Media Area */}
        <div className="flex-1 bg-black flex items-center justify-center min-h-[300px] lg:min-h-[550px] relative overflow-hidden">
          {isImageFile && post.fileUrl ? (
            <img
              src={post.fileUrl}
              alt={post.title}
              className="w-full h-full max-h-[75vh] object-contain"
            />
          ) : isVideoFile && post.fileUrl ? (
            <video
              src={post.fileUrl}
              controls
              autoPlay
              className="w-full h-full max-h-[75vh] object-contain"
            ></video>
          ) : ytEmbed ? (
            <iframe
              src={ytEmbed}
              title={post.title}
              className="w-full h-full min-h-[350px] lg:min-h-[480px] border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : isPdf && post.fileUrl ? (
            <iframe
              src={`${post.fileUrl}#toolbar=0`}
              title={post.title}
              className="w-full h-full min-h-[400px] border-0"
            ></iframe>
          ) : post.fileUrl ? (
            <div className="p-8 text-center space-y-4">
              <FileText className="w-16 h-16 text-[#C5A059] mx-auto" />
              <h4 className="text-white font-bold text-base">{post.fileName || "Document"}</h4>
              <p className="text-xs text-slate-400">
                {post.fileSize ? `${(post.fileSize / (1024 * 1024)).toFixed(2)} MB` : "Document File"}
              </p>
              <a
                href={post.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2D5A43] hover:bg-[#234734] text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download / Open Document</span>
              </a>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              <Sparkles className="w-12 h-12 text-[#C5A059] mx-auto mb-3" />
              <p className="text-xs">Text / Poetry Showcase</p>
            </div>
          )}
        </div>

        {/* Right: Details & Metadata */}
        <div className="w-full lg:w-96 p-6 bg-[#0F172A] border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between overflow-y-auto max-h-[85vh] lg:max-h-[90vh]">
          <div className="space-y-4">
            {/* Header badges */}
            <div className="flex items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#2D5A43] text-white">
                {post.category}
              </span>
              {post.isPinned && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                  <Pin className="w-3 h-3" />
                  Pinned
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-white leading-tight">
              {post.title}
            </h3>

            {/* Author details */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <img
                src={post.authorAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                alt={post.authorName}
                className="w-10 h-10 rounded-full object-cover border border-[#C5A059]/40 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{post.authorName}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  {post.authorBatch && <span>{post.authorBatch}</span>}
                  <span>•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Description / Content Body */}
            {post.description && (
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap font-light p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                {post.description}
              </div>
            )}

            {/* External URL card if exists */}
            {post.externalUrl && (
              <a
                href={post.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-[#C5A059]/30 transition-colors text-xs text-amber-300 flex items-center justify-between"
              >
                <span className="truncate mr-2 font-mono text-[11px]">{post.externalUrl}</span>
                <ExternalLink className="w-4 h-4 shrink-0" />
              </a>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {post.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg text-[10px] bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Link</span>
                </>
              )}
            </button>

            {post.fileUrl && (
              <a
                href={post.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="py-2.5 px-4 rounded-xl bg-[#2D5A43] hover:bg-[#234734] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                title="Download / Open Original"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
