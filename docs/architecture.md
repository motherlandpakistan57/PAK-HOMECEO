# PAK-HOMECEO — System Architecture & Data Model

## 1. Architectural Philosophy

PAK-HOMECEO operates as a **single connected decentralized domestic enterprise platform**. Rather than siloed, disparate portals, the system employs a unified state and event architecture where transactions, production milestones, and quality audits immediately propagate across all four roles:

1. **Skill Partner (Master Artisan)**
2. **Business Builder (Product Manager)**
3. **Community Connector (Field Operations)**
4. **Citizen (Conscious Buyer)**

---

## 2. Core State Entities & Relationships

```text
┌─────────────────┐       creates       ┌──────────────────┐
│     Citizen     ├────────────────────►│      Order       │
└─────────────────┘                     └────────┬─────────┘
                                                 │
                                        includes │
                                                 ▼
                                        ┌──────────────────┐
                                        │   Order Brief    │
                                        └────────┬─────────┘
                                                 │
                                     allocated to│
                                                 ▼
┌─────────────────┐       manages       ┌──────────────────┐
│ Business Builder├────────────────────►│ Production Batch │
└─────────────────┘                     └────────┬─────────┘
                                                 │
                                      assigned to│
                                                 ▼
┌─────────────────┐     executes craft  ┌──────────────────┐
│  Skill Partner  │◄────────────────────┤ SkillPartnerTask │
└────────┬────────┘                     └────────┬─────────┘
         │                                       │
         │ receives drops                        │ doorstep QC
         ▼                                       ▼
┌─────────────────┐                     ┌──────────────────┐
│CommunityConnector├────────────────────► QualityCheck     │
└─────────────────┘                     └────────┬─────────┘
                                                 │ verified
                                                 ▼
                                        ┌──────────────────┐
                                        │ Escrow / Payout  │
                                        └──────────────────┘
```

---

## 3. Data Schema Specifications

### Order & Order Brief
- `id`: Unique string identifier (`ord-xxx`)
- `trackingNumber`: Human-readable reference (`PK-ORD-8012`)
- `productId`: References catalog `Product`
- `quantity`: Positive integer
- `unitPricePKR`: Unit price in Pakistani Rupees
- `totalPKR`: Calculated order gross total
- `status`: `placed` | `confirmed` | `assigned` | `in_production` | `quality_check` | `quality_verified` | `dispatched` | `delivered` | `completed`
- `orderBrief`: Structured questionnaire data (customizations, timing preference, gift note)
- `payoutReleased`: Boolean escrow settlement flag

### Production Batch
- `id`: Batch identifier (`batch-xxx`)
- `batchCode`: Code (`BATCH-MLT-2026-08`)
- `category`: `HUNAR` | `MENUE` | `KNOWLEDGE` | `SERVICES`
- `skillPartnerId`: Target master artisan
- `targetUnits`: Required unit capacity
- `completedUnits`: Current progress counter
- `status`: `draft` | `materials_ordered` | `materials_delivered` | `in_production` | `qc_passed` | `completed`

### Quality Verification
- `id`: Audit identifier (`qc-xxx`)
- `orderId` / `batchId`: Target references
- `criteria`: 4-point verified physical integrity metrics (materials, finish, dimensions, safety)
- `score`: Quantitative quality index (0–100)
- `passed`: Boolean pass certification
