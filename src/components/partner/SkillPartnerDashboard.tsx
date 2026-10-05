import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { VoiceGuidancePlayer } from '../common/VoiceGuidancePlayer';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { StatCard } from '../ui/StatCard';
import { StatusBadge } from '../ui/StatusBadge';
import { WorkDetailModal } from './WorkDetailModal';
import { SkillPartnerTask, SkillPartnerTaskStatus, UserRole } from '../../types';
import { Avatar } from '../ui/Avatar';
import {
  Volume2,
  CheckCircle2,
  Clock,
  PhoneCall,
  PackageCheck,
  AlertTriangle,
  PlusCircle,
  MessageSquare,
  HelpCircle,
  Briefcase,
  DollarSign,
  Layers,
  ArrowRight,
  ShieldCheck,
  Send,
  FileText,
  UserCheck,
  Lock,
  Sparkles,
  Receipt,
  ExternalLink,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { OFFICIAL_VISUAL_LIBRARY } from '../../data/visualLibrary';

interface SkillPartnerDashboardProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

type TabKey = 'dashboard' | 'work' | 'earnings' | 'messages' | 'help';

export const SkillPartnerDashboard: React.FC<SkillPartnerDashboardProps> = ({
  activeTab: propTab,
  setActiveTab: setPropTab,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    skillPartners,
    batches,
    orders,
    payouts,
    skillPartnerTasks,
    messages,
    sendMessage,
    incrementBatchProgress,
    requestConnectorMaterialHelp,
    acceptAssignedTask,
    updateTaskProgress,
    updateOrderWorkflowStatus,
    openConfirmDialog,
    showToast,
  } = useApp();

  // Determine current active tab from query param, prop, or internal state
  const urlTab = searchParams.get('tab') as TabKey | null;
  const initialTab: TabKey =
    urlTab === 'work' || urlTab === 'earnings' || urlTab === 'messages' || urlTab === 'help'
      ? urlTab
      : propTab === 'work' || propTab === 'money' || propTab === 'earnings'
      ? 'earnings'
      : 'dashboard';

  const [currentTab, setCurrentTab] = useState<TabKey>(initialTab);

  // Sync with searchParams if urlTab changes
  useEffect(() => {
    if (urlTab && ['dashboard', 'work', 'earnings', 'messages', 'help'].includes(urlTab)) {
      setCurrentTab(urlTab as TabKey);
    }
  }, [urlTab]);

  const handleTabChange = (tab: TabKey) => {
    setCurrentTab(tab);
    setSearchParams({ tab });
    if (setPropTab) {
      setPropTab(tab);
    }
  };

  // Current artisan data (Kalsoom Bibi)
  const currentArtisan = skillPartners[0] || {
    id: 'sp-1',
    name: 'Kalsoom Bibi',
    anonymizedCode: 'KB-MLT-402',
    skillTitle: 'Master Kashidakari Embroiderer',
    city: 'Multan',
    district: 'Multan Artisan Quarter',
    craftExperienceYears: 18,
    totalEarningsPKR: 184800,
    pendingPayoutPKR: 34700,
    voiceGuidanceScript:
      'Assalam-o-Alaikum Kalsoom Bibi! Raw materials for your new embroidery batch have been verified by Connector Fatima. Please check your assigned tasks and record progress.',
    avatarUrl: '',
  };

  // Associated tasks, batches, and payouts
  const myTasks = skillPartnerTasks;
  const myBatches = batches.filter((b) => b.skillPartnerId === currentArtisan.id);
  const myPayouts = payouts.filter((p) => p.recipientName.includes('Kalsoom') || p.recipientId === currentArtisan.id);

  // Directly assigned citizen orders
  const assignedCitizenOrders = orders.filter(
    (o) =>
      o.skillPartnerId === currentArtisan.id ||
      (o.assignedPerson && o.assignedPerson.toLowerCase().includes(currentArtisan.name.toLowerCase().split(' ')[0]))
  );

  const handleStartCrafting = (orderId: string) => {
    updateOrderWorkflowStatus(orderId, { productionStatus: 'in_craft' }, 'Artisan Kalsoom Bibi has commenced handcrafting.');
    showToast('Crafting started. Citizen and Product Manager notified.', 'success', 'Crafting Commenced');
  };

  const handleFinishCrafting = (orderId: string) => {
    updateOrderWorkflowStatus(
      orderId,
      { status: 'quality_check', productionStatus: 'quality_review' },
      'Artisan Kalsoom Bibi completed handcrafting; pending 6-point doorstep QC by Field Connector.'
    );
    showToast('Craft completed! Doorstep quality audit requested.', 'success', 'Ready for QC');
  };

  // Status breakdown for tasks
  const [taskStatusFilter, setTaskStatusFilter] = useState<'All' | SkillPartnerTaskStatus>('All');
  const filteredTasks = taskStatusFilter === 'All'
    ? myTasks
    : myTasks.filter((t) => t.status === taskStatusFilter);

  // Selected task for detailed modal
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<SkillPartnerTask | null>(null);

  // Next Priority Task (first active, in-production or assigned task)
  const nextTask =
    myTasks.find((t) => t.status === 'In Production') ||
    myTasks.find((t) => t.status === 'Assigned') ||
    myTasks.find((t) => t.status === 'Accepted') ||
    myTasks[0];

  // Financial calculations
  const totalPaidEarnings = currentArtisan.totalEarningsPKR || 184800;
  const pendingEarnings = currentArtisan.pendingPayoutPKR || 34700;
  const currentInProductionEarnings = myTasks
    .filter((t) => t.status === 'In Production' || t.status === 'Accepted')
    .reduce((sum, t) => sum + (t.completedUnits * t.unitPayPKR), 0);

  // Calling connector simulation
  const [callingConnector, setCallingConnector] = useState(false);
  const handleSimulateCall = () => {
    setCallingConnector(true);
    showToast(
      `Connecting audio call to Field Connector ${currentArtisan.assignedConnectorName}...`,
      'info',
      'Connecting Call'
    );
    setTimeout(() => {
      setCallingConnector(false);
      showToast(
        `Audio call connected with ${currentArtisan.assignedConnectorName}. Verbal assistance active.`,
        'success',
        'Call Active'
      );
    }, 2000);
  };

  // Urgent supplies modal
  const [urgentNeedOpen, setUrgentNeedOpen] = useState(false);
  const [urgentNoteText, setUrgentNoteText] = useState('Raw silk threads and mirror roundels running low.');
  const handleSendUrgentHelp = (batchId: string) => {
    requestConnectorMaterialHelp(batchId, urgentNoteText);
    setUrgentNeedOpen(false);
  };

  // Messages with Business Builder Zainab
  const [chatMessageText, setChatMessageText] = useState('');
  const [chatPriority, setChatPriority] = useState<'normal' | 'urgent'>('normal');

  // Filter messages for Kalsoom Bibi
  const artisanMessages = messages.filter(
    (m) =>
      (m.recipientRole === 'partner' && m.recipientName.includes('Kalsoom')) ||
      (m.senderRole === 'partner' && m.senderName.includes('Kalsoom'))
  );
  const unreadArtisanMessages = artisanMessages.filter((m) => !m.read && m.recipientRole === 'partner');

  const handleSendArtisanMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim()) return;

    sendMessage({
      recipientId: 'demo-builder',
      recipientName: 'Zainab Malik',
      recipientRole: 'builder',
      topic: 'Craft Operations & Progress',
      content: chatMessageText.trim(),
      priority: chatPriority,
    });

    setChatMessageText('');
    showToast('Message sent to Business Builder Zainab Malik.', 'success', 'Message Sent');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full font-sans space-y-8">
      {/* 1. DIGNIFIED WELCOME & ARTISAN IDENTITY HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5 min-w-0">
          <div className="relative shrink-0">
            <Avatar name={currentArtisan.name} size="xl" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-sans text-[11px] font-extrabold uppercase tracking-wider text-[#01411C] bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#BBF7D0]">
                Master Producer · CEO of Cluster
              </span>
              <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#4A5D52] bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
                Economic Contributor
              </span>
              <span className="font-mono text-[11px] font-bold text-[#01411C] bg-emerald-50/80 px-2 py-0.5 rounded-full border border-emerald-200">
                Code: {currentArtisan.anonymizedCode}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A2E22] tracking-tight">
              Welcome, {currentArtisan.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#4A5D52] mt-1">
              {currentArtisan.skillTitle} · {currentArtisan.craftExperienceYears} Years Mastery · {currentArtisan.city}
            </p>
          </div>
        </div>

        {/* High-priority voice and connector assistance buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="md"
            leftIcon={<Volume2 className="w-4 h-4 text-[#01411C]" />}
            onClick={() => handleTabChange('help')}
            className="border-2"
          >
            Voice Guidance (Urdu)
          </Button>

          <Button
            variant="primary"
            size="md"
            leftIcon={<PhoneCall className={`w-4 h-4 ${callingConnector ? 'animate-bounce' : ''}`} />}
            onClick={handleSimulateCall}
            disabled={callingConnector}
          >
            {callingConnector ? 'Calling Fatima...' : 'Call Connector Fatima'}
          </Button>
        </div>
      </div>

      {/* NAVIGATION TABS (Large, Accessible Touch Controls) */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => handleTabChange('dashboard')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            currentTab === 'dashboard'
              ? 'bg-[#01411C] text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('work')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            currentTab === 'work'
              ? 'bg-[#01411C] text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>My Work</span>
          <span className={`px-2 py-0.5 text-xs rounded-full font-mono ${
            currentTab === 'work' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
          }`}>
            {myTasks.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('earnings')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            currentTab === 'earnings'
              ? 'bg-[#01411C] text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>My Earnings</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('messages')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            currentTab === 'messages'
              ? 'bg-[#01411C] text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>My Messages</span>
          {unreadArtisanMessages.length > 0 && (
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('help')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            currentTab === 'help'
              ? 'bg-[#01411C] text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help & Audio</span>
        </button>
      </div>

      {/* ========================================================== */}
      {/* TAB 1: PRIMARY DASHBOARD OVERVIEW                         */}
      {/* ========================================================== */}
      {currentTab === 'dashboard' && (
        <div className="space-y-8">
          {/* PRIMARY 4 CARDS (Mandated by Section 2: My Work, My Earnings, My Next Task, My Messages) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: My Work */}
            <div
              onClick={() => handleTabChange('work')}
              className="bg-white rounded-3xl p-5 border-2 border-stone-200 hover:border-[#01411C] transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#01411C]/10 text-[#01411C] flex items-center justify-center mb-3">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#718579] block">
                  Primary Hub
                </span>
                <h3 className="text-lg font-extrabold text-[#1A2E22] group-hover:text-[#01411C] transition-colors">
                  My Work
                </h3>
                <p className="text-xs text-[#4A5D52] mt-1">
                  {myTasks.filter((t) => t.status === 'In Production' || t.status === 'Assigned').length} active tasks assigned for production.
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#01411C]">
                <span>View All Tasks ({myTasks.length})</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: My Earnings */}
            <div
              onClick={() => handleTabChange('earnings')}
              className="bg-[#F0FDF4] rounded-3xl p-5 border-2 border-[#BBF7D0] hover:border-[#01411C] transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#01411C] text-white flex items-center justify-center mb-3">
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#01411C] block">
                  Direct Compensation
                </span>
                <h3 className="text-lg font-extrabold text-[#01411C]">
                  My Earnings
                </h3>
                <div className="mt-1">
                  <span className="text-xl font-extrabold font-mono text-[#01411C] tabular-nums block">
                    PKR {totalPaidEarnings.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-[#4A5D52]">
                    +PKR {pendingEarnings.toLocaleString()} held in escrow
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-[#BBF7D0]/60 flex items-center justify-between text-xs font-bold text-[#01411C]">
                <span>Payment Breakdown</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: My Next Task */}
            <div
              onClick={() => {
                if (nextTask) setSelectedTaskForModal(nextTask);
              }}
              className="bg-white rounded-3xl p-5 border-2 border-stone-200 hover:border-[#01411C] transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 block">
                  Immediate Priority
                </span>
                <h3 className="text-base font-extrabold text-[#1A2E22] group-hover:text-[#01411C] transition-colors truncate">
                  {nextTask?.productTitle || 'No active task'}
                </h3>
                <p className="text-xs text-[#4A5D52] mt-1">
                  {nextTask ? `${nextTask.completedUnits} / ${nextTask.quantity} units completed · Due ${nextTask.deadline}` : 'All work completed'}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#01411C]">
                <span>Open Task Details</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 4: My Messages */}
            <div
              onClick={() => handleTabChange('messages')}
              className="bg-white rounded-3xl p-5 border-2 border-stone-200 hover:border-[#01411C] transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center mb-3 relative">
                  <MessageSquare className="w-5 h-5" />
                  {unreadArtisanMessages.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-800 block">
                  Support & Coordination
                </span>
                <h3 className="text-lg font-extrabold text-[#1A2E22] group-hover:text-[#01411C] transition-colors">
                  My Messages
                </h3>
                <p className="text-xs text-[#4A5D52] mt-1">
                  Direct connection with Business Builder Zainab & Connector Fatima.
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#01411C]">
                <span>Open Chat Thread</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* VOICE GUIDANCE PROMINENT HERO */}
          <VoiceGuidancePlayer
            scriptText={currentArtisan.voiceGuidanceScript}
            artisanName={currentArtisan.name}
          />

          {/* ACTIVE BATCH SECTION (with 3-Step Pictorial Controls) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-extrabold text-[#1A2E22]">
                  Active Batch & Production Flow
                </h3>
                <p className="text-xs text-[#4A5D52]">
                  Doorstep raw materials verified by Community Connector Fatima Zehra.
                </p>
              </div>
              <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#01411C] bg-[#F0FDF4] px-3 py-1 rounded-full border border-[#BBF7D0]">
                Doorstep Pickups Verified
              </span>
            </div>

            {myBatches.map((batch) => {
              const progressPercent = Math.round((batch.completedUnits / batch.targetUnits) * 100);

              return (
                <Card key={batch.id} className="p-6 sm:p-7 space-y-6 border-2 border-stone-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-900 border border-stone-200">
                          {batch.batchCode}
                        </span>
                        <StatusBadge status={batch.status} type="batch" />
                      </div>
                      <h4 className="text-lg font-extrabold text-[#1A2E22]">
                        {batch.title}
                      </h4>
                      <p className="text-xs text-[#4A5D52] mt-0.5">
                        Target completion: <strong>{batch.deadline}</strong> · Assigned Connector: <strong>{batch.connectorName}</strong>
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-2xl font-extrabold font-mono text-[#01411C] tabular-nums block">
                        PKR {batch.totalBatchPayPKR.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#718579] block">
                        Direct Compensation Guaranteed
                      </span>
                    </div>
                  </div>

                  {/* 3-Step Visual Process Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                    <div
                      className={`p-4 rounded-2xl border transition-all ${
                        batch.rawMaterialsDelivered
                          ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#01411C]'
                          : 'bg-stone-100 border-stone-200 text-stone-400'
                      }`}
                    >
                      <span className="text-2xl block">📦</span>
                      <span className="text-xs font-extrabold block mt-1.5">
                        1. Raw Materials Received
                      </span>
                      <span className="text-[11px] text-[#4A5D52] mt-0.5 block">
                        {batch.rawMaterialsDelivered ? 'Delivered by Fatima ✓' : 'Awaiting Delivery'}
                      </span>
                    </div>

                    <div
                      className={`p-4 rounded-2xl border transition-all ${
                        batch.completedUnits > 0
                          ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                          : 'bg-stone-100 border-stone-200 text-stone-400'
                      }`}
                    >
                      <span className="text-2xl block">✂️</span>
                      <span className="text-xs font-extrabold block mt-1.5">
                        2. Craft Synthesis
                      </span>
                      <span className="text-[11px] text-amber-900 mt-0.5 block font-bold">
                        {batch.completedUnits} / {batch.targetUnits} Completed
                      </span>
                    </div>

                    <div
                      className={`p-4 rounded-2xl border transition-all ${
                        batch.completedUnits >= batch.targetUnits
                          ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#01411C]'
                          : 'bg-stone-100 border-stone-200 text-stone-400'
                      }`}
                    >
                      <span className="text-2xl block">⭐</span>
                      <span className="text-xs font-extrabold block mt-1.5">
                        3. 6-Point Quality Check
                      </span>
                      <span className="text-[11px] text-[#4A5D52] mt-0.5 block">
                        {batch.completedUnits >= batch.targetUnits ? 'Doorstep Audit Ready' : 'Pending Finishing'}
                      </span>
                    </div>
                  </div>

                  {/* Progress Meter */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-[#1A2E22]">Production Completion</span>
                      <span className="font-mono text-[#01411C]">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-3.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
                      <div
                        style={{ width: `${progressPercent}%` }}
                        className="bg-[#01411C] h-full rounded-full transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Ergonomic Big Touch Controls */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Button
                      size="lg"
                      variant="executiveGreen"
                      leftIcon={<PlusCircle className="w-5 h-5 text-white" />}
                      className="flex-1 min-w-[200px]"
                      onClick={() => incrementBatchProgress(batch.id)}
                      disabled={batch.completedUnits >= batch.targetUnits}
                    >
                      Finished +1 Unit ({batch.completedUnits}/{batch.targetUnits})
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      leftIcon={<AlertTriangle className="w-4 h-4 text-amber-700" />}
                      onClick={() => setUrgentNeedOpen(true)}
                    >
                      Request Extra Supplies
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* DIGNITY FINANCIAL STATUS CALLOUT */}
          <div className="p-6 rounded-3xl bg-[#F0FDF4] border-2 border-[#BBF7D0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#01411C] text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-[#01411C]">
                  100% Fair Compensation Guarantee
                </h4>
                <p className="text-xs text-[#4A5D52] mt-0.5">
                  Direct mobile wallet transfer with automated escrow protection. Zero intermediary cuts.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="md"
              onClick={() => handleTabChange('earnings')}
              className="shrink-0 bg-white"
            >
              View Full Financial Ledger
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 2: MY WORK (ASSIGNED PRODUCTION WORK)                  */}
      {/* ========================================================== */}
      {currentTab === 'work' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-[#1A2E22]">
                My Assigned Production Tasks
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5D52]">
                Detailed specifications, crafting instructions, and production status for all assigned pieces.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<Volume2 className="w-4 h-4 text-[#01411C]" />}
              onClick={() => handleTabChange('help')}
            >
              Hear Urdu Instructions
            </Button>
          </div>

          {/* Assigned Citizen Orders & Custom Briefs (Closed-Loop Workflow) */}
          {assignedCitizenOrders.length > 0 && (
            <div className="p-5 rounded-3xl bg-[#F0FDF4] border-2 border-[#BBF7D0] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#01411C] text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#1A2E22]">
                      Assigned Citizen Orders ({assignedCitizenOrders.length})
                    </h3>
                    <p className="text-xs text-[#4A5D52]">
                      Direct custom briefs from Citizens assigned to your workshop by Product Manager Zainab.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#01411C] bg-white px-2.5 py-1 rounded-full border border-[#BBF7D0] w-fit">
                  Live Operations
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignedCitizenOrders.map((ord) => {
                  const isInCraft = ord.productionStatus === 'in_craft';
                  const isReadyQC = ord.status === 'quality_check';
                  const isVerified = ord.status === 'quality_verified';
                  const isDispatched = ord.status === 'dispatched';
                  const isDelivered = ord.status === 'delivered';

                  return (
                    <div
                      key={ord.id}
                      className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 shadow-xs hover:border-[#01411C] transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                          {ord.trackingNumber}
                        </span>
                        <StatusBadge status={ord.status} type="order" />
                      </div>

                      <div>
                        <h4 className="text-sm font-extrabold text-[#1A2E22]">{ord.productTitle}</h4>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Citizen: <strong>{ord.customerName}</strong> ({ord.customerCity}) · {ord.quantity} Unit(s)
                        </p>
                      </div>

                      {/* Brief Highlights */}
                      <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] space-y-1">
                        <div className="flex justify-between text-amber-950 font-semibold">
                          <span>Customization:</span>
                          <span className="text-stone-700">{ord.orderBrief?.customizationRequirements || 'Standard catalog'}</span>
                        </div>
                        <div className="flex justify-between text-amber-950 font-semibold">
                          <span>Delivery Timing:</span>
                          <span className="text-stone-700">{ord.orderBrief?.preferredDeliveryTiming || 'Standard Handcrafted'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-extrabold font-mono text-[#01411C]">
                          Artisan: PKR {ord.payoutAmountPKR.toLocaleString()}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {!isInCraft && !isReadyQC && !isVerified && !isDispatched && !isDelivered && (
                            <Button
                              size="sm"
                              variant="executiveGreen"
                              onClick={() => handleStartCrafting(ord.id)}
                            >
                              Start Crafting
                            </Button>
                          )}

                          {isInCraft && (
                            <Button
                              size="sm"
                              variant="executiveGreen"
                              onClick={() => handleFinishCrafting(ord.id)}
                            >
                              Finish & Request QC
                            </Button>
                          )}

                          {isReadyQC && (
                            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                              Pending Doorstep QC
                            </span>
                          )}

                          {isVerified && (
                            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                              QC Passed ✓
                            </span>
                          )}

                          {isDispatched && (
                            <span className="text-[11px] font-bold text-blue-800 bg-blue-100 px-2.5 py-1 rounded-lg">
                              Dispatched
                            </span>
                          )}

                          {isDelivered && (
                            <span className="text-[11px] font-bold text-[#01411C] bg-[#DCFCE7] px-2.5 py-1 rounded-lg">
                              Delivered ✓
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {(['All', 'Assigned', 'Accepted', 'In Production', 'Submitted', 'Approved', 'Completed'] as const).map(
              (status) => {
                const count =
                  status === 'All'
                    ? myTasks.length
                    : myTasks.filter((t) => t.status === status).length;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setTaskStatusFilter(status)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      taskStatusFilter === status
                        ? 'bg-[#01411C] text-white shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <span>{status}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        taskStatusFilter === status
                          ? 'bg-white/20 text-white'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              }
            )}
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredTasks.map((task) => {
              const isAssigned = task.status === 'Assigned';
              const isInProgress = task.status === 'In Production' || task.status === 'Accepted';
              const isSubmitted = task.status === 'Submitted';
              const isApproved = task.status === 'Approved';
              const isCompleted = task.status === 'Completed';

              return (
                <div
                  key={task.id}
                  className="bg-white rounded-3xl border-2 border-stone-200 hover:border-[#01411C] transition-all p-5 sm:p-6 flex flex-col justify-between shadow-xs space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header: Batch Code, Category & Status */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
                          {task.batchCode}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#718579]">
                          {task.category}
                        </span>
                      </div>

                      <span
                        className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          isCompleted
                            ? 'bg-[#01411C] text-white border-[#01411C]'
                            : isApproved
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            : isSubmitted
                            ? 'bg-blue-50 text-blue-900 border-blue-200'
                            : isInProgress
                            ? 'bg-amber-50 text-amber-950 border-amber-200'
                            : 'bg-stone-100 text-stone-700 border-stone-300'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>

                    {/* Product Photo & Title */}
                    <div className="flex items-start gap-4">
                      {task.productImage && (
                        <img
                          src={task.productImage}
                          alt={task.productTitle}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-stone-200 shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-extrabold text-[#1A2E22] leading-snug">
                          {task.productTitle}
                        </h3>
                        <p className="text-xs text-[#4A5D52] mt-1">
                          Quantity: <strong>{task.quantity} Units</strong> · Deadline: <strong>{task.deadline}</strong>
                        </p>
                        <p className="text-xs font-bold font-mono text-[#01411C] mt-1">
                          Direct Compensation: PKR {task.totalPayPKR.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Craft Instructions Preview */}
                    <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-stone-200/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-[#1A2E22]">
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#01411C]" />
                          <span>{task.instructions.title}</span>
                        </span>
                        <span className="text-[10px] text-stone-500 font-normal">
                          {task.instructions.steps.length} Steps
                        </span>
                      </div>
                      <p className="text-[11px] text-[#4A5D52] line-clamp-2">
                        {task.instructions.steps[0]}
                      </p>
                      {task.instructions.urduText && (
                        <p className="text-xs text-amber-950 font-serif text-right line-clamp-1 pt-1 border-t border-stone-200/50">
                          {task.instructions.urduText}
                        </p>
                      )}
                    </div>

                    {/* Progress Bar for In-Progress Tasks */}
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-[#4A5D52]">Finished Progress</span>
                        <span className="font-mono text-[#01411C]">
                          {task.completedUnits} / {task.quantity} Units
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#01411C] transition-all rounded-full"
                          style={{
                            width: `${Math.round((task.completedUnits / task.quantity) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2">
                    <Button
                      onClick={() => setSelectedTaskForModal(task)}
                      variant="outline"
                      size="md"
                      className="flex-1"
                    >
                      View Instructions & Details
                    </Button>

                    {isAssigned && (
                      <Button
                        onClick={() => acceptAssignedTask(task.id)}
                        variant="executiveGreen"
                        size="md"
                        leftIcon={<CheckCircle2 className="w-4 h-4 text-white" />}
                      >
                        Accept Task
                      </Button>
                    )}

                    {isInProgress && (
                      <Button
                        onClick={() => updateTaskProgress(task.id, task.completedUnits + 1)}
                        variant="secondary"
                        size="md"
                        disabled={task.completedUnits >= task.quantity}
                        leftIcon={<PlusCircle className="w-4 h-4 text-[#01411C]" />}
                      >
                        +1 Unit
                      </Button>
                    )}

                    {isSubmitted && (
                      <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                        Awaiting Doorstep Audit
                      </span>
                    )}

                    {isApproved && (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        QC Passed · Ready for Pay
                      </span>
                    )}

                    {isCompleted && (
                      <span className="text-xs font-bold text-[#01411C] bg-[#F0FDF4] px-3 py-1.5 rounded-xl border border-[#BBF7D0]">
                        Paid & Settled ✓
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 3: MY EARNINGS (CLEAR FINANCIAL LANGUAGE & PAYOUTS)   */}
      {/* ========================================================== */}
      {currentTab === 'earnings' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-[#1A2E22]">
              Artisan Remuneration & Payout Ledger
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5D52]">
              Transparent accounting of your direct craft earnings. All payments are verified and transferred directly to your mobile wallet or bank.
            </p>
          </div>

          {/* High-Contrast Financial Tickers with Tabular Numerics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Paid Direct Income"
              value={`PKR ${totalPaidEarnings.toLocaleString()}`}
              sublabel="Transferred into JazzCash / Bank"
              variant="executiveGreen"
              icon={<CheckCircle2 className="w-5 h-5 text-white" />}
            />
            <StatCard
              label="Pending in Escrow"
              value={`PKR ${pendingEarnings.toLocaleString()}`}
              sublabel="Disbursed upon doorstep quality check"
              variant="lightGreen"
              icon={<Clock className="w-5 h-5 text-[#01411C]" />}
            />
            <StatCard
              label="Active Work Value"
              value={`PKR ${currentInProductionEarnings.toLocaleString()}`}
              sublabel="Units finished in current open batches"
              variant="default"
              icon={<Briefcase className="w-5 h-5 text-stone-700" />}
            />
          </div>

          {/* Dignified Financial Language Charter */}
          <div className="p-5 rounded-3xl bg-white border-2 border-stone-200 space-y-2">
            <h4 className="text-sm font-extrabold text-[#1A2E22] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#01411C]" />
              <span>Dignified Compensation Principles</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#4A5D52] pt-1">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60">
                <strong className="block text-[#1A2E22] mb-1">Direct Settlement</strong>
                100% of fair artisan wages go directly to you without deduction or agent commission.
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60">
                <strong className="block text-[#1A2E22] mb-1">Escrow Protection</strong>
                Customer payments are locked in escrow when an order is placed, guaranteeing your compensation.
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60">
                <strong className="block text-[#1A2E22] mb-1">Doorstep Inspection</strong>
                Connector Fatima performs the 6-point verification at your doorstep, triggering immediate release.
              </div>
            </div>
          </div>

          {/* Recent Payouts Table / List */}
          <Card className="overflow-hidden border-2 border-stone-200">
            <CardHeader className="bg-[#FAF9F6] border-b border-stone-200 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-extrabold text-[#1A2E22]">
                  Recent Direct Payouts ({myPayouts.length})
                </CardTitle>
                <p className="text-xs text-[#4A5D52] mt-0.5">
                  Automated electronic transfers to your registered payment channel.
                </p>
              </div>
              <span className="text-xs font-bold text-[#01411C] bg-[#F0FDF4] px-3 py-1 rounded-full border border-[#BBF7D0]">
                Verified Payouts
              </span>
            </CardHeader>

            <div className="divide-y divide-stone-100">
              {myPayouts.map((payout) => (
                <div
                  key={payout.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/70 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#01411C] border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-xs font-bold text-stone-900">
                          {payout.payoutCode}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            payout.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {payout.status === 'completed' ? 'Settled ✓' : 'Processing'}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-stone-500">
                          Method: {payout.method.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">
                        Date: <strong>{payout.date}</strong> · Batch: <span className="font-mono">{payout.referenceBatchCode}</span>
                      </p>
                      <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                        Transaction Ref: {payout.transactionRef}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-lg font-extrabold font-mono text-[#01411C] tabular-nums block">
                      +PKR {payout.amountPKR.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-stone-500 block mt-0.5">
                      Direct Wallet Credit
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 4: MY MESSAGES (COMMUNICATION WITH BUSINESS BUILDER)  */}
      {/* ========================================================== */}
      {currentTab === 'messages' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-[#1A2E22]">
              Enterprise Communication Channel
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5D52]">
              Direct, respectful coordination with Business Builder Zainab Malik and Connector Fatima Zehra.
            </p>
          </div>

          {/* Privacy Protection Notice */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-3 text-xs text-amber-950">
            <Lock className="w-4 h-4 text-amber-800 shrink-0" />
            <div>
              <strong>Privacy Protected:</strong> Your communication identity is displayed as{' '}
              <span className="font-mono font-bold">{currentArtisan.name} ({currentArtisan.anonymizedCode})</span>.
              Your personal phone number and exact residential address are kept confidential.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Contact Info & Support */}
            <div className="space-y-4">
              <Card className="p-5 space-y-4 border-2 border-stone-200">
                <CardTitle className="text-sm font-extrabold text-[#1A2E22]">
                  Assigned Team Leads
                </CardTitle>

                {/* Business Builder */}
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-3">
                  <Avatar name="Zainab Malik" size="md" />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-stone-900 truncate">Zainab Malik</h5>
                    <p className="text-[11px] text-stone-500">Enterprise Business Builder</p>
                    <span className="text-[10px] font-bold text-[#01411C]">Lahore Hub · Online</span>
                  </div>
                </div>

                {/* Field Connector */}
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name="Fatima Zehra" size="md" />
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-stone-900 truncate">Fatima Zehra</h5>
                      <p className="text-[11px] text-stone-500">Doorstep Quality Connector</p>
                      <span className="text-[10px] font-bold text-emerald-800">Field Active</span>
                    </div>
                  </div>

                  <Button size="sm" variant="outline" onClick={handleSimulateCall}>
                    Call
                  </Button>
                </div>
              </Card>

              {/* Quick Template Replies */}
              <Card className="p-5 space-y-3 border-2 border-stone-200">
                <CardTitle className="text-xs font-extrabold uppercase tracking-wider text-[#718579]">
                  One-Tap Quick Messages
                </CardTitle>
                <div className="space-y-2">
                  {[
                    'Assalam-o-Alaikum Zainab, raw materials received safely and inspected.',
                    'Finished 2 more shawls today with tight resham embroidery.',
                    'All batch units completed. Ready for Fatima to visit for doorstep audit.',
                    'Urgent: Need extra silk spools for border hem stitching.',
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setChatMessageText(preset)}
                      className="w-full text-left p-2.5 rounded-xl bg-stone-50 hover:bg-[#F0FDF4] hover:text-[#01411C] border border-stone-200 text-xs text-stone-700 transition-colors cursor-pointer"
                    >
                      "{preset}"
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right: Message Stream & Composer */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="p-5 border-2 border-stone-200 space-y-4">
                <CardTitle className="text-base font-extrabold text-[#1A2E22] flex items-center justify-between">
                  <span>Conversation History</span>
                  <span className="text-xs font-normal text-stone-500">
                    Encrypted enterprise channel
                  </span>
                </CardTitle>

                {/* Message items */}
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {artisanMessages.length > 0 ? (
                    artisanMessages.map((msg) => {
                      const isMe = msg.senderRole === 'partner';

                      return (
                        <div
                          key={msg.id}
                          className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                            isMe
                              ? 'bg-[#F0FDF4] border-[#BBF7D0] ml-6 sm:ml-12'
                              : 'bg-white border-stone-200 mr-6 sm:mr-12'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className={isMe ? 'text-[#01411C]' : 'text-stone-900'}>
                              {isMe ? 'You (Kalsoom Bibi)' : msg.senderName}
                            </span>
                            <span className="text-stone-400 font-normal">{msg.timestamp}</span>
                          </div>
                          {msg.topic && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                              Topic: {msg.topic}
                            </span>
                          )}
                          <p className="text-stone-800 leading-relaxed">{msg.content}</p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-stone-500 text-xs">
                      No previous messages recorded. Send your first update below!
                    </div>
                  )}
                </div>

                {/* Message composer form */}
                <form onSubmit={handleSendArtisanMessage} className="pt-3 border-t border-stone-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-[#1A2E22]">Send Update to Zainab Malik</label>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-stone-500">Priority:</span>
                      <select
                        value={chatPriority}
                        onChange={(e) => setChatPriority(e.target.value as 'normal' | 'urgent')}
                        className="p-1 text-xs border border-stone-300 rounded-lg bg-white"
                      >
                        <option value="normal">Normal</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    value={chatMessageText}
                    onChange={(e) => setChatMessageText(e.target.value)}
                    placeholder="Type your message, progress update, or supplies query..."
                    className="w-full p-3 text-xs border border-stone-300 rounded-2xl focus:outline-none focus:border-[#01411C]"
                  />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="executiveGreen"
                      size="md"
                      leftIcon={<Send className="w-4 h-4 text-white" />}
                      disabled={!chatMessageText.trim()}
                    >
                      Send Message
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 5: HELP & VOICE GUIDANCE ARCHITECTURE                  */}
      {/* ========================================================== */}
      {currentTab === 'help' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-[#1A2E22]">
              Assistance, Voice Guidance & Safety
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5D52]">
              Audio-first support designed for ease of use, dignity, and domestic safety.
            </p>
          </div>

          {/* Master Voice Guidance Component */}
          <VoiceGuidancePlayer
            scriptText={currentArtisan.voiceGuidanceScript}
            artisanName={currentArtisan.name}
          />

          {/* Visual Step-by-Step Audio Help Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="p-5 space-y-3 border-2 border-stone-200">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#01411C] flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <CardTitle className="text-base font-extrabold text-[#1A2E22]">
                1. Voice Instructions
              </CardTitle>
              <p className="text-xs text-stone-600 leading-relaxed">
                Every assigned product comes with step-by-step spoken Urdu instructions. Tap the "Listen in Urdu" button inside any task card.
              </p>
            </Card>

            <Card className="p-5 space-y-3 border-2 border-stone-200">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <CardTitle className="text-base font-extrabold text-[#1A2E22]">
                2. Emergency Supplies
              </CardTitle>
              <p className="text-xs text-stone-600 leading-relaxed">
                If thread, mirror, or gota runs out, tap "Request Extra Supplies". Field Connector Fatima is alerted for a priority replenishment drop.
              </p>
              <Button size="sm" variant="outline" onClick={() => setUrgentNeedOpen(true)}>
                Open Supplies Alert
              </Button>
            </Card>

            <Card className="p-5 space-y-3 border-2 border-stone-200">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <CardTitle className="text-base font-extrabold text-[#1A2E22]">
                3. Direct Audio Call
              </CardTitle>
              <p className="text-xs text-stone-600 leading-relaxed">
                Need immediate verbal clarification? Call Connector Fatima Zehra directly for real-time craft guidance.
              </p>
              <Button size="sm" variant="primary" onClick={handleSimulateCall}>
                Call Fatima Now
              </Button>
            </Card>
          </div>

          {/* Safety & Workplace Dignity */}
          <div className="p-6 rounded-3xl bg-white border-2 border-stone-200 space-y-2">
            <h4 className="text-sm font-extrabold text-[#1A2E22]">
              Home Enterprise Craft Safety & Ergonomics
            </h4>
            <ul className="text-xs text-[#4A5D52] space-y-1.5 list-disc pl-5">
              <li>Keep fine embroidery needles securely placed in wooden boxes away from children.</li>
              <li>Ensure good daytime lighting or a high-CRI reading lamp to prevent eye fatigue during counted-thread Kashidakari.</li>
              <li>Store natural resham silk coils in dry, ventilated cloth pouches to preserve fiber luster.</li>
            </ul>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* WORK DETAIL MODAL (Inspect, confirm, update, photo upload)  */}
      {/* ========================================================== */}
      {selectedTaskForModal && (
        <WorkDetailModal
          task={selectedTaskForModal}
          isOpen={Boolean(selectedTaskForModal)}
          onClose={() => setSelectedTaskForModal(null)}
        />
      )}

      {/* ========================================================== */}
      {/* URGENT MATERIAL REQUEST MODAL                              */}
      {/* ========================================================== */}
      {urgentNeedOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setUrgentNeedOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-stone-900">
                  Request Raw Craft Supplies
                </h3>
                <p className="text-xs text-stone-500">
                  Connector Fatima will receive a high-priority dispatch notice.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-stone-800 block">
                Specify Missing Materials or Tools:
              </label>
              <textarea
                value={urgentNoteText}
                onChange={(e) => setUrgentNoteText(e.target.value)}
                rows={3}
                className="w-full p-3 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
              />

              <div className="flex gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="md"
                  className="flex-1"
                  onClick={() => setUrgentNeedOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="executiveGreen"
                  size="md"
                  className="flex-1"
                  onClick={() => handleSendUrgentHelp(myBatches[0]?.id || 'batch-1')}
                >
                  Send Urgent Alert
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
