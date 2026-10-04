import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConnectorTask, ProductionBatch } from '../../types';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
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
} from 'lucide-react';
import { OFFICIAL_VISUAL_LIBRARY } from '../../data/visualLibrary';

interface ConnectorDashboardProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const ConnectorDashboard: React.FC<ConnectorDashboardProps> = ({
  activeTab: externalTab,
  setActiveTab: setExternalTab,
}) => {
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

  const [internalTab, setInternalTab] = useState<'home' | 'women' | 'visits' | 'tasks' | 'messages'>('home');
  const currentTab = externalTab || internalTab;
  const setTab = setExternalTab || setInternalTab;

  const [selectedBatchForDrop, setSelectedBatchForDrop] = useState<string>('');
  const [dropNotes, setDropNotes] = useState('Raw materials verified and hand-delivered directly to artisan.');
  const [showDropModal, setShowDropModal] = useState(false);

  // Quick visit recording modal (Section 13: Open person → Record visit → Update status → Add note → Submit)
  const [recordingVisitArtisan, setRecordingVisitArtisan] = useState<string | null>(null);
  const [visitPurpose, setVisitPurpose] = useState<'material_drop' | 'quality_audit' | 'safety_check' | 'payment_reconciliation'>('quality_audit');
  const [visitOutcome, setVisitOutcome] = useState<'satisfactory' | 'needs_supplies' | 'revision_requested'>('satisfactory');
  const [visitNotes, setVisitNotes] = useState('Standard physical craft check completed. Work atmosphere dignified and safe.');

  const pendingTasks = connectorTasks.filter((t) => t.status === 'pending');
  const completedTasks = connectorTasks.filter((t) => t.status === 'completed');
  const ordersNeedingQC = orders.filter((o) => o.status === 'quality_check');

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
  };

  const handleSaveVisit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Visit recorded for ${recordingVisitArtisan}: ${visitPurpose.replace('_', ' ')} (${visitOutcome.replace('_', ' ')}).`);
    setRecordingVisitArtisan(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <PageHeader
        kicker="Community Field Network"
        roleBadge="Fatima Zehra · Multan & Bahawalpur Lead"
        title="Field Facilitation & Ground Trust"
        description="Preserving human connection: distributing raw supplies, verifying safety standards, and ensuring home artisan privacy is protected."
        primaryAction={
          <Button
            variant="primary"
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
          label="Completed Field Audits"
          value={completedTasks.length}
          sublabel="100% compliance certified"
          variant="default"
        />
        <StatCard
          label="Dignity Standard"
          value="100%"
          sublabel="Private home privacy sealed"
          variant="lightGreen"
        />
      </div>

      {/* Community Connector Grassroots Commerce Context (Lahore Bazaar) */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-7 text-white bg-stone-900 border border-stone-800 shadow-md mb-8">
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
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            The Trusted Bridge Between Home Artisans & the Citizen Marketplace
          </h2>
          <p className="text-xs text-stone-200 leading-relaxed">
            Community Connectors manage raw material distribution, verify physical craft quality at doorsteps, and safeguard household dignity with zero exploitation.
          </p>
        </div>
      </div>

      {/* TAB 1: HOME & TASKS */}
      {(currentTab === 'home' || currentTab === 'tasks' || currentTab === 'visits') && (
        <div className="space-y-6">
          {/* Order Doorstep Quality Verifications */}
          {ordersNeedingQC.length > 0 && (
            <div className="p-5 rounded-3xl bg-amber-50/80 border-2 border-amber-300 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-700 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-amber-950">
                      Doorstep Quality Checks Awaiting Verification ({ordersNeedingQC.length})
                    </h3>
                    <p className="text-xs text-amber-800">
                      Artisans have completed handcrafting. Please conduct 6-point physical craft audit at their doorstep.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 w-fit">
                  Field Audit Required
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ordersNeedingQC.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 bg-white rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                          {ord.trackingNumber}
                        </span>
                        <StatusBadge status={ord.status} type="order" />
                      </div>
                      <h4 className="text-sm font-extrabold text-[#1A2E22] mt-1.5">{ord.productTitle}</h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Maker: <strong>{ord.assignedPerson || ord.skillPartnerName}</strong> ({ord.customerCity || 'Cluster Hub'})
                      </p>
                      {ord.orderBrief?.customizationRequirements && (
                        <p className="text-[11px] text-amber-900 mt-1 bg-amber-50 p-2 rounded-lg">
                          Custom Brief: "{ord.orderBrief.customizationRequirements}"
                        </p>
                      )}
                    </div>

                    <Button
                      size="sm"
                      variant="executiveGreen"
                      leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-300" />}
                      onClick={() => handleVerifyOrderQuality(ord.id)}
                    >
                      Approve 6-Point Physical QC
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1A2E22] font-sans">Scheduled Field Route & Tasks</h3>
            <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#718579]">
              {pendingTasks.length} pending actions
            </span>
          </div>

          <div className="space-y-3">
            {connectorTasks.map((task) => (
              <Card
                key={task.id}
                className={`p-5 transition-all ${
                  task.status === 'completed' ? 'bg-stone-50/70 border-stone-200' : 'bg-white border-stone-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-900">{task.scheduledDate}</span>
                      <span className="text-stone-300">·</span>
                      <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                        {task.taskType.replace('_', ' ')}
                      </span>
                      <span className="text-stone-300">·</span>
                      <span className="text-xs text-stone-600 font-semibold">{task.artisanName} ({task.artisanCode})</span>
                    </div>

                    <p className="text-xs text-stone-800 font-medium">{task.description}</p>

                    <div className="flex items-center gap-3 text-[11px] text-stone-500">
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
                        variant="secondary"
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        onClick={() => completeConnectorTask(task.id)}
                      >
                        Complete Task
                      </Button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: WOMEN (ARTISANS ROSTER) */}
      {(currentTab === 'women' || currentTab === 'messages') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 font-serif">Assigned Women Artisan Roster ({skillPartners.length})</h3>
            <span className="text-xs text-stone-500">Fast field visit logging</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillPartners.map((artisan) => (
              <Card key={artisan.id} className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-stone-900">{artisan.name}</h4>
                    <p className="text-xs text-stone-500 font-mono">{artisan.anonymizedCode} · {artisan.city}</p>
                    <p className="text-xs font-semibold text-emerald-800 mt-0.5">{artisan.skillTitle}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRecordingVisitArtisan(artisan.name)}
                  >
                    Record Visit
                  </Button>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl space-y-1 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Specialty:</span>
                    <span className="font-semibold text-stone-800">{artisan.specialty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Production:</span>
                    <span className="font-mono font-bold text-stone-800">{artisan.activeBatchesCount} Batches</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consent Status:</span>
                    <span className="font-semibold text-emerald-700">Verbal & Recorded on File</span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-500 italic bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                  "{artisan.voiceGuidanceScript}"
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* QUICK VISIT RECORDING MODAL (Section 13) */}
      {recordingVisitArtisan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900 mb-1">
              Record Field Visit for {recordingVisitArtisan}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Structured entry to minimize typing while maintaining audit standards.
            </p>

            <form onSubmit={handleSaveVisit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Visit Purpose</label>
                <select
                  value={visitPurpose}
                  onChange={(e) => setVisitPurpose(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700 bg-white"
                >
                  <option value="material_drop">Raw Supply Drop-Off</option>
                  <option value="quality_audit">Physical Quality Audit</option>
                  <option value="safety_check">Home Workspace Safety Review</option>
                  <option value="payment_reconciliation">Payout & Receipt Verification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Visit Outcome</label>
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
                      className={`p-2 rounded-lg border text-center text-xs font-semibold cursor-pointer ${
                        visitOutcome === o.id
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-stone-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Field Observations</label>
                <textarea
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setRecordingVisitArtisan(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
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
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900 mb-1">Confirm Raw Material Handover</h3>
            <p className="text-xs text-stone-500 mb-4">
              Sign off on physical delivery of thread, jars, packaging, or fabric directly to the home artisan.
            </p>

            <form onSubmit={handleConfirmDrop} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Target Production Batch</label>
                <select
                  value={selectedBatchForDrop}
                  onChange={(e) => setSelectedBatchForDrop(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700 bg-white"
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
                <label className="block text-xs font-semibold text-stone-700 mb-1">Verification Field Notes</label>
                <textarea
                  value={dropNotes}
                  onChange={(e) => setDropNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowDropModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
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
