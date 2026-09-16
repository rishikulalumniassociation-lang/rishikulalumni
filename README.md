# Rishikul Snatak Evam Snatkottar Association — Alumni Portal
### ऋषिकुल स्नातक एवं स्नातकोत्तर एसोसिएशन (हरिद्वार)

A modern, production-grade, mobile-first Alumni Association Portal for **Rishikul Government Ayurvedic College, Haridwar, Uttarakhand, India** (Estd. 1919).

---

## 🏛️ Features

- **Editorial Cinematic + Ayurvedic Heritage UX/UI**:
  - Warm Ivory (`#FAF7F2`), Deep Slate Navy (`#0F172A`), Muted Ayurvedic Green (`#2D5A43`), Antique Gold (`#C5A059`).
  - Google Fonts: **Instrument Serif** for display headings and **Inter** for body and controls.
  - Immersive video hero with subtle overlay and dual-script Devanagari/English typography.

- **Mobile-First Experience**:
  - Touch-friendly layout with large touch targets.
  - Sticky bottom mobile navigation for quick access to Home, Directory, Register, Digital Card, and Events.
  - Slide-over mobile **Filter Drawer** for batch years, Ayurvedic specialties, states, and cities.
  - Card-first design instead of wide tabular data.

- **Alumni Directory & Networking**:
  - Search by doctor name, specialty, hospital/clinic, and location.
  - Instant direct WhatsApp and profile sharing links.
  - Verified credentials badge for registered members.

- **Digital Membership & ID Card**:
  - Interactive flip preview of official Alumni ID Card.
  - QR Code generator encoding cryptographic verification URL.
  - One-click **Download Digital ID** as high-resolution PNG for mobile wallet.
  - Clear tiers: **Life Member**, **Patron Member**, and **Annual Member**.

- **Association & Event Management**:
  - Upcoming conclaves (Maha Kumbh Alumni Conclave, National CMEs).
  - Detailed schedule, chief guest profile, and instant one-tap RSVP.

- **Multi-Step Onboarding**:
  - 4-step wizard (Personal Details, Rishikul Academic History, Practice & Workplace, Membership Tier).
  - Automated provisional Alumni ID generation with celebratory confetti.

- **Supabase PostgreSQL & Security**:
  - Production SQL migration in `supabase/schema.sql` (Profiles, Events, Registrations, RLS policies).
  - Ready for deployment to **GitHub → Vercel**.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🗄️ Supabase Setup

1. Create a new project on [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the contents of [`supabase/schema.sql`](supabase/schema.sql).
4. Add your environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

---

## 📜 Association Details
- **Institution**: Rishikul Government Ayurvedic College, Haridwar, Uttarakhand (Estd. 1919)
- **Association**: Rishikul Snatak Evam Snatkottar Association (ऋषिकुल स्नातक एवं स्नातकोत्तर एसोसिएशन)
- **Secretariat**: Association Office, Rishikul Campus, Haridwar - 249401
