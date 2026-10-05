import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { StatCard } from '../ui/StatCard';
import { StatusBadge } from '../ui/StatusBadge';
import { PageHeader } from '../ui/PageHeader';
import {
  MapPin,
  CheckCircle2,
  Package,
  ShieldCheck,
  Calendar,
  Phone,
  UserCheck,
  Plus,
  Users,
  Layers,
  Sparkles,
  Search,
  ArrowRight,
  Clock,
  AlertCircle,
  FileText,
  Filter,
} from 'lucide-react';
import { OFFICIAL_VISUAL_LIBRARY } from '../../data/visualLibrary';

interface ConnectorDashboardProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

type ConnectorTabKey = 'field' | 'qc' | 'artisans' | 'batches';

export const ConnectorDashboard: React.FC<ConnectorDashboardProps> = ({
  activeTab: propTab,
  setActiveTab: setPropTab,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    connectorTasks,
    batches,
    skillPartners,
    orders,
    completeConnectorTask,
    markBatchMaterialsDelivered,
    updateOrderWorkflowStatus,
    showToast,
  } = useApp();

  // Normalize active tab from query param or prop
  const tabFromQuery = (searchParams.get('tab') as ConnectorTabKey) || (propTab as ConnectorTabKey) || 'field';
  
  const normalizeTabKey = (tabKey: string): ConnectorTabKey => {
    if (tabKey === 'qc' || tabKey === 'quality' || tabKey === 'audits') return 'qc';
    if (tabKey === 'artisans' || tabKey === 'women' || tabKey === 'visits') return 'artisans';
    if (tabKey === 'batches' || tabKey === 'drops') return 'batches';
    return 'field';
  };

  const activeTab = normalizeTabKey(tabFromQuery);

  const handleTabChange = (newTab: ConnectorTabKey) => {
    if (setPropTab) setPropTab(newTab);
    setSearchParams({ tab: newTab });
  };

  const [selectedBatchForDrop, setSelectedBatchForDrop] = useState<string>('');
  const [dropNotes, setDropNotes] = useState('Raw materials verified and hand-delivered directly to artisan.');
  const [showDropModal, setShowDropModal] = useState(false);

  // Quick visit recording modal
  const [recordingVisitArtisan, setRecordingVisitArtisan] = useState<string | null>(null);
  const [visitPurpose, setVisitPurpose] = useState<'material_drop' | 'quality_audit' | 'safety_check' | 'payment_reconciliation'>('quality_audit');
  const [visitOutcome, setVisitOutcome] = useState<'satisfactory' | 'needs_supplies' | 'revision_requested'>('satisfactory');
  const [visitNotes, setVisitNotes] = useState('Standard physical craft check completed. Work atmosphere dignified and safe.');

  // Filters for lists
  const [searchTerm, setSearchTerm] = useState('');
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const pendingTasks = connectorTasks.filter((t) => t.status === 'pending');
  const completedTasks = connectorTasks.filter((t) => t.status === 'completed');
  const ordersNeedingQC = orders.filter((o) => o.status === 'quality_check');
  const verifiedOrders = orders.filter((o) => o.status === 'quality_verified' || o.qualityStatus === 'verified_passed');

  const filteredTasks = connectorTasks.filter((task) => {
    const matchesFilter =
      taskFilter === 'all' ? true : taskFilter === 'pending' ? task.status === 'pending' : task.status === 'completed';
    const matchesSearch =
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.artisanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredArtisans = skillPartners.filter((artisan) =>
    artisan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artisan.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artisan.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artisan.anonymizedCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerifyOrderQuality = (orderId: string) => {
    updateOrderWorkflowStatus(
      orderId,
      { status: 'quality_verified', qualityStatus: 'verified_passed' },
      'Doorstep 6-point physical quality audit verified by Field Connector Fatima Zehra. Craft authenticity sealed.'
    );
    showToast('Quality audit verified! Ready for Product Manager dispatch.', 'success', 'QC Verified');
  };

  const handleConfirmDrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchForDrop) return;
    markBatchMaterialsDelivered(selectedBatchForDrop, dropNotes);
    setShowDropModal(false);
    showToast('Raw materials handover confirmed and batch status updated!', 'success', 'Batch Advanced');
  };

  const handleSaveVisit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Visit recorded for ${recordingVisitArtisan}: ${visitPurpose.replace('_', ' ')} (${visitOutcome.replace('_', ' ')}).`, 'success', 'Visit Logged');
    setRecordingVisitArtisan(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 font-sans">
      {/* Page Header */}
      <PageHeader
        kicker="Community Field Network"
        roleBadge="Fatima Zehra · Multan & Bahawalpur Lead"
        title="Field Facilitation & Ground Trust"
        description="Preserving human connection: distributing raw supplies, verifying safety standards, and ensuring home artisan privacy is protected."
        primaryAction={
          <Button
            variant="executiveGreen"
            leftIcon={<Package className="w-4 h-4" />}
            onClick={() => {
              if (batches.length > 0) setSelectedBatchForDrop(batches[0].id);
              setShowDropModal(true);
            }}
          >
            Confirm Material Handover
          </Button>
        }
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Pending Field Tasks"
          value={pendingTasks.length}
          sublabel="Scheduled visits in route"
          variant="default"
        />
        <StatCard
          label="Assigned Artisans"
          value={skillPartners.length}
          sublabel="Under local personal care"
          variant="executiveGreen"
        />
        <StatCard
          label="Pending Quality Checks"
          value={ordersNeedingQC.length}
          sublabel="Awaiting doorstep audit"
          variant="default"
        />
        <StatCard
          label="Dignity Standard"
          value="100%"
          sublabel="Private home privacy sealed"
          variant="lightGreen"
        />
      </div>

      {/* Community Connector Grassroots Commerce Context */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-7 text-white bg-stone-900 border border-stone-800 shadow-md">
        <img
          src={OFFICIAL_VISUAL_LIBRARY.bazaar_commerce.imageUrl}
          alt="Lahore Bazaar Grassroots Commerce"
          className="absolute inset-0 w-full h-full object-cover opacity-25 filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/80 to-[#01411C]/60" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#BBF7D0] bg-[#01411C]/80 px-2.5 py-0.5 rounded-full border border-[#BBF7D0]/30">
              Grassroots Commerce Bridge
            </span>
            <span className="text-[10px] text-stone-300 font-mono">
              Lahore Bazaar & Community Economy
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            The Trusted Bridge Between Home Artisans & the Citizen Marketplace
          </h2>
          <p className="text-xs text-stone-200 leading-relaxed">
            Community Connectors manage raw material distribution, verify physical craft quality at doorsteps, and safeguard household dignity with zero exploitation.
          </p>
        </div>
      </div>

      {/* Interactive Tab Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200/90 scrollbar-none">
        <button
          type="button"
          onClick={() => handleTabChange('field')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
            activeTab === 'field'
              ? 'bg-[#01411C] text-white shadow-md'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Field Drop-offs & Tasks</span>
          {pendingTasks.length > 0 && (
            <span className={`px-2 py-0.5 text-[10px] rounded-full font-mono font-bold ${
              activeTab === 'field' ? 'bg-[#86EFAC] text-[#01411C]' : 'bg-amber-100 text-amber-800'
            }`}>
              {pendingTasks.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('qc')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
            activeTab === 'qc'
              ? 'bg-[#01411C] text-white shadow-md'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Quality Audits (6-Point QC)</span>
          {ordersNeedingQC.length > 0 && (
            <span className={`px-2 py-0.5 text-[10px] rounded-full font-mono font-bold ${
              activeTab === 'qc' ? 'bg-amber-400 text-black' : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}>
              {ordersNeedingQC.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('artisans')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
            activeTab === 'artisans'
              ? 'bg-[#01411C] text-white shadow-md'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Artisan Visits & Roster</span>
          <span className={`px-2 py-0.5 text-[10px] rounded-full font-mono font-bold ${
            activeTab === 'artisans' ? 'bg-[#86EFAC] text-[#01411C]' : 'bg-stone-100 text-stone-700'
          }`}>
            {skillPartners.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('batches')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
            activeTab === 'batches'
              ? 'bg-[#01411C] text-white shadow-md'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Material Handover & Batches</span>
          <span className={`px-2 py-0.5 text-[10px] rounded-full font-mono font-bold ${
            activeTab === 'batches' ? 'bg-[#86EFAC] text-[#01411C]' : 'bg-stone-100 text-stone-700'
          }`}>
            {batches.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FIELD DROP-OFFS & TASKS                                            */}
      {/* ========================================================================= */}
      {activeTab === 'field' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1A2E22]">Filter Tasks:</span>
              {(['all', 'pending', 'completed'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setTaskFilter(filter)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    taskFilter === filter
                      ? 'bg-[#01411C] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {filter} ({filter === 'all' ? connectorTasks.length : filter === 'pending' ? pendingTasks.length : completedTasks.length})
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by artisan, city, or task..."
                className="pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#01411C] w-full sm:w-64"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
                No matching field tasks found for the selected filter.
              </div>
            ) : (
              filteredTasks.map((task) => (
                <Card
                  key={task.id}
                  className={`p-5 transition-all ${
                    task.status === 'completed' ? 'bg-stone-50/70 border-stone-200 opacity-90' : 'bg-white border-stone-200 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                          {task.scheduledDate}
                        </span>
                        <span className="text-stone-300">·</span>
                        <span className="text-xs font-bold text-[#01411C] uppercase tracking-wide">
                          {task.taskType.replace('_', ' ')}
                        </span>
                        <span className="text-stone-300">·</span>
                        <span className="text-xs text-stone-800 font-extrabold">{task.artisanName} ({task.artisanCode})</span>
                      </div>

                      <p className="text-xs text-stone-800 font-medium">{task.description}</p>

                      <div className="flex items-center gap-3 text-[11px] text-stone-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          {task.areaLocality}, {task.city}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-stone-400" />
                          {task.phoneMasked}
                        </span>
                      </div>

                      {task.notes && (
                        <p className="text-[11px] text-stone-500 italic mt-1 bg-stone-100/60 p-2 rounded-lg">
                          Note: "{task.notes}"
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {task.status === 'pending' ? (
                        <Button
                          size="sm"
                          variant="executiveGreen"
                          leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}
                          onClick={() => completeConnectorTask(task.id)}
                        >
                          Complete Task
                        </Button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Verified Complete
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: QUALITY AUDITS (6-POINT QC)                                        */}
      {/* ========================================================================= */}
      {activeTab === 'qc' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Pending QC Queue */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#1A2E22]">
                  Doorstep 6-Point Quality Check Queue ({ordersNeedingQC.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Conduct physical doorstep inspection before approving items for courier dispatch.
                </p>
              </div>
            </div>

            {ordersNeedingQC.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-stone-200 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#01411C] mx-auto" />
                <h4 className="text-sm font-bold text-[#1A2E22]">All Field Quality Audits Up to Date</h4>
                <p className="text-xs text-stone-500">
                  No orders currently waiting for doorstep physical QC verification.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ordersNeedingQC.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 bg-white rounded-3xl border-2 border-amber-300 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-lg">
                          {ord.trackingNumber}
                        </span>
                        <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          Field Audit Required
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-extrabold text-[#1A2E22]">{ord.productTitle}</h4>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Assigned Maker: <strong>{ord.assignedPerson || ord.skillPartnerName}</strong> ({ord.customerCity || 'Cluster Hub'})
                        </p>
                      </div>

                      {ord.orderBrief?.customizationRequirements && (
                        <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
                          <span className="font-bold text-[10px] uppercase font-mono block text-amber-800">Custom Citizen Requirements:</span>
                          <p>"{ord.orderBrief.customizationRequirements}"</p>
                        </div>
                      )}

                      {/* 6-Point Audit Checklist Preview */}
                      <div className="p-3 bg-stone-50 rounded-xl space-y-1.5 text-[11px] text-stone-600">
                        <div className="flex items-center gap-1.5 text-stone-800 font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#01411C]" />
                          <span>6-Point Protocol: Material Purity, Stitch Precision, Seal, Maker Signature</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="executiveGreen"
                      className="w-full font-bold"
                      leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-300" />}
                      onClick={() => handleVerifyOrderQuality(ord.id)}
                    >
                      Approve 6-Point Physical QC
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recently Verified Quality Audits */}
          {verifiedOrders.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-stone-200">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#718579]">
                Recently Verified Audits ({verifiedOrders.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {verifiedOrders.slice(0, 6).map((vo) => (
                  <div key={vo.id} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-stone-800">{vo.trackingNumber}</span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">Passed QC</span>
                    </div>
                    <p className="font-semibold text-stone-900 truncate">{vo.productTitle}</p>
                    <p className="text-[11px] text-stone-500">Maker: {vo.assignedPerson || vo.skillPartnerName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ARTISAN VISITS & ROSTER                                            */}
      {/* ========================================================================= */}
      {activeTab === 'artisans' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
            <div>
              <h3 className="text-base font-extrabold text-stone-900">
                Assigned Women Artisan Roster ({skillPartners.length})
              </h3>
              <p className="text-xs text-stone-500">
                Direct doorstep companion network maintaining privacy and dignified trade.
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search artisans by name or city..."
                className="pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#01411C] w-full sm:w-64"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArtisans.map((artisan) => (
              <Card key={artisan.id} className="p-5 space-y-4 bg-white border border-stone-200 shadow-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-base font-extrabold text-stone-900">{artisan.name}</h4>
                    <p className="text-xs text-stone-500 font-mono">{artisan.anonymizedCode} · {artisan.city}</p>
                    <p className="text-xs font-bold text-[#01411C] mt-0.5">{artisan.skillTitle}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="executiveGreen"
                    onClick={() => setRecordingVisitArtisan(artisan.name)}
                  >
                    Record Visit
                  </Button>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Specialty Domain:</span>
                    <span className="font-semibold text-stone-800">{artisan.specialty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Production:</span>
                    <span className="font-mono font-bold text-stone-800">{artisan.activeBatchesCount} Batches</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consent & Privacy Status:</span>
                    <span className="font-semibold text-emerald-700">Verbal & Recorded on File</span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-600 italic bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                  "{artisan.voiceGuidanceScript}"
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MATERIAL HANDOVER & BATCHES                                        */}
      {/* ========================================================================= */}
      {activeTab === 'batches' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#1A2E22]">Production Batch Material Handover</h3>
              <p className="text-xs text-stone-500">
                Track pre-funded raw material drop-offs and batch milestone advances.
              </p>
            </div>
            <Button
              variant="executiveGreen"
              leftIcon={<Package className="w-4 h-4" />}
              onClick={() => {
                if (batches.length > 0) setSelectedBatchForDrop(batches[0].id);
                setShowDropModal(true);
              }}
            >
              Sign Off Material Drop
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {batches.map((batch) => (
              <div key={batch.id} className="p-5 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                    {batch.batchCode}
                  </span>
                  <StatusBadge status={batch.status} type="batch" />
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-[#1A2E22]">{batch.title}</h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Maker: <strong>{batch.skillPartnerName}</strong> ({batch.city})
                  </p>
                </div>

                <div className="p-2.5 bg-stone-50 rounded-xl space-y-1 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Target Units:</span>
                    <span className="font-mono font-bold text-stone-800">{batch.targetUnits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Materials Status:</span>
                    <span className={`font-semibold ${batch.rawMaterialsDelivered ? 'text-[#01411C]' : 'text-amber-700'}`}>
                      {batch.rawMaterialsDelivered ? 'DELIVERED & VERIFIED' : 'PENDING HANDOVER'}
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => {
                    setSelectedBatchForDrop(batch.id);
                    setShowDropModal(true);
                  }}
                >
                  Update Drop Verification
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUICK VISIT RECORDING MODAL */}
      {recordingVisitArtisan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-extrabold text-stone-900 mb-1">
              Record Field Visit for {recordingVisitArtisan}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Structured entry to minimize typing while maintaining audit standards.
            </p>

            <form onSubmit={handleSaveVisit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Visit Purpose</label>
                <select
                  value={visitPurpose}
                  onChange={(e) => setVisitPurpose(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C] bg-white font-medium"
                >
                  <option value="material_drop">Raw Supply Drop-Off</option>
                  <option value="quality_audit">Physical Quality Audit</option>
                  <option value="safety_check">Home Workspace Safety Review</option>
                  <option value="payment_reconciliation">Payout & Receipt Verification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Visit Outcome</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'satisfactory', label: 'Satisfactory' },
                    { id: 'needs_supplies', label: 'Needs Supplies' },
                    { id: 'revision_requested', label: 'Revision Needed' },
                  ].map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setVisitOutcome(o.id as any)}
                      className={`p-2 rounded-xl border text-center text-xs font-bold cursor-pointer transition-colors ${
                        visitOutcome === o.id
                          ? 'bg-[#01411C] text-white border-[#01411C]'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Field Observations</label>
                <textarea
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setRecordingVisitArtisan(null)}>
                  Cancel
                </Button>
                <Button variant="executiveGreen" size="sm" type="submit" className="font-bold">
                  Log Field Visit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM MATERIAL DELIVERY MODAL */}
      {showDropModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-extrabold text-stone-900 mb-1">Confirm Raw Material Handover</h3>
            <p className="text-xs text-stone-500 mb-4">
              Sign off on physical delivery of thread, jars, packaging, or fabric directly to the home artisan.
            </p>

            <form onSubmit={handleConfirmDrop} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Target Production Batch</label>
                <select
                  value={selectedBatchForDrop}
                  onChange={(e) => setSelectedBatchForDrop(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C] bg-white font-medium"
                  required
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batchCode} · {b.title} ({b.skillPartnerName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Verification Field Notes</label>
                <textarea
                  value={dropNotes}
                  onChange={(e) => setDropNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowDropModal(false)}>
                  Cancel
                </Button>
                <Button variant="executiveGreen" size="sm" type="submit" className="font-bold">
                  Confirm Handover & Advance Batch
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
