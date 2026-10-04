# PAK-HOMECEO — Roles, Permissions & Access Control (RBAC)

## 1. Role Definitions

| Role Identifier | Role Title | Primary Workspace | Core Mission |
|---|---|---|---|
| `partner` | **Skill Partner** | `/skill-partner` | Domestic craft mastery, progress reporting, Urdu voice guidance |
| `builder` | **Business Builder** | `/business-builder` | Catalog operations, batch synthesis, QC signoff, escrow release |
| `connector` | **Community Connector** | `/community-connector` | Doorstep raw material drops, physical QC audits, ground trust |
| `citizen` | **Citizen** | `/citizen` | Catalog discovery, custom briefs, ethical purchases, order tracking |

---

## 2. Route Protection Matrix

The application utilizes `src/components/auth/ProtectedRoute.tsx` to enforce strict client-side permission barriers:

| Route | Allowed Roles | Guard Behavior |
|---|---|---|
| `/skill-partner` | `partner` | Redirects to role prompt or active dashboard |
| `/business-builder` | `builder` | Redirects to role prompt or active dashboard |
| `/community-connector` | `connector` | Redirects to role prompt or active dashboard |
| `/citizen` | `citizen`, `patron` | Accessible to all buyers |
| `/batches` | `builder`, `connector`, `partner` | Restricted from general public |
| `/payments` | `builder`, `partner` | Financial data protected |
| `/products`, `/orders`, `/impact` | All authenticated roles | Open shared modules |
| `/welcome`, `/how-it-works`, `/login` | Public (Unauthenticated) | Entry onboarding flows |
