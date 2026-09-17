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
  Award
} from "lucide-react";
import { getLoggedInAlumni, setLoggedInAlumni, getAlumniList, updateAlumniProfile } from "@/lib/store";
import { compressImageTo50Kb } from "@/lib/imageCompressor";
import { AlumniProfile, WorkExperience, AlumniFamilyRelation, FamilyRelationType } from "@/types";

export default function AlumniProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AlumniProfile | null>(null);
  const [allAlumni, setAllAlumni] = useState<AlumniProfile[]>([]);
  const [activeTab, setActiveTab] = useState<"about" | "work" | "family" | "teachers" | "friends">("work");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Editable fields
  const [formData, setFormData] = useState<Partial<AlumniProfile>>({});
  const [workHistory, setWorkHistory] = useState<WorkExperience[]>([]);
  const [familyRelations, setFamilyRelations] = useState<AlumniFamilyRelation[]>([]);
  const [teacherIds, setTeacherIds] = useState<string[]>([]);

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
    const fullList = getAlumniList();
    const freshUser = fullList.find((a) => a.id === loggedIn.id) || loggedIn;

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
    setTeacherIds(freshUser.teacherAlumniIds || ["alumni-001"]);
  }, [router]);

  if (!user) return null;

  const handleSaveProfile = () => {
    const updates: Partial<AlumniProfile> = {
      ...formData,
      workHistory,
      familyAlumniRelations: familyRelations,
      teacherAlumniIds: teacherIds,
    };
    updateAlumniProfile(user.id, updates);
    setUser({ ...user, ...updates });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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
    updateAlumniProfile(user.id, { workHistory: updated });
  };

  const handleDeleteWork = (id: string) => {
    const updated = workHistory.filter((w) => w.id !== id);
    setWorkHistory(updated);
    updateAlumniProfile(user.id, { workHistory: updated });
  };

  const handleAddFamilyRelation = () => {
    if (!selectedFamilyAlumniId) return;
    if (familyRelations.some((r) => r.relatedAlumniId === selectedFamilyAlumniId)) return;
    const updated = [...familyRelations, { relatedAlumniId: selectedFamilyAlumniId, relationType: selectedFamilyRelation }];
    setFamilyRelations(updated);
    updateAlumniProfile(user.id, { familyAlumniRelations: updated });
    setSelectedFamilyAlumniId("");
  };

  const handleDeleteFamilyRelation = (relId: string) => {
    const updated = familyRelations.filter((r) => r.relatedAlumniId !== relId);
    setFamilyRelations(updated);
    updateAlumniProfile(user.id, { familyAlumniRelations: updated });
  };

  const handleAddTeacher = () => {
    if (!selectedTeacherId) return;
    if (teacherIds.includes(selectedTeacherId)) return;
    const updated = [...teacherIds, selectedTeacherId];
    setTeacherIds(updated);
    updateAlumniProfile(user.id, { teacherAlumniIds: updated });
    setSelectedTeacherId("");
  };

  const handleDeleteTeacher = (tid: string) => {
    const updated = teacherIds.filter((id) => id !== tid);
    setTeacherIds(updated);
    updateAlumniProfile(user.id, { teacherAlumniIds: updated });
  };

  // Friends / Connected Batchmates
  const connectedFriends = (user.connectedAlumniIds || [])
    .map((id) => allAlumni.find((a) => a.id === id))
    .filter(Boolean) as AlumniProfile[];

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Facebook-Style Cover & Header */}
        <div className="bg-white rounded-3xl overflow-hidden border-2 border-[#C5A059]/30 shadow-xl mb-8">
          {/* Top Banner / Cover */}
          <div className="h-40 sm:h-52 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#2D5A43] relative">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase">
                {user.membershipTier}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>
          </div>

          {/* Profile Identity Bar */}
          <div className="px-6 sm:px-10 pb-6 relative pt-0">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
              <div className="flex items-end gap-5">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-900 flex-shrink-0">
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mb-2">
                  <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#0F172A]">
                    {user.fullName}
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    @{user.username} • {user.city}, {user.state}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {user.ugBatchYear && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#FAF7F2] text-[#0F172A] border border-[#C5A059]">
                        UG Batch: {user.ugBatchYear}
                      </span>
                    )}
                    {user.pgBatchYear && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#2D5A43]/10 text-[#2D5A43] border border-[#2D5A43]/30">
                        PG Batch: {user.pgBatchYear} ({user.pgDegree || "MD"})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] transition-colors shadow-md"
                >
                  <Save className="w-3.5 h-3.5 text-[#C5A059]" />
                  Save Changes
                </button>
              </div>
            </div>

            {savedSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>आपकी प्रोफाइल जानकारी सफलतापूर्वक सुरक्षित (Update) हो गई है!</span>
              </div>
            )}

            {/* Navigation Tabs (Facebook-Style Profile Sections) */}
            <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-100 pt-3 text-xs font-bold uppercase tracking-wider">
              {[
                { id: "work", label: "Work Timeline (कार्य अनुभव)", icon: Briefcase },
                { id: "family", label: `Alumni Family (${familyRelations.length})`, icon: Heart },
                { id: "teachers", label: `My Teachers (${teacherIds.length})`, icon: GraduationCap },
                { id: "friends", label: `Friends / Batchmates (${connectedFriends.length})`, icon: Users2 },
                { id: "about", label: "Basic Info & Bio", icon: User },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
                    activeTab === id
                      ? "bg-[#0F172A] text-[#C5A059] shadow-sm"
                      : "text-slate-600 hover:bg-[#FAF7F2]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

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
                Rishikul Alumni Family (परिवार के अन्य सदस्य जो पूर्व छात्र हैं)
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                यदि आपके पति/पत्नी, भाई, बहन, माता-पिता, बेटा या बेटी भी ऋषिकुल से पढ़े हैं, तो उन्हें यहाँ अपने रिश्ते के साथ मार्क करें:
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-2xl bg-[#FAF7F2] border border-slate-300">
                <div className="flex-1 w-full">
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Select Family Member (from Alumni Directory)
                  </label>
                  <select
                    value={selectedFamilyAlumniId}
                    onChange={(e) => setSelectedFamilyAlumniId(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none"
                  >
                    <option value="">-- Choose Registered Alumnus --</option>
                    {allAlumni
                      .filter((a) => a.id !== user.id)
                      .map((a) => (
                        <option key={a.id} value={a.id}>
                          Dr. {a.fullName} ({a.ugBatchYear ? `UG:${a.ugBatchYear}` : `PG:${a.pgBatchYear}`})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="w-full sm:w-48">
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Relationship Type (रिश्ता)
                  </label>
                  <select
                    value={selectedFamilyRelation}
                    onChange={(e) => setSelectedFamilyRelation(e.target.value as FamilyRelationType)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none"
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
                  className="w-full sm:w-auto mt-auto px-5 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase hover:bg-[#2D5A43] transition-colors"
                >
                  Link Family
                </button>
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

              <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-2xl bg-[#FAF7F2] border border-slate-300">
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="flex-1 w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none"
                >
                  <option value="">-- Choose Professor / Senior Alumnus --</option>
                  {allAlumni
                    .filter((a) => a.id !== user.id)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        Vaidya Dr. {a.fullName} ({a.designation})
                      </option>
                    ))}
                </select>

                <button
                  type="button"
                  onClick={handleAddTeacher}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase hover:bg-[#2D5A43] transition-colors"
                >
                  Add Teacher
                </button>
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

        {/* TAB 5: BASIC INFO & BIO */}
        {activeTab === "about" && (
          <div className="bg-white rounded-3xl p-6 border border-[#C5A059]/30 shadow-sm space-y-4">
            <h3 className="font-serif-heading text-xl font-bold text-[#0F172A] mb-1">
              Personal Bio & Contact Details
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName || ""}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                About Me / Bio (अपनी जीवन यात्रा एवं क्लिनिकल अनुभव)
              </label>
              <textarea
                rows={4}
                value={formData.bio || ""}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Share your Ayurvedic achievements, memorable teachers, batch experiences..."
                className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl p-3 text-sm outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={formData.mobile || ""}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  value={formData.whatsappNumber || ""}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-6 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43]"
              >
                Save Bio & Info
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
