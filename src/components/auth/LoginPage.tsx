import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  ArrowRight,
  Phone,
  Mail,
  Sparkles,
  CheckCircle2,
  Users,
  Layers,
  HeartHandshake,
  Compass,
  Upload,
  Video,
  Play,
  RotateCcw,
  Link as LinkIcon,
  Check,
  Lock,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const {
    switchRole,
    setDemoMode,
    showToast,
    videoConfig,
    updateVideoConfig,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [showCredentialsForm, setShowCredentialsForm] = useState(false);
  const [authPhone, setAuthPhone] = useState('0300-7821940');
  const [authRole, setAuthRole] = useState<UserRole>('builder');

  // The 4 Core Platform Roles
  const roles = [
    {
      role: 'citizen' as UserRole,
      title: 'Citizen',
      badge: 'Marketplace Access',
      tagline: 'Discover artisan stories, buy authentic heritage goods, and track closed-loop deliveries.',
      icon: <Compass className="w-6 h-6 text-blue-700" />,
      bgLight: 'bg-blue-50/60 border-blue-200/80',
      route: '/citizen',
      persona: 'Amina Siddiqui · Citizen',
      highlights: [
        'Direct ethical purchases with ~70% going to makers',
        'Live 6-stage order tracking to your doorstep',
        'Real Pakistani heritage without charity or pity',
      ],
    },
    {
      role: 'builder' as UserRole,
      title: 'Business Builder (Product Manager)',
      badge: 'Command Center',
      tagline: 'Oversee enterprise operations, receive citizen orders, allocate batches, and verify quality audits.',
      icon: <Layers className="w-6 h-6 text-[#01411C]" />,
      bgLight: 'bg-[#F0FDF4] border-[#BBF7D0]',
      route: '/business-builder',
      persona: 'Zainab Malik · Operations Lead',
      highlights: [
        'Centralized order intake & batch synthesis',
        '6-point physical doorstep quality signoffs',
        'Escrow verification & direct artisan payout release',
      ],
    },
    {
      role: 'partner' as UserRole,
      title: 'Skill Partner (Master Artisan)',
      badge: 'Artisan Hub',
      tagline: 'Turning home-based skills into income, dignity, and purpose in later life with Urdu voice guidance.',
      icon: <Users className="w-6 h-6 text-[#01411C]" />,
      bgLight: 'bg-[#F0FDF4] border-[#BBF7D0]',
      route: '/skill-partner',
      persona: 'Kalsoom Bibi (KB-MLT-402) · Multan',
      highlights: [
        'Dignified, high-contrast, large-touch interface',
        'Voice instructions in Urdu for domestic artisans',
        'Direct mobile wallet earnings (PKR) without middlemen',
      ],
    },
    {
      role: 'connector' as UserRole,
      title: 'Community Connector',
      badge: 'Field Operations',
      tagline: 'Doorstep raw material delivery, gentle physical checks, and local human encouragement.',
      icon: <HeartHandshake className="w-6 h-6 text-amber-700" />,
      bgLight: 'bg-amber-50/60 border-amber-200/80',
      route: '/community-connector',
      persona: 'Fatima Zehra · Field Coordinator',
      highlights: [
        'Doorstep check-ins & raw material drop-offs',
        'Fast 3-step field workflow (Open → Verify → Log)',
        'Human connection and artisan encouragement',
      ],
    },
  ];

  const handleSelectRole = (r: typeof roles[0]) => {
    switchRole(r.role);
    setDemoMode(true);
    showToast(`Entering as ${r.title}. Welcome to PAK-HOMECEO!`, 'success', 'Role Activated');
    navigate(r.route);
  };

  // Video Upload Handlers
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
      showToast(`Video "${file.name}" uploaded and ready for display!`, 'success', 'Video Uploaded');
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
      title: 'Platform Overview Video',
      isCustomUploaded: true,
      uploadedFileName: 'Web Video Stream',
    });
    setCustomUrl('');
    setShowUrlInput(false);
    showToast('Video URL updated successfully!', 'success', 'Video Configured');
  };

  const handleResetVideo = () => {
    updateVideoConfig({
      videoUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
      isCustomUploaded: false,
      uploadedFileName: undefined,
      title: 'PAK-HOMECEO: Transforming Household Capability Into Scalable Enterprise',
    });
    showToast('Video player reset to platform default showcase.', 'info', 'Video Reset');
  };

  const isEmbed = videoConfig.videoUrl.includes('youtube.com') || videoConfig.videoUrl.includes('vimeo.com');

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A2E22] font-sans selection:bg-[#01411C]/20 selection:text-[#01411C]">
      {/* Top Header */}
      <header className="bg-white border-b border-stone-200/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/welcome" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#01411C] flex items-center justify-center text-white shadow-xs">
              <span className="font-mono font-extrabold text-xs tracking-tighter">PK</span>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-[#1A2E22] block font-sans">
                PAK-HOMECEO
              </span>
              <span className="text-[10px] text-[#4A5D52] font-sans block -mt-0.5">
                Pakistan Women-Led Enterprise Platform
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleLanguage}
              className="text-xs font-bold text-stone-700 hover:text-[#01411C] px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span className="text-[10px] text-[#01411C] font-mono uppercase">Lang:</span>
              <span>{language === 'en' ? 'اردو' : 'English'}</span>
            </button>
            <Link
              to="/welcome"
              className="text-xs font-semibold text-[#4A5D52] hover:text-[#01411C] transition-colors hidden sm:block"
            >
              Back to Overview
            </Link>
            <Button
              onClick={() => {
                switchRole('citizen');
                navigate('/citizen');
              }}
              variant="outline"
              size="sm"
            >
              <span>Citizen Marketplace</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12">
        {/* Role Selection Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[11px] font-bold uppercase tracking-wider text-[#01411C]">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Select Your Role to Enter Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A2E22] tracking-tight">
            Role-Based Access
          </h1>

          <p className="text-xs sm:text-sm text-[#4A5D52] leading-relaxed">
            Choose your perspective in the closed-loop system. Each role is designed around human dignity,
            clear responsibilities, and transparent economic participation.
          </p>
        </div>

        {/* 4 Role-Based Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((r) => (
            <div
              key={r.role}
              onClick={() => handleSelectRole(r)}
              className="bg-white rounded-3xl border-2 border-stone-200 hover:border-[#01411C] shadow-xs hover:shadow-xl transition-all duration-200 p-6 sm:p-7 flex flex-col justify-between cursor-pointer group space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center shrink-0">
                      {r.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#01411C] px-2 py-0.5 rounded-md bg-[#DCFCE7] border border-[#BBF7D0]">
                        {r.badge}
                      </span>
                      <h2 className="text-lg sm:text-xl font-extrabold text-[#1A2E22] group-hover:text-[#01411C] transition-colors mt-1 font-sans">
                        {r.title}
                      </h2>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#4A5D52] leading-relaxed font-medium">
                  {r.tagline}
                </p>

                {/* Persona Header */}
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
                  <span className="text-stone-600 font-medium">
                    Demo Account: <strong className="text-stone-900">{r.persona}</strong>
                  </span>
                  <span className="text-[11px] font-mono text-[#01411C] font-bold">1-Click Live</span>
                </div>

                {/* Highlights */}
                <ul className="space-y-1.5 text-xs text-stone-600 pt-1">
                  {r.highlights.map((h, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#01411C] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant="executiveGreen"
                size="md"
                className="w-full font-bold shadow-xs group-hover:shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectRole(r);
                }}
              >
                <span>Enter as {r.title}</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>

        {/* Collapsible Direct Credentials / Phone Form Option */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setShowCredentialsForm(!showCredentialsForm)}
            className="text-xs font-semibold text-[#4A5D52] hover:text-[#01411C] underline transition-colors cursor-pointer"
          >
            {showCredentialsForm ? 'Hide credentials sign-in' : 'Or sign in with Phone / Password'}
          </button>

          {showCredentialsForm && (
            <div className="mt-4 max-w-md mx-auto p-5 bg-white rounded-2xl border border-stone-200 text-left space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Mobile Phone (Pakistan)</label>
                <input
                  type="text"
                  value={authPhone}
                  onChange={(e) => setAuthPhone(e.target.value)}
                  className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
                  placeholder="0300-XXXXXXX"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Assign Workspace</label>
                <select
                  value={authRole}
                  onChange={(e) => setAuthRole(e.target.value as UserRole)}
                  className="w-full p-2.5 text-xs border border-stone-300 rounded-xl bg-white"
                >
                  <option value="citizen">Citizen (Marketplace Access)</option>
                  <option value="builder">Business Builder (Operations Lead)</option>
                  <option value="partner">Skill Partner (Artisan Hub)</option>
                  <option value="connector">Community Connector (Field Ops)</option>
                </select>
              </div>

              <Button
                onClick={() => {
                  switchRole(authRole);
                  const target =
                    authRole === 'citizen' || authRole === 'patron'
                      ? '/citizen'
                      : authRole === 'builder'
                      ? '/business-builder'
                      : authRole === 'partner'
                      ? '/skill-partner'
                      : '/community-connector';
                  navigate(target);
                }}
                variant="executiveGreen"
                size="sm"
                className="w-full"
              >
                Sign In to Workspace
              </Button>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* PLATFORM VIDEO SHOWCASE & UPLOAD (Explicitly requested by user)           */}
        {/* ========================================================================= */}
        <section className="pt-6 border-t border-stone-200/80 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#01411C]" />
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A2E22]">
                  Platform Overview Video
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#4A5D52] mt-1">
                Watch the complete platform walk-through, or upload your own video below to display here for all users.
              </p>
            </div>

            {/* Video Controls Action Bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                onChange={handleFileUpload}
                className="hidden"
              />

              <Button
                size="sm"
                variant="executiveGreen"
                leftIcon={<Upload className="w-4 h-4" />}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Video File
              </Button>

              <Button
                size="sm"
                variant="outline"
                leftIcon={<LinkIcon className="w-4 h-4" />}
                onClick={() => setShowUrlInput(!showUrlInput)}
              >
                Embed Video URL
              </Button>

              {videoConfig.isCustomUploaded && (
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  onClick={handleResetVideo}
                  title="Reset to default showcase"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Optional Direct URL Input Drawer */}
          {showUrlInput && (
            <form onSubmit={handleApplyCustomUrl} className="p-4 bg-white rounded-2xl border border-stone-200 flex gap-2">
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="Paste video URL (e.g. https://www.youtube.com/watch?v=... or direct MP4 link)"
                className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
              />
              <Button type="submit" variant="executiveGreen" size="sm">
                Apply URL
              </Button>
            </form>
          )}

          {/* Video Player Display Container */}
          <div className="bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-16/9 relative group">
            {videoConfig.isCustomUploaded && videoConfig.videoUrl.startsWith('blob:') ? (
              <video
                src={videoConfig.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain bg-black"
              >
                Your browser does not support the video tag.
              </video>
            ) : isEmbed ? (
              <iframe
                src={videoConfig.videoUrl}
                title={videoConfig.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={videoConfig.videoUrl}
                  alt="PAK-HOMECEO Cinematic Landscape"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-full bg-[#01411C] hover:bg-[#025c27] text-white flex items-center justify-center shadow-xl hover:scale-105 transition-all cursor-pointer border-2 border-white/40"
                  >
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold max-w-lg">
                      {videoConfig.title}
                    </h3>
                    <p className="text-xs text-stone-200 mt-1 max-w-md">
                      Click the upload button to load your platform video file (.mp4, .webm). It will play directly inside this frame.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="executiveGreen"
                    onClick={() => fileInputRef.current?.click()}
                    leftIcon={<Upload className="w-4 h-4" />}
                  >
                    Select Video from Your Computer
                  </Button>
                </div>
              </div>
            )}

            {/* Video Status Badge */}
            <div className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-semibold border border-white/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{videoConfig.uploadedFileName ? `Custom Video: ${videoConfig.uploadedFileName}` : 'Platform Video Player Ready'}</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 px-4 text-center text-xs text-stone-500 font-sans mt-12">
        PAK-HOMECEO · Every Home Can Become an Enterprise. Every Woman Can Become a CEO.
      </footer>
    </div>
  );
};
