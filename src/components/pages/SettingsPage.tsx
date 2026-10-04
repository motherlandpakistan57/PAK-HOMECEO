import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../layout/PageContainer';
import { Button } from '../ui/Button';
import {
  User,
  Settings,
  Bell,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { UserRole } from '../../types';

export const SettingsPage: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    currentRole,
    switchRole,
    demoMode,
    setDemoMode,
    resetDemo,
    openConfirmDialog,
    showToast,
  } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [city, setCity] = useState(currentUser.city);
  const [email, setEmail] = useState(currentUser.email);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [productionAlerts, setProductionAlerts] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name,
      phone,
      city,
      email,
    });
    showToast('Profile credentials and preferences updated successfully.', 'success', 'Settings Saved');
  };

  const handleResetDemoConfirm = () => {
    openConfirmDialog({
      title: 'Reset Demo to Initial State',
      message: 'This will reset all production orders, batches, inspections, and financial ledgers back to seed data.',
      confirmLabel: 'Reset Data',
      variant: 'warning',
      onConfirm: () => {
        resetDemo();
      },
    });
  };

  return (
    <PageContainer
      kicker="Platform Governance"
      title="Enterprise Settings & Identity"
      description="Manage role identity, alert preferences, and demonstration simulation controls."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
        {/* Left Column: Profile Card & Demo Mode */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs text-center space-y-4">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-[#F0FDF4] shadow-xs"
            />
            <div>
              <div className="flex items-center justify-center gap-1.5">
                <h3 className="text-base font-bold text-[#1A2E22]">{currentUser.name}</h3>
                {currentUser.verified && (
                  <span className="w-4 h-4 rounded-full bg-[#01411C] text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-xs text-[#4A5D52] mt-0.5">{currentUser.title}</p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-stone-100 text-[#01411C] px-2 py-0.5 rounded border border-stone-200">
                  {currentUser.code}
                </span>
                <span className="text-[11px] text-[#718579]">{currentUser.city}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 text-left space-y-1.5 text-xs text-[#4A5D52]">
              <div className="flex items-center justify-between">
                <span>Active Role:</span>
                <strong className="text-[#01411C] capitalize">{currentRole}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Status:</span>
                <span className="text-emerald-700 font-semibold">Active & Verified</span>
              </div>
            </div>
          </div>

          {/* Demo Mode Configuration */}
          <div className="p-5 bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold text-[#01411C] uppercase tracking-wider">
                  Demo Simulation
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setDemoMode(!demoMode)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer ${
                  demoMode
                    ? 'bg-[#01411C] text-white'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {demoMode ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <p className="text-xs text-[#4A5D52] leading-relaxed">
              In demo mode, you can freely switch between the 4 fictional personas to inspect the customized navigation and workflows for each role.
            </p>

            {demoMode && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#718579] block">
                  Quick Switch Persona
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {[
                    { id: 'builder', label: 'Business Builder' },
                    { id: 'partner', label: 'Skill Partner' },
                    { id: 'connector', label: 'Connector' },
                    { id: 'citizen', label: 'Citizen' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => switchRole(r.id as UserRole)}
                      className={`p-2 rounded-xl font-bold transition-all text-left cursor-pointer ${
                        currentRole === r.id
                          ? 'bg-[#01411C] text-white shadow-xs'
                          : 'bg-white text-[#1A2E22] hover:bg-stone-50 border border-stone-200'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <Button
                    onClick={handleResetDemoConfirm}
                    variant="secondary"
                    size="sm"
                    className="w-full bg-white hover:bg-stone-50"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                    <span>Reset Demo to Seed State</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Profile Edit & Alerts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Identity Form */}
          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#1A2E22]">Profile Credentials</h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#1A2E22] block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#1A2E22] block mb-1">
                    Phone / Mobile Wallet
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#1A2E22] block mb-1">
                    City / Cluster Hub
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#1A2E22] block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
                  />
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="pt-4 border-t border-stone-100 space-y-3">
                <h4 className="text-xs font-bold text-[#1A2E22]">Notification Channels</h4>
                <div className="space-y-2 text-xs text-[#4A5D52]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={orderAlerts}
                      onChange={(e) => setOrderAlerts(e.target.checked)}
                      className="accent-[#01411C]"
                    />
                    <span>Receive new customer order notifications & batch assignments</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productionAlerts}
                      onChange={(e) => setProductionAlerts(e.target.checked)}
                      className="accent-[#01411C]"
                    />
                    <span>Receive raw material delivery updates & QC audit signoffs</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentAlerts}
                      onChange={(e) => setPaymentAlerts(e.target.checked)}
                      className="accent-[#01411C]"
                    />
                    <span>Receive instant mobile wallet payout settlement notifications</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end pt-3">
                <Button type="submit" variant="executiveGreen" size="sm">
                  <span>Save Changes</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
