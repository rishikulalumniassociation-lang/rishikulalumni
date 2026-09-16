"use client";

import React, { useState } from "react";
import { MOCK_EVENTS } from "@/lib/mockData";
import { AssociationEvent } from "@/types";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  Ticket,
  ChevronRight,
  ExternalLink
} from "lucide-react";

export default function EventsPage() {
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [successModalEvent, setSuccessModalEvent] = useState<AssociationEvent | null>(null);

  const handleRegister = (event: AssociationEvent) => {
    if (!registeredEventIds.includes(event.id)) {
      setRegisteredEventIds((prev) => [...prev, event.id]);
    }
    setSuccessModalEvent(event);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
            <span>आयोजन एवं सम्मेलन</span>
            <span>•</span>
            <span>Reunions & CMEs</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight">
            Association Events & Conclaves
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
            Gather with your batchmates on the sacred banks of the Ganges. Attend accredited Continuing Medical Education (CME) seminars, Golden & Silver Jubilee commemorations, and annual General Body meetings.
          </p>
        </div>

        {/* Events Grid */}
        <div className="space-y-10">
          {MOCK_EVENTS.map((event) => {
            const isRegistered = registeredEventIds.includes(event.id);

            return (
              <div
                key={event.id}
                className="bg-white rounded-3xl overflow-hidden border-2 border-[#C5A059]/30 shadow-lg hover:shadow-xl transition-all grid grid-cols-1 lg:grid-cols-12"
              >
                {/* Left Media Banner */}
                <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-full bg-slate-900">
                  <img
                    src={event.bannerUrl}
                    alt={event.title}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#2D5A43] text-white shadow-md">
                      {event.eventType}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs text-amber-200 font-semibold mb-0.5">
                      Chief Guest
                    </div>
                    <div className="text-xs font-light line-clamp-1">
                      {event.chiefGuest || "Dignitaries of AYUSH"}
                    </div>
                  </div>
                </div>

                {/* Right Event Details & Action */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] mb-2 font-medium">
                      <span className="flex items-center gap-1 text-[#2D5A43]">
                        <Calendar className="w-3.5 h-3.5" />
                        {event.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {event.time}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#0F172A]">
                        <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                        {event.city}
                      </span>
                    </div>

                    <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2 leading-tight">
                      {event.title}
                    </h2>
                    {event.titleHindi && (
                      <p className="text-xs sm:text-sm text-[#2D5A43] font-medium mb-4">
                        {event.titleHindi}
                      </p>
                    )}

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-light">
                      {event.description}
                    </p>

                    {/* Schedule Snippets */}
                    {event.schedule && (
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
                            <span>Registered</span>
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
      </div>

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
              <div><strong>Pass:</strong> Sent to registered alumni email</div>
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
