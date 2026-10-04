export type UserRole = 'citizen' | 'patron' | 'builder' | 'partner' | 'connector';

export type AppView = 'welcome' | 'login' | 'dashboard';

export type ProductCategory = 'HUNAR' | 'RASOI' | 'KNOWLEDGE' | 'SERVICES';

export type PaymentMethod = 'jazzcash' | 'easypaisa' | 'card' | 'cod' | 'bank' | 'escrow';

export type PaymentStatus = 'paid' | 'escrow_hold' | 'pending_cod' | 'settled';

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'allocated'
  | 'in_production'
  | 'quality_check'
  | 'dispatched'
  | 'delivered'
  | 'completed'
  | 'placed'
  | 'reviewed_batched'
  | 'quality_verified';

export type ProductStatus = 'published' | 'draft' | 'paused' | 'archived';
export type ProductAvailability = 'in_stock' | 'made_to_order' | 'seasonal' | 'out_of_stock';

export interface Product {
  id: string;
  title: string;
  category: ProductCategory;
  subCategory: string;
  pricePKR: number;
  description: string;
  story: string;
  producerId: string;
  producerName: string;
  producerCode: string;
  city: string;
  materialsCostPKR: number;
  logisticsCostPKR: number;
  artisanSplitPercent: number; // e.g. 70% direct to artisan
  builderMarginPercent: number; // e.g. 12%
  connectorFeePercent: number; // e.g. 6%
  minBatchUnits: number;
  currentBatchOrders: number;
  stockReadyUnits: number;
  craftHeritage: string;
  rating: number;
  reviewsCount: number;
  tags: string[];
  colorTheme: string;
  safetyCertified: boolean;
  imageIcon: 'embroidery' | 'pickle' | 'recipe' | 'tailoring' | 'shawl' | 'honey' | 'sweets' | 'ralli' | 'pottery';
  imageUrl?: string;
  images?: string[];
  status?: ProductStatus;
  capacityMonthly?: number;
  productionTimeDays?: number;
  availability?: ProductAvailability;
}

export interface OrderFeedback {
  id: string;
  orderId: string;
  productTitle: string;
  patronName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'published' | 'under_review';
  actionTakenByBuilder?: string;
}

export interface OrderTimelineEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  note: string;
}

export interface OrderBriefData {
  orderType: 'order' | 'pre_order';
  customizationRequirements?: string;
  preferredDeliveryTiming?: string;
  specialInstructions?: string;
  additionalRequirements?: string;
  contactEmail?: string;
  briefSummary?: string;
}

export interface Order {
  id: string;
  trackingNumber: string;
  productId: string;
  productTitle: string;
  category: ProductCategory;
  quantity: number;
  unitPricePKR: number;
  totalPKR: number;
  customerName: string;
  customerCity: string;
  customerPhoneMasked: string;
  customerAddressMasked: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  batchId?: string;
  skillPartnerId: string;
  skillPartnerName: string;
  skillPartnerCode: string;
  connectorName: string;
  payoutReleased: boolean;
  payoutAmountPKR: number;
  createdAt: string;
  estimatedDeliveryDate: string;
  qualityPassed: boolean;
  qualityScore?: number;
  feedback?: OrderFeedback;
  // Closed-loop enterprise workflow & brief
  isPreOrder?: boolean;
  orderBrief?: OrderBriefData;
  priority?: 'normal' | 'high' | 'urgent';
  assignedPerson?: string;
  productionStatus?: 'pending_assignment' | 'materials_ready' | 'in_craft' | 'quality_review' | 'ready_for_dispatch';
  qualityStatus?: 'pending' | 'verified_passed' | 'rework_needed';
  deliveryStatus?: 'processing' | 'dispatched' | 'out_for_delivery' | 'delivered';
  timeline?: OrderTimelineEvent[];
}

export interface ProductionBatch {
  id: string;
  batchCode: string;
  title: string;
  category: ProductCategory;
  skillPartnerId: string;
  skillPartnerName: string;
  skillPartnerCode: string;
  connectorName: string;
  city: string;
  targetUnits: number;
  completedUnits: number;
  status: 'forming' | 'allocated' | 'in_production' | 'quality_check' | 'ready_dispatch';
  orderIds: string[];
  rawMaterialsDelivered: boolean;
  rawMaterialsNotes: string;
  startDate: string;
  deadline: string;
  unitPayPKR: number;
  totalBatchPayPKR: number;
  notes: string;
}

export interface SkillPartnerProfile {
  id: string;
  name: string;
  anonymizedCode: string;
  skillTitle: string;
  specialty: string;
  city: string;
  district: string;
  craftExperienceYears: number;
  activeBatchesCount: number;
  completedOrdersCount: number;
  totalEarningsPKR: number;
  pendingPayoutPKR: number;
  rating: number;
  voiceGuidanceScript: string;
  urgentNoticeEnglish?: string;
  consentRecorded: boolean;
  assignedConnectorName: string;
  avatarUrl?: string;
}

export type SkillPartnerTaskStatus =
  | 'Assigned'
  | 'Accepted'
  | 'In Production'
  | 'Submitted'
  | 'Approved'
  | 'Completed';

export interface SkillPartnerTask {
  id: string;
  productId: string;
  productTitle: string;
  productImage?: string;
  category: ProductCategory;
  quantity: number;
  completedUnits: number;
  deadline: string;
  batchId: string;
  batchCode: string;
  unitPayPKR: number;
  totalPayPKR: number;
  status: SkillPartnerTaskStatus;
  instructions: {
    title: string;
    steps: string[];
    safetyTip: string;
    urduText: string;
    audioUrl?: string;
  };
  proofPhotoUrl?: string;
  notesFromBuilder?: string;
  artisanNote?: string;
  createdAt: string;
  acceptedAt?: string;
  submittedAt?: string;
  approvedAt?: string;
}

export interface ConnectorTask {
  id: string;
  connectorName: string;
  artisanName: string;
  artisanCode: string;
  city: string;
  taskType: 'material_drop' | 'quality_audit' | 'onboarding' | 'payout_verification';
  description: string;
  status: 'pending' | 'completed';
  scheduledDate: string;
  phoneMasked: string;
  areaLocality: string;
  notes: string;
}

export interface LedgerEntry {
  id: string;
  timestamp: string;
  type: 'customer_payment' | 'artisan_payout' | 'materials_allocation' | 'connector_fee' | 'builder_margin';
  referenceOrderId?: string;
  referenceBatchCode?: string;
  recipientName: string;
  amountPKR: number;
  status: 'held_in_escrow' | 'settled' | 'allocated';
  note: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorRole: UserRole;
  actorName: string;
  action: string;
  details: string;
}

export type NotificationType = 'order' | 'production' | 'payment' | 'message' | 'action_required';

export interface NotificationItem {
  id: string;
  timestamp: string;
  targetRole: UserRole;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  type?: NotificationType;
}

export interface PlatformMetrics {
  womenEngaged: number;
  ordersCompleted: number;
  totalIncomeGeneratedPKR: number;
  activeBatches: number;
  repeatPatronsRate: number; // backward compatibility
  repeatCitizensRate: number;
  verifiedQualityRate: number;
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
  title: string;
  city: string;
  code: string;
  email: string;
  phone: string;
  badge: string;
  bio?: string;
  verified: boolean;
}

export interface BusinessBuilderProfile {
  id: string;
  name: string;
  code: string;
  city: string;
  title: string;
  avatarUrl: string;
  activeProducersCount: number;
  totalRevenueManagedPKR: number;
  batchesOverseenCount: number;
  email: string;
  phone: string;
}

export interface ConnectorProfile {
  id: string;
  name: string;
  code: string;
  city: string;
  district: string;
  avatarUrl: string;
  assignedArtisansCount: number;
  pendingVisitsCount: number;
  completedAuditsCount: number;
  email: string;
  phone: string;
}

export interface CitizenProfile {
  id: string;
  name: string;
  code: string;
  city: string;
  avatarUrl: string;
  totalOrdersPlaced: number;
  totalImpactContributionPKR: number;
  preferredCategories: ProductCategory[];
  email: string;
  phone: string;
}

export type PatronProfile = CitizenProfile;

export interface QualityCheckRecord {
  id: string;
  orderId: string;
  batchId?: string;
  productTitle: string;
  artisanName: string;
  inspectorName: string;
  date: string;
  passed: boolean;
  score: number; // 0-100
  criteria: {
    materialIntegrity: boolean;
    craftsmanshipFinish: boolean;
    dimensionalAccuracy: boolean;
    packagingSafety: boolean;
  };
  notes: string;
}

export interface PayoutRecord {
  id: string;
  payoutCode: string;
  recipientId: string;
  recipientName: string;
  recipientRole: UserRole;
  amountPKR: number;
  method: PaymentMethod;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  date: string;
  referenceOrderId?: string;
  referenceBatchCode?: string;
  transactionRef: string;
}

export interface AppMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  recipientName: string;
  recipientRole: UserRole;
  topic: string;
  content: string;
  timestamp: string;
  read: boolean;
  priority: 'normal' | 'urgent';
}

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary' | 'success';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface PlatformVideoConfig {
  videoUrl: string;
  title: string;
  isCustomUploaded: boolean;
  uploadedFileName?: string;
  posterUrl?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1';
  autoPlay?: boolean;
}

export interface PlatformCustomImage {
  id: string;
  name: string;
  dataUrl: string;
  category: 'hunar' | 'menue' | 'knowledge' | 'services' | 'landscape' | 'artisan' | 'community';
  caption: string;
  uploadedAt: string;
}
