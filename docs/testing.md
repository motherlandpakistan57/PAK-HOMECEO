# PAK-HOMECEO — Quality Assurance & Testing Suite

## 1. Automated Verification Checks

### TypeScript Compilation & Type Check
```bash
npm run lint
# Executes: tsc --noEmit
```

### Production Build Validation
```bash
npm run build
# Executes: vite build
```

---

## 2. Golden End-to-End Test Scenario

1. **Step 1 (Citizen)**: Visit `/citizen` → Click "Multani Kashidakari Shawl" → Click "Order / Pre-Order" → Fill out Order Brief → Submit Order.
2. **Step 2 (Business Builder)**: Switch role to `builder` at `/business-builder` → View new order under Orders tab → Assign to Artisan Kalsoom Bibi → Create batch code.
3. **Step 3 (Skill Partner)**: Switch role to `partner` at `/skill-partner` → Listen to Urdu audio guidance → Tap "Commence Crafting" → Mark completion.
4. **Step 4 (Connector)**: Switch role to `connector` at `/community-connector` → Conduct 6-point physical doorstep QC → Certify quality audit.
5. **Step 5 (Settlement)**: Switch role to `builder` → Dispatch order → Citizen receives order → Release escrow payout of ~70% PKR directly to artisan ledger.
6. **Step 6 (Telemetry)**: Check `/impact` → Observe verified income metric increase in real time.
