"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Video,
  FileText,
  Link as LinkIcon,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Lock,
  Camera,
  Layers,
  BookOpen,
  Palette,
  Clock,
  ExternalLink,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { AlumniProfile, PostContentType, PostCategory, CommunityPost } from "@/types";
import { createCommunityPost, updateCommunityPost } from "@/lib/store";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AlumniProfile | null;
  onPostCreated?: (post: CommunityPost) => void;
  onSuccess?: () => void;
  postToEdit?: CommunityPost;
}

const CATEGORIES: PostCategory[] = [
  "Photos",
  "Videos",
  "Research",
  "Articles",
  "Poems",
  "Artwork",
  "Documents",
  "Memories",
  "Other",
];

const CONTENT_TYPE_OPTIONS: { type: PostContentType; label: string; icon: React.ElementType }[] = [
  { type: "photo", label: "Photo / Image", icon: ImageIcon },
  { type: "video", label: "Video", icon: Video },
  { type: "poem", label: "Poem (कविता)", icon: BookOpen },
  { type: "article", label: "Article / Essay", icon: FileText },
  { type: "research", label: "Research Paper", icon: Sparkles },
  { type: "artwork", label: "Artwork / Drawing", icon: Palette },
  { type: "document", label: "Document (PDF/Word)", icon: FileText },
  { type: "memory", label: "Batch Memory", icon: Clock },
  { type: "link", label: "External Link / Video", icon: LinkIcon },
];

export default function CreatePostModal({
  isOpen,
  onClose,
  currentUser,
  onPostCreated,
  onSuccess,
  postToEdit,
}: CreatePostModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [contentType, setContentType] = useState<PostContentType>("photo");
  const [category, setCategory] = useState<string>("Photos");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [relatedBatch, setRelatedBatch] = useState(
    currentUser?.ugBatchYear ? String(currentUser.ugBatchYear) : currentUser?.pgBatchYear ? String(currentUser.pgBatchYear) : ""
  );
  const [tagsInput, setTagsInput] = useState("");
  const [copyrightConsent, setCopyrightConsent] = useState(false);

  useEffect(() => {
    if (postToEdit) {
      setContentType(postToEdit.contentType);
      setCategory(postToEdit.category);
      setTitle(postToEdit.title);
      setDescription(postToEdit.description || "");
      setExternalUrl(postToEdit.externalUrl || "");
      setRelatedBatch(postToEdit.relatedBatch || "");
      setTagsInput(postToEdit.tags ? postToEdit.tags.join(", ") : "");
      setFilePreview(postToEdit.fileUrl || null);
      setCopyrightConsent(true);
    } else {
      setContentType("photo");
      setCategory("Photos");
      setTitle("");
      setDescription("");
      setExternalUrl("");
      setRelatedBatch(
        currentUser?.ugBatchYear ? String(currentUser.ugBatchYear) : currentUser?.pgBatchYear ? String(currentUser.pgBatchYear) : ""
      );
      setTagsInput("");
      setSelectedFile(null);
      setFilePreview(null);
      setCopyrightConsent(false);
    }
  }, [postToEdit, isOpen, currentUser]);

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");

  if (!isOpen) return null;

  // Access rule: Only verified and approved alumni can post
  const isApprovedAlumni = Boolean(
    currentUser && currentUser.isVerified && currentUser.approvalStatus === "approved"
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const uploadFileToCloudinary = async (file: File): Promise<{ publicUrl: string; thumbnailUrl?: string; cloudinaryPublicId: string }> => {
    if (!currentUser) throw new Error("User not authenticated.");

    // 1. Request signed Cloudinary upload parameters from server API
    const res = await fetch("/api/community/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
        fileSize: file.size,
        userId: currentUser.id,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.uploadUrl) {
      throw new Error(data.error || "Failed to obtain upload authorization.");
    }

    // 2. Prepare multipart FormData for direct Cloudinary upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", data.apiKey);
    formData.append("timestamp", String(data.timestamp));
    formData.append("signature", data.signature);
    formData.append("folder", data.folder);

    // 3. Upload file directly to Cloudinary with live progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", data.uploadUrl, true);

      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          const percent = Math.round((evt.loaded / evt.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const resJson = JSON.parse(xhr.responseText);
            const secureUrl = resJson.secure_url || resJson.url;
            const isVideo = resJson.resource_type === "video";
            const thumbnailUrl = isVideo
              ? secureUrl.replace(/\.[^/.]+$/, ".jpg")
              : secureUrl;

            resolve({
              publicUrl: secureUrl,
              thumbnailUrl,
              cloudinaryPublicId: resJson.public_id,
            });
          } catch (e: any) {
            reject(new Error("Failed to parse Cloudinary response."));
          }
        } else {
          try {
            const errJson = JSON.parse(xhr.responseText);
            reject(new Error(errJson?.error?.message || `Cloudinary upload failed with status ${xhr.status}`));
          } catch {
            reject(new Error(`Storage upload failed with status ${xhr.status}`));
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error during file upload to Cloudinary."));
      };

      xhr.send(formData);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError("");

    if (!currentUser) {
      setUploadError("पोस्ट करने के लिए कृपया पहले लॉग-इन करें।");
      return;
    }

    if (!isApprovedAlumni) {
      setUploadError("केवल स्वीकृत एवं सत्यापित पूर्व छात्र ही सामग्री पोस्ट कर सकते हैं।");
      return;
    }

    if (!title.trim()) {
      setUploadError("कृपया शीर्षक (Title) अवश्य भरें।");
      return;
    }

    if (!copyrightConsent) {
      setUploadError("कृपया सर्वाधिकार व प्रकाशन सहमति बॉक्स को चेक करें।");
      return;
    }

    // If file is selected or external URL provided or description present
    if (!selectedFile && !externalUrl.trim() && !description.trim() && !postToEdit?.fileUrl) {
      setUploadError("कृपया कोई फ़ोटो/फ़ाइल अपलोड करें, विवरण लिखें या लिंक प्रदान करें।");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      let fileUrl: string | undefined = postToEdit?.fileUrl;
      let thumbnailUrl: string | undefined = postToEdit?.thumbnailUrl;
      let cloudinaryPublicId: string | undefined = postToEdit?.cloudinaryPublicId;
      let fileName: string | undefined = postToEdit?.fileName;
      let mimeType: string | undefined = postToEdit?.mimeType;
      let fileSize: number | undefined = postToEdit?.fileSize;

      // Upload file to Cloudinary if selected
      if (selectedFile) {
        fileName = selectedFile.name;
        mimeType = selectedFile.type;
        fileSize = selectedFile.size;

        const uploadResult = await uploadFileToCloudinary(selectedFile);
        fileUrl = uploadResult.publicUrl;
        thumbnailUrl = uploadResult.thumbnailUrl;
        cloudinaryPublicId = uploadResult.cloudinaryPublicId;
      }

      setUploadProgress(90);

      // Parse tags
      const tags = tagsInput
        .split(/[,#\s]+/)
        .map((t) => t.trim())
        .filter(Boolean);

      // Batch display text
      const batchText = relatedBatch.trim()
        ? `Batch ${relatedBatch.trim()}`
        : currentUser.ugBatchYear
        ? `UG: ${currentUser.ugBatchYear}`
        : currentUser.pgBatchYear
        ? `PG: ${currentUser.pgBatchYear}`
        : undefined;

      if (postToEdit) {
        await updateCommunityPost(postToEdit.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          contentType,
          category,
          fileUrl,
          thumbnailUrl,
          cloudinaryPublicId,
          fileName,
          mimeType,
          fileSize,
          externalUrl: externalUrl.trim() || undefined,
          relatedBatch: relatedBatch.trim() || undefined,
          tags,
        });
        setUploadProgress(100);
        onSuccess?.();
        onClose();
        return;
      }

      // Create post in Supabase (Immediately published & visible publicly!)
      const newPost = await createCommunityPost({
        userId: currentUser.id,
        authorName: currentUser.fullName,
        authorAvatar: currentUser.avatarUrl,
        authorBatch: batchText,
        title: title.trim(),
        description: description.trim() || undefined,
        contentType,
        category,
        fileUrl,
        thumbnailUrl,
        cloudinaryPublicId,
        fileName,
        mimeType,
        fileSize,
        externalUrl: externalUrl.trim() || undefined,
        relatedBatch: relatedBatch.trim() || undefined,
        tags,
      });

      setUploadProgress(100);
      onPostCreated?.(newPost);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Create post error:", err);
      setUploadError(err.message || "पोस्ट प्रकाशित करने में त्रुटि हुई। कृपया पुनः प्रयास करें।");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl border-2 border-[#C5A059]/40 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#2D5A43] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Rishikul Community Showcase</span>
          </div>
          <h2 className="font-serif-heading text-2xl font-bold">
            Share with Rishikul (संगम पटल पर साझा करें)
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            अपनी स्मृतियाँ, शोध-पत्र, कविताएँ, कलाकृतियाँ, आलेख या वीडियो संपूर्ण ऋषिकुल परिवार के साथ साझा करें।
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Access Warning if not approved */}
          {!isApprovedAlumni && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">सत्यापन आवश्यक (Approval Required):</p>
                <p className="mt-0.5 text-slate-700">
                  संगम पटल पर सामग्री साझा करने के लिए आपका पूर्व छात्र खाता एसोसिएशन एडमिन द्वारा सत्यापित एवं अनुमोदित होना आवश्यक है।
                </p>
              </div>
            </div>
          )}

          {uploadError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Content Type Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Content Type (सामग्री का प्रकार)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {CONTENT_TYPE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = contentType === opt.type;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => {
                        setContentType(opt.type);
                        // Suggest matching category
                        if (opt.type === "photo") setCategory("Photos");
                        else if (opt.type === "video") setCategory("Videos");
                        else if (opt.type === "poem") setCategory("Poems");
                        else if (opt.type === "article") setCategory("Articles");
                        else if (opt.type === "research") setCategory("Research");
                        else if (opt.type === "artwork") setCategory("Artwork");
                        else if (opt.type === "document") setCategory("Documents");
                        else if (opt.type === "memory") setCategory("Memories");
                      }}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all ${
                        isSelected
                          ? "border-[#2D5A43] bg-[#2D5A43] text-white font-bold shadow-sm"
                          : "border-slate-200 bg-[#FAF7F2] text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px] leading-tight line-clamp-1">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title & Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Title (शीर्षक) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 1988 Batch Golden Memories at Haridwar Ghat"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF7F2] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2D5A43] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category (श्रेणी)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-[#FAF7F2] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2D5A43] outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description / Text Content */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Description / Text Content (विवरण / कविता / आलेख)
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="यहाँ विस्तृत विवरण लिखें या अपनी रचना/कविता/शोध का सार पेस्ट करें..."
                className="w-full px-4 py-2.5 text-xs bg-[#FAF7F2] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2D5A43] outline-none leading-relaxed"
              ></textarea>
            </div>

            {/* File Upload Box (Supports Mobile Camera, Gallery, Files) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Upload Media / Document (फ़ोटो, वीडियो या दस्तावेज़)
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#C5A059]/40 hover:border-[#2D5A43] rounded-2xl p-5 bg-[#FAF7F2]/60 text-center cursor-pointer transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept={
                    contentType === "photo" || contentType === "artwork"
                      ? "image/*"
                      : contentType === "video"
                      ? "video/*"
                      : contentType === "document" || contentType === "research"
                      ? ".pdf,.doc,.docx,.ppt,.pptx,.txt"
                      : "image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.txt"
                  }
                  className="hidden"
                />

                {filePreview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="max-h-48 rounded-xl object-contain shadow-md mb-2"
                    />
                    <p className="text-[11px] font-semibold text-[#2D5A43]">{selectedFile?.name}</p>
                    <p className="text-[10px] text-slate-400">
                      ({((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB) • Click to change
                    </p>
                  </div>
                ) : selectedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-8 h-8 text-[#C5A059]" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-[#0F172A]">{selectedFile.name}</p>
                      <p className="text-[10px] text-slate-500">
                        {((selectedFile.size || 0) / (1024 * 1024)).toFixed(2)} MB • Click to replace
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="w-10 h-10 rounded-full bg-amber-50 text-[#C5A059] flex items-center justify-center mx-auto mb-2">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-[#0F172A]">
                      Click to choose from Camera, Gallery or Files
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Photos (JPEG, PNG, WebP), Videos (MP4), Documents (PDF, Word, PPT) up to 50MB (Videos up to 250MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* External URL (YouTube, ResearchGate, PubMed, Article) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                External Link (वैकल्पिक: YouTube, ResearchGate, PubMed या ब्लॉग लिंक)
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://youtu.be/... या https://www.researchgate.net/..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF7F2] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2D5A43] outline-none"
                />
              </div>
            </div>

            {/* Related Batch & Tags Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Related Batch (संबंधित बैच - वैकल्पिक)
                </label>
                <input
                  type="text"
                  value={relatedBatch}
                  onChange={(e) => setRelatedBatch(e.target.value)}
                  placeholder="e.g. 1985 या 1994"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF7F2] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2D5A43] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Tags (टैग्स - अल्पविराम द्वारा अलग करें)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. Dravyaguna, Shalya, Reunion, Campus"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF7F2] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2D5A43] outline-none"
                />
              </div>
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="space-y-1 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex justify-between text-xs font-bold text-amber-900">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Publishing to Rishikul Community Showcase...
                  </span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-amber-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2D5A43] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Mandatory Copyright Consent Checkbox */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#C5A059]/30 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={copyrightConsent}
                  onChange={(e) => setCopyrightConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-[#2D5A43] focus:ring-[#2D5A43] border-slate-300"
                />
                <span className="text-xs text-slate-700 leading-relaxed">
                  <strong>Copyright & Authorization Consent (सर्वाधिकार व प्रकाशन सहमति):</strong>
                  <br />
                  “I confirm that I have the right to share this content and authorize Rishikul Snatak Evam Snatkottar Association to display it on this portal.”
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading || !isApprovedAlumni}
                className="px-6 py-2.5 rounded-xl bg-[#2D5A43] hover:bg-[#234734] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    <span>Publish Immediately (तुरंत प्रकाशित करें)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
