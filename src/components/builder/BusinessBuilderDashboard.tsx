import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Order,
  ProductionBatch,
  ProductCategory,
  Product,
  SkillPartnerProfile,
  OrderStatus,
  ProductStatus,
} from '../../types';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { StatCard } from '../ui/StatCard';
import { StatusBadge } from '../ui/StatusBadge';
import { PageHeader } from '../ui/PageHeader';
import { CreateProductModal } from './modals/CreateProductModal';
import { EditProductModal } from './modals/EditProductModal';
import { CreateBatchModal } from './modals/CreateBatchModal';
import { AllocateOrderModal } from './modals/AllocateOrderModal';
import { QualityAuditModal } from './modals/QualityAuditModal';
import { AddSkillPartnerModal } from './modals/AddSkillPartnerModal';
import { AssignWorkModal } from './modals/AssignWorkModal';
import { MessagePartnerModal } from './modals/MessagePartnerModal';
import { ViewPartnerProfileModal } from './modals/ViewPartnerProfileModal';
import { ViewOrderModal } from './modals/ViewOrderModal';
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  Plus,
  DollarSign,
  Truck,
  Sparkles,
  ClipboardCheck,
  ShieldCheck,
  UserCheck,
  TrendingUp,
  MessageSquare,
  Clock,
  Brain,
  ShoppingBag,
  Package,
  Users,
  Search,
  Filter,
  UserPlus,
  ChevronRight,
  ArrowRight,
  AlertTriangle,
  Send,
  Eye,
  Edit,
  Play,
  Pause,
  Archive,
  Award,
  Zap,
} from 'lucide-react';
import { OFFICIAL_VISUAL_LIBRARY } from '../../data/visualLibrary';

interface BusinessBuilderDashboardProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

type BuilderTabKey = 'overview' | 'orders' | 'people' | 'products' | 'batches' | 'insights';

export const BusinessBuilderDashboard: React.FC<BusinessBuilderDashboardProps> = ({
  activeTab: propTab,
  setActiveTab: setPropTab,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    orders,
    batches,
    skillPartners,
    products,
    ledgerEntries,
    metrics,
    confirmOrder,
    allocateOrderToBatch,
    advanceBatchStatus,
    dispatchOrder,
    markOrderDelivered,
    releaseArtisanPayout,
    updateProductStatus,
    updateOrderStatus,
    incrementBatchProgress,
    runAiDemandAnalysis,
    showToast,
  } = useApp();

  // Tab synchronization with URL search param
  const urlTab = searchParams.get('tab') as BuilderTabKey | null;
  const initialTab: BuilderTabKey =
    urlTab && ['overview', 'orders', 'people', 'products', 'batches', 'insights'].includes(urlTab)
      ? urlTab
      : propTab === 'orders' || propTab === 'people' || propTab === 'products' || propTab === 'batches' || propTab === 'insights'
      ? (propTab as BuilderTabKey)
      : 'overview';

  const [currentTab, setCurrentTab] = useState<BuilderTabKey>(initialTab);

  const handleTabChange = (tab: BuilderTabKey) => {
    setCurrentTab(tab);
    setSearchParams({ tab });
    if (setPropTab) setPropTab(tab);
  };

  // Modals state
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [showCreateBatchModal, setShowCreateBatchModal] = useState(false);
  const [allocatingOrder, setAllocatingOrder] = useState<Order | null>(null);
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [assigningPartner, setAssigningPartner] = useState<SkillPartnerProfile | null>(null);
  const [messagingPartner, setMessagingPartner] = useState<SkillPartnerProfile | null>(null);
  const [viewingPartner, setViewingPartner] = useState<SkillPartnerProfile | null>(null);

  // Orders Filter & Search
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | string>('All');

  // AI Demand Analysis
  const [aiReport, setAiReport] = useState<{ recommendations: string[]; projectedRevenuePKR: number } | null>(null);

  // Computed metrics
  const totalRevenuePKR = orders.reduce((sum, o) => sum + o.totalPKR, 0);
  const directArtisanPaidPKR = orders
    .filter((o) => o.payoutReleased)
    .reduce((sum, o) => sum + o.payoutAmountPKR, 0);
  const totalArtisanSharePKR = orders.reduce((sum, o) => sum + o.payoutAmountPKR, 0);
  const averageArtisanSplitPercent = totalRevenuePKR > 0 ? Math.round((totalArtisanSharePKR / totalRevenuePKR) * 100) : 70;

  // Urgent triage items
  const pendingOrders = orders.filter((o) => o.status === 'placed' || o.status === 'new');
  const confirmedUnallocated = orders.filter((o) => o.status === 'confirmed' || (!o.batchId && o.status !== 'delivered' && o.status !== 'completed'));
  const qualityCheckOrders = orders.filter((o) => o.status === 'quality_check' || o.status === 'quality_verified');
  const readyToDispatchOrders = orders.filter((o) => o.status === 'quality_verified' && !o.payoutReleased);
  const deliveredAwaitingEscrow = orders.filter((o) => o.status === 'delivered' && !o.payoutReleased);

  const urgentActionsCount = pendingOrders.length + confirmedUnallocated.length + qualityCheckOrders.length + deliveredAwaitingEscrow.length;

  // Orders normalization and filtering
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      orderSearchQuery === '' ||
      o.trackingNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.productTitle.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerCity.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.skillPartnerName.toLowerCase().includes(orderSearchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (orderStatusFilter === 'All') return true;

    // Map internal status representations
    const normalizedFilter = orderStatusFilter.toLowerCase().replace(' ', '_');
    if (normalizedFilter === 'new') return o.status === 'new' || o.status === 'placed';
    if (normalizedFilter === 'confirmed') return o.status === 'confirmed';
    if (normalizedFilter === 'allocated') return o.status === 'allocated' || o.status === 'reviewed_batched';
    if (normalizedFilter === 'in_production') return o.status === 'in_production';
    if (normalizedFilter === 'quality_check') return o.status === 'quality_check' || o.status === 'quality_verified';
    if (normalizedFilter === 'dispatched') return o.status === 'dispatched';
    if (normalizedFilter === 'delivered') return o.status === 'delivered';
    if (normalizedFilter === 'completed') return o.status === 'completed' || (o.status === 'delivered' && o.payoutReleased);

    return o.status === orderStatusFilter;
  });

  const handleRunAiForecast = () => {
    const report = runAiDemandAnalysis();
    setAiReport(report);
    showToast('AI Demand Model updated with latest cluster signals.', 'success', 'AI Forecast Ready');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full font-sans space-y-7">
      {/* 1. OPERATIONS COMMAND PAGE HEADER */}
      <PageHeader
        kicker="Business Builder Command Center"
        roleBadge="Zainab Malik · Enterprise Operations Lead"
        title="Enterprise Management & Closed-Loop Control"
        description="Unified command: oversee revenue, aggregate demand into production batches, verify quality checkpoints, and distribute direct artisan earnings without context switching."
        primaryAction={
          <Button
            variant="executiveGreen"
            leftIcon={<Plus className="w-4 h-4 text-white" />}
            onClick={() => setShowCreateBatchModal(true)}
          >
            Create Batch
          </Button>
        }
        secondaryActions={
          <Button
            variant="outline"
            leftIcon={<Sparkles className="w-4 h-4 text-[#01411C]" />}
            onClick={() => setShowCreateProductModal(true)}
          >
            Create Product
          </Button>
        }
      />

      {/* 2. QUICK ACTIONS BAR (Mandated by Section: Quick Actions) */}
      <div className="bg-white rounded-2xl p-3 border-2 border-stone-200/90 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-extrabold uppercase tracking-wider text-[#718579] px-2">
          Quick Actions:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {/* Create Product */}
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#01411C]" />}
            onClick={() => setShowCreateProductModal(true)}
          >
            Create Product
          </Button>

          {/* Create Batch */}
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Layers className="w-3.5 h-3.5 text-[#01411C]" />}
            onClick={() => setShowCreateBatchModal(true)}
          >
            Create Batch
          </Button>

          {/* View Orders */}
          <Button
            size="sm"
            variant="outline"
            leftIcon={<ShoppingBag className="w-3.5 h-3.5 text-[#01411C]" />}
            onClick={() => handleTabChange('orders')}
          >
            View Orders ({orders.length})
          </Button>

          {/* Add Skill Partner */}
          <Button
            size="sm"
            variant="outline"
            leftIcon={<UserPlus className="w-3.5 h-3.5 text-[#01411C]" />}
            onClick={() => setShowAddPartnerModal(true)}
          >
            Add Skill Partner
          </Button>

          {/* Review Quality */}
          <Button
            size="sm"
            variant="outline"
            leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-amber-700" />}
            onClick={() => {
              if (qualityCheckOrders.length > 0) {
                setInspectingOrder(qualityCheckOrders[0]);
              } else {
                showToast('All active batches have completed quality signoff.', 'info', 'Quality Clean');
              }
            }}
          >
            Review Quality ({qualityCheckOrders.length})
          </Button>

          {/* View Payments */}
          <Button
            size="sm"
            variant="outline"
            leftIcon={<DollarSign className="w-3.5 h-3.5 text-[#01411C]" />}
            onClick={() => navigate('/payments')}
          >
            View Payments
          </Button>
        </div>
      </div>

      {/* 3. WORKSPACE NAVIGATION TABS (No screen jumping needed) */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => handleTabChange('overview')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            currentTab === 'overview'
              ? 'bg-[#01411C] text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Command Overview</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            currentTab === 'orders'
              ? 'bg-[#01411C] text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders Management</span>
          <span className={`px-2 py-0.5 text-xs rounded-full font-mono ${
            currentTab === 'orders' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
          }`}>
            {orders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('people')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            currentTab === 'people'
              ? 'bg-[#01411C] text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Skill Partners (People)</span>
          <span className={`px-2 py-0.5 text-xs rounded-full font-mono ${
            currentTab === 'people' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
          }`}>
            {skillPartners.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('products')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            currentTab === 'products'
              ? 'bg-[#01411C] text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products Catalog</span>
          <span className={`px-2 py-0.5 text-xs rounded-full font-mono ${
            currentTab === 'products' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
          }`}>
            {products.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('batches')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            currentTab === 'batches'
              ? 'bg-[#01411C] text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Production Batches</span>
          <span className={`px-2 py-0.5 text-xs rounded-full font-mono ${
            currentTab === 'batches' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
          }`}>
            {batches.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('insights')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            currentTab === 'insights'
              ? 'bg-[#01411C] text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Business Insights</span>
        </button>
      </div>

      {/* ========================================================== */}
      {/* 4. TAB: COMMAND OVERVIEW (Exact Dashboard Priority Order)  */}
      {/* ========================================================== */}
      {currentTab === 'overview' && (
        <div className="space-y-8">
          {/* SECTION PRIORITY 1: Revenue | Orders | Active Women | Production | Pending Actions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#718579]">
                Enterprise Executive Telemetry
              </h3>
              <span className="text-[11px] font-bold text-[#01411C]">
                Closed-Loop Verified
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
              {/* Metric 1: Revenue */}
              <StatCard
                label="Total Revenue"
                value={`PKR ${totalRevenuePKR.toLocaleString()}`}
                sublabel={`~${averageArtisanSplitPercent}% Direct Artisan Split`}
                variant="executiveGreen"
                icon={<DollarSign className="w-5 h-5 text-white" />}
              />

              {/* Metric 2: Orders */}
              <StatCard
                label="Total Orders"
                value={orders.length}
                sublabel={`${orders.filter((o) => o.status === 'delivered' || o.status === 'completed').length} Delivered`}
                variant="default"
                icon={<ShoppingBag className="w-5 h-5 text-stone-700" />}
              />

              {/* Metric 3: Active Women */}
              <StatCard
                label="Active Women"
                value={skillPartners.length}
                sublabel="Across 4 craft clusters"
                variant="lightGreen"
                icon={<Users className="w-5 h-5 text-[#01411C]" />}
              />

              {/* Metric 4: Production */}
              <StatCard
                label="Active Production"
                value={`${batches.filter((b) => b.status !== 'ready_dispatch').length} Batches`}
                sublabel={`${batches.reduce((acc, b) => acc + b.completedUnits, 0)} Units Crafted`}
                variant="default"
                icon={<Layers className="w-5 h-5 text-stone-700" />}
              />

              {/* Metric 5: Pending Actions */}
              <StatCard
                label="Pending Actions"
                value={urgentActionsCount}
                sublabel="Immediate triage required"
                variant="ochre"
                icon={<AlertCircle className="w-5 h-5 text-amber-700" />}
              />
            </div>
          </div>

          {/* SECTION PRIORITY 2: Needs Attention */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-extrabold text-[#1A2E22]">
                  Needs Attention ({urgentActionsCount})
                </h3>
              </div>
              <span className="text-xs text-[#4A5D52]">
                Incoming orders, QC signoffs & cluster actions
              </span>
            </div>

            {urgentActionsCount === 0 ? (
              <div className="p-6 bg-white rounded-3xl border border-stone-200 text-center text-xs text-stone-500">
                All production flows, orders, and quality checks are current! No pending bottlenecks.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Unallocated incoming orders */}
                {pendingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 bg-white rounded-3xl border-2 border-amber-300 shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                          Unallocated Order
                        </span>
                        <span className="font-mono text-xs font-bold text-stone-900">
                          {order.trackingNumber}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-[#1A2E22]">{order.productTitle}</h4>
                      <p className="text-xs text-[#4A5D52] mt-0.5">
                        Citizen: <strong>{order.customerName}</strong> ({order.customerCity}) · Qty: {order.quantity}
                      </p>
                      <p className="text-xs font-bold text-[#01411C] font-mono mt-1">
                        PKR {order.totalPKR.toLocaleString()} · Artisan Share: PKR {order.payoutAmountPKR.toLocaleString()}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="executiveGreen"
                        className="flex-1"
                        onClick={() => setAllocatingOrder(order)}
                      >
                        Allocate to Batch
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => confirmOrder(order.id)}
                      >
                        Confirm
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Orders in Quality Check */}
                {qualityCheckOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 bg-white rounded-3xl border-2 border-emerald-300 shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Quality Audit Ready
                        </span>
                        <span className="font-mono text-xs font-bold text-stone-900">
                          {order.trackingNumber}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-[#1A2E22]">{order.productTitle}</h4>
                      <p className="text-xs text-[#4A5D52] mt-0.5">
                        Crafted by: <strong>{order.skillPartnerName}</strong> ({order.skillPartnerCode})
                      </p>
                      <p className="text-[11px] text-stone-500 mt-1">
                        Connector Fatima verified doorstep stitch tension. Requires builder signoff.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="executiveGreen"
                        className="flex-1"
                        leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                        onClick={() => setInspectingOrder(order)}
                      >
                        Sign Off Quality Check
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setViewingOrder(order)}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Delivered orders awaiting escrow payout */}
                {deliveredAwaitingEscrow.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 bg-[#F0FDF4] rounded-3xl border-2 border-[#BBF7D0] shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#01411C] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                          Delivered · Payout Queued
                        </span>
                        <span className="font-mono text-xs font-bold text-stone-900">
                          {order.trackingNumber}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-[#1A2E22]">{order.productTitle}</h4>
                      <p className="text-xs text-[#4A5D52] mt-0.5">
                        Delivery confirmed at {order.customerCity}. Escrow release ready.
                      </p>
                      <p className="text-xs font-bold text-[#01411C] font-mono mt-1">
                        Disburse: PKR {order.payoutAmountPKR.toLocaleString()} to {order.skillPartnerName}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#BBF7D0]/60 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="executiveGreen"
                        className="flex-1"
                        leftIcon={<DollarSign className="w-3.5 h-3.5" />}
                        onClick={() => releaseArtisanPayout(order.id)}
                      >
                        Release Direct Payout
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION PRIORITY 3: Production */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-[#1A2E22]">
                  Active Cluster Production ({batches.length})
                </h3>
                <p className="text-xs text-[#4A5D52]">
                  Batched craft synthesis, raw material delivery & progress across districts
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                leftIcon={<Plus className="w-3.5 h-3.5 text-[#01411C]" />}
                onClick={() => setShowCreateBatchModal(true)}
              >
                Form New Batch
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {batches.map((batch) => {
                const progressPct = Math.round((batch.completedUnits / batch.targetUnits) * 100);

                return (
                  <Card key={batch.id} className="p-5 border-2 border-stone-200 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
                          {batch.batchCode}
                        </span>
                        <StatusBadge status={batch.status} type="batch" />
                      </div>

                      <h4 className="text-base font-extrabold text-[#1A2E22]">{batch.title}</h4>

                      <p className="text-xs text-[#4A5D52]">
                        Lead: <strong>{batch.skillPartnerName}</strong> ({batch.city}) · Connector: {batch.connectorName}
                      </p>

                      {/* Progress Meter */}
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-stone-600">Completion</span>
                          <span className="font-mono text-[#01411C]">
                            {batch.completedUnits} / {batch.targetUnits} Units ({progressPct}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${progressPct}%` }}
                            className="bg-[#01411C] h-full rounded-full transition-all"
                          />
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 text-[11px] text-stone-600 flex justify-between">
                        <span>Due: <strong>{batch.deadline}</strong></span>
                        <span className="font-mono font-bold text-[#01411C]">
                          PKR {batch.totalBatchPayPKR.toLocaleString()} Pay
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1"
                        onClick={() => incrementBatchProgress(batch.id)}
                        disabled={batch.completedUnits >= batch.targetUnits}
                      >
                        +1 Unit Progress
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTabChange('batches')}
                      >
                        Manage
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* SECTION PRIORITY 4: Recent Orders */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-[#1A2E22]">
                  Recent Orders & Fulfillment Stream
                </h3>
                <p className="text-xs text-[#4A5D52]">
                  Real-time marketplace orders, customer verification, and direct compensation
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleTabChange('orders')}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                View Full Orders Manager ({orders.length})
              </Button>
            </div>

            {/* Orders summary table */}
            <Card className="overflow-hidden border-2 border-stone-200">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F6] border-b border-stone-200 text-[#718579] uppercase tracking-wider font-extrabold text-[10px]">
                    <tr>
                      <th className="p-3.5">Tracking #</th>
                      <th className="p-3.5">Product & Units</th>
                      <th className="p-3.5">Citizen</th>
                      <th className="p-3.5">Producer Cluster</th>
                      <th className="p-3.5 text-right">Total Price</th>
                      <th className="p-3.5 text-right">Artisan Pay</th>
                      <th className="p-3.5 text-center">Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-sans">
                    {orders.slice(0, 6).map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-stone-900">
                          {order.trackingNumber}
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-stone-900 block truncate max-w-[200px]">
                            {order.productTitle}
                          </span>
                          <span className="text-[11px] text-stone-500">
                            {order.quantity} {order.quantity === 1 ? 'Unit' : 'Units'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-medium text-stone-800 block">{order.customerName}</span>
                          <span className="text-[11px] text-stone-500">{order.customerCity}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-medium text-stone-800 block">{order.skillPartnerName}</span>
                          <span className="font-mono text-[10px] text-[#01411C]">{order.skillPartnerCode}</span>
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold text-stone-900">
                          PKR {order.totalPKR.toLocaleString()}
                        </td>
                        <td className="p-3.5 text-right font-mono font-extrabold text-[#01411C]">
                          PKR {order.payoutAmountPKR.toLocaleString()}
                        </td>
                        <td className="p-3.5 text-center">
                          <StatusBadge status={order.status} type="order" />
                        </td>
                        <td className="p-3.5 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setViewingOrder(order)}
                          >
                            Inspect
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* SECTION PRIORITY 5: Growth & Impact */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-[#1A2E22]">
                  Enterprise Growth & Direct Economic Impact
                </h3>
                <p className="text-xs text-[#4A5D52]">
                  Rigorous operational metrics on retention, quality compliance, and household income growth
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                leftIcon={<Brain className="w-3.5 h-3.5 text-[#01411C]" />}
                onClick={handleRunAiForecast}
              >
                Run AI Demand Model
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-5 border-2 border-stone-200 space-y-2">
                <span className="text-[11px] uppercase font-bold text-[#718579] block">
                  Repeat Citizen Rate
                </span>
                <span className="text-2xl font-extrabold font-mono text-[#01411C]">
                  {metrics.repeatPatronsRate}%
                </span>
                <p className="text-xs text-[#4A5D52]">
                  High customer trust driven by physical artisan attribution and hand-signed authenticity cards.
                </p>
              </Card>

              <Card className="p-5 border-2 border-stone-200 space-y-2">
                <span className="text-[11px] uppercase font-bold text-[#718579] block">
                  Quality Audit Compliance
                </span>
                <span className="text-2xl font-extrabold font-mono text-[#01411C]">
                  {metrics.verifiedQualityRate}%
                </span>
                <p className="text-xs text-[#4A5D52]">
                  Zero returns across 394 delivered orders. 100% pre-dispatch doorstep audit pass rate.
                </p>
              </Card>

              <Card className="p-5 border-2 border-stone-200 space-y-2">
                <span className="text-[11px] uppercase font-bold text-[#718579] block">
                  Direct Income Disbursed
                </span>
                <span className="text-2xl font-extrabold font-mono text-[#01411C]">
                  PKR {metrics.totalIncomeGeneratedPKR.toLocaleString()}
                </span>
                <p className="text-xs text-[#4A5D52]">
                  Average household monthly income increased by 3.8x baseline across Multan, Sargodha & Swat.
                </p>
              </Card>
            </div>

            {/* AI Report Card if triggered */}
            {aiReport && (
              <div className="p-6 bg-[#F0FDF4] rounded-3xl border-2 border-[#BBF7D0] space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#01411C]" />
                    <h4 className="font-extrabold text-[#01411C] text-sm">
                      AI Demand & Capacity Recommendations
                    </h4>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#01411C]">
                    Projected Revenue: +PKR {aiReport.projectedRevenuePKR.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-[#1A2E22]">
                  {aiReport.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="font-bold text-[#01411C]">✓</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 5. TAB: ORDERS MANAGEMENT (Search, Filter 8 Statuses, Track)*/}
      {/* ========================================================== */}
      {currentTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-[#1A2E22]">
                Orders Management & Dispatch Queue
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5D52]">
                Track order lifecycle across all 8 pipeline statuses: New, Confirmed, Allocated, In Production, Quality Check, Dispatched, Delivered, and Completed.
              </p>
            </div>
            <Button
              variant="executiveGreen"
              size="sm"
              leftIcon={<Layers className="w-4 h-4 text-white" />}
              onClick={() => setShowCreateBatchModal(true)}
            >
              Batch Allocation
            </Button>
          </div>

          {/* Search Bar & 8 Status Filter Pills */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="Search orders by tracking #, customer name, product, city, or artisan..."
                className="w-full pl-10 pr-4 py-2.5 text-xs border border-stone-300 rounded-2xl bg-white focus:outline-none focus:border-[#01411C]"
              />
            </div>

            {/* Filter Pills (All 8 Statuses) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {[
                'All',
                'New',
                'Confirmed',
                'Allocated',
                'In Production',
                'Quality Check',
                'Dispatched',
                'Delivered',
                'Completed',
              ].map((st) => {
                const count =
                  st === 'All'
                    ? orders.length
                    : orders.filter((o) => {
                        const s = st.toLowerCase().replace(' ', '_');
                        if (s === 'new') return o.status === 'new' || o.status === 'placed';
                        if (s === 'confirmed') return o.status === 'confirmed';
                        if (s === 'allocated') return o.status === 'allocated' || o.status === 'reviewed_batched';
                        if (s === 'in_production') return o.status === 'in_production';
                        if (s === 'quality_check') return o.status === 'quality_check' || o.status === 'quality_verified';
                        if (s === 'dispatched') return o.status === 'dispatched';
                        if (s === 'delivered') return o.status === 'delivered';
                        if (s === 'completed') return o.status === 'completed' || (o.status === 'delivered' && o.payoutReleased);
                        return false;
                      }).length;

                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      orderStatusFilter === st
                        ? 'bg-[#01411C] text-white shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <span>{st}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        orderStatusFilter === st
                          ? 'bg-white/20 text-white'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Orders Detailed Table */}
          <Card className="overflow-hidden border-2 border-stone-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F6] border-b border-stone-200 text-[#718579] uppercase tracking-wider font-extrabold text-[10px]">
                  <tr>
                    <th className="p-3.5">Tracking #</th>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Customer & City</th>
                    <th className="p-3.5">Producer</th>
                    <th className="p-3.5 text-right">Price</th>
                    <th className="p-3.5 text-right">Direct Pay</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-stone-400">
                        No orders match the selected search or filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-stone-900">
                          {order.trackingNumber}
                          <span className="block text-[10px] text-stone-400 font-normal font-sans">
                            {order.createdAt}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-stone-900 block truncate max-w-[220px]">
                            {order.productTitle}
                          </span>
                          <span className="text-[11px] text-stone-500">
                            {order.quantity} Units · Batch: {order.batchId || 'Unallocated'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-medium text-stone-800 block">{order.customerName}</span>
                          <span className="text-[11px] text-stone-500">{order.customerCity}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-medium text-stone-800 block">{order.skillPartnerName}</span>
                          <span className="font-mono text-[10px] text-[#01411C]">{order.skillPartnerCode}</span>
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold text-stone-900">
                          PKR {order.totalPKR.toLocaleString()}
                        </td>
                        <td className="p-3.5 text-right font-mono font-extrabold text-[#01411C]">
                          PKR {order.payoutAmountPKR.toLocaleString()}
                        </td>
                        <td className="p-3.5 text-center">
                          <StatusBadge status={order.status} type="order" />
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {/* Inline status update */}
                            <select
                              value={
                                order.status === 'placed'
                                  ? 'new'
                                  : order.status === 'reviewed_batched'
                                  ? 'allocated'
                                  : order.status === 'quality_verified'
                                  ? 'quality_check'
                                  : order.status
                              }
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                              className="px-2 py-1 text-[11px] font-bold rounded-lg border border-stone-200 bg-white text-stone-700 hover:border-[#01411C] focus:outline-none cursor-pointer"
                              title="Update order status directly"
                            >
                              <option value="new">New</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="allocated">Allocated</option>
                              <option value="in_production">In Production</option>
                              <option value="quality_check">Quality Check</option>
                              <option value="dispatched">Dispatched</option>
                              <option value="delivered">Delivered</option>
                              <option value="completed">Completed</option>
                            </select>

                            {(order.status === 'placed' || order.status === 'new') && (
                              <Button
                                size="sm"
                                variant="executiveGreen"
                                onClick={() => confirmOrder(order.id)}
                              >
                                Confirm
                              </Button>
                            )}

                            {(!order.batchId || order.status === 'confirmed') && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setAllocatingOrder(order)}
                              >
                                Allocate
                              </Button>
                            )}

                            {(order.status === 'quality_check' || order.status === 'quality_verified') && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setInspectingOrder(order)}
                              >
                                QC
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setViewingOrder(order)}
                            >
                              Details
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================== */}
      {/* 6. TAB: PEOPLE (SKILL PARTNERS DIRECTORY)                  */}
      {/* ========================================================== */}
      {currentTab === 'people' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-[#1A2E22]">
                Skill Partners & Producer Directory
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5D52]">
                Monitor artisan workloads, verified lifetime compensation, and active cluster capabilities.
              </p>
            </div>
            <Button
              variant="executiveGreen"
              size="sm"
              leftIcon={<UserPlus className="w-4 h-4 text-white" />}
              onClick={() => setShowAddPartnerModal(true)}
            >
              Add Skill Partner
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {skillPartners.map((partner) => {
              const activeBatchesForPartner = batches.filter((b) => b.skillPartnerId === partner.id);
              const totalActiveUnits = activeBatchesForPartner.reduce((sum, b) => sum + (b.targetUnits - b.completedUnits), 0);

              return (
                <div
                  key={partner.id}
                  className="bg-white rounded-3xl border-2 border-stone-200 hover:border-[#01411C] transition-all p-6 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            partner.avatarUrl ||
                            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
                          }
                          alt={partner.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-stone-200"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#F0FDF4] text-[#01411C] border border-[#BBF7D0]">
                              {partner.anonymizedCode}
                            </span>
                            <span className="text-[10px] font-bold uppercase text-stone-500">
                              {partner.city}
                            </span>
                          </div>
                          <h3 className="text-lg font-extrabold text-[#1A2E22]">{partner.name}</h3>
                          <p className="text-xs font-semibold text-[#01411C]">{partner.skillTitle}</p>
                        </div>
                      </div>

                      {/* Status */}
                      <span className="text-xs font-extrabold text-[#01411C] bg-[#F0FDF4] px-3 py-1 rounded-full border border-[#BBF7D0] shrink-0">
                        {totalActiveUnits > 0 ? 'Active & Producing' : 'Capacity Available'}
                      </span>
                    </div>

                    {/* Skills & Specialty */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#718579] block">
                        Master Craft Skills & Technique
                      </span>
                      <p className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-200/70">
                        {partner.specialty}
                      </p>
                    </div>

                    {/* Financial & Production Tickers (Active Work & Earnings) */}
                    <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                      <div className="p-3 bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0]">
                        <span className="text-[10px] uppercase font-bold text-[#718579] block">
                          Lifetime Earnings
                        </span>
                        <span className="font-mono text-base font-extrabold text-[#01411C] tabular-nums block">
                          PKR {partner.totalEarningsPKR.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-emerald-800 font-medium">
                          +PKR {partner.pendingPayoutPKR.toLocaleString()} in escrow
                        </span>
                      </div>

                      <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                        <span className="text-[10px] uppercase font-bold text-[#718579] block">
                          Active Work
                        </span>
                        <span className="font-mono text-base font-extrabold text-stone-900 tabular-nums block">
                          {activeBatchesForPartner.length} Batches
                        </span>
                        <span className="text-[10px] text-stone-600 font-medium">
                          {totalActiveUnits} units in production queue
                        </span>
                      </div>
                    </div>

                    {/* Recent activity */}
                    <div className="p-2.5 rounded-xl bg-stone-100/70 border border-stone-200 text-[11px] text-stone-700 space-y-1">
                      <div className="flex items-center justify-between font-bold text-stone-800">
                        <span>Recent Activity</span>
                        <span className="text-[10px] text-stone-500 font-normal">Active Cycle</span>
                      </div>
                      <p className="text-stone-600 text-[11px]">
                        Field Coordinator {partner.assignedConnectorName} logged home inspection · Quality score {partner.rating}/5.0 ★
                      </p>
                    </div>
                  </div>

                  {/* Actions Area (View Profile, Assign Work, Message) */}
                  <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => setViewingPartner(partner)}
                    >
                      View Profile
                    </Button>

                    <Button
                      size="sm"
                      variant="executiveGreen"
                      className="flex-1"
                      leftIcon={<Plus className="w-3.5 h-3.5 text-white" />}
                      onClick={() => setAssigningPartner(partner)}
                    >
                      Assign Work
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<MessageSquare className="w-3.5 h-3.5 text-stone-600" />}
                      onClick={() => setMessagingPartner(partner)}
                    >
                      Message
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 7. TAB: PRODUCTS CATALOG & LIFECYCLE                       */}
      {/* ========================================================== */}
      {currentTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-[#1A2E22]">
                Enterprise Product Catalog
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5D52]">
                Publish, edit, pause, and archive craft product definitions across HUNAR, RASOI, KNOWLEDGE, and SERVICES.
              </p>
            </div>
            <Button
              variant="executiveGreen"
              size="sm"
              leftIcon={<Plus className="w-4 h-4 text-white" />}
              onClick={() => setShowCreateProductModal(true)}
            >
              Create Product
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => {
              const status = product.status || 'published';

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border-2 border-stone-200 hover:border-[#01411C] transition-all p-5 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header Image & Availability / Status Badges */}
                    <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                      <img
                        src={product.imageUrl || product.images?.[0] || 'https://images.unsplash.com/photo-1606744888344-493238955de0?auto=format&fit=crop&w=800&q=80'}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-900/80 text-white backdrop-blur-xs">
                          {product.category}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 text-stone-800 shadow-xs">
                          {product.availability === 'in_stock'
                            ? 'In Stock'
                            : product.availability === 'seasonal'
                            ? 'Seasonal'
                            : product.availability === 'out_of_stock'
                            ? 'Out of Stock'
                            : 'Made to Order'}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs ${
                            status === 'published'
                              ? 'bg-emerald-600 text-white'
                              : status === 'paused'
                              ? 'bg-amber-600 text-white'
                              : status === 'draft'
                              ? 'bg-stone-600 text-white'
                              : 'bg-red-600 text-white'
                          }`}
                        >
                          {status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Product Name & Description */}
                    <div>
                      <h3 className="text-base font-extrabold text-[#1A2E22] leading-snug">
                        {product.title}
                      </h3>
                      <p className="text-xs text-[#4A5D52] line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    </div>

                    {/* Price & Producer */}
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-500 block">
                          Market Price
                        </span>
                        <span className="font-mono text-base font-extrabold text-stone-900">
                          PKR {product.pricePKR.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-[#01411C] block">
                          Master Producer
                        </span>
                        <span className="font-bold text-stone-800">
                          {product.producerName}
                        </span>
                        <span className="font-mono text-[10px] text-stone-500 block">
                          {product.producerCode}
                        </span>
                      </div>
                    </div>

                    {/* Operational Details: Capacity & Production Time */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 bg-stone-50/70 p-2.5 rounded-xl border border-stone-200/60">
                      <div>
                        Monthly Capacity: <strong className="text-stone-900">{product.capacityMonthly || 25} Units</strong>
                      </div>
                      <div>
                        Production Time: <strong className="text-stone-900">{product.productionTimeDays || 7} Days</strong>
                      </div>
                    </div>

                    {/* Artisan Story */}
                    {product.story && (
                      <div className="p-2.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[11px] text-[#01411C]">
                        <span className="font-bold block text-[10px] uppercase tracking-wider text-[#01411C] mb-0.5">
                          Artisan Heritage Story
                        </span>
                        <p className="line-clamp-2 leading-relaxed text-stone-700">
                          {product.story}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar: Edit + 1-Click Lifecycle Statuses (Draft, Publish, Pause, Archive) */}
                  <div className="pt-3 border-t border-stone-100 space-y-2">
                    <div className="flex items-center gap-1.5 justify-between">
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<Edit className="w-3.5 h-3.5" />}
                        className="flex-1"
                        onClick={() => setEditingProduct(product)}
                      >
                        Edit Product
                      </Button>

                      {status !== 'published' ? (
                        <Button
                          size="sm"
                          variant="executiveGreen"
                          onClick={() => updateProductStatus(product.id, 'published')}
                        >
                          Publish
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateProductStatus(product.id, 'paused')}
                        >
                          Pause
                        </Button>
                      )}
                    </div>

                    {/* Quick status selector buttons */}
                    <div className="flex items-center justify-between gap-1 pt-1 text-[10px]">
                      <span className="text-stone-400 font-bold uppercase tracking-wider">Set:</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => updateProductStatus(product.id, 'draft')}
                          disabled={status === 'draft'}
                          className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                            status === 'draft' ? 'bg-stone-200 text-stone-800' : 'text-stone-500 hover:bg-stone-100'
                          }`}
                        >
                          Draft
                        </button>
                        <button
                          type="button"
                          onClick={() => updateProductStatus(product.id, 'published')}
                          disabled={status === 'published'}
                          className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                            status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'text-stone-500 hover:bg-stone-100'
                          }`}
                        >
                          Publish
                        </button>
                        <button
                          type="button"
                          onClick={() => updateProductStatus(product.id, 'paused')}
                          disabled={status === 'paused'}
                          className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                            status === 'paused' ? 'bg-amber-100 text-amber-800' : 'text-stone-500 hover:bg-stone-100'
                          }`}
                        >
                          Pause
                        </button>
                        <button
                          type="button"
                          onClick={() => updateProductStatus(product.id, 'archived')}
                          disabled={status === 'archived'}
                          className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                            status === 'archived' ? 'bg-red-100 text-red-800' : 'text-stone-500 hover:bg-stone-100'
                          }`}
                        >
                          Archive
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 8. TAB: PRODUCTION BATCHES (Cluster Synthesis)             */}
      {/* ========================================================== */}
      {currentTab === 'batches' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-[#1A2E22]">
                Production Batches & Cluster Scheduling
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5D52]">
                Consolidate order demand into physical batches for raw material fulfillment and door-to-door quality audit.
              </p>
            </div>
            <Button
              variant="executiveGreen"
              size="sm"
              leftIcon={<Plus className="w-4 h-4 text-white" />}
              onClick={() => setShowCreateBatchModal(true)}
            >
              Form Production Batch
            </Button>
          </div>

          {/* Contextual Cluster Commerce Reference (Karachi Textile Market & Food Enterprise) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-3xl bg-white border border-stone-200 flex items-center gap-4 shadow-2xs">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 relative bg-stone-100 border border-stone-200">
                <img
                  src={OFFICIAL_VISUAL_LIBRARY.textile_market.imageUrl}
                  alt="Karachi Textile Market"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 bg-black/75 text-[8px] text-white px-1 rounded font-mono">
                  Textiles
                </span>
              </div>
              <div className="space-y-1 min-w-0">
                <span className="text-[10px] font-mono font-bold uppercase text-[#01411C] block">
                  Commercial Textile Procurement
                </span>
                <h4 className="text-xs sm:text-sm font-extrabold text-[#1A2E22] truncate">
                  Karachi Resham & Cotton Yardage Batches
                </h4>
                <p className="text-[11px] text-stone-500 line-clamp-2">
                  Standardized handloom lawn and raw silk skeins procured in bulk and distributed via Field Connectors.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-stone-200 flex items-center gap-4 shadow-2xs">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 relative bg-stone-100 border border-stone-200">
                <img
                  src={OFFICIAL_VISUAL_LIBRARY.food_enterprise.imageUrl}
                  alt="Women Food Enterprise"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 bg-black/75 text-[8px] text-white px-1 rounded font-mono">
                  MENUE
                </span>
              </div>
              <div className="space-y-1 min-w-0">
                <span className="text-[10px] font-mono font-bold uppercase text-amber-700 block">
                  HOMECEO MENUE Production Batches
                </span>
                <h4 className="text-xs sm:text-sm font-extrabold text-[#1A2E22] truncate">
                  Scaled Sun-Cured Food Safety & Sterilization
                </h4>
                <p className="text-[11px] text-stone-500 line-clamp-2">
                  Clean-seal glass jars, certified mustard oil, and digital batch logging for artisan home kitchens.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {batches.map((batch) => {
              const progressPct = Math.round((batch.completedUnits / batch.targetUnits) * 100);

              return (
                <Card key={batch.id} className="p-6 border-2 border-stone-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-900 border border-stone-200">
                          {batch.batchCode}
                        </span>
                        <StatusBadge status={batch.status} type="batch" />
                      </div>
                      <h3 className="text-lg font-extrabold text-[#1A2E22]">{batch.title}</h3>
                      <p className="text-xs text-[#4A5D52]">
                        Cluster Lead: <strong>{batch.skillPartnerName}</strong> ({batch.city}) · Connector: {batch.connectorName}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-mono font-extrabold text-[#01411C]">
                        PKR {batch.totalBatchPayPKR.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-stone-500 block">Direct Cluster Pay</span>
                    </div>
                  </div>

                  {/* 3-Step Process Indicator */}
                  <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                    <div
                      className={`p-3 rounded-2xl border ${
                        batch.rawMaterialsDelivered
                          ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#01411C]'
                          : 'bg-stone-50 border-stone-200 text-stone-400'
                      }`}
                    >
                      <span className="text-lg block">📦</span>
                      <span className="font-bold text-[11px] block mt-1">1. Materials</span>
                      <span className="text-[10px] text-stone-500">
                        {batch.rawMaterialsDelivered ? 'Delivered ✓' : 'Awaiting Drop'}
                      </span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl border ${
                        batch.completedUnits > 0
                          ? 'bg-amber-50 border-amber-200 text-amber-950'
                          : 'bg-stone-50 border-stone-200 text-stone-400'
                      }`}
                    >
                      <span className="text-lg block">✂️</span>
                      <span className="font-bold text-[11px] block mt-1">2. Production</span>
                      <span className="text-[10px] text-amber-900 font-bold">
                        {batch.completedUnits}/{batch.targetUnits} Units
                      </span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl border ${
                        batch.completedUnits >= batch.targetUnits
                          ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#01411C]'
                          : 'bg-stone-50 border-stone-200 text-stone-400'
                      }`}
                    >
                      <span className="text-lg block">⭐</span>
                      <span className="font-bold text-[11px] block mt-1">3. QC Ready</span>
                      <span className="text-[10px] text-stone-500">
                        {batch.completedUnits >= batch.targetUnits ? 'Doorstep Audit' : 'In Progress'}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Production Completion</span>
                      <span className="font-mono text-[#01411C]">{progressPct}%</span>
                    </div>
                    <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
                      <div
                        style={{ width: `${progressPct}%` }}
                        className="bg-[#01411C] h-full rounded-full transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <span className="text-xs text-stone-500">
                      Deadline: <strong>{batch.deadline}</strong>
                    </span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => incrementBatchProgress(batch.id)}
                      disabled={batch.completedUnits >= batch.targetUnits}
                    >
                      Finished +1 Unit
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 9. TAB: BUSINESS INSIGHTS & AI DEMAND                      */}
      {/* ========================================================== */}
      {currentTab === 'insights' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-[#1A2E22]">
                Practical Business Insights & Forecasting
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5D52]">
                Sales trends, customer cohorts, partner earnings ratios, and AI-driven production capacity optimization.
              </p>
            </div>
            <Button
              variant="executiveGreen"
              size="sm"
              leftIcon={<Brain className="w-4 h-4 text-white" />}
              onClick={handleRunAiForecast}
            >
              Refresh AI Predictive Model
            </Button>
          </div>

          {/* 6 Key Operational Telemetry Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Sales */}
            <StatCard
              label="Sales (Gross Volume)"
              value={`PKR ${totalRevenuePKR.toLocaleString()}`}
              sublabel="100% cashless escrow settlement"
              variant="executiveGreen"
              icon={<DollarSign className="w-5 h-5 text-white" />}
            />

            {/* 2. Orders */}
            <StatCard
              label="Total Orders"
              value={`${orders.length} Orders`}
              sublabel={`${orders.filter((o) => o.status === 'delivered' || o.status === 'completed').length} Delivered · 0 Returns`}
              variant="default"
              icon={<ShoppingBag className="w-5 h-5 text-stone-700" />}
            />

            {/* 3. Repeat Customers */}
            <StatCard
              label="Repeat Customers"
              value={`${metrics.repeatPatronsRate}%`}
              sublabel="Hand-signed authenticity card trust"
              variant="lightGreen"
              icon={<TrendingUp className="w-5 h-5 text-[#01411C]" />}
            />

            {/* 4. Production Efficiency */}
            <StatCard
              label="Production Efficiency"
              value="4.2 Days"
              sublabel="Average turnaround per batch"
              variant="default"
              icon={<Clock className="w-5 h-5 text-stone-700" />}
            />

            {/* 5. Partner Earnings */}
            <StatCard
              label="Partner Direct Earnings"
              value={`PKR ${totalArtisanSharePKR.toLocaleString()}`}
              sublabel={`~${averageArtisanSplitPercent}% fair direct compensation`}
              variant="ochre"
              icon={<Award className="w-5 h-5 text-amber-800" />}
            />

            {/* 6. Top Products */}
            <StatCard
              label="Top Products"
              value={`${products.length} Products`}
              sublabel="Across HUNAR, RASOI, KNOWLEDGE"
              variant="default"
              icon={<Package className="w-5 h-5 text-stone-700" />}
            />
          </div>

          {/* Top Selling Products */}
          <Card className="p-6 border-2 border-stone-200 space-y-4">
            <CardTitle className="text-base font-extrabold text-[#1A2E22]">
              Top Products Ranked by Citizen Demand & Direct Impact
            </CardTitle>
            <div className="space-y-3">
              {products.slice(0, 4).map((p, idx) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-white border border-stone-300 font-mono font-bold text-stone-800 flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <div>
                      <h5 className="font-extrabold text-stone-900">{p.title}</h5>
                      <p className="text-stone-500 text-[11px]">
                        Category: {p.category} · Master Producer: {p.producerName} ({p.city})
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-stone-900 block">
                      PKR {p.pricePKR.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#01411C] font-semibold">
                      ~70% direct split to artisan
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Demand & Capacity Forecasting Engine */}
          <div className="p-6 bg-[#F0FDF4] rounded-3xl border-2 border-[#BBF7D0] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#01411C] text-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#01411C]">
                    AI Cluster Forecasting & Procurement Recommendations
                  </h4>
                  <p className="text-xs text-[#4A5D52]">
                    Synthesizing incoming patron search traffic, seasonal holidays, and home cluster capacity.
                  </p>
                </div>
              </div>

              <span className="font-mono text-xs font-bold text-[#01411C] bg-white px-3 py-1.5 rounded-xl border border-[#BBF7D0]">
                Projected Next-Cycle Rev: +PKR {(aiReport?.projectedRevenuePKR || 1450000).toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              {(aiReport?.recommendations || [
                'High surge in demand for Multani Kashidakari shawls in Islamabad and Lahore corporate gifting.',
                'Sargodha Achar inventory running low: recommend opening 2 additional home pickle batches.',
                'Cholistan Desert Ralli quilts are outperforming target margin by 14% among diaspora patrons.',
              ]).map((rec, i) => (
                <div key={i} className="p-3.5 bg-white rounded-2xl border border-[#BBF7D0] space-y-1">
                  <span className="text-[10px] font-bold text-[#01411C] uppercase block">
                    Strategic Recommendation #{i + 1}
                  </span>
                  <p className="text-stone-800 leading-relaxed font-medium">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 10. MODAL SUITE (In-place operation without jumping screens)*/}
      {/* ========================================================== */}
      <CreateProductModal
        isOpen={showCreateProductModal}
        onClose={() => setShowCreateProductModal(false)}
      />

      <EditProductModal
        product={editingProduct}
        isOpen={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
      />

      <CreateBatchModal
        isOpen={showCreateBatchModal}
        onClose={() => setShowCreateBatchModal(false)}
      />

      <AllocateOrderModal
        order={allocatingOrder}
        isOpen={Boolean(allocatingOrder)}
        onClose={() => setAllocatingOrder(null)}
      />

      <QualityAuditModal
        order={inspectingOrder}
        isOpen={Boolean(inspectingOrder)}
        onClose={() => setInspectingOrder(null)}
      />

      <AddSkillPartnerModal
        isOpen={showAddPartnerModal}
        onClose={() => setShowAddPartnerModal(false)}
      />

      <AssignWorkModal
        partner={assigningPartner}
        isOpen={Boolean(assigningPartner)}
        onClose={() => setAssigningPartner(null)}
      />

      <MessagePartnerModal
        partner={messagingPartner}
        isOpen={Boolean(messagingPartner)}
        onClose={() => setMessagingPartner(null)}
      />

      <ViewPartnerProfileModal
        partner={viewingPartner}
        isOpen={Boolean(viewingPartner)}
        onClose={() => setViewingPartner(null)}
        onAssignWork={(p) => setAssigningPartner(p)}
        onMessage={(p) => setMessagingPartner(p)}
      />

      <ViewOrderModal
        order={viewingOrder}
        isOpen={Boolean(viewingOrder)}
        onClose={() => setViewingOrder(null)}
        onAllocate={(o) => setAllocatingOrder(o)}
        onReviewQuality={(o) => setInspectingOrder(o)}
      />
    </div>
  );
};
