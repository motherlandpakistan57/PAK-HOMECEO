# PAK-HOMECEO

> **"Every Home Can Become an Enterprise. Every Woman Can Become a CEO."**

A women-led, closed-loop domestic enterprise operating platform designed specifically for Pakistan. PAK-HOMECEO converts untapped home-based skills (embroidery, culinary arts, generational craft, and domestic knowledge) into sustainable household income, formal enterprise leadership, and dignified social belonging.

---

## 🌟 Vision & Platform Overview

In Pakistan, millions of women possess exceptional generational craft mastery and kitchen enterprise capabilities, yet remain economically invisible due to lack of market access, predatory middleman commissions, and domestic confinement. 

**PAK-HOMECEO** bridges this gap through a decentralized 4-pillar operating model:
1. **Skill Partner (Master Artisan)**: Mature home-based makers who execute artisanal craftsmanship and small-batch culinary production in the safety of their homes.
2. **Business Builder (Product Manager)**: Young, digitally skilled women who manage catalog architecture, intake citizen orders, review order briefs, structure production batches, and oversee quality audits.
3. **Community Connector (Field Operations)**: Trusted local neighborhood women who perform doorstep raw material drops, gentle safety verifications, and physical craft handovers.
4. **Citizen (Conscious Buyer)**: Diaspora and domestic buyers who discover authentic cultural stories, customize orders via structured briefs, and support ~70% direct-to-artisan escrow payouts.

```text
Skill → Opportunity → Enterprise → Income → Dignity → Connection → Belonging → Growth
```

---

## 🔄 End-to-End Closed-Loop Workflow

The platform operates as **one connected, synchronous business workflow**:

```text
Citizen Discovers Product
       │
       ▼
Reads Cultural Story & Selects Options
       │
       ▼
Fills Structured Order Brief (Specifications, Timing, Notes)
       │
       ▼
Places Order / Pre-Order (Payment held in Escrow)
       │
       ▼
Business Builder / Product Manager Reviews Brief & Triage
       │
       ▼
Assigns to Skill Partner & Creates Production Batch
       │
       ▼
Community Connector Delivers Raw Materials to Household Doorstep
       │
       ▼
Skill Partner Crafts with Urdu Voice Guidance & Records Progress
       │
       ▼
Community Connector Performs 6-Point Physical QC Audit
       │
       ▼
Business Builder Approves & Dispatches Order via Sealed Courier
       │
       ▼
Citizen Receives Delivery & Confirms Receipt
       │
       ▼
Escrow Automatically Settles (~70% Direct Payout to Artisan Mobile Wallet)
       │
       ▼
Real-Time Verified Household Impact Telemetry Updates
```

---

## 🏗️ Technical Architecture & Stack

- **Framework**: React 19 (TypeScript)
- **Bundler & Dev Server**: Vite 6
- **Routing**: React Router DOM v7 (SPA with client-side history)
- **Styling & Design System**: Tailwind CSS v4 with custom PAK-HOMECEO Palette (*Terracotta, Warm Ochre, Deep Indigo, Ivory, Forest Green*)
- **Icons**: Lucide React
- **State Management**: Centralized React Context (`AppContext`) with localized localStorage persistence and synchronous cross-role synchronization
- **Bilingual Engine**: English + Urdu with dynamic RTL (`dir="rtl"`) layout and Urdu voice guidance player
- **Media Engine**: Custom platform video player/uploader and Pakistani cultural photo asset curation studio
- **AI Engine**: Assistive, bilingual platform assistant with order tracking, brief preparation, and human escalation

---

## 📁 Repository Structure

```text
PAK-HOMECEO/
├── README.md                          # Master project documentation
├── LICENSE                            # MIT License
├── .gitignore                         # Git exclusion rules
├── .env.example                       # Safe environment variable template
├── metadata.json                      # AI Studio application metadata
├── package.json                       # Project dependencies & npm scripts
├── tsconfig.json                      # TypeScript configuration
├── vite.config.ts                     # Vite build & plugin configuration
├── index.html                         # HTML5 entry with metadata
├── public/                            # Static public assets
├── docs/                              # In-depth architectural & deployment guides
│   ├── architecture.md               # Detailed system design & state model
│   ├── user-flows.md                 # Complete 4-role user journey maps
│   ├── roles-and-permissions.md      # RBAC matrices & protected routes
│   ├── deployment.md                 # Cloud Run, Vercel & Docker deployment
│   ├── testing.md                    # Quality assurance & verification suites
│   └── privacy-and-security.md       # Domestic artisan privacy safeguards
└── src/
    ├── main.tsx                       # React DOM root entry
    ├── App.tsx                        # Core router & role route declarations
    ├── index.css                      # Global styles & Tailwind imports
    ├── types/
    │   └── index.ts                   # Core domain types & data interfaces
    ├── context/
    │   ├── AppContext.tsx             # Enterprise state, orders, batches & payouts
    │   └── LanguageContext.tsx        # Urdu/English dictionary & RTL state
    ├── data/
    │   ├── seedData.ts                # Verified Pakistani seed data & catalog
    │   └── visualLibrary.ts           # 9 Official Pakistani cultural visual mappings
    ├── components/
    │   ├── welcome/                   # Entry overview, hero banner & pillars
    │   ├── story/                     # 5-Stage platform transformation story
    │   ├── auth/                      # Role-based login & persona selector
    │   ├── layout/                    # AppShell, AppHeader, AppSidebar, AppMobileNav
    │   ├── builder/                   # Product Manager / Business Builder Command Center
    │   ├── partner/                   # Skill Partner Dashboard with Urdu audio
    │   ├── connector/                 # Field Operations & Material drops
    │   ├── patron/                    # Citizen Marketplace & Order Brief Modal
    │   ├── pages/                     # Shared catalog, orders, batches, impact & settings
    │   ├── media/                     # Video settings & custom image uploader
    │   ├── visuals/                   # Official visual reference library modal
    │   ├── ai/                        # Bilingual assistive AI assistant
    │   ├── search/                    # Global Command-K spotlight search modal
    │   ├── notifications/             # Notification drawer
    │   ├── profile/                   # User profile & demo persona switcher
    │   └── ui/                        # Reusable accessible component primitives
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** (or **bun** / **yarn** / **pnpm**)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/your-org/pak-homeceo.git
cd pak-homeceo

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional for local demo)
cp .env.example .env

# 4. Start local development server
npm run dev
```

The application will be available at `http://localhost:3000` (or `http://localhost:5173`).

---

## 🛠️ Build, Lint & Verification Commands

```bash
# Type check and lint codebase
npm run lint

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 👥 Platform Team & Acknowledgments

**Strategically prepared by:**
- **Fakhar Mushtaq**

**Co-designed by Team StrongerTogether:**
- **Fatima Jaweria**
- **Hijab Gul**
- **Maryam Tahir**
- **Minahil Tahir**
- **Aiza Asif**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
