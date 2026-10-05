import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Users,
  Layers,
  HeartHandshake,
  Compass,
  Upload,
  Video,
  Play,
  RotateCcw,
  Link as LinkIcon,
  CheckCircle2,
  LogIn,
  UserPlus,
  Lock,
  Mail,
  User,
  MapPin,
  Phone,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';
import { triggerWelcomeToLoginCelebration, triggerRoleSelectCelebration } from '../../utils/celebration';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();

  // Trigger celebratory welcoming burst on landing
  React.useEffect(() => {
    triggerWelcomeToLoginCelebration();
  }, []);
  const {
    switchRole,
    setDemoMode,
    showToast,
    videoConfig,
    updateVideoConfig,
    loginAccount,
    registerAccount,
  } = useApp();

  // Auth Modes: 'demo' | 'signin' | 'register'
  const [authMode, setAuthMode] = useState<'demo' | 'signin' | 'register'>('demo');

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('citizen');
  const [regCity, setRegCity] = useState('Lahore');
  const [regPhone, setRegPhone] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  // 4 Core Platform Roles
  const roles = [
    {
      role: 'citizen' as UserRole,
      title: 'Citizen',
      urdu: 'شہری',
      badge: 'Marketplace',
      tagline: 'Browse local products, book custom pre-orders, and track doorstep deliveries.',
      icon: <Compass className="w-5 h-5 text-blue-700" />,
      accentColor: 'border-blue-200 hover:border-blue-600 hover:bg-blue-50/50',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
      route: '/citizen',
      persona: 'Amina Siddiqui',
      demoEmail: 'amina.siddiqui@pak-homeceo.pk',
    },
    {
      role: 'builder' as UserRole,
      title: 'Business Builder',
      urdu: 'کاروباری منتظم',
      badge: 'Operations',
      tagline: 'Review briefs, schedule production batches, assign artisans, and release payouts.',
      icon: <Layers className="w-5 h-5 text-[#01411C]" />,
      accentColor: 'border-emerald-200 hover:border-[#01411C] hover:bg-emerald-50/50',
      badgeBg: 'bg-emerald-100 text-[#01411C] border-emerald-200',
      route: '/business-builder',
      persona: 'Zainab Malik',
      demoEmail: 'zainab.malik@pak-homeceo.pk',
    },
    {
      role: 'partner' as UserRole,
      title: 'Skill Partner',
      urdu: 'ہنرمند ساتھی',
      badge: 'Artisan Hub',
      tagline: 'Craft production tasks with Urdu voice guidance, progress tracking, and direct pay.',
      icon: <Users className="w-5 h-5 text-[#C05638]" />,
      accentColor: 'border-orange-200 hover:border-[#C05638] hover:bg-orange-50/50',
      badgeBg: 'bg-orange-100 text-[#C05638] border-orange-200',
      route: '/skill-partner',
      persona: 'Kalsoom Bibi (KB-MLT-402)',
      demoEmail: 'kalsoom.bibi@pak-homeceo.pk',
    },
    {
      role: 'connector' as UserRole,
      title: 'Community Connector',
      urdu: 'رابطہ کار',
      badge: 'Field Ops',
      tagline: 'Doorstep raw material drops, artisan check-ins, and physical quality audits.',
      icon: <HeartHandshake className="w-5 h-5 text-[#D9822B]" />,
      accentColor: 'border-amber-200 hover:border-[#D9822B] hover:bg-amber-50/50',
      badgeBg: 'bg-amber-100 text-[#D9822B] border-amber-200',
      route: '/community-connector',
      persona: 'Fatima Zehra',
      demoEmail: 'fatima.zehra@pak-homeceo.pk',
    },
  ];

  const handleSelectDemoRole = (r: typeof roles[0]) => {
    triggerRoleSelectCelebration(r.role);
    switchRole(r.role);
    setDemoMode(true);
    showToast(`Welcome, ${r.persona}! Entering as ${r.title}.`, 'success', 'Role Activated');
    navigate(r.route);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail.trim()) {
      showToast('Please enter your email address.', 'warning');
      return;
    }
    const result = loginAccount(signInEmail, signInPassword);
    if (result.success && result.user) {
      triggerRoleSelectCelebration(result.user.role);
      const roleRoute =
        result.user.role === 'builder'
          ? '/business-builder'
          : result.user.role === 'partner'
          ? '/skill-partner'
          : result.user.role === 'connector'
          ? '/community-connector'
          : '/citizen';
      navigate(roleRoute);
    } else {
      showToast(result.message || 'Login failed.', 'error');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      showToast('Please enter your full name and email.', 'warning');
      return;
    }
    const result = registerAccount({
      name: regName,
      email: regEmail,
      password: regPassword,
      role: regRole,
      city: regCity,
      phone: regPhone,
    });
    if (result.success && result.user) {
      triggerRoleSelectCelebration(result.user.role);
      const roleRoute =
        result.user.role === 'builder'
          ? '/business-builder'
          : result.user.role === 'partner'
          ? '/skill-partner'
          : result.user.role === 'connector'
          ? '/community-connector'
          : '/citizen';
      navigate(roleRoute);
    } else {
      showToast(result.message || 'Registration failed.', 'error');
    }
  };

  // Video Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      updateVideoConfig({
        videoUrl: objectUrl,
        title: file.name.replace(/\.[^/.]+$/, ''),
        isCustomUploaded: true,
        uploadedFileName: file.name,
      });
      showToast(`Video "${file.name}" uploaded successfully!`, 'success', 'Video Configured');
    }
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    let finalUrl = customUrl.trim();
    if (finalUrl.includes('youtube.com/watch?v=')) {
      finalUrl = finalUrl.replace('watch?v=', 'embed/');
    } else if (finalUrl.includes('youtu.be/')) {
      finalUrl = finalUrl.replace('youtu.be/', 'youtube.com/embed/');
    }

    updateVideoConfig({
      videoUrl: finalUrl,
      title: 'PAK-HOMECEO Platform Showcase',
      isCustomUploaded: true,
      uploadedFileName: 'Web Video Stream',
    });
    setCustomUrl('');
    setShowUrlInput(false);
    showToast('Platform video stream updated.', 'success', 'Video Ready');
  };

  const handleResetVideo = () => {
    updateVideoConfig({
      videoUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
      isCustomUploaded: false,
      uploadedFileName: undefined,
      title: 'PAK-HOMECEO: Transforming Household Capability Into Scalable Enterprise',
    });
    showToast('Reset to platform default showcase.', 'info');
  };

  const isEmbed =
    videoConfig.videoUrl.includes('youtube.com') || videoConfig.videoUrl.includes('vimeo.com');

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A2E22] font-sans selection:bg-[#01411C]/20 selection:text-[#01411C]">
      {/* Top Navigation */}
      <header className="bg-white border-b border-stone-200/90 py-3 px-4 sm:px-6 lg:px-8 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/welcome" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#01411C] flex items-center justify-center text-white font-mono font-bold text-xs shadow-xs">
              PK
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-[#1A2E22] block font-sans">
                PAK-HOMECEO
              </span>
              <span className="text-[10px] text-[#4A5D52] font-sans block -mt-0.5">
                Pakistan Home-Enterprise Platform
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleLanguage}
              className="text-xs font-bold text-stone-700 hover:text-[#01411C] px-2.5 py-1 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <span className="text-[10px] text-[#01411C] font-mono mr-1">LANG:</span>
              <span>{language === 'en' ? 'اردو' : 'English'}</span>
            </button>
            <Link
              to="/welcome"
              className="text-xs font-semibold text-[#4A5D52] hover:text-[#01411C] transition-colors"
            >
              Overview
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Title */}
        <div className="text-center max-w-lg mx-auto space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[10px] font-bold uppercase tracking-wider text-[#01411C]">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Platform Entry & Role Access</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A2E22] tracking-tight">
            Access Your Enterprise Role
          </h1>
          <p className="text-xs text-[#4A5D52]">
            Create an account, sign in, or enter instantly via pre-configured demo personas.
          </p>
        </div>

        {/* Auth Mode Tabs (Demo, Sign In, Create Account) */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-5 sm:p-7 space-y-6">
          <div className="flex items-center justify-center p-1 bg-stone-100 rounded-2xl max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setAuthMode('demo')}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'demo'
                  ? 'bg-white text-[#01411C] shadow-2xs font-extrabold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Demo</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'signin'
                  ? 'bg-white text-[#01411C] shadow-2xs font-extrabold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'register'
                  ? 'bg-white text-[#01411C] shadow-2xs font-extrabold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* 1. DEMO CARDS TAB */}
          {authMode === 'demo' && (
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-xs font-medium text-stone-500">
                  Select a persona below to explore their dedicated role workspace instantly:
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {roles.map((r) => (
                  <div
                    key={r.role}
                    onClick={() => handleSelectDemoRole(r)}
                    className={`bg-[#FCFBFA] rounded-2xl border p-4 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group space-y-3 ${r.accentColor}`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center shrink-0 shadow-2xs">
                          {r.icon}
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${r.badgeBg}`}>
                          {r.badge}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-extrabold text-[#1A2E22] group-hover:text-[#01411C] transition-colors">
                            {r.title}
                          </h3>
                          <span className="text-xs font-serif font-bold text-stone-700">{r.urdu}</span>
                        </div>
                        <p className="text-[11px] text-[#4A5D52] leading-snug mt-1 line-clamp-2">
                          {r.tagline}
                        </p>
                      </div>

                      <div className="px-2 py-1 rounded-lg bg-white border border-stone-200/80 text-[10px] text-stone-600 truncate">
                        Persona: <strong className="text-stone-900">{r.persona}</strong>
                      </div>
                    </div>

                    <Button
                      variant="executiveGreen"
                      size="sm"
                      className="w-full text-xs font-bold justify-center py-1.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectDemoRole(r);
                      }}
                    >
                      <span>Enter as {r.title.split(' ')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. SIGN IN FORM TAB */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="max-w-md mx-auto space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1A2E22] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-stone-500" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="e.g. yourname@email.com or demo email"
                  className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#01411C] focus:bg-white"
                />
                <p className="text-[10px] text-stone-500">
                  Tip: Demo accounts (e.g. <code className="bg-stone-200 px-1 rounded">amina.siddiqui@pak-homeceo.pk</code>) can also sign in here.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1A2E22] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-stone-500" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="Enter your password (optional for demo accounts)"
                  className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#01411C] focus:bg-white"
                />
              </div>

              <Button type="submit" variant="executiveGreen" className="w-full text-xs font-bold py-2 justify-center">
                <LogIn className="w-3.5 h-3.5 mr-1" />
                <span>Sign In to Platform</span>
              </Button>
            </form>
          )}

          {/* 3. CREATE ACCOUNT TAB */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="max-w-lg mx-auto space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1A2E22] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-stone-500" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Sadia Khan"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#01411C] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1A2E22] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-stone-500" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. sadia@gmail.com"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#01411C] focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1A2E22] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#01411C]" />
                  <span>Choose Your Role *</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'citizen', label: 'Citizen', sub: 'Marketplace' },
                    { id: 'builder', label: 'Business Builder', sub: 'Operations' },
                    { id: 'partner', label: 'Skill Partner', sub: 'Artisan' },
                    { id: 'connector', label: 'Connector', sub: 'Field QC' },
                  ].map((roleOption) => (
                    <button
                      key={roleOption.id}
                      type="button"
                      onClick={() => setRegRole(roleOption.id as UserRole)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        regRole === roleOption.id
                          ? 'border-[#01411C] bg-[#F0FDF4] text-[#01411C] font-extrabold shadow-2xs'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <div className="text-xs">{roleOption.label}</div>
                      <div className="text-[9px] text-stone-500 font-normal">{roleOption.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1A2E22] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-500" />
                    <span>City</span>
                  </label>
                  <input
                    type="text"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    placeholder="e.g. Karachi / Multan"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#01411C] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1A2E22] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-stone-500" />
                    <span>Mobile Phone</span>
                  </label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#01411C] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1A2E22] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-stone-500" />
                    <span>Password</span>
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Choose password"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#01411C] focus:bg-white"
                  />
                </div>
              </div>

              <Button type="submit" variant="executiveGreen" className="w-full text-xs font-bold py-2 justify-center">
                <UserPlus className="w-3.5 h-3.5 mr-1" />
                <span>Create Account & Enter Platform</span>
              </Button>
            </form>
          )}

          {/* Workflow Sequence Banner */}
          <div className="border-t border-stone-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-stone-600">
            <div className="flex items-center gap-1.5 text-stone-800 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Closed-Loop Workflow:</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-medium text-stone-700">
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 font-bold">1. Citizen Orders</span>
              <ArrowRight className="w-3 h-3 text-stone-400" />
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">2. Product Manager Assigns</span>
              <ArrowRight className="w-3 h-3 text-stone-400" />
              <span className="px-2 py-0.5 rounded-md bg-orange-50 text-orange-800 border border-orange-200 font-bold">3. Skill Partner Crafts</span>
              <ArrowRight className="w-3 h-3 text-stone-400" />
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold">4. Connector QC & Drop</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PLATFORM SHOWCASE VIDEO (Excellently Placed at the Bottom)                 */}
        {/* ========================================================================= */}
        <section className="bg-stone-950 rounded-3xl p-5 sm:p-7 text-white border border-stone-800 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800/80 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#01411C] flex items-center justify-center text-[#86EFAC]">
                  <Video className="w-4 h-4" />
                </div>
                <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  PAK-HOMECEO Cinematic Platform Showcase
                </h2>
              </div>
              <p className="text-xs text-stone-400">
                Visual demonstration of home enterprise transformation across Pakistan.
              </p>
            </div>

            {/* Video Controls Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <Button
                size="sm"
                variant="executiveGreen"
                leftIcon={<Upload className="w-3.5 h-3.5" />}
                onClick={() => fileInputRef.current?.click()}
                className="text-xs"
              >
                Upload Video
              </Button>

              <Button
                size="sm"
                variant="outline"
                leftIcon={<LinkIcon className="w-3.5 h-3.5" />}
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-xs text-stone-200 border-stone-700 hover:bg-stone-800"
              >
                Set URL
              </Button>

              {videoConfig.isCustomUploaded && (
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  onClick={handleResetVideo}
                  className="text-xs text-stone-400 hover:text-white"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Collapsible URL input */}
          {showUrlInput && (
            <form
              onSubmit={handleApplyCustomUrl}
              className="p-3 bg-stone-900 rounded-2xl border border-stone-800 flex gap-2"
            >
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="Paste YouTube or direct video URL (e.g. https://www.youtube.com/watch?v=...)"
                className="flex-1 px-3 py-1.5 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-[#86EFAC]"
              />
              <Button type="submit" variant="executiveGreen" size="sm">
                Apply
              </Button>
            </form>
          )}

          {/* Cinematic Video Player Container */}
          <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-black border border-stone-800/90 shadow-2xl flex items-center justify-center group">
            {videoConfig.isCustomUploaded && (videoConfig.videoUrl.startsWith('blob:') || videoConfig.videoUrl.endsWith('.mp4') || videoConfig.videoUrl.endsWith('.webm')) ? (
              <video
                src={videoConfig.videoUrl}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-contain"
              >
                Your browser does not support HTML5 video.
              </video>
            ) : isEmbed ? (
              <iframe
                src={videoConfig.videoUrl}
                title={videoConfig.title}
                className="w-full h-full border-0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div 
                className="relative w-full h-full cursor-pointer"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
              >
                <img
                  src={videoConfig.videoUrl}
                  alt={videoConfig.title}
                  className="w-full h-full object-cover brightness-70 group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-black/40 backdrop-blur-2xs space-y-3">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white ml-1 fill-white" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                      Platform Story & Ecosystem Overview (Click to Upload / Play)
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold max-w-md">
                      {videoConfig.title}
                    </h3>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-3.5 px-4 text-center text-xs text-stone-500 font-sans">
        PAK-HOMECEO · Transforming Home Skills into Dignity, Income, and Purpose across Pakistan.
      </footer>
    </div>
  );
};
