"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Briefcase,
  Users2,
  GraduationCap,
  Heart,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  MapPin,
  Building,
  Upload,
  ExternalLink,
  ShieldCheck,
  Award,
  Sparkles,
  Stethoscope,
  BookOpen,
  LogOut,
  Medal,
  Trophy,
  CreditCard,
  Camera,
  ArrowLeft,
  ChevronRight,
  Crown
} from "lucide-react";
import { getLoggedInAlumni, setLoggedInAlumni, getAlumniList, updateAlumniProfile, getCommunityPosts, deleteCommunityPost } from "@/lib/store";
import { compressImageTo50Kb } from "@/lib/imageCompressor";
import { AlumniProfile, WorkExperience, AlumniFamilyRelation, FamilyRelationType, SpecialAchievement, SpecialAchievementType, CommunityPost, JobType } from "@/types";
import { JOB_TYPE_OPTIONS } from "@/lib/mockData";
import AlumniSearchSelect from "@/components/Common/AlumniSearchSelect";
import DigitalIdCard from "@/components/Membership/DigitalIdCard";
import CreatePostModal from "@/components/Community/CreatePostModal";
import MediaLightbox from "@/components/Community/MediaLightbox";
import PostCard from "@/components/Community/PostCard";

export default function AlumniProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AlumniProfile | null>(null);
  const [allAlumni, setAllAlumni] = useState<AlumniProfile[]>([]);
  const [activeTab, setActiveTab] = useState<"about" | "work" | "family" | "teachers" | "friends" | "specialty" | "achievements" | "idcard" | "community">("achievements");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [myPosts, setMyPosts] = useState<CommunityPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [lightboxPost, setLightboxPost] = useState<CommunityPost | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [photoUploadMsg, setPhotoUploadMsg] = useState<string>("");

  // Editable fields
  const [formData, setFormData] = useState<Partial<AlumniProfile>>({});
  const [workHistory, setWorkHistory] = useState<WorkExperience[]>([]);
  const [familyRelations, setFamilyRelations] = useState<AlumniFamilyRelation[]>([]);
  const [teacherIds, setTeacherIds] = useState<string[]>([]);
  const [specialAchievements, setSpecialAchievements] = useState<SpecialAchievement[]>([]);

  // New Special Achievement item state
  const [newAchievement, setNewAchievement] = useState<{
    title: string;
    type: SpecialAchievementType;
    subjectOrField: string;
    year: string;
    awardedBy: string;
    description: string;
  }>({
    title: "",
    type: "Gold Medalist (UG)",
    subjectOrField: "",
    year: "",
    awardedBy: "",
    description: "",
  });

  // New Work item state
  const [newWork, setNewWork] = useState<Partial<WorkExperience>>({
    institution: "",
    designation: "",
    fromYear: "2015",
    toYear: "Present",
    location: "",
    description: "",
  });

  // New Family item state
  const [selectedFamilyAlumniId, setSelectedFamilyAlumniId] = useState("");
  const [selectedFamilyRelation, setSelectedFamilyRelation] = useState<FamilyRelationType>("Spouse");

  // New Teacher item state
  const [selectedTeacherId, setSelectedTeacherId] = useState("");

  useEffect(() => {
    const loggedIn = getLoggedInAlumni();
    if (!loggedIn) {
      router.push("/login");
      return;
    }

    // Set initial user data immediately so page renders without waiting for network
    setUser(loggedIn);
    setFormData(loggedIn);
    setFamilyRelations(loggedIn.familyAlumniRelations || []);
    setTeacherIds(loggedIn.teacherAlumniIds || []);
    setSpecialAchievements(loggedIn.specialAchievements || []);

    (async () => {
      try {
        const fullList = await getAlumniList();
        const freshUser = fullList.find((a) => a.id === loggedIn.id) || loggedIn;
        if (!freshUser.ugPassoutYear && freshUser.ugBatchYear) {
          freshUser.ugPassoutYear = freshUser.ugBatchYear + 5;
        }
        if (!freshUser.pgPassoutYear && freshUser.pgBatchYear) {
          freshUser.pgPassoutYear = freshUser.pgBatchYear + 3;
        }

        setUser(freshUser);
        setAllAlumni(fullList);
        setFormData(freshUser);
        setWorkHistory(freshUser.workHistory || [
          {
            id: "work-1",
            institution: freshUser.workplace,
            designation: freshUser.designation,
            fromYear: "2018",
            toYear: "Present",
            location: `${freshUser.city}, ${freshUser.state}`,
            description: "Leading patient OPD and Ayurvedic clinical consultations.",
          }
        ]);
        setFamilyRelations(freshUser.familyAlumniRelations || []);
        setTeacherIds(freshUser.teacherAlumniIds || []);
        setSpecialAchievements(freshUser.specialAchievements || []);
        if (freshUser.id) {
          loadMyPosts(freshUser.id);
        }
      } catch (err) {
        console.error("Profile background load error:", err);
      }
    })();
  }, [router]);

  const loadMyPosts = async (userId: string) => {
    try {
      setLoadingPosts(true);
      const posts = await getCommunityPosts({ authorId: userId, includeHidden: true });
      setMyPosts(posts);
    } catch (err) {
      console.error('Failed to load user community posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleDeleteMyPost = async (post: CommunityPost) => {
    const res = await deleteCommunityPost(post.id);
    if (res.success) {
      setMyPosts((prev) => prev.filter((p) => p.id !== post.id));
    } else {
      alert(res.error || 'Failed to delete post');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-600">प्रोफ़ाइल लोड हो रही है...</span>
        </div>
      </div>
    );
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    try {
      setIsUploadingPhoto(true);
      setPhotoUploadMsg("");
      const { dataUrl } = await compressImageTo50Kb(file, 50);
      setFormData((prev) => ({ ...prev, avatarUrl: dataUrl }));
      setUser((prev) => (prev ? { ...prev, avatarUrl: dataUrl } : prev));
      await updateAlumniProfile(user.id, { avatarUrl: dataUrl });
      const currentSession = getLoggedInAlumni();
      if (currentSession && currentSession.id === user.id) {
        setLoggedInAlumni({ ...currentSession, avatarUrl: dataUrl });
      }
      setSavedSuccess(true);
      setPhotoUploadMsg("प्रोफाइल फोटो सफलतापूर्वक अपडेट हो गई!");
      setTimeout(() => {
        setSavedSuccess(false);
        setPhotoUploadMsg("");
      }, 4000);
      window.dispatchEvent(new Event("alumni_updated"));
    } catch (err) {
      console.error("Failed to upload new photo:", err);
      alert("फोटो बदलने में त्रुटि हुई। कृपया कोई अन्य फोटो चुनें।");
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = "";
    }
  };

  const handleSaveProfile = async () => {
    const hasExpertise = Boolean(
      formData.isExpert ||
      (formData.diseaseSpecialty && formData.diseaseSpecialty.trim().length > 0) ||
      formData.acceptingShishya
    );

    // If mobile number is changed, keep mobile and whatsappNumber unified,
    // and also update login username to this new mobile number
    const updatedMobile = formData.mobile ? formData.mobile.trim() : user.mobile;
    const newUsername = updatedMobile ? updatedMobile.replace(/\D/g, "") : user.username;

    const updates: Partial<AlumniProfile> = {
      ...formData,
      ugBatchYear: formData.ugBatchYear ? Number(formData.ugBatchYear) : undefined,
      ugPassoutYear: formData.ugPassoutYear ? Number(formData.ugPassoutYear) : (formData.ugBatchYear ? Number(formData.ugBatchYear) + 5 : undefined),
      pgBatchYear: formData.pgBatchYear ? Number(formData.pgBatchYear) : undefined,
      pgPassoutYear: formData.pgPassoutYear ? Number(formData.pgPassoutYear) : (formData.pgBatchYear ? Number(formData.pgBatchYear) + 3 : undefined),
      mobile: updatedMobile,
      whatsappNumber: updatedMobile,
      username: newUsername || user.username,
      isExpert: hasExpertise,
      gender: formData.gender || user.gender || "Male",
      dateOfBirth: formData.dateOfBirth || user.dateOfBirth,
      workHistory,
      familyAlumniRelations: familyRelations,
      teacherAlumniIds: teacherIds,
      specialAchievements,
    };

    await updateAlumniProfile(user.id, updates);
    setUser({ ...user, ...updates });
    setFormData((prev) => ({ ...prev, ...updates }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    window.dispatchEvent(new Event("alumni_updated"));
  };

  const handleAddSpecialAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchievement.title.trim()) return;

    const item: SpecialAchievement = {
      id: `achieve-${Date.now()}`,
      title: newAchievement.title.trim(),
      type: newAchievement.type,
      subjectOrField: newAchievement.subjectOrField.trim() || undefined,
      year: newAchievement.year.trim() || undefined,
      awardedBy: newAchievement.awardedBy.trim() || undefined,
      description: newAchievement.description.trim() || undefined,
    };

    const updated = [item, ...specialAchievements];
    setSpecialAchievements(updated);
    setNewAchievement({
      title: "",
      type: "Gold Medalist (UG)",
      subjectOrField: "",
      year: "",
      awardedBy: "",
      description: "",
    });
    void updateAlumniProfile(user.id, { specialAchievements: updated });
    setUser({ ...user, specialAchievements: updated });
  };

  const handleDeleteSpecialAchievement = (id: string) => {
    const updated = specialAchievements.filter((a) => a.id !== id);
    setSpecialAchievements(updated);
    void updateAlumniProfile(user.id, { specialAchievements: updated });
    setUser({ ...user, specialAchievements: updated });
  };

  const handleAddWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWork.institution || !newWork.designation) return;
    const item: WorkExperience = {
      id: `w-${Date.now()}`,
      institution: newWork.institution,
      designation: newWork.designation,
      fromYear: newWork.fromYear || "2020",
      toYear: newWork.toYear || "Present",
      location: newWork.location || user.city,
      description: newWork.description || "",
    };
    const updated = [item, ...workHistory];
    setWorkHistory(updated);
    setNewWork({ institution: "", designation: "", fromYear: "2020", toYear: "Present", location: "", description: "" });
    void updateAlumniProfile(user.id, { workHistory: updated });
  };

  const handleDeleteWork = (id: string) => {
    const updated = workHistory.filter((w) => w.id !== id);
    setWorkHistory(updated);
    void updateAlumniProfile(user.id, { workHistory: updated });
  };

  const handleAddFamilyRelation = () => {
    if (!selectedFamilyAlumniId) return;
    if (familyRelations.some((r) => r.relatedAlumniId === selectedFamilyAlumniId)) return;
    const updated = [...familyRelations, { relatedAlumniId: selectedFamilyAlumniId, relationType: selectedFamilyRelation }];
    setFamilyRelations(updated);
    void updateAlumniProfile(user.id, { familyAlumniRelations: updated });
    setSelectedFamilyAlumniId("");
  };

  const handleDeleteFamilyRelation = (relId: string) => {
    const updated = familyRelations.filter((r) => r.relatedAlumniId !== relId);
    setFamilyRelations(updated);
    void updateAlumniProfile(user.id, { familyAlumniRelations: updated });
  };

  const handleAddTeacher = () => {
    if (!selectedTeacherId) return;
    if (teacherIds.includes(selectedTeacherId)) return;
    const updated = [...teacherIds, selectedTeacherId];
    setTeacherIds(updated);
    void updateAlumniProfile(user.id, { teacherAlumniIds: updated });
    setSelectedTeacherId("");
  };

  const handleDeleteTeacher = (tid: string) => {
    const updated = teacherIds.filter((id) => id !== tid);
    setTeacherIds(updated);
    void updateAlumniProfile(user.id, { teacherAlumniIds: updated });
  };

  // Friends / Connected Batchmates
  const connectedFriends = (user.connectedAlumniIds || [])
    .map((id) => allAlumni.find((a) => a.id === id))
    .filter(Boolean) as AlumniProfile[];

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-8 pb-32 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Cover & Header with 100% Crisp Visibility */}
        <div className="bg-white rounded-3xl overflow-hidden border-2 border-[#C5A059]/30 shadow-xl mb-8">
          {/* Top Dark Banner / Cover with White Name */}
          <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#2D5A43] px-5 sm:px-10 pt-5 pb-6 relative">
            {/* Top Badges Row */}
            <div className="flex items-center justify-end gap-2 mb-3">
              {user.membershipTier === "Life Member" ? (
                <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 via-[#C5A059] to-amber-500 text-slate-950 text-[11px] sm:text-xs font-extrabold uppercase shadow-md flex items-center gap-1.5 border border-amber-200">
                  <Crown className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                  Paid Life Member
                </span>
              ) : user.membershipTier === "Patron Member" ? (
                <span className="px-3.5 py-1 rounded-full bg-slate-900 text-amber-300 text-[11px] sm:text-xs font-extrabold uppercase shadow-md flex items-center gap-1.5 border border-[#C5A059]">
                  <Crown className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                  Patron Member
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-bold uppercase shadow-sm">
                  {user.membershipTier}
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] sm:text-xs font-bold uppercase flex items-center gap-1 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>

            {/* Avatar & Name in Dark Portion */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl sm:rounded-3xl overflow-hidden border-3 sm:border-4 border-white shadow-2xl bg-slate-900 shrink-0 relative group">
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-200 text-white text-[10px] sm:text-xs font-bold gap-1 p-1 text-center">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                  <span>फोटो बदलें</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    disabled={isUploadingPhoto}
                  />
                </label>
                {isUploadingPhoto && (
                  <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center text-amber-300 text-[10px] sm:text-xs font-bold p-1 text-center">
                    <span className="text-sm mb-0.5">⏳</span>
                    अपलोडिंग...
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-serif-heading text-xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight drop-shadow-md break-words">
                    {user.fullName}
                  </h1>
                  <label className="sm:hidden inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold cursor-pointer hover:bg-white/30 transition">
                    <Camera className="w-3 h-3 text-amber-300" />
                    <span>फोटो बदलें</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      disabled={isUploadingPhoto}
                    />
                  </label>
                </div>
                {user.fullNameHindi && (
                  <p className="text-xs sm:text-sm text-amber-200 font-semibold mt-1 drop-shadow-xs">
                    {user.fullNameHindi}
                  </p>
                )}
                {photoUploadMsg && (
                  <p className="text-xs text-emerald-300 font-medium mt-1">
                    ✓ {photoUploadMsg}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Profile Identity Bar on Pure White Surface */}
          <div className="px-5 sm:px-10 py-5 relative bg-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-5 border-b border-slate-100">
              <div>
                <p className="text-sm font-bold text-[#0F172A] flex flex-wrap items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-[#2D5A43] shrink-0" />
                  <span>{user.designation || "Ayurvedic Physician"}</span>
                  {user.workplace && <span className="text-slate-500 font-normal">at {user.workplace}</span>}
                </p>
                <p className="text-xs text-slate-500 font-medium flex flex-wrap items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{user.city}, {user.state}</span>
                  <span className="text-slate-300">•</span>
                  <span>@{user.username}</span>
                  {user.jobType && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {user.jobType}
                      </span>
                    </>
                  )}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  {user.ugBatchYear && (
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-xs">
                      UG Batch: {user.ugBatchYear}
                    </span>
                  )}
                  {user.pgBatchYear && (
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#2D5A43]/10 text-[#2D5A43] border border-[#2D5A43]/30 shadow-xs">
                      PG Batch: {user.pgBatchYear} ({user.pgDegree || "MD"})
                    </span>
                  )}
                  {user.rishikulEducation !== "UG" && user.specialization && user.specialization !== "General Ayurvedic Practice" && (
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      PG Specialization: {user.specialization}
                    </span>
                  )}
                  {specialAchievements.length > 0 && (
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/15 text-amber-900 border border-amber-400 flex items-center gap-1 shadow-xs">
                      <Medal className="w-3.5 h-3.5 text-amber-600" />
                      {specialAchievements.length} Special Honor{specialAchievements.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("about")}
                  className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all shadow-xs active:scale-95 whitespace-nowrap ${
                    activeTab === "about"
                      ? "bg-[#2D5A43] text-white border-[#2D5A43]"
                      : "bg-[#2D5A43]/10 hover:bg-[#2D5A43]/20 text-[#2D5A43] border-[#2D5A43]/30"
                  }`}
                  title="अपनी प्रोफाइल व पद विवरण संपादित करें"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>

                <Link
                  href="/membership"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider transition-all shadow-xs active:scale-95 whitespace-nowrap"
                  title="मेरा डिजिटल आईडी कार्ड देखें"
                >
                  <CreditCard className="w-4 h-4 text-[#C5A059]" />
                  <span>My Digital ID</span>
                </Link>

                <button
                  onClick={handleSaveProfile}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] transition-all shadow-md active:scale-95 whitespace-nowrap"
                >
                  <Save className="w-4 h-4 text-[#C5A059]" />
                  Save Changes
                </button>

                <button
                  onClick={() => {
                    setLoggedInAlumni(null);
                    router.push("/login");
                  }}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold uppercase tracking-wider transition-all shadow-xs active:scale-95 whitespace-nowrap"
                  title="लॉग आउट करें"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>

            {savedSuccess && (
              <div className="my-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>आपकी प्रोफाइल जानकारी सफलतापूर्वक सुरक्षित (Update) हो गई है!</span>
              </div>
            )}

            {/* Navigation Tabs - Enhanced Horizontal Scroll with subtle background & prompt indicator */}
            <div className="pt-4">
              <div className="flex items-center justify-between pb-2 text-[11px] font-semibold text-slate-500">
                <span className="flex items-center gap-1 text-[#2D5A43]">
                  <Sparkles className="w-3 h-3 text-[#C5A059]" />
                  Profile Sections / प्रोफाइल विभाग
                </span>
                <span className="text-[10px] text-slate-400 sm:hidden">
                  (Swipe horizontally →)
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs font-bold uppercase tracking-wider scroll-smooth">
                {[
                  { id: "idcard", label: "My Digital ID (आईडी कार्ड)", icon: CreditCard },
                  { id: "about", label: "Edit Profile & Work (प्रोफाइल एडिट)", icon: Edit },
                  { id: "community", label: `Contributions (${myPosts.length})`, icon: Camera },
                  { id: "achievements", label: `Honors & Awards (${specialAchievements.length})`, icon: Medal },
                  { id: "work", label: "Work Timeline", icon: Briefcase },
                  { id: "specialty", label: "Specialty & Shishya", icon: Sparkles },
                  { id: "family", label: `Family (${familyRelations.length})`, icon: Heart },
                  { id: "teachers", label: `Teachers (${teacherIds.length})`, icon: GraduationCap },
                  { id: "friends", label: `Batchmates (${connectedFriends.length})`, icon: Users2 },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                      activeTab === id
                        ? "bg-[#0F172A] text-[#C5A059] shadow-md font-bold ring-2 ring-[#C5A059]/40 scale-100"
                        : "bg-slate-50 hover:bg-[#FAF7F2] text-slate-700 border border-slate-200/80"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TAB: MY DIGITAL ID CARD */}
        {activeTab === "idcard" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C5A059]/30 shadow-sm text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D5A43]/10 text-[#2D5A43] text-xs font-bold uppercase tracking-wider mb-2">
                <CreditCard className="w-3.5 h-3.5 text-[#C5A059]" />
                Official Verified Digital Credential
              </div>
              <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2">
                My Official Rishikul Sangam Digital ID
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mb-8 leading-relaxed">
                यह आपका आधिकारिक डिजिटल पहचान पत्र है। इसमें आपका नाम, बैच, पद, कार्यस्थल और सत्यापन हेतु क्यूआर कोड (QR Code) अंकित है। इसे आप सीधे डाउनलोड भी कर सकते हैं।
              </p>

              <div className="max-w-md mx-auto">
                <DigitalIdCard alumni={user} />
              </div>
            </div>
          </div>
        )}

        {/* TAB: MY COMMUNITY CONTRIBUTIONS */}
        {activeTab === "community" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C5A059]/30 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                    <Camera className="w-3.5 h-3.5 text-amber-600" />
                    Rishikul Showcase
                  </div>
                  <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A]">
                    My Community Contributions (मेरी प्रस्तुतियाँ)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Manage the photos, videos, poems, articles, and research you have shared with the alumni fraternity.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <button
                    onClick={() => {
                      setEditingPost(null);
                      setIsCreateModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-amber-600 text-slate-950 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Share New Post
                  </button>
                  <Link
                    href="/community"
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View Gallery
                  </Link>
                </div>
              </div>

              {loadingPosts ? (
                <div className="py-16 text-center">
                  <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Loading your posts...</p>
                </div>
              ) : myPosts.length === 0 ? (
                <div className="p-8 text-center bg-[#FAF7F2] rounded-2xl border border-[#C5A059]/30 space-y-3">
                  <Camera className="w-10 h-10 text-amber-600/50 mx-auto" />
                  <h4 className="font-bold text-slate-900 text-sm">No Contributions Yet</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    You have not published any posts to the Rishikul Community Showcase yet. Share photos of your college batch, clinical case studies, Ayurvedic research papers, or poems!
                  </p>
                  <button
                    onClick={() => {
                      setEditingPost(null);
                      setIsCreateModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0F172A] text-[#C5A059] text-xs font-bold hover:bg-[#2D5A43] transition inline-flex items-center gap-1.5 mt-2"
                  >
                    <Plus className="w-3.5 h-3.5" /> Publish First Post
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUser={user}
                      onOpenLightbox={setLightboxPost}
                      onReport={() => {}}
                      onEdit={(p) => {
                        setEditingPost(p);
                        setIsCreateModalOpen(true);
                      }}
                      onDelete={handleDeleteMyPost}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: SPECIAL ACHIEVEMENTS (Gold Medals in UG/PG Subjects, Ranks & Honors) */}
        {activeTab === "achievements" && (
          <div className="space-y-6">
            {/* Add New Special Achievement Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C5A059]/30 shadow-sm">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <Medal className="w-3.5 h-3.5 text-amber-600" />
                  Academic Excellence & Honors
                </div>
                <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A] flex items-center gap-2">
                  <span>Special Achievements & Honors (विशिष्ट उपलब्धियां एवं पदक)</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  ऋषिकुल में अध्ययन (UG / PG) के दौरान किसी विशिष्ट विषय में प्राप्त <strong>स्वर्ण पदक (Gold Medal)</strong>, विश्वविद्यालय मेरिट, विषय टॉपर, राज्य/राष्ट्रीय पुरस्कार अथवा शोध उपलब्धि यहाँ दर्ज करें। यह आपकी प्रोफाइल और एल्युमनाई डायरेक्टरी में सभी को गौरवपूर्वक प्रदर्शित होगी।
                </p>
              </div>

              <form onSubmit={handleAddSpecialAchievement} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Achievement Type / उपलब्धि प्रकार *
                    </label>
                    <select
                      value={newAchievement.type}
                      onChange={(e) => setNewAchievement({ ...newAchievement, type: e.target.value as any })}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                    >
                      <option value="Gold Medalist (UG)">Gold Medalist (UG - BAMS)</option>
                      <option value="Gold Medalist (PG)">Gold Medalist (PG - MD/MS)</option>
                      <option value="Subject Topper / Merit">Subject Topper / Merit (विषय टॉपर)</option>
                      <option value="University Rank Holder">University Rank Holder (विश्वविद्यालय रैंक)</option>
                      <option value="State / National Award">State / National Award (राज्य/राष्ट्रीय सम्मान)</option>
                      <option value="Research / Clinical Breakthrough">Research / Clinical Breakthrough (अनुसंधान/क्लिनिकल)</option>
                      <option value="Other Special Honor">Other Special Honor (अन्य विशिष्ट सम्मान)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Subject or Specific Field (विषय / क्षेत्र)
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. द्रव्यगुण विज्ञान / शल्य तंत्र / BAMS Overall"
                      value={newAchievement.subjectOrField}
                      onChange={(e) => setNewAchievement({ ...newAchievement, subjectOrField: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Year / वर्ष
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. 2012 या 2018"
                      value={newAchievement.year}
                      onChange={(e) => setNewAchievement({ ...newAchievement, year: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Achievement Title / उपाधि का शीर्षक *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. Gold Medal in Dravyaguna (UG Batch 2012) / University 1st Rank"
                    value={newAchievement.title}
                    onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                  {/* Quick suggestion tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[11px] text-slate-400 self-center mr-1">त्वरित सुझाव:</span>
                    {[
                      "Gold Medalist in Dravyaguna (UG)",
                      "Gold Medalist in Shalya Tantra (PG)",
                      "Gold Medalist in Kayachikitsa",
                      "University 1st Rank in Final BAMS",
                      "Subject Topper in Rasa Shastra",
                      "Best Clinical Thesis Award",
                    ].map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setNewAchievement({ ...newAchievement, title: sug })}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 transition-colors"
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Awarded By / प्रदानकर्ता संस्था
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. Uttarakhand Ayurved University / HNB Garhwal University / आयुष मंत्रालय"
                      value={newAchievement.awardedBy}
                      onChange={(e) => setNewAchievement({ ...newAchievement, awardedBy: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Description / विवरण (वैकल्पिक)
                    </label>
                    <input
                      type="text"
                      placeholder="संक्षिप्त विवरण या प्रशस्ति..."
                      value={newAchievement.description}
                      onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F172A] text-[#C5A059] text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] hover:text-white transition-all shadow-md active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Special Achievement</span>
                  </button>
                </div>
              </form>
            </div>

            {/* List of Special Achievements */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C5A059]/30 shadow-sm">
              <h4 className="font-serif-heading text-xl font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                <span>My Honors & Achievements ({specialAchievements.length})</span>
              </h4>

              {specialAchievements.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs bg-[#FAF7F2] rounded-2xl border border-dashed border-slate-300 p-8">
                  <Medal className="w-10 h-10 text-amber-500/40 mx-auto mb-2" />
                  <p className="font-medium text-slate-600">अभी कोई विशेष उपलब्धि या पदक नहीं जोड़ा गया है।</p>
                  <p className="text-slate-400 text-[11px] mt-1">
                    यदि आपको UG/PG में गोल्ड मेडल, विषय मेरिट या अन्य पुरस्कार मिला है तो ऊपर दिए गए फॉर्म से जोड़ें।
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {specialAchievements.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-amber-100/30 border-2 border-amber-300/80 flex items-start justify-between gap-3 shadow-xs hover:border-amber-400 transition-all"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center font-bold shadow-md flex-shrink-0 mt-0.5">
                          <Medal className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className="text-[10px] uppercase font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md border border-amber-300">
                              {item.type}
                            </span>
                            {item.year && (
                              <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                                {item.year}
                              </span>
                            )}
                          </div>
                          <h5 className="font-serif-heading text-base font-bold text-[#0F172A] leading-snug">
                            {item.title}
                          </h5>
                          {item.subjectOrField && (
                            <p className="text-xs text-[#2D5A43] font-semibold mt-0.5">
                              Subject/Field: {item.subjectOrField}
                            </p>
                          )}
                          {item.awardedBy && (
                            <p className="text-[11px] text-slate-500 mt-1">
                              Awarded by: {item.awardedBy}
                            </p>
                          )}
                          {item.description && (
                            <p className="text-xs text-slate-600 mt-1.5 italic font-light">
                              "{item.description}"
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteSpecialAchievement(item.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        title="हटाएं (Delete)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 1: WORK TIMELINE (Facebook-Style "Work Experience: From... To...") */}
        {activeTab === "work" && (
          <div className="space-y-6">
            {/* Add New Work Experience Form */}
            <div className="bg-white rounded-3xl p-6 border border-[#C5A059]/30 shadow-sm">
              <h3 className="font-serif-heading text-xl font-bold text-[#0F172A] mb-1 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#2D5A43]" />
                Add Work Experience (कहाँ-कहाँ कार्य किया)
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                फेसबुक की तरह अपने पूर्व एवं वर्तमान कार्यस्थलों (Hospital, Clinic, Govt Health Center) का कार्यकाल जोड़ें:
              </p>

              <form onSubmit={handleAddWork} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Hospital / Institution / Clinic Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AIIMS Rishikesh / Self Clinic"
                      value={newWork.institution}
                      onChange={(e) => setNewWork({ ...newWork, institution: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Designation / Role (पद) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Medical Officer / Consultant"
                      value={newWork.designation}
                      onChange={(e) => setNewWork({ ...newWork, designation: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      From Year (कब से) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2012"
                      value={newWork.fromYear}
                      onChange={(e) => setNewWork({ ...newWork, fromYear: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      To Year (कब तक) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2018 or Present"
                      value={newWork.toYear}
                      onChange={(e) => setNewWork({ ...newWork, toYear: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Location (City, State)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dehradun"
                      value={newWork.location}
                      onChange={(e) => setNewWork({ ...newWork, location: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Description of Work (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Led Kayachikitsa department, managed Panchakarma ICU unit"
                    value={newWork.description}
                    onChange={(e) => setNewWork({ ...newWork, description: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#C5A059]" />
                  Add to Work History
                </button>
              </form>
            </div>

            {/* List of Work Experiences (Timeline Display) */}
            <div className="bg-white rounded-3xl p-6 border border-[#C5A059]/30 shadow-sm">
              <h4 className="font-serif-heading text-lg font-bold text-[#0F172A] mb-4">
                Career Timeline ({workHistory.length} Positions)
              </h4>

              <div className="space-y-4">
                {workHistory.map((work) => (
                  <div
                    key={work.id}
                    className="p-4 rounded-2xl bg-[#FAF7F2] border border-slate-200 flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-[#C5A059] flex items-center justify-center font-bold flex-shrink-0">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-[#0F172A]">{work.designation}</h5>
                        <p className="text-xs font-semibold text-[#2D5A43]">{work.institution}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {work.fromYear} – {work.toYear} • {work.location}
                        </p>
                        {work.description && (
                          <p className="text-xs text-slate-600 mt-1 italic font-light">
                            "{work.description}"
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteWork(work.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ALUMNI FAMILY RELATIONS (Wife, Brother, Daughter, Son who are also Alumni) */}
        {activeTab === "family" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#C5A059]/30 shadow-sm">
              <h3 className="font-serif-heading text-xl font-bold text-[#0F172A] mb-1 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Rishikul Alumni Family (परिवार के अन्य सदस्य जो पूर्व स्नातक / स्नातकोत्तर हैं)
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                यदि आपके पति/पत्नी, भाई, बहन, माता-पिता, बेटा या बेटी भी ऋषिकुल से पढ़े हैं, तो उन्हें यहाँ अपने रिश्ते के साथ मार्क करें:
              </p>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-slate-300 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1.5">
                    Search & Select Family Member (पूर्व स्नातक / स्नातकोत्तर परिवार के सदस्य को खोजें)
                  </label>
                  <AlumniSearchSelect
                    alumniList={allAlumni}
                    excludeIds={[user.id, ...familyRelations.map((r) => r.relatedAlumniId)]}
                    selectedId={selectedFamilyAlumniId}
                    onSelect={setSelectedFamilyAlumniId}
                    placeholder="परिवार के सदस्य का नाम, बैच या शहर टाइप करके खोजें..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <div className="w-full sm:w-64">
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Relationship Type (रिश्ता)
                    </label>
                    <select
                      value={selectedFamilyRelation}
                      onChange={(e) => setSelectedFamilyRelation(e.target.value as FamilyRelationType)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#C5A059]"
                    >
                      <option value="Spouse">Spouse (पति / पत्नी)</option>
                      <option value="Brother">Brother (भाई)</option>
                      <option value="Sister">Sister (बहन)</option>
                      <option value="Son">Son (बेटा)</option>
                      <option value="Daughter">Daughter (बेटी)</option>
                      <option value="Father">Father (पिताजी)</option>
                      <option value="Mother">Mother (माताजी)</option>
                      <option value="Relative">Relative (रिश्तेदार)</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddFamilyRelation}
                    disabled={!selectedFamilyAlumniId}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0F172A] disabled:bg-slate-300 text-white text-xs font-bold uppercase hover:bg-[#2D5A43] transition-colors self-end mt-1 sm:mt-0 shadow-sm"
                  >
                    Link Family
                  </button>
                </div>
              </div>
            </div>

            {/* List of Marked Family Relations */}
            <div className="bg-white rounded-3xl p-6 border border-[#C5A059]/30 shadow-sm">
              <h4 className="font-serif-heading text-lg font-bold text-[#0F172A] mb-4">
                Linked Alumni Family ({familyRelations.length})
              </h4>

              {familyRelations.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No family alumni linked yet. Add family members using the form above.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {familyRelations.map((rel) => {
                    const person = allAlumni.find((a) => a.id === rel.relatedAlumniId);
                    if (!person) return null;

                    return (
                      <div
                        key={rel.relatedAlumniId}
                        className="p-4 rounded-2xl bg-[#FAF7F2] border border-slate-200 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={person.avatarUrl}
                            alt={person.fullName}
                            className="w-12 h-12 rounded-xl object-cover border"
                          />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                              {rel.relationType}
                            </span>
                            <h5 className="font-bold text-sm text-[#0F172A] mt-0.5">
                              {person.fullName}
                            </h5>
                            <p className="text-xs text-slate-500">
                              {person.ugBatchYear ? `UG:${person.ugBatchYear}` : `PG:${person.pgBatchYear}`} • {person.city}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteFamilyRelation(rel.relatedAlumniId)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MY TEACHERS (Who taught them at Rishikul) */}
        {activeTab === "teachers" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#C5A059]/30 shadow-sm">
              <h3 className="font-serif-heading text-xl font-bold text-[#0F172A] mb-1 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#C5A059]" />
                My Rishikul Teachers (ऋषिकुल में मुझे पढ़ाने वाले गुरुजन)
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                ऋषिकुल में आपके अध्ययन के दौरान जो प्रोफेसर/गुरुजन रहे, उन्हें यहाँ मार्क करें। वे आपकी प्रोफाइल में श्रद्धापूर्वक प्रदर्शित होंगे:
              </p>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-slate-300 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1.5">
                    Search & Select Teacher / Professor (गुरुजन / प्रोफेसर खोजें)
                  </label>
                  <AlumniSearchSelect
                    alumniList={allAlumni}
                    excludeIds={[user.id, ...teacherIds]}
                    selectedId={selectedTeacherId}
                    onSelect={setSelectedTeacherId}
                    placeholder="प्रोफेसर या गुरुजन का नाम, पद या शहर टाइप करके खोजें..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddTeacher}
                    disabled={!selectedTeacherId}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0F172A] disabled:bg-slate-300 text-white text-xs font-bold uppercase hover:bg-[#2D5A43] transition-colors shadow-sm"
                  >
                    Add Teacher
                  </button>
                </div>
              </div>
            </div>

            {/* List of Marked Teachers */}
            <div className="bg-white rounded-3xl p-6 border border-[#C5A059]/30 shadow-sm">
              <h4 className="font-serif-heading text-lg font-bold text-[#0F172A] mb-4">
                Honored Gurujans & Professors ({teacherIds.length})
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teacherIds.map((tid) => {
                  const teacher = allAlumni.find((a) => a.id === tid);
                  if (!teacher) return null;

                  return (
                    <div
                      key={tid}
                      className="p-4 rounded-2xl bg-[#FAF7F2] border border-amber-200/80 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={teacher.avatarUrl}
                          alt={teacher.fullName}
                          className="w-12 h-12 rounded-xl object-cover border border-[#C5A059]"
                        />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                            गुरुजन • Teacher
                          </span>
                          <h5 className="font-serif-heading text-base font-bold text-[#0F172A] mt-0.5">
                            {teacher.fullName}
                          </h5>
                          <p className="text-xs text-slate-500">
                            {teacher.designation} • {teacher.specialization}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteTeacher(tid)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FRIENDS & CONNECTED BATCHMATES */}
        {activeTab === "friends" && (
          <div className="bg-white rounded-3xl p-6 border border-[#C5A059]/30 shadow-sm">
            <h3 className="font-serif-heading text-xl font-bold text-[#0F172A] mb-1 flex items-center gap-2">
              <Users2 className="w-5 h-5 text-[#2D5A43]" />
              Connected Batchmates & Friends ({connectedFriends.length})
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Alumni members you have connected with on the Rishikul Alumni portal:
            </p>

            {connectedFriends.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No connections yet. Visit the <Link href="/directory" className="text-[#2D5A43] font-bold underline">Alumni Directory</Link> and tap "Connect" on your batchmates' cards!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {connectedFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="p-4 rounded-2xl bg-[#FAF7F2] border border-slate-200 flex items-center gap-3"
                  >
                    <img
                      src={friend.avatarUrl}
                      alt={friend.fullName}
                      className="w-12 h-12 rounded-xl object-cover border"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-sm text-[#0F172A] truncate">
                        {friend.fullName}
                      </h5>
                      <p className="text-xs text-[#2D5A43]">
                        {friend.ugBatchYear ? `UG:${friend.ugBatchYear}` : `PG:${friend.pgBatchYear}`} • {friend.city}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{friend.workplace}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: EDIT PROFILE & WORK DETAILS */}
        {activeTab === "about" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C5A059]/30 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D5A43]/10 text-[#2D5A43] text-xs font-bold uppercase tracking-wider mb-2">
                <Edit className="w-3.5 h-3.5 text-[#C5A059]" />
                Edit Profile & Workplace Details
              </div>
              <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A]">
                Profile, Current Job & Location Settings (प्रोफाइल व पद विवरण)
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                यहाँ से आप अपनी वर्तमान पदवी, संस्था, जॉब प्रकार, शहर, पता, संपर्क नंबर एवं रक्त समूह बदल सकते हैं। यह जानकारी आपकी डायरेक्टरी और डिजिटल आईडी कार्ड पर भी अपडेट होगी।
              </p>
            </div>

            {/* SECTION 1: PROFESSIONAL & WORKPLACE DETAILS */}
            <div className="space-y-4 p-5 rounded-2xl bg-[#FAF7F2] border border-slate-200">
              <h4 className="text-xs font-bold uppercase text-[#2D5A43] flex items-center gap-1.5 tracking-wider">
                <Briefcase className="w-4 h-4" />
                1. Current Professional & Job Details (वर्तमान पद एवं कार्यस्थल)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Current Job Type (कार्य का प्रकार) *
                  </label>
                  <select
                    value={formData.jobType || "Private Practice"}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value as JobType })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  >
                    {JOB_TYPE_OPTIONS.filter((j) => j !== "All Job Types").map((job) => (
                      <option key={job} value={job}>
                        {job}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Current Designation / Role (वर्तमान पदनाम) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. Senior Medical Officer / Consultant Physician / Professor"
                    value={formData.designation || ""}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  Institution / Hospital / Organization / Clinic Name (संस्थान / चिकित्सालय का नाम) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. Govt Ayurvedic Hospital Haridwar / Aarogyam Clinic / Patanjali Yogpeeth"
                  value={formData.workplace || ""}
                  onChange={(e) => setFormData({ ...formData, workplace: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                />
              </div>
            </div>

            {/* SECTION 2: LOCATION & ADDRESS */}
            <div className="space-y-4 p-5 rounded-2xl bg-[#FAF7F2] border border-slate-200">
              <h4 className="text-xs font-bold uppercase text-[#2D5A43] flex items-center gap-1.5 tracking-wider">
                <MapPin className="w-4 h-4" />
                2. City, State & Address (शहर, राज्य व कार्यस्थल पता)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    City (शहर) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. Haridwar"
                    value={formData.city || ""}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    State (राज्य) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. Uttarakhand"
                    value={formData.state || ""}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Clinic / Residential Address (क्लीनिक या आवास का पूरा पता)
                </label>
                <textarea
                  rows={2}
                  placeholder="मकान/दुकान/क्लीनिक संख्या, मार्ग, कॉलोनी, लैंडमार्क..."
                  value={formData.address || ""}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                />
              </div>
            </div>

            {/* SECTION 3: PERSONAL & CONTACT DETAILS */}
            <div className="space-y-4 p-5 rounded-2xl bg-white border border-slate-200">
              <h4 className="text-xs font-bold uppercase text-[#0F172A] flex items-center gap-1.5 tracking-wider">
                <User className="w-4 h-4 text-[#C5A059]" />
                3. Personal, Photo & Contact Details (व्यक्तिगत, फोटो एवं संपर्क विवरण)
              </h4>

              {/* Profile Photo Change Box */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-[#C5A059]/60 bg-[#FAF7F2] flex flex-col sm:flex-row items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src={formData.avatarUrl || user.avatarUrl}
                    alt="Profile Photo"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-[#2D5A43] shadow-md"
                  />
                  {isUploadingPhoto && (
                    <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center text-white text-[10px] font-bold">
                      अपलोडिंग...
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-xs font-bold uppercase text-[#2D5A43] flex items-center justify-center sm:justify-start gap-1.5 tracking-wider">
                    <Camera className="w-4 h-4 text-[#C5A059]" />
                    Profile Photo (प्रोफाइल फोटो बदलें)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    अपनी स्पष्ट फोटो अपलोड करें। सिस्टम इसे अधिकतम 50KB में स्वतः कंप्रेस कर देगा और प्रोफाइल व डिजिटल आईडी पर तुरंत प्रदर्शित होगी।
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0F172A] text-white hover:bg-[#2D5A43] cursor-pointer text-xs font-semibold transition shadow-sm">
                      <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                      {isUploadingPhoto ? "अपलोड हो रहा है..." : "नई फोटो अपलोड करें (Change Photo)"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        disabled={isUploadingPhoto}
                      />
                    </label>
                    {photoUploadMsg && (
                      <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2.5 py-1 rounded-lg">
                        ✓ {photoUploadMsg}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Full Name (अंग्रेजी में नाम) *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName || ""}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Full Name in Hindi (हिंदी में नाम)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. डॉ. कुलदीप पाण्डेय"
                    value={formData.fullNameHindi || ""}
                    onChange={(e) => setFormData({ ...formData, fullNameHindi: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1 flex items-center justify-between">
                    <span>WhatsApp Mobile (Login)</span>
                    <span className="text-[10px] text-[#2D5A43] font-bold lowercase">(@{user.username})</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="10 digit mobile"
                    value={formData.mobile || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({
                        ...formData,
                        mobile: val,
                        whatsappNumber: val,
                      });
                    }}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    यही आपका लॉगिन यूज़रनेम भी रहेगा।
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Email ID (ईमेल)
                  </label>
                  <input
                    type="email"
                    placeholder="doctor@example.com"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    महत्वपूर्ण संचार एवं सूचनाओं हेतु।
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Date of Birth (जन्मतिथि)
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth || ""}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    जन्मदिन शुभकामनाओं हेतु।
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Gender (लिंग)
                  </label>
                  <select
                    value={formData.gender || "Male"}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  >
                    <option value="Male">Male / पुरुष</option>
                    <option value="Female">Female / महिला</option>
                    <option value="Other">Other / अन्य</option>
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">
                    प्रोफाइल पहचान हेतु।
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1 flex items-center gap-1">
                    <span className="text-rose-600 font-bold">🩸</span> Blood Group (रक्त समूह)
                  </label>
                  <select
                    value={formData.bloodGroup || "O+"}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  >
                    <option value="A+">A+ (Positive)</option>
                    <option value="A-">A- (Negative)</option>
                    <option value="B+">B+ (Positive)</option>
                    <option value="B-">B- (Negative)</option>
                    <option value="AB+">AB+ (Positive)</option>
                    <option value="AB-">AB- (Negative)</option>
                    <option value="O+">O+ (Positive)</option>
                    <option value="O-">O- (Negative)</option>
                    <option value="Unknown">Unknown / ज्ञात नहीं</option>
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">
                    डिजिटल आईडी कार्ड पर भी अपडेट होगा।
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  About Me / Bio (अपनी जीवन यात्रा एवं क्लिनिकल अनुभव)
                </label>
                <textarea
                  rows={3}
                  value={formData.bio || ""}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Share your Ayurvedic achievements, memorable teachers, batch experiences..."
                  className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                />
              </div>
            </div>

            {/* SECTION 4: RISHIKUL EDUCATION, ADMISSION & PASSOUT YEARS */}
            <div className="space-y-4 p-5 rounded-2xl bg-[#FAF7F2] border border-slate-200">
              <h4 className="text-xs font-bold uppercase text-[#2D5A43] flex items-center gap-1.5 tracking-wider">
                <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                4. Rishikul Education & Batch Years (शिक्षा, प्रवेश एवं उत्तीर्ण वर्ष)
              </h4>

              {/* UG Years (if UG or BOTH) */}
              {(user.rishikulEducation === "UG" || user.rishikulEducation === "BOTH") && (
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-[#2D5A43] flex items-center justify-between">
                    <span>UG (BAMS) Admission & Passout Years</span>
                    <span className="text-[10px] text-slate-500 font-normal">Degree: BAMS</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        UG Admission Year (प्रवेश वर्ष)
                      </label>
                      <input
                        type="number"
                        min="1940"
                        max="2026"
                        placeholder="e.g. 1995"
                        value={formData.ugBatchYear ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          const num = parseInt(val, 10);
                          setFormData((prev) => ({
                            ...prev,
                            ugBatchYear: val ? Number(val) : undefined,
                            ugPassoutYear: num ? num + 5 : prev.ugPassoutYear,
                          }));
                        }}
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        UG Passout Year (उत्तीर्ण वर्ष)
                      </label>
                      <input
                        type="number"
                        min="1945"
                        max="2032"
                        placeholder="e.g. 2000"
                        value={formData.ugPassoutYear ?? (formData.ugBatchYear ? Number(formData.ugBatchYear) + 5 : "")}
                        onChange={(e) => setFormData({ ...formData, ugPassoutYear: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PG Years (if PG or BOTH) */}
              {(user.rishikulEducation === "PG" || user.rishikulEducation === "BOTH") && (
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-[#C5A059] flex items-center justify-between">
                    <span>PG (MD/MS) Admission & Passout Years</span>
                    <span className="text-[10px] text-slate-500 font-normal">Degree: {user.pgDegree || "MD/MS"}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        PG Admission Year (प्रवेश वर्ष)
                      </label>
                      <input
                        type="number"
                        min="1970"
                        max="2026"
                        placeholder="e.g. 2003"
                        value={formData.pgBatchYear ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          const num = parseInt(val, 10);
                          setFormData((prev) => ({
                            ...prev,
                            pgBatchYear: val ? Number(val) : undefined,
                            pgPassoutYear: num ? num + 3 : prev.pgPassoutYear,
                          }));
                        }}
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        PG Passout Year (उत्तीर्ण वर्ष)
                      </label>
                      <input
                        type="number"
                        min="1973"
                        max="2032"
                        placeholder="e.g. 2006"
                        value={formData.pgPassoutYear ?? (formData.pgBatchYear ? Number(formData.pgBatchYear) + 3 : "")}
                        onChange={(e) => setFormData({ ...formData, pgPassoutYear: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      PG Specialization / स्नातकोत्तर विशेषता (MD/MS)
                    </label>
                    <select
                      value={formData.specialization || ""}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value as any })}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                    >
                      <option value="">Select PG Specialization</option>
                      {[
                        "Kayachikitsa (Internal Medicine)",
                        "Panchakarma",
                        "Shalya Tantra (Surgery)",
                        "Shalakya Tantra (ENT & Ophthalmology)",
                        "Prasuti & Stri Roga (Obstetrics & Gynecology)",
                        "Kaumarbhritya (Pediatrics)",
                        "Dravyaguna (Pharmacology)",
                        "Rasa Shastra & Bhaishajya Kalpana",
                        "Sharir Kriya (Physiology)",
                        "Sharir Rachana (Anatomy)",
                        "Samhita & Siddhanta",
                        "Swasthavritta & Yoga",
                        "Agada Tantra (Toxicology)",
                        "General Ayurvedic Practice"
                      ].map((spec) => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* SAVE BUTTON */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handleSaveProfile}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] transition-all shadow-md active:scale-95"
              >
                <Save className="w-4 h-4 text-[#C5A059]" />
                Save Profile & Job Details / सुरक्षित करें
              </button>

              {savedSuccess && (
                <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>सफलतापूर्वक अपडेट हो गया!</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: AYURVEDA CLINICAL SPECIALTY & GURU-SHISHYA MENTORSHIP */}
        {activeTab === "specialty" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C5A059]/30 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D5A43]/10 text-[#2D5A43] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                Ayurveda Clinical Mastery & Guru-Shishya Parampara
              </div>
              <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A]">
                Clinical Disease Specialty & Shishya Mentorship (रोग विशिष्टता व शिष्य)
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                ऋषिकुल एलुमनाई समुदाय में अपनी क्लिनिकल रोग-चिकित्सा घोषित करें। 
              </p>
              <div className="mt-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                💡 <strong>अंतर समझें:</strong> PG Specialization आपकी स्नातकोत्तर उपाधि (MD/MS) का विषय है (उदा. कायचिकित्सा), जबकि Clinical Disease Specialty वह विशिष्ट रोग अथवा प्रक्रिया है जिसमें आपकी क्लिनिकल प्रैक्टिस व महारत है (उदा. अर्श-भगंदर क्षारसूत्र, सोरायसिस, संधिवात आदि)। इसे भरने पर आप 'Ayurveda Clinical Experts' डायरेक्टरी में सूचीबद्ध होंगे।
              </div>
            </div>

            {/* Disease Specialty Field */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-[#2D5A43]" />
                Clinical Disease Specialty / रोग विशिष्टता (क्लिनिकल प्रैक्टिस) *
              </label>
              <input
                type="text"
                placeholder="उदा. अर्श, भगंदर व क्षारसूत्र (Anorectal / Ksharasutra) / सोरायसिस / संधिवात"
                value={formData.diseaseSpecialty || ""}
                onChange={(e) => setFormData({ ...formData, diseaseSpecialty: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
              />

              {/* Quick Suggestion Pills */}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <span className="text-[11px] text-slate-400 self-center mr-1">त्वरित चयन:</span>
                {[
                  "अर्श, भगंदर व क्षारसूत्र (Ksharasutra)",
                  "संधिवात व आमवात (Arthritis)",
                  "सोरायसिस व चर्म रोग (Skin)",
                  "मधुमेह एवं जीवनशैली रोग (Diabetes)",
                  "स्त्री रोग व वंध्यत्व (Infertility)",
                  "पंचकर्म एवं शोधन (Panchakarma)",
                  "यकृत एवं उदर विकार (Gastro/Liver)",
                  "श्वास एवं कास (Asthma/Respiratory)",
                  "शलाक्य तंत्र (Eye/ENT)",
                  "बालरोग एवं स्वर्णप्राशन (Pediatrics)",
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, diseaseSpecialty: s })}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#C5A059]/20 hover:text-[#0F172A] text-slate-600 transition-colors"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Specialty Details / Protocol */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#2D5A43]" />
                Clinical Approach & Protocol / क्लिनिकल अनुभव व उपचार पद्धति
              </label>
              <textarea
                rows={3}
                placeholder="उदा. 20+ वर्षों से जटिल अर्श-भगंदर का सफल क्षारसूत्र उपचार। विशेष आयुर्वेदिक रस-औषधि एवं शोधन चिकित्सा द्वारा उपचार..."
                value={formData.specialtyDescription || ""}
                onChange={(e) => setFormData({ ...formData, specialtyDescription: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
              />
            </div>

            {/* Join me as a Shishya Section */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/80 to-[#FAF7F2] border-2 border-[#C5A059]/40 space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acceptingShishyaCheck"
                  checked={!!formData.acceptingShishya}
                  onChange={(e) => setFormData({ ...formData, acceptingShishya: e.target.checked })}
                  className="w-5 h-5 mt-0.5 rounded text-[#2D5A43] focus:ring-[#2D5A43] cursor-pointer"
                />
                <label htmlFor="acceptingShishyaCheck" className="cursor-pointer">
                  <div className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                    <span>🌟 Join me as a Shishya (शिष्य स्वीकार्य)</span>
                    <span className="text-[10px] bg-[#2D5A43] text-white px-2 py-0.5 rounded-full uppercase">
                      गुरु-शिष्य परंपरा
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    हाँ, मैं अपनी इस क्लिनिकल विशेषता को ऋषिकुल के कनिष्ठ वैद्यों एवं नए स्नातकों को सिखाने के लिए तैयार हूँ। मेरा प्रोफाइल "Ayurveda Experts & Mentors" डायरेक्टरी में <strong>शिष्य स्वीकार्य</strong> बैज के साथ दिखेगा।
                  </p>
                </label>
              </div>

              {formData.acceptingShishya && (
                <div className="pt-2 pl-8 space-y-3 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      शिष्य हेतु नियम व पात्रता (Mentorship Requirements & Guidance)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="उदा. BAMS फ्रेश ग्रेजुएट / इंटर्न। न्यूनतम 6 माह का समय अनिवार्य। ओपीडी समय प्रातः 10:00 से 2:00 बजे तक। संपर्क हेतु नीचे व्हाट्सएप पर संदेश भेजें..."
                      value={formData.shishyaRequirement || ""}
                      onChange={(e) => setFormData({ ...formData, shishyaRequirement: e.target.value })}
                      className="w-full bg-white border border-[#C5A059]/50 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                    />
                  </div>
                  <div className="text-[11px] text-amber-800 bg-amber-100/60 p-2.5 rounded-xl border border-amber-200">
                    💡 कनिष्ठ चिकित्सक/स्नातक आपके प्रोफाइल पर दिए गए व्हाट्सएप नंबर पर सीधे आपसे संपर्क कर शिष्य बनने का अनुरोध कर सकेंगे।
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-6 py-3 rounded-xl bg-[#0F172A] text-[#C5A059] text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] hover:text-white transition-colors flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4" />
                Save Specialty & Shishya Settings
              </button>

              <Link
                href="/experts"
                className="px-5 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Experts Directory
              </Link>
            </div>
          </div>
        )}

        {/* Create / Edit Post Modal */}
        <CreatePostModal
          isOpen={isCreateModalOpen || !!editingPost}
          currentUser={user}
          postToEdit={editingPost || undefined}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingPost(null);
          }}
          onSuccess={() => {
            if (user?.id) loadMyPosts(user.id);
          }}
        />

        {/* Media Lightbox */}
        <MediaLightbox
          post={lightboxPost}
          onClose={() => setLightboxPost(null)}
        />
      </div>

      {/* Sticky Mobile Profile Navigation Bar with Back Button */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-t border-[#C5A059]/40 py-2 px-3 shadow-2xl">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {/* Extreme Left: Back to Home / Main Portal button */}
          <Link
            href="/"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-300/30 text-xs font-bold shrink-0 transition-colors"
            title="होमपेज पर वापस जाएं"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Home</span>
          </Link>

          <span className="h-5 w-[1px] bg-slate-700 shrink-0" />

          {/* Quick-Access Profile Tabs */}
          {[
            { id: "idcard", label: "My Digital ID", icon: CreditCard },
            { id: "community", label: `Showcase (${myPosts.length})`, icon: Camera },
            { id: "achievements", label: `Honors (${specialAchievements.length})`, icon: Medal },
            { id: "work", label: "Timeline", icon: Briefcase },
            { id: "specialty", label: "Specialty", icon: Sparkles },
            { id: "family", label: `Family (${familyRelations.length})`, icon: Heart },
            { id: "teachers", label: `Teachers (${teacherIds.length})`, icon: GraduationCap },
            { id: "friends", label: `Friends (${connectedFriends.length})`, icon: Users2 },
            { id: "about", label: "Bio", icon: User },
          ].map(({ id, label, icon: Icon }) => {
            const isSelected = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id as any);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shrink-0 transition-all ${
                  isSelected
                    ? "bg-[#C5A059] text-[#0F172A] shadow-md"
                    : "bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
