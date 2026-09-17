"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getEvents, addEvent, getLoggedInAlumni, isAdminAuthenticated } from "@/lib/store";
import { AssociationEvent, AlumniProfile } from "@/types";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  Ticket,
  ChevronRight,
  ExternalLink,
  Plus,
  X,
  Image as ImageIcon,
  Building,
  User,
  Search,
  Filter
} from "lucide-react";

const EVENT_TYPES = [
  "Annual Reunion",
  "CME Conference",
  "Silver Jubilee",
  "Golden Jubilee",
  "Webinar",
  "General Body Meeting",
  "Alumni Meet",
  "Workshop / Seminar",
];

const PRESET_BANNERS = [
  { label: "Campus & Heritage", url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop" },
  { label: "CME Conference Hall", url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop" },
  { label: "Haridwar & Ganga Ghat", url: "https://images.unsplash.com/photo-1588096344356-9b59b9549f2b?w=800&auto=format&fit=crop" },
  { label: "Herbal & Ayurveda", url: "https://images.unsplash.com/photo-1512290900672-1f02e858ec3f?w=800&auto=format&fit=crop" },
  { label: "Virtual Conclave / Webinar", url: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&auto=format&fit=crop" },
];

export default function EventsPage() {
  const [events, setEvents] = useState<AssociationEvent[]>([]);
  const [currentUser, setCurrentUser] = useState<AlumniProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [successModalEvent, setSuccessModalEvent] = useState<AssociationEvent | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  // Create Event Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [newEventSuccess, setNewEventSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    titleHindi: "",
    eventType: "CME Conference",
    date: "",
    time: "10:00 AM – 4:00 PM IST",
    venue: "",
    city: "Haridwar",
    isOnline: false,
    registrationOpen: true,
    registrationFee: "Free (निःशुल्क)",
    chiefGuest: "",
    bannerUrl: PRESET_BANNERS[0].url,
    description: "",
  });

  useEffect(() => {
    getEvents().then((list) => setEvents(list));
    setCurrentUser(getLoggedInAlumni());
    setIsAdmin(isAdminAuthenticated());

    const handleUpdate = () => {
      getEvents().then((list) => setEvents(list));
    };
    window.addEventListener("events_updated", handleUpdate);
    return () => window.removeEventListener("events_updated", handleUpdate);
  }, []);

  const canPost = Boolean(currentUser || isAdmin);

  const handleRegister = (event: AssociationEvent) => {
    if (!registeredEventIds.includes(event.id)) {
      setRegisteredEventIds((prev) => [...prev, event.id]);
    }
    setSuccessModalEvent(event);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.venue) {
      alert("कृपया शीर्षक, तारीख एवं स्थान अनिवार्य रूप से भरें।");
      return;
    }

    try {
      await addEvent({
        title: formData.title.trim(),
        titleHindi: formData.titleHindi.trim() || undefined,
        eventType: formData.eventType as any,
        date: formData.date,
        time: formData.time,
        venue: formData.venue,
        city: formData.city,
        isOnline: formData.isOnline,
        registrationOpen: formData.registrationOpen,
        registrationFee: formData.registrationFee,
        chiefGuest: formData.chiefGuest.trim() || undefined,
        bannerUrl: formData.bannerUrl || PRESET_BANNERS[0].url,
        description: formData.description.trim(),
      });

      setShowCreateModal(false);
      setNewEventSuccess(true);
      setTimeout(() => setNewEventSuccess(false), 5000);

      // Reset Form
      setFormData({
        title: "",
        titleHindi: "",
        eventType: "CME Conference",
        date: "",
        time: "10:00 AM – 4:00 PM IST",
        venue: "",
        city: "Haridwar",
        isOnline: false,
        registrationOpen: true,
        registrationFee: "Free (निःशुल्क)",
        chiefGuest: "",
        bannerUrl: PRESET_BANNERS[0].url,
        description: "",
      });
    } catch (err) {
      alert("इवेंट जोड़ने में त्रुटि हुई। कृपया पुनः प्रयास करें।");
    }
  };

  const filteredEvents = events.filter((ev) => {
    const matchesType = selectedType === "All" || ev.eventType === selectedType;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      ev.title.toLowerCase().includes(q) ||
      (ev.titleHindi && ev.titleHindi.toLowerCase().includes(q)) ||
      ev.city.toLowerCase().includes(q) ||
      ev.venue.toLowerCase().includes(q) ||
      ev.description.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Call-to-Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-[#C5A059]/30 pb-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>आयोजन एवं सम्मेलन • Reunions & CMEs</span>
            </div>
            <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight">
              Association Events & Conclaves
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
              माँ गंगा के पावन तट पर अपने सहपाठियों एवं आदरणीय गुरुजनों से पुनः मिलें। ऋषिकुल परिसर में आयोजित वार्षिक पुनर्मिलन (Annual Reunion), राष्ट्रीय आयुर्वेद सेमिनार (CME), और सम्मेलनों की सूचना देखें या नया आयोजन जोड़ें।
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => {
                if (canPost) {
                  setShowCreateModal(true);
                } else {
                  setShowLoginPrompt(true);
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0F172A] text-[#C5A059] hover:bg-[#2D5A43] hover:text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Event (नया आयोजन जोड़ें)</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {newEventSuccess && (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>नया आयोजन सफलतापूर्वक पोस्ट कर दिया गया है! पूरा ऋषिकुल परिवार इसे देख सकता है और RSVP कर सकता है।</span>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-10 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search events by title, venue, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#FAF7F2] border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#2D5A43]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedType("All")}
              className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                selectedType === "All"
                  ? "bg-[#0F172A] text-[#C5A059] font-bold"
                  : "bg-[#FAF7F2] text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Events
            </button>
            {EVENT_TYPES.slice(0, 5).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                  selectedType === t
                    ? "bg-[#0F172A] text-[#C5A059] font-bold"
                    : "bg-[#FAF7F2] text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-4">
            <Calendar className="w-12 h-12 text-[#C5A059] mx-auto" />
            <h3 className="font-serif-heading text-xl font-bold text-[#0F172A]">
              No Events Found
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              इस फ़िल्टर या खोज के अनुरूप कोई आयोजन उपलब्ध नहीं है। आप नया आयोजन जोड़ सकते हैं।
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {filteredEvents.map((event) => {
              const isRegistered = registeredEventIds.includes(event.id);

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-3xl overflow-hidden border-2 border-[#C5A059]/30 shadow-lg hover:shadow-xl transition-all grid grid-cols-1 lg:grid-cols-12"
                >
                  {/* Left Media Banner */}
                  <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-full bg-slate-900">
                    <img
                      src={event.bannerUrl || PRESET_BANNERS[0].url}
                      alt={event.title}
                      className="w-full h-full object-cover opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#2D5A43] text-white shadow-md">
                        {event.eventType}
                      </span>
                      {event.isOnline && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-sky-600 text-white shadow-md">
                          Virtual Webinar
                        </span>
                      )}
                    </div>
                    {event.chiefGuest && (
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="text-xs text-amber-200 font-semibold mb-0.5">
                          Chief Guest / Keynote
                        </div>
                        <div className="text-xs font-light line-clamp-1">
                          {event.chiefGuest}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Event Details & Action */}
                  <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] mb-2 font-medium">
                        <span className="flex items-center gap-1 text-[#2D5A43] font-semibold">
                          <Calendar className="w-3.5 h-3.5" />
                          {event.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {event.time}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[#0F172A] font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                          {event.city}
                        </span>
                      </div>

                      <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#0F172A] mb-1 leading-tight">
                        {event.title}
                      </h2>
                      {event.titleHindi && (
                        <p className="text-xs sm:text-sm text-[#2D5A43] font-medium mb-3">
                          {event.titleHindi}
                        </p>
                      )}

                      <div className="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>Venue: {event.venue}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-light whitespace-pre-line">
                        {event.description}
                      </p>

                      {/* Schedule Snippets */}
                      {event.schedule && event.schedule.length > 0 && (
                        <div className="mb-6 p-4 rounded-2xl bg-[#FAF7F2] border border-[#C5A059]/20">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] mb-2">
                            Program Highlights
                          </h4>
                          <div className="space-y-1.5 text-xs text-slate-600">
                            {event.schedule.slice(0, 3).map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between">
                                <span className="font-semibold text-slate-800">{item.time}</span>
                                <span className="text-slate-500 truncate ml-3">{item.activity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-slate-500 block">
                          Registration Fee
                        </span>
                        <span className="font-serif-heading text-xl font-bold text-[#0F172A]">
                          {event.registrationFee}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleRegister(event)}
                          disabled={isRegistered}
                          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md ${
                            isRegistered
                              ? "bg-emerald-700 text-white cursor-default"
                              : "bg-[#0F172A] text-white hover:bg-[#2D5A43]"
                          }`}
                        >
                          {isRegistered ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                              <span>Registered (पंजीकृत)</span>
                            </>
                          ) : (
                            <>
                              <Ticket className="w-4 h-4 text-[#C5A059]" />
                              <span>Register for Event</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE EVENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C5A059]/40 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2D5A43]">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Rishikul Alumni Event Portal</span>
                </div>
                <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A]">
                  Post New Upcoming Event / नया आयोजन
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Event Title (आयोजन का शीर्षक) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. Annual Alumni Reunion & CME 2026"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Title in Hindi (शीर्षक हिंदी में)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. वार्षिक पुरातन छात्र मिलन समारोह"
                    value={formData.titleHindi}
                    onChange={(e) => setFormData({ ...formData, titleHindi: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Event Type (प्रकार) *
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-3 py-2.5 text-sm outline-none"
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Date (दिनांक) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. October 24, 2026"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Time (समय) *
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. 10:00 AM – 4:00 PM IST"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-3 py-2.5 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Venue (सभागार / स्थान) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. Malaviya Auditorium, Rishikul Campus"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    City (शहर) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. Haridwar / Dehradun / Delhi"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Chief Guest / Keynote (मुख्य अतिथि)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. Hon. AYUSH Minister / Padma Bhushan Vaidya"
                    value={formData.chiefGuest}
                    onChange={(e) => setFormData({ ...formData, chiefGuest: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Registration Fee (शुल्क)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. Free (निःशुल्क) या ₹500"
                    value={formData.registrationFee}
                    onChange={(e) => setFormData({ ...formData, registrationFee: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Banner Preset Selector */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Select Event Banner (बैनर फोटो चुनें)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2">
                  {PRESET_BANNERS.map((b) => (
                    <button
                      key={b.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, bannerUrl: b.url })}
                      className={`relative rounded-xl overflow-hidden border-2 text-left h-16 transition-all ${
                        formData.bannerUrl === b.url
                          ? "border-[#2D5A43] ring-2 ring-[#2D5A43]/40"
                          : "border-slate-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={b.url} alt={b.label} className="w-full h-full object-cover" />
                      <span className="absolute inset-0 bg-black/40 flex items-center justify-center p-1 text-center text-[10px] text-white font-bold leading-tight">
                        {b.label}
                      </span>
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  placeholder="या अपना कस्टम फोटो URL दर्ज करें..."
                  value={formData.bannerUrl}
                  onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Event Description (आयोजन का विस्तृत विवरण) *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="आयोजन का उद्देश्य, मुख्य आकर्षण, विषय-सूची, आवास व्यवस्था आदि का विवरण लिखें..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isOnlineCheck"
                  checked={formData.isOnline}
                  onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
                  className="w-4 h-4 rounded text-[#2D5A43] focus:ring-[#2D5A43]"
                />
                <label htmlFor="isOnlineCheck" className="text-xs text-slate-700 cursor-pointer font-medium">
                  यह एक वर्चुअल / ऑनलाइन वेबिनार (Virtual Webinar) है
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold uppercase hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0F172A] text-[#C5A059] hover:bg-[#2D5A43] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Publish Event (आयोजन प्रकाशित करें)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOGIN PROMPT MODAL */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-[#C5A059]/40 shadow-2xl text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-[#C5A059] flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif-heading text-xl font-bold text-[#0F172A]">
                कृपया पहले लॉग-इन करें
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                ऋषिकुल पुरातन छात्र पोर्टल पर नया आयोजन (Event) पोस्ट करने के लिए पंजीकृत एलुमनाई या एडमिन का लॉग-इन होना आवश्यक है।
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-xl bg-[#0F172A] text-[#C5A059] text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] hover:text-white transition-colors"
              >
                Alumni Login
              </Link>
              <Link
                href="/admin/login"
                className="px-5 py-2.5 rounded-xl bg-[#2D5A43] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#234734] transition-colors"
              >
                Admin Login
              </Link>
            </div>

            <button
              onClick={() => setShowLoginPrompt(false)}
              className="text-xs text-slate-400 hover:text-slate-600 underline pt-2 block mx-auto"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* RSVP Confirmation Modal */}
      {successModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C5A059]/40 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#2D5A43] border-2 border-[#2D5A43] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A]">
              RSVP Confirmed!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 mb-6">
              You are officially registered for:
              <br />
              <strong className="text-[#0F172A] font-semibold block mt-1">
                {successModalEvent.title}
              </strong>
            </p>

            <div className="p-3 bg-[#FAF7F2] rounded-xl text-left text-xs text-slate-600 mb-6 space-y-1">
              <div><strong>Venue:</strong> {successModalEvent.venue}</div>
              <div><strong>Date:</strong> {successModalEvent.date}</div>
              <div><strong>Time:</strong> {successModalEvent.time}</div>
              <div><strong>Pass:</strong> Sent to registered alumni email / mobile</div>
            </div>

            <button
              onClick={() => setSuccessModalEvent(null)}
              className="w-full py-3 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
