# PAK-HOMECEO — User Journey & Role Workflows

## Workflow 1: The Citizen Journey

1. **Discovery**: Citizen accesses `/citizen` (Marketplace) or `/products`.
2. **Filtering**: Citizen filters by category (*HUNAR*, *MENUE*, *KNOWLEDGE*, *SERVICES*) or searches by city (Multan, Swat, Sargodha, Hala).
3. **Product Story**: Citizen reads the verified cultural heritage narrative and reviews the artisan's ~70% direct remuneration split.
4. **Order Brief Questionnaire**: Citizen specifies custom dimensions, thread palette, preferred timeline (Standard vs Expedited Batch), and masked delivery contact.
5. **Payment Authorization**: Citizen selects payment rail (JazzCash, EasyPaisa, Direct Bank, Escrow). Payment is locked in secure escrow.
6. **Milestone Tracking**: Citizen views real-time 6-stage order tracking at `/orders/:id`.

---

## Workflow 2: The Business Builder (Product Manager) Journey

1. **Order Triage**: Business Builder views newly placed orders in `/business-builder?tab=orders`.
2. **Review & Allocation**: Manager reviews the citizen's Order Brief and allocates the order to an active production batch or specific master artisan.
3. **Batch Scheduling**: Creates cluster batch at `/business-builder?tab=batches` and triggers raw material procurement.
4. **Quality Verification**: Reviews doorstep physical audit scores submitted by the Field Connector.
5. **Dispatch Approval**: Confirms courier tracking and marks order dispatched.
6. **Escrow Settlement**: Authorizes payout release upon doorstep delivery receipt.

---

## Workflow 3: The Skill Partner (Master Artisan) Journey

1. **Dignified Entry**: Artisan logs into `/skill-partner` with large-touch, high-contrast, zero-cognitive-overload UI.
2. **Urdu Voice Guidance**: Plays personalized Urdu audio briefing regarding daily craft milestones and raw material handover status.
3. **Task Execution**: Views assigned pieces under `/skill-partner?tab=work` and taps "Commence Crafting".
4. **Progress Logging**: Increments completed stitch units or pickle jars with one tap.
5. **Earnings Tracking**: Transparent ledger under `/skill-partner?tab=earnings` showing direct PKR balance in JazzCash/EasyPaisa.

---

## Workflow 4: The Community Connector (Field Operations) Journey

1. **Route Coordination**: Connector logs into `/community-connector` to view pending neighborhood visits and material drops.
2. **Material Handover**: Delivers silk skeins, mirror discs, or sterilized glass jars to the artisan's home without violating family privacy.
3. **Physical QC Audit**: Conducts 6-point doorstep quality check (dimensional accuracy, stitch tension, packaging hygiene).
4. **Instant Submission**: Logs audit score directly on mobile; automatically unlocks dispatch eligibility for the Business Builder.
