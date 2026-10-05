import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserRole,
  AppView,
  Product,
  Order,
  ProductionBatch,
  SkillPartnerProfile,
  ConnectorTask,
  PlatformMetrics,
  PaymentMethod,
  ProductCategory,
  OrderFeedback,
  LedgerEntry,
  AuditLog,
  NotificationItem,
  UserProfile,
  BusinessBuilderProfile,
  ConnectorProfile,
  PatronProfile,
  CitizenProfile,
  QualityCheckRecord,
  PayoutRecord,
  AppMessage,
  ToastItem,
  ToastType,
  ConfirmDialogOptions,
  SkillPartnerTask,
  SkillPartnerTaskStatus,
  ProductStatus,
  ProductAvailability,
  OrderStatus,
  OrderBriefData,
  OrderTimelineEvent,
  PlatformVideoConfig,
  PlatformCustomImage,
} from '../types';
import {
  SEED_PRODUCTS,
  SEED_ORDERS,
  SEED_BATCHES,
  SEED_SKILL_PARTNERS,
  SEED_CONNECTOR_TASKS,
  INITIAL_METRICS,
  SEED_LEDGER_ENTRIES,
  SEED_AUDIT_LOGS,
  SEED_NOTIFICATIONS,
  DEMO_PROFILES,
  SEED_BUSINESS_BUILDERS,
  SEED_CONNECTORS,
  SEED_PATRONS,
  SEED_QUALITY_CHECKS,
  SEED_PAYOUTS,
  SEED_MESSAGES,
  SEED_SKILL_PARTNER_TASKS,
} from '../data/seedData';
import { triggerOrderPlacedCelebration, triggerProcessCompleteCelebration } from '../utils/celebration';

export interface AppContextType {
  // Navigation & User State
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;
  demoMode: boolean;
  setDemoMode: (isDemo: boolean) => void;
  isRealMode: boolean;
  setIsRealMode: (isReal: boolean) => void;
  resetDemo: () => void;
  resetToDemoData: () => void; // alias for compatibility

  // Selected State
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;

  // Centralized State Entities (As requested by Section: Global State)
  products: Product[];
  orders: Order[];
  batches: ProductionBatch[];
  payments: LedgerEntry[];
  ledgerEntries: LedgerEntry[]; // alias
  payouts: PayoutRecord[];
  skillPartners: SkillPartnerProfile[];
  businessBuilders: BusinessBuilderProfile[];
  connectors: ConnectorProfile[];
  patrons: PatronProfile[];
  citizens: CitizenProfile[];
  messages: AppMessage[];
  notifications: NotificationItem[];
  impactMetrics: PlatformMetrics;
  metrics: PlatformMetrics; // alias
  qualityChecks: QualityCheckRecord[];
  connectorTasks: ConnectorTask[];
  skillPartnerTasks: SkillPartnerTask[];
  auditLogs: AuditLog[];

  // Global Dialog / Overlay System
  toasts: ToastItem[];
  addToast: (toast: { type: ToastType; title: string; message?: string; duration?: number }) => string;
  dismissToast: (id: string) => void;
  showToast: (msg: string, type?: ToastType, title?: string) => void;
  toastMessage: string | null; // backward compatibility

  confirmDialog: ConfirmDialogOptions | null;
  openConfirmDialog: (options: ConfirmDialogOptions) => void;
  closeConfirmDialog: () => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;

  registeredAccounts: UserProfile[];
  registerAccount: (data: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    city: string;
    phone: string;
    title?: string;
    bio?: string;
  }) => { success: boolean; message?: string; user?: UserProfile };
  loginAccount: (email: string, password?: string) => { success: boolean; message?: string; user?: UserProfile };
  logoutAccount: () => void;

  // Video Showcase & Platform Media state
  videoConfig: PlatformVideoConfig;
  updateVideoConfig: (config: Partial<PlatformVideoConfig>) => void;
  customImages: PlatformCustomImage[];
  hiddenSlideIds: string[];
  addCustomImage: (img: Omit<PlatformCustomImage, 'id' | 'uploadedAt'>) => void;
  updateCustomImage: (id: string, updates: Partial<PlatformCustomImage>) => void;
  removeCustomImage: (id: string) => void;
  clearCustomImages: () => void;
  toggleHideSlide: (id: string) => void;
  restoreAllSlides: () => void;

  // Enterprise & Role Operations
  placeOrder: (data: {
    productId: string;
    quantity: number;
    customerName: string;
    customerCity: string;
    customerPhone: string;
    customerAddress: string;
    paymentMethod: PaymentMethod;
    isPreOrder?: boolean;
    orderBrief?: OrderBriefData;
    priority?: 'normal' | 'high' | 'urgent';
  }) => Order;
  submitOrderFeedback: (orderId: string, rating: number, comment: string) => void;
  acceptOrder: (orderId: string, note?: string) => void;
  clarifyOrRejectOrder: (orderId: string, actionType: 'clarify' | 'reject', comment: string) => void;
  assignOrderToArtisan: (orderId: string, partnerId: string, partnerName: string, note?: string) => void;
  escalateOrder: (orderId: string, reason: string) => void;
  updateOrderWorkflowStatus: (orderId: string, updates: Partial<Order>, note?: string) => void;

  allocateOrderToBatch: (orderId: string, batchId: string) => void;
  createProductionBatch: (data: {
    title: string;
    category: ProductCategory;
    skillPartnerId: string;
    targetUnits: number;
    deadline: string;
    notes: string;
  }) => ProductionBatch;
  advanceBatchStatus: (batchId: string, nextStatus: ProductionBatch['status']) => void;
  runQualityVerification: (orderId: string, passed: boolean, score: number) => void;
  dispatchOrder: (orderId: string) => void;
  markOrderDelivered: (orderId: string) => void;
  releaseArtisanPayout: (orderId: string) => void;
  addNewProduct: (productData: Omit<Product, 'id' | 'rating' | 'reviewsCount' | 'currentBatchOrders'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  updateProductStatus: (id: string, status: ProductStatus) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  confirmOrder: (orderId: string) => void;
  assignTaskToPartner: (taskData: Omit<SkillPartnerTask, 'id' | 'createdAt'>) => void;
  addNewSkillPartner: (partnerData: Omit<SkillPartnerProfile, 'id' | 'activeBatchesCount' | 'completedOrdersCount' | 'totalEarningsPKR' | 'pendingPayoutPKR' | 'rating'>) => void;
  recordBuilderFeedbackAction: (feedbackId: string, actionNote: string) => void;
  runAiDemandAnalysis: () => { recommendations: string[]; projectedRevenuePKR: number };

  incrementBatchProgress: (batchId: string) => void;
  requestConnectorMaterialHelp: (batchId: string, urgentNote: string) => void;
  completeConnectorTask: (taskId: string) => void;
  markBatchMaterialsDelivered: (batchId: string, notes: string) => void;

  acceptAssignedTask: (taskId: string) => void;
  updateTaskProgress: (taskId: string, completedUnits: number) => void;
  submitTaskForAudit: (taskId: string, note?: string, proofPhotoUrl?: string) => void;
  updateTaskStatus: (taskId: string, status: SkillPartnerTaskStatus) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  sendMessage: (msg: {
    recipientId: string;
    recipientName: string;
    recipientRole: UserRole;
    topic: string;
    content: string;
    priority?: 'normal' | 'urgent';
  }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'pak_homeceo_app_state_v3';

function safeJsonParse<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved || saved === 'undefined' || saved === 'null') return fallback;
    return JSON.parse(saved);
  } catch (e) {
    console.warn(`Failed to parse localStorage key "${key}":`, e);
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Role
  const [currentView, setCurrentView] = useState<AppView>('welcome');
  const [currentRole, setCurrentRole] = useState<UserRole>('builder');
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [isRealMode, setIsRealMode] = useState<boolean>(false);

  // Active User Profile synced to currentRole
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    return DEMO_PROFILES.builder;
  });

  // Selections
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Entities with persistence using safeJsonParse
  const [products, setProducts] = useState<Product[]>(() => {
    return safeJsonParse(`${LOCAL_STORAGE_KEY}_products`, SEED_PRODUCTS);
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    return safeJsonParse(`${LOCAL_STORAGE_KEY}_orders`, SEED_ORDERS);
  });

  const [batches, setBatches] = useState<ProductionBatch[]>(() => {
    return safeJsonParse(`${LOCAL_STORAGE_KEY}_batches`, SEED_BATCHES);
  });

  const [skillPartners, setSkillPartners] = useState<SkillPartnerProfile[]>(() => {
    return safeJsonParse(`${LOCAL_STORAGE_KEY}_partners`, SEED_SKILL_PARTNERS);
  });

  const [businessBuilders, setBusinessBuilders] = useState<BusinessBuilderProfile[]>(() => {
    return safeJsonParse(`${LOCAL_STORAGE_KEY}_builders`, SEED_BUSINESS_BUILDERS);
  });

  const [connectors, setConnectors] = useState<ConnectorProfile[]>(() => {
    return safeJsonParse(`${LOCAL_STORAGE_KEY}_connectors`, SEED_CONNECTORS);
  });

  const [patrons, setPatrons] = useState<PatronProfile[]>(() => {
    return safeJsonParse(`${LOCAL_STORAGE_KEY}_patrons`, SEED_PATRONS);
  });

  const [connectorTasks, setConnectorTasks] = useState<ConnectorTask[]>(() => {
    return safeJsonParse(`${LOCAL_STORAGE_KEY}_tasks`, SEED_CONNECTOR_TASKS);
  });

  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(() => {
    return safeJsonParse(`${LOCAL_STORAGE_KEY}_ledger`, SEED_LEDGER_ENTRIES);
  });

  const [payouts, setPayouts] = useState<PayoutRecord[]>(() => {
    return safeJsonParse(`${LOCAL_STORAGE_KEY}_payouts`, SEED_PAYOUTS);
  });

  const [qualityChecks, setQualityChecks] = useState<QualityCheckRecord[]>(() => {
    return safeJsonParse(`${LOCAL_STORAGE_KEY}_qc`, SEED_QUALITY_CHECKS);
  });

  const [messages, setMessages] = useState<AppMessage[]>(() => {
    return safeJsonParse(`${LOCAL_STORAGE_KEY}_messages`, SEED_MESSAGES);
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    return safeJsonParse(`${LOCAL_STORAGE_KEY}_audit`, SEED_AUDIT_LOGS);
  });

  const [skillPartnerTasks, setSkillPartnerTasks] = useState<SkillPartnerTask[]>(() => {
    return safeJsonParse(`${LOCAL_STORAGE_KEY}_sptasks`, SEED_SKILL_PARTNER_TASKS);
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    return safeJsonParse(`${LOCAL_STORAGE_KEY}_notifs`, SEED_NOTIFICATIONS);
  });

  const [impactMetrics, setImpactMetrics] = useState<PlatformMetrics>(() => {
    return safeJsonParse(`${LOCAL_STORAGE_KEY}_metrics`, INITIAL_METRICS);
  });

  // Video state
  const [videoConfig, setVideoConfig] = useState<PlatformVideoConfig>(() => {
    return safeJsonParse(`${LOCAL_STORAGE_KEY}_video`, {
      videoUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
      title: 'PAK-HOMECEO: Transforming Household Capability Into Scalable Enterprise',
      description: 'A 2-minute strategic walk-through explaining the closed-loop economic model connecting young business managers with skilled home artisans.',
      isCustomUploaded: false,
      aspectRatio: '16:9',
      autoPlay: false,
    });
  });

  // Custom Platform Media Uploads
  const [customImages, setCustomImages] = useState<PlatformCustomImage[]>(() => {
    return safeJsonParse(`${LOCAL_STORAGE_KEY}_custom_images`, []);
  });

  const [hiddenSlideIds, setHiddenSlideIds] = useState<string[]>(() => {
    return safeJsonParse(`${LOCAL_STORAGE_KEY}_hidden_slide_ids`, []);
  });

  // Registered Accounts (Real Account Creation & Auth)
  const [registeredAccounts, setRegisteredAccounts] = useState<UserProfile[]>(() => {
    return safeJsonParse(`${LOCAL_STORAGE_KEY}_registered_accounts`, []);
  });

  // Global Toast System
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const addToast = useCallback((toast: { type: ToastType; title: string; message?: string; duration?: number }): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const duration = toast.duration ?? 4500;
    const newToast: ToastItem = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);
    setToastMessage(toast.title + (toast.message ? `: ${toast.message}` : ''));

    if (duration > 0) {
      setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((msg: string, type: ToastType = 'info', title?: string) => {
    addToast({
      type,
      title: title || (type === 'success' ? 'Success' : type === 'error' ? 'Notice' : type === 'warning' ? 'Warning' : 'Information'),
      message: msg,
    });
  }, [addToast]);

  // Global Confirmation Dialog
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogOptions | null>(null);

  const openConfirmDialog = useCallback((options: ConfirmDialogOptions) => {
    setConfirmDialog(options);
  }, []);

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog(null);
  }, []);

  // Global Search Modal State
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Global Notification Drawer State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Role Switching in Demo Mode
  const switchRole = useCallback((role: UserRole) => {
    const canonicalRole: UserRole = role === 'patron' ? 'citizen' : role;
    setCurrentRole(canonicalRole);
    const profile = (DEMO_PROFILES as any)[canonicalRole] || (DEMO_PROFILES as any)[role] || (DEMO_PROFILES as any).citizen;
    if (profile) {
      setCurrentUser(profile);
    }
    const label =
      canonicalRole === 'builder'
        ? 'Business Builder'
        : canonicalRole === 'partner'
        ? 'Skill Partner'
        : canonicalRole === 'connector'
        ? 'Community Connector'
        : 'Citizen';
    showToast(`Switched to ${label} profile.`, 'success', 'Role Updated');
  }, [showToast]);

  // Real Account Registration
  const registerAccount = useCallback(
    (data: {
      name: string;
      email: string;
      password?: string;
      role: UserRole;
      city: string;
      phone: string;
      title?: string;
      bio?: string;
    }): { success: boolean; message?: string; user?: UserProfile } => {
      const emailNormalized = data.email.trim().toLowerCase();
      if (!emailNormalized || !data.name.trim()) {
        return { success: false, message: 'Name and email are required.' };
      }

      // Check if user already exists
      const existing = registeredAccounts.find((u) => u.email.toLowerCase() === emailNormalized);
      if (existing) {
        return { success: false, message: 'An account with this email already exists. Please Sign In.' };
      }

      const roleCodePrefix = data.role === 'builder' ? 'BB' : data.role === 'partner' ? 'SP' : data.role === 'connector' ? 'CC' : 'CTZ';
      const cityCode = (data.city || 'KHI').slice(0, 3).toUpperCase();
      const code = `${roleCodePrefix}-${cityCode}-${Math.floor(100 + Math.random() * 900)}`;

      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: data.name.trim(),
        email: emailNormalized,
        password: data.password || 'pakistan2026',
        role: data.role,
        city: data.city.trim() || 'Lahore',
        phone: data.phone.trim() || '+92 300 1234567',
        code,
        title:
          data.title?.trim() ||
          (data.role === 'citizen'
            ? 'Verified Citizen'
            : data.role === 'builder'
            ? 'Enterprise Business Builder'
            : data.role === 'partner'
            ? 'Registered Skill Partner'
            : 'Community Field Coordinator'),
        avatarUrl: '',
        badge: `${data.role.toUpperCase()} · ${data.city || 'Pakistan'}`,
        bio: data.bio?.trim() || `Verified ${data.role} member of PAK-HOMECEO.`,
        verified: true,
      };

      setRegisteredAccounts((prev) => [newUser, ...prev]);
      setCurrentUser(newUser);
      setCurrentRole(newUser.role);
      setDemoMode(false);
      setIsRealMode(true);

      // If registered as skill partner, also register into active skill partners list
      if (newUser.role === 'partner') {
        const newPartnerProfile: SkillPartnerProfile = {
          id: `sp-${Date.now()}`,
          name: newUser.name,
          anonymizedCode: newUser.code,
          skillTitle: newUser.title,
          specialty: newUser.bio || 'Home artisan enterprise participant',
          city: newUser.city,
          district: 'Urban Center',
          craftExperienceYears: 5,
          activeBatchesCount: 0,
          completedOrdersCount: 0,
          totalEarningsPKR: 0,
          pendingPayoutPKR: 0,
          rating: 5.0,
          voiceGuidanceScript: `Welcome ${newUser.name}. Your workspace is active and ready for batch assignments.`,
          consentRecorded: true,
          assignedConnectorName: 'Fatima Zehra',
          avatarUrl: newUser.avatarUrl,
        };
        setSkillPartners((prev) => [newPartnerProfile, ...prev]);
      }

      showToast(`Account created successfully! Welcome, ${newUser.name}.`, 'success', 'Account Registered');
      return { success: true, user: newUser };
    },
    [registeredAccounts, showToast]
  );

  // Real Account Login
  const loginAccount = useCallback(
    (email: string, password?: string): { success: boolean; message?: string; user?: UserProfile } => {
      const emailNormalized = email.trim().toLowerCase();
      if (!emailNormalized) {
        return { success: false, message: 'Please enter your email address.' };
      }

      // 1. Check custom registered accounts
      const foundCustom = registeredAccounts.find((u) => u.email.toLowerCase() === emailNormalized);
      if (foundCustom) {
        if (password && foundCustom.password && foundCustom.password !== password) {
          return { success: false, message: 'Incorrect password. Please try again.' };
        }
        setCurrentUser(foundCustom);
        setCurrentRole(foundCustom.role);
        setDemoMode(false);
        setIsRealMode(true);
        showToast(`Welcome back, ${foundCustom.name}!`, 'success', 'Signed In');
        return { success: true, user: foundCustom };
      }

      // 2. Check preset demo accounts by email
      const demoRoles: UserRole[] = ['citizen', 'builder', 'partner', 'connector'];
      for (const r of demoRoles) {
        const demoUser = DEMO_PROFILES[r];
        if (demoUser.email.toLowerCase() === emailNormalized) {
          setCurrentUser(demoUser);
          setCurrentRole(r);
          setDemoMode(true);
          setIsRealMode(false);
          showToast(`Signed in as ${demoUser.name} (${r}).`, 'success', 'Demo Access');
          return { success: true, user: demoUser };
        }
      }

      return {
        success: false,
        message: 'No account found with this email. You can create a new account or select 1-click Demo entry.',
      };
    },
    [registeredAccounts, showToast]
  );

  const logoutAccount = useCallback(() => {
    setCurrentRole('citizen');
    setCurrentUser(DEMO_PROFILES.citizen);
    setDemoMode(true);
    setIsRealMode(false);
    showToast('You have been logged out.', 'info', 'Logged Out');
  }, [showToast]);

  // Sync to LocalStorage safely without throwing QuotaExceededError
  useEffect(() => {
    const safeSet = (key: string, val: any) => {
      try {
        localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
      } catch (err) {
        console.warn(`localStorage save error for ${key}:`, err);
      }
    };

    safeSet(`${LOCAL_STORAGE_KEY}_products`, products);
    safeSet(`${LOCAL_STORAGE_KEY}_orders`, orders);
    safeSet(`${LOCAL_STORAGE_KEY}_batches`, batches);
    safeSet(`${LOCAL_STORAGE_KEY}_partners`, skillPartners);
    safeSet(`${LOCAL_STORAGE_KEY}_builders`, businessBuilders);
    safeSet(`${LOCAL_STORAGE_KEY}_connectors`, connectors);
    safeSet(`${LOCAL_STORAGE_KEY}_patrons`, patrons);
    safeSet(`${LOCAL_STORAGE_KEY}_tasks`, connectorTasks);
    safeSet(`${LOCAL_STORAGE_KEY}_ledger`, ledgerEntries);
    safeSet(`${LOCAL_STORAGE_KEY}_payouts`, payouts);
    safeSet(`${LOCAL_STORAGE_KEY}_qc`, qualityChecks);
    safeSet(`${LOCAL_STORAGE_KEY}_messages`, messages);
    safeSet(`${LOCAL_STORAGE_KEY}_sptasks`, skillPartnerTasks);
    safeSet(`${LOCAL_STORAGE_KEY}_audit`, auditLogs);
    safeSet(`${LOCAL_STORAGE_KEY}_notifs`, notifications);
    safeSet(`${LOCAL_STORAGE_KEY}_metrics`, impactMetrics);
    safeSet(`${LOCAL_STORAGE_KEY}_video`, videoConfig);
    safeSet(`${LOCAL_STORAGE_KEY}_custom_images`, customImages);
    safeSet(`${LOCAL_STORAGE_KEY}_hidden_slide_ids`, hiddenSlideIds);
    safeSet(`${LOCAL_STORAGE_KEY}_registered_accounts`, registeredAccounts);
  }, [products, orders, batches, skillPartners, businessBuilders, connectors, patrons, connectorTasks, skillPartnerTasks, ledgerEntries, payouts, qualityChecks, messages, auditLogs, notifications, impactMetrics, videoConfig, customImages, hiddenSlideIds, registeredAccounts]);

  const resetDemo = useCallback(() => {
    setProducts(SEED_PRODUCTS);
    setOrders(SEED_ORDERS);
    setBatches(SEED_BATCHES);
    setSkillPartners(SEED_SKILL_PARTNERS);
    setBusinessBuilders(SEED_BUSINESS_BUILDERS);
    setConnectors(SEED_CONNECTORS);
    setPatrons(SEED_PATRONS);
    setConnectorTasks(SEED_CONNECTOR_TASKS);
    setSkillPartnerTasks(SEED_SKILL_PARTNER_TASKS);
    setLedgerEntries(SEED_LEDGER_ENTRIES);
    setPayouts(SEED_PAYOUTS);
    setQualityChecks(SEED_QUALITY_CHECKS);
    setMessages(SEED_MESSAGES);
    setAuditLogs(SEED_AUDIT_LOGS);
    setNotifications(SEED_NOTIFICATIONS);
    setImpactMetrics(INITIAL_METRICS);
    setCurrentUser(DEMO_PROFILES[currentRole]);
    showToast('Platform reset to complete pre-seeded demonstration data.', 'success', 'Demo Reset');
  }, [currentRole, showToast]);

  const resetToDemoData = resetDemo;

  const updateVideoConfig = (config: Partial<PlatformVideoConfig>) => {
    setVideoConfig((prev) => ({ ...prev, ...config }));
    showToast('Platform video configuration updated.', 'info', 'Video Settings Saved');
  };

  const addCustomImage = (img: Omit<PlatformCustomImage, 'id' | 'uploadedAt'>) => {
    const newImage: PlatformCustomImage = {
      ...img,
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      uploadedAt: new Date().toISOString(),
    };
    setCustomImages((prev) => [newImage, ...prev]);
    showToast(`Image "${img.name}" successfully added to platform visual assets pool!`, 'success', 'Asset Uploaded');
  };

  const updateCustomImage = (id: string, updates: Partial<PlatformCustomImage>) => {
    setCustomImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, ...updates } : img))
    );
    showToast('Visual asset caption updated successfully.', 'success', 'Image Saved');
  };

  const removeCustomImage = (id: string) => {
    setCustomImages((prev) => prev.filter((img) => img.id !== id));
    showToast('Visual asset removed from platform pool.', 'info', 'Asset Removed');
  };

  const clearCustomImages = () => {
    setCustomImages([]);
    showToast('All custom uploaded images cleared.', 'info');
  };

  const toggleHideSlide = (id: string) => {
    setHiddenSlideIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Image restored to live rotation loop.', 'success', 'Image Kept');
        return prev.filter((i) => i !== id);
      } else {
        showToast('Image removed from active rotation loop.', 'info', 'Image Hidden');
        return [...prev, id];
      }
    });
  };

  const restoreAllSlides = () => {
    setHiddenSlideIds([]);
    showToast('All slides restored to active gallery loop.', 'success');
  };

  // Notification actions
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  }, [showToast]);

  const sendMessage = useCallback((msgData: {
    recipientId: string;
    recipientName: string;
    recipientRole: UserRole;
    topic: string;
    content: string;
    priority?: 'normal' | 'urgent';
  }) => {
    const newMsg: AppMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentRole,
      recipientId: msgData.recipientId,
      recipientName: msgData.recipientName,
      recipientRole: msgData.recipientRole,
      topic: msgData.topic,
      content: msgData.content,
      timestamp: 'Just now',
      read: false,
      priority: msgData.priority || 'normal',
    };
    setMessages((prev) => [newMsg, ...prev]);
    showToast(`Message sent to ${msgData.recipientName}`, 'success', 'Message Dispatched');
  }, [currentUser, currentRole, showToast]);

  // Citizen places an order or pre-order with structured brief
  const placeOrder = (data: {
    productId: string;
    quantity: number;
    customerName: string;
    customerCity: string;
    customerPhone: string;
    customerAddress: string;
    paymentMethod: PaymentMethod;
    isPreOrder?: boolean;
    orderBrief?: OrderBriefData;
    priority?: 'normal' | 'high' | 'urgent';
  }): Order => {
    const product = products.find((p) => p.id === data.productId) || products[0];
    const totalPKR = product.pricePKR * data.quantity;
    const directArtisanPayoutPKR = Math.round((totalPKR * product.artisanSplitPercent) / 100);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingNumber = `PK-HCEO-2026-${randomSuffix}`;
    const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    const isPreOrder = !!data.isPreOrder;

    const initialTimeline: OrderTimelineEvent[] = [
      {
        id: `tl-${Date.now()}-1`,
        timestamp,
        actor: `Citizen (${data.customerName})`,
        action: isPreOrder ? 'Pre-Order Brief Submitted' : 'Order Placed & Brief Created',
        note: data.orderBrief?.briefSummary || `Custom requirements submitted for ${data.quantity}x ${product.title}`,
      },
    ];

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      trackingNumber,
      productId: product.id,
      productTitle: product.title,
      category: product.category,
      quantity: data.quantity,
      unitPricePKR: product.pricePKR,
      totalPKR,
      customerName: data.customerName,
      customerCity: data.customerCity,
      customerPhoneMasked: data.customerPhone.replace(/(\d{4})\d{4}(\d{3})/, '$1-***$2'),
      customerAddressMasked: data.customerAddress,
      status: 'placed',
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === 'cod' ? 'pending_cod' : 'escrow_hold',
      skillPartnerId: product.producerId,
      skillPartnerName: product.producerName,
      skillPartnerCode: product.producerCode,
      connectorName: 'Fatima Zehra',
      payoutReleased: false,
      payoutAmountPKR: directArtisanPayoutPKR,
      createdAt: timestamp,
      estimatedDeliveryDate: new Date(Date.now() + (isPreOrder ? 14 : 6) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      qualityPassed: false,
      isPreOrder,
      orderBrief: data.orderBrief,
      priority: data.priority || 'normal',
      assignedPerson: product.producerName,
      productionStatus: 'pending_assignment',
      qualityStatus: 'pending',
      deliveryStatus: 'processing',
      timeline: initialTimeline,
    };

    setOrders((prev) => [newOrder, ...prev]);

    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      targetRole: 'builder',
      title: isPreOrder ? 'New Citizen Pre-Order Brief' : 'New Citizen Order Placed',
      message: `${data.customerName} requested ${data.quantity}x ${product.title} (PKR ${totalPKR.toLocaleString()}). Structured brief available for Product Manager review.`,
      read: false,
      actionUrl: `/orders/${newOrder.id}`,
      type: 'order',
    };
    setNotifications((prev) => [newNotification, ...prev]);

    const newLedger: LedgerEntry = {
      id: `led-${Date.now()}`,
      timestamp,
      type: 'customer_payment',
      referenceOrderId: newOrder.id,
      recipientName: 'PAK-HOMECEO Escrow Settlement',
      amountPKR: totalPKR,
      status: 'held_in_escrow',
      note: `Escrow hold for Order ${trackingNumber} placed via ${data.paymentMethod.toUpperCase()}`,
    };
    setLedgerEntries((prev) => [newLedger, ...prev]);

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp,
        actorRole: 'citizen',
        actorName: data.customerName,
        action: isPreOrder ? 'Pre-Order Brief Submitted' : 'Order Placed',
        details: `Order ${trackingNumber} for ${data.quantity}x ${product.title} with customization brief`,
      },
      ...prev,
    ]);

    setImpactMetrics((prev) => ({
      ...prev,
      totalIncomeGeneratedPKR: prev.totalIncomeGeneratedPKR + totalPKR,
    }));

    // Trigger festive order celebration
    triggerOrderPlacedCelebration();

    showToast(
      isPreOrder ? `Pre-Order ${trackingNumber} recorded in batch queue!` : `Order ${trackingNumber} placed successfully!`,
      'success',
      'Order Confirmed'
    );
    return newOrder;
  };

  // Product Manager Workflow Operations
  const acceptOrder = (orderId: string, note?: string) => {
    const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              id: `tl-${Date.now()}`,
              timestamp,
              actor: 'Product Manager (Zainab Malik)',
              action: 'Order Accepted & Verified',
              note: note || 'Custom specifications validated against artisan capacity.',
            },
          ];
          return {
            ...o,
            status: 'confirmed',
            timeline: updatedTimeline,
          };
        }
        return o;
      })
    );
    showToast('Order accepted into production schedule.', 'success', 'Order Accepted');
  };

  const clarifyOrRejectOrder = (orderId: string, actionType: 'clarify' | 'reject', comment: string) => {
    const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              id: `tl-${Date.now()}`,
              timestamp,
              actor: 'Product Manager (Zainab Malik)',
              action: actionType === 'clarify' ? 'Clarification Requested' : 'Order Rejected / Refund Initiated',
              note: comment,
            },
          ];
          return {
            ...o,
            status: actionType === 'clarify' ? 'placed' : 'completed',
            timeline: updatedTimeline,
          };
        }
        return o;
      })
    );
    showToast(
      actionType === 'clarify' ? 'Clarification note added to order brief.' : 'Order closed and refund initiated.',
      actionType === 'clarify' ? 'info' : 'warning'
    );
  };

  const assignOrderToArtisan = (orderId: string, partnerId: string, partnerName: string, note?: string) => {
    const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    const partner = skillPartners.find((p) => p.id === partnerId);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              id: `tl-${Date.now()}`,
              timestamp,
              actor: 'Product Manager (Zainab Malik)',
              action: `Assigned to ${partnerName}`,
              note: note || `Dispatched to ${partner?.city || 'Artisan Hub'} for production.`,
            },
          ];
          return {
            ...o,
            status: 'allocated',
            skillPartnerId: partnerId,
            skillPartnerName: partnerName,
            assignedPerson: partnerName,
            productionStatus: 'in_craft',
            timeline: updatedTimeline,
          };
        }
        return o;
      })
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        timestamp: 'Just now',
        targetRole: 'partner',
        title: 'New Order Assignment',
        message: `Assigned Order to ${partnerName}. Please review craft specs.`,
        read: false,
        type: 'production',
      },
      ...prev,
    ]);

    showToast(`Order assigned directly to ${partnerName}.`, 'success', 'Assignment Recorded');
  };

  const escalateOrder = (orderId: string, reason: string) => {
    const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              id: `tl-${Date.now()}`,
              timestamp,
              actor: `${currentUser.name} (${currentUser.role})`,
              action: 'Escalated to Executive Review',
              note: reason,
            },
          ];
          return {
            ...o,
            priority: 'urgent',
            timeline: updatedTimeline,
          };
        }
        return o;
      })
    );
    showToast(`Order escalated as Urgent: "${reason}"`, 'warning', 'Escalation Logged');
  };

  const updateOrderWorkflowStatus = (orderId: string, updates: Partial<Order>, note?: string) => {
    const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const timelineEntry: OrderTimelineEvent = {
            id: `tl-${Date.now()}`,
            timestamp,
            actor: `${currentUser.name} (${currentUser.role})`,
            action: `Status Update: ${updates.status || updates.productionStatus || 'Progress Updated'}`,
            note: note || 'Workflow progression logged.',
          };
          return {
            ...o,
            ...updates,
            timeline: [...(o.timeline || []), timelineEntry],
          };
        }
        return o;
      })
    );
    showToast('Order status updated across ecosystem.', 'success', 'Updated');
  };

  const submitOrderFeedback = (orderId: string, rating: number, comment: string) => {
    const feedback: OrderFeedback = {
      id: `fb-${Date.now()}`,
      orderId,
      productTitle: '',
      citizenName: currentUser.name,
      patronName: currentUser.name,
      rating,
      comment,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'published',
    };

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          feedback.productTitle = ord.productTitle;
          return { ...ord, feedback };
        }
        return ord;
      })
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        timestamp: 'Just now',
        targetRole: 'builder',
        title: 'Customer Craft Feedback Received',
        message: `${currentUser.name} rated order ${rating} stars: "${comment.slice(0, 60)}..."`,
        read: false,
        actionUrl: `/orders/${orderId}`,
        type: 'message',
      },
      ...prev,
    ]);

    showToast('Thank you! Your feedback helps our home producers flourish.', 'success', 'Feedback Recorded');
  };

  const allocateOrderToBatch = (orderId: string, batchId: string) => {
    const targetBatch = batches.find((b) => b.id === batchId);
    if (!targetBatch) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'reviewed_batched',
              batchId,
            }
          : o
      )
    );

    setBatches((prev) =>
      prev.map((b) =>
        b.id === batchId
          ? {
              ...b,
              orderIds: b.orderIds.includes(orderId) ? b.orderIds : [...b.orderIds, orderId],
              status: 'allocated',
            }
          : b
      )
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        timestamp: 'Just now',
        targetRole: 'partner',
        title: 'Order Allocated to Production Batch',
        message: `Order assigned to Batch ${targetBatch.batchCode}. Prepare materials for craft synthesis.`,
        read: false,
        actionUrl: '/skill-partner',
        type: 'production',
      },
      ...prev,
    ]);

    showToast(`Order allocated to Batch ${targetBatch.batchCode}.`, 'success', 'Batch Allocated');
  };

  const createProductionBatch = (data: {
    title: string;
    category: ProductCategory;
    skillPartnerId: string;
    targetUnits: number;
    deadline: string;
    notes: string;
  }): ProductionBatch => {
    const partner = skillPartners.find((p) => p.id === data.skillPartnerId) || skillPartners[0];
    const batchCode = `BATCH-${partner.city.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const unitPayPKR = 5950;
    const totalBatchPayPKR = unitPayPKR * data.targetUnits;

    const newBatch: ProductionBatch = {
      id: `batch-${Date.now()}`,
      batchCode,
      title: data.title,
      category: data.category,
      skillPartnerId: partner.id,
      skillPartnerName: partner.name,
      skillPartnerCode: partner.anonymizedCode,
      connectorName: partner.assignedConnectorName || 'Fatima Zehra',
      city: partner.city,
      targetUnits: data.targetUnits,
      completedUnits: 0,
      status: 'forming',
      orderIds: [],
      rawMaterialsDelivered: false,
      rawMaterialsNotes: 'Awaiting connector fulfillment and logistics verification.',
      startDate: new Date().toISOString().split('T')[0],
      deadline: data.deadline,
      unitPayPKR,
      totalBatchPayPKR,
      notes: data.notes,
    };

    setBatches((prev) => [newBatch, ...prev]);

    setConnectorTasks((prev) => [
      {
        id: `tsk-${Date.now()}`,
        connectorName: partner.assignedConnectorName,
        artisanName: partner.name,
        artisanCode: partner.anonymizedCode,
        city: partner.city,
        taskType: 'material_drop',
        description: `Deliver raw materials for new ${data.title} (${batchCode})`,
        status: 'pending',
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        phoneMasked: '0300-***4920',
        areaLocality: `${partner.district}, ${partner.city}`,
        notes: `Raw materials for ${data.targetUnits} units. Verify physical drop & confirm artisan receipt.`,
      },
      ...prev,
    ]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        timestamp: 'Just now',
        targetRole: 'connector',
        title: 'New Logistics Task Scheduled',
        message: `Deliver raw material bundle for Batch ${batchCode} to ${partner.name}.`,
        read: false,
        actionUrl: '/community-connector',
        type: 'action_required',
      },
      ...prev,
    ]);

    showToast(`Batch ${batchCode} created. Logistics task routed to connector.`, 'success', 'Batch Formed');
    return newBatch;
  };

  const advanceBatchStatus = (batchId: string, nextStatus: ProductionBatch['status']) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, status: nextStatus } : b))
    );
    showToast(`Batch status updated to ${nextStatus.replace('_', ' ').toUpperCase()}`, 'info');
  };

  const runQualityVerification = (orderId: string, passed: boolean, score: number) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              qualityPassed: passed,
              qualityScore: score,
              status: passed ? 'quality_verified' : o.status,
            }
          : o
      )
    );

    if (targetOrder) {
      const qcRecord: QualityCheckRecord = {
        id: `qc-${Date.now()}`,
        orderId,
        batchId: targetOrder.batchId,
        productTitle: targetOrder.productTitle,
        artisanName: targetOrder.skillPartnerName,
        inspectorName: currentUser.name,
        date: new Date().toISOString().split('T')[0],
        passed,
        score,
        criteria: {
          materialIntegrity: true,
          craftsmanshipFinish: score >= 90,
          dimensionalAccuracy: true,
          packagingSafety: true,
        },
        notes: passed ? `Physical audit verified. Score ${score}/100.` : `Issues detected in finish tension. Score ${score}/100.`,
      };
      setQualityChecks((prev) => [qcRecord, ...prev]);
    }

    showToast(
      passed
        ? `Quality verification passed with score ${score}/100.`
        : `Quality audit flagged for rectification (Score ${score}/100).`,
      passed ? 'success' : 'warning',
      'QC Audit'
    );
  };

  const dispatchOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'dispatched' } : o))
    );
    showToast(`Order marked as dispatched for secure transit.`, 'info', 'Dispatched');
  };

  const markOrderDelivered = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'delivered',
              paymentStatus: 'paid',
            }
          : o
      )
    );
    triggerProcessCompleteCelebration();
    showToast(`Order confirmed delivered to patron. Escrow payout ready for settlement.`, 'success', 'Delivered');
  };

  const releaseArtisanPayout = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, payoutReleased: true } : o))
    );
    triggerProcessCompleteCelebration();

    const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    const newLedger: LedgerEntry = {
      id: `led-${Date.now()}`,
      timestamp,
      type: 'artisan_payout',
      referenceOrderId: order.id,
      referenceBatchCode: order.batchId,
      recipientName: `${order.skillPartnerName} (${order.skillPartnerCode})`,
      amountPKR: order.payoutAmountPKR,
      status: 'settled',
      note: `Direct artisan remuneration released for order ${order.trackingNumber}`,
    };
    setLedgerEntries((prev) => [newLedger, ...prev]);

    const newPayout: PayoutRecord = {
      id: `pay-${Date.now()}`,
      payoutCode: `PAY-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      recipientId: order.skillPartnerId,
      recipientName: order.skillPartnerName,
      recipientRole: 'partner',
      amountPKR: order.payoutAmountPKR,
      method: 'jazzcash',
      status: 'completed',
      date: timestamp,
      referenceOrderId: order.id,
      referenceBatchCode: order.batchId,
      transactionRef: `JC-${Date.now()}`,
    };
    setPayouts((prev) => [newPayout, ...prev]);

    setSkillPartners((prev) =>
      prev.map((p) =>
        p.id === order.skillPartnerId
          ? {
              ...p,
              totalEarningsPKR: p.totalEarningsPKR + order.payoutAmountPKR,
              pendingPayoutPKR: Math.max(0, p.pendingPayoutPKR - order.payoutAmountPKR),
              completedOrdersCount: p.completedOrdersCount + 1,
            }
          : p
      )
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        timestamp: 'Just now',
        targetRole: 'partner',
        title: 'Artisan Remuneration Disbursed',
        message: `PKR ${order.payoutAmountPKR.toLocaleString()} has been settled to your mobile wallet.`,
        read: false,
        actionUrl: '/skill-partner',
        type: 'payment',
      },
      ...prev,
    ]);

    showToast(`PKR ${order.payoutAmountPKR.toLocaleString()} disbursed to ${order.skillPartnerName}.`, 'success', 'Payout Disbursed');
  };

  const addNewProduct = (productData: Omit<Product, 'id' | 'rating' | 'reviewsCount' | 'currentBatchOrders'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      currentBatchOrders: 0,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`New product "${productData.title}" added to enterprise catalog!`, 'success', 'Product Published');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Product updated successfully in catalog.', 'success', 'Product Updated');
  };

  const updateProductStatus = (id: string, status: ProductStatus) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    showToast(`Product status updated to ${status}.`, 'info', 'Status Changed');
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    showToast(`Order status updated to "${status}".`, 'info', 'Order Status');
  };

  const confirmOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'confirmed' } : o))
    );
    showToast('Order confirmed! Ready for cluster batch allocation.', 'success', 'Order Confirmed');
  };

  const assignTaskToPartner = (taskData: Omit<SkillPartnerTask, 'id' | 'createdAt'>) => {
    const newTask: SkillPartnerTask = {
      ...taskData,
      id: `spt-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      completedUnits: 0,
      status: 'Assigned',
    };
    setSkillPartnerTasks((prev) => [newTask, ...prev]);
    showToast(`Work assigned to ${taskData.productTitle} cluster.`, 'success', 'Task Assigned');
  };

  const addNewSkillPartner = (partnerData: Omit<SkillPartnerProfile, 'id' | 'activeBatchesCount' | 'completedOrdersCount' | 'totalEarningsPKR' | 'pendingPayoutPKR' | 'rating'>) => {
    const newPartner: SkillPartnerProfile = {
      ...partnerData,
      id: `sp-${Date.now()}`,
      activeBatchesCount: 0,
      completedOrdersCount: 0,
      totalEarningsPKR: 0,
      pendingPayoutPKR: 0,
      rating: 5.0,
    };
    setSkillPartners((prev) => [newPartner, ...prev]);
    showToast(`Home artisan "${partnerData.name}" onboarded to PAK-HOMECEO network!`, 'success', 'Artisan Onboarded');
  };

  const recordBuilderFeedbackAction = (feedbackId: string, actionNote: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.feedback?.id === feedbackId) {
          return {
            ...o,
            feedback: {
              ...o.feedback,
              actionTakenByBuilder: actionNote,
            },
          };
        }
        return o;
      })
    );
    showToast(`Corrective improvement note logged for patron feedback.`, 'info');
  };

  const runAiDemandAnalysis = () => {
    const projected = 1450000;
    return {
      recommendations: [
        'High surge in demand for Multani Kashidakari shawls in Islamabad and Lahore corporate gifting.',
        'Sargodha Achar inventory running low: recommend opening 2 additional home pickle batches.',
        'Cholistan Desert Ralli quilts are outperforming target margin by 14% among diaspora patrons.',
      ],
      projectedRevenuePKR: projected,
    };
  };

  const incrementBatchProgress = (batchId: string) => {
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id === batchId) {
          const next = Math.min(b.targetUnits, b.completedUnits + 1);
          const nextStatus = next >= b.targetUnits ? 'quality_check' : 'in_production';
          return {
            ...b,
            completedUnits: next,
            status: nextStatus,
          };
        }
        return b;
      })
    );
    showToast(`Batch craft counter incremented! Quality check triggered when target reached.`, 'success', 'Progress Logged');
  };

  const requestConnectorMaterialHelp = (batchId: string, urgentNote: string) => {
    const batch = batches.find((b) => b.id === batchId);
    if (!batch) return;

    setConnectorTasks((prev) => [
      {
        id: `tsk-${Date.now()}`,
        connectorName: batch.connectorName,
        artisanName: batch.skillPartnerName,
        artisanCode: batch.skillPartnerCode,
        city: batch.city,
        taskType: 'material_drop',
        description: `URGENT Artisan Request: ${urgentNote}`,
        status: 'pending',
        scheduledDate: new Date().toISOString().split('T')[0],
        phoneMasked: '0300-***4920',
        areaLocality: `${batch.city} Artisan Quarter`,
        notes: `Urgent note received from artisan: "${urgentNote}". Connector priority visit required.`,
      },
      ...prev,
    ]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        timestamp: 'Just now',
        targetRole: 'connector',
        title: 'Priority Material Alert',
        message: `${batch.skillPartnerName} sent an urgent material request: "${urgentNote}"`,
        read: false,
        actionUrl: '/community-connector',
        type: 'action_required',
      },
      ...prev,
    ]);

    showToast(`Urgent material alert dispatched to Connector ${batch.connectorName}.`, 'warning', 'Alert Dispatched');
  };

  const completeConnectorTask = (taskId: string) => {
    setConnectorTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'completed' } : t))
    );
    showToast(`Field task completed and logged to platform audit trail.`, 'success', 'Task Done');
  };

  const markBatchMaterialsDelivered = (batchId: string, notes: string) => {
    setBatches((prev) =>
      prev.map((b) =>
        b.id === batchId
          ? {
              ...b,
              rawMaterialsDelivered: true,
              rawMaterialsNotes: notes,
              status: 'in_production',
            }
          : b
      )
    );
    showToast(`Raw materials drop confirmed. Artisan batch moved into active production.`, 'success', 'Materials Delivered');
  };

  const acceptAssignedTask = (taskId: string) => {
    setSkillPartnerTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: 'Accepted',
              acceptedAt: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
            }
          : t
      )
    );
    showToast('Task accepted! Production batch assigned to your domestic schedule.', 'success', 'Work Confirmed');
  };

  const updateTaskProgress = (taskId: string, completedUnits: number) => {
    setSkillPartnerTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextUnits = Math.min(t.quantity, Math.max(0, completedUnits));
          const nextStatus: SkillPartnerTaskStatus =
            nextUnits >= t.quantity ? 'In Production' : t.status === 'Assigned' ? 'Accepted' : t.status;
          return {
            ...t,
            completedUnits: nextUnits,
            status: nextStatus,
          };
        }
        return t;
      })
    );
    showToast(`Progress logged: ${completedUnits} units finished.`, 'info', 'Counter Updated');
  };

  const submitTaskForAudit = (taskId: string, note?: string, proofPhotoUrl?: string) => {
    const task = skillPartnerTasks.find((t) => t.id === taskId);
    if (!task) return;

    setSkillPartnerTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: 'Submitted',
              completedUnits: t.quantity,
              artisanNote: note || t.artisanNote,
              proofPhotoUrl: proofPhotoUrl || t.proofPhotoUrl,
              submittedAt: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
            }
          : t
      )
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        timestamp: 'Just now',
        targetRole: 'builder',
        title: 'Artisan Task Submitted for Quality Check',
        message: `${task.productTitle} (${task.quantity} units) submitted by Kalsoom Bibi. Ready for 6-point physical audit.`,
        read: false,
        actionUrl: '/orders',
        type: 'action_required',
      },
      ...prev,
    ]);

    showToast('Task submitted for 6-point physical audit! Connector Fatima will collect.', 'success', 'Audit Ready');
  };

  const updateTaskStatus = (taskId: string, status: SkillPartnerTaskStatus) => {
    setSkillPartnerTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
    showToast(`Task status updated to ${status}.`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentUser,
        setCurrentUser,
        currentRole,
        setCurrentRole,
        switchRole,
        demoMode,
        setDemoMode,
        isRealMode,
        setIsRealMode,
        resetDemo,
        resetToDemoData,

        selectedProduct,
        setSelectedProduct,
        selectedOrderId,
        setSelectedOrderId,

        products,
        orders,
        batches,
        payments: ledgerEntries,
        ledgerEntries,
        payouts,
        skillPartners,
        businessBuilders,
        connectors,
        patrons,
        citizens: patrons,
        messages,
        notifications,
        impactMetrics,
        metrics: impactMetrics,
        qualityChecks,
        connectorTasks,
        skillPartnerTasks,
        auditLogs,

        toasts,
        addToast,
        dismissToast,
        showToast,
        toastMessage,

        confirmDialog,
        openConfirmDialog,
        closeConfirmDialog,

        isSearchOpen,
        setIsSearchOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,

        registeredAccounts,
        registerAccount,
        loginAccount,
        logoutAccount,

        videoConfig,
        updateVideoConfig,
        customImages,
        hiddenSlideIds,
        addCustomImage,
        updateCustomImage,
        removeCustomImage,
        clearCustomImages,
        toggleHideSlide,
        restoreAllSlides,

        placeOrder,
        submitOrderFeedback,
        acceptOrder,
        clarifyOrRejectOrder,
        assignOrderToArtisan,
        escalateOrder,
        updateOrderWorkflowStatus,
        allocateOrderToBatch,
        createProductionBatch,
        advanceBatchStatus,
        runQualityVerification,
        dispatchOrder,
        markOrderDelivered,
        releaseArtisanPayout,
        addNewProduct,
        updateProduct,
        updateProductStatus,
        updateOrderStatus,
        confirmOrder,
        assignTaskToPartner,
        addNewSkillPartner,
        recordBuilderFeedbackAction,
        runAiDemandAnalysis,
        incrementBatchProgress,
        requestConnectorMaterialHelp,
        completeConnectorTask,
        markBatchMaterialsDelivered,

        acceptAssignedTask,
        updateTaskProgress,
        submitTaskForAudit,
        updateTaskStatus,

        markNotificationRead,
        markAllNotificationsRead,
        sendMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
