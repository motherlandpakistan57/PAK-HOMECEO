import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';
import { OFFICIAL_VISUAL_LIBRARY } from '../../data/visualLibrary';
import {
  Upload,
  Video,
  Play,
  RotateCcw,
  Link as LinkIcon,
  Check,
  Sparkles,
  Trash2,
  Tag,
  Maximize2,
  ShieldCheck,
  Plus,
  Layers,
  Camera,
  Film,
  Eye,
  Info,
} from 'lucide-react';

export const PlatformMediaUploader: React.FC = () => {
  const {
    videoConfig,
    updateVideoConfig,
    customImages,
    addCustomImage,
    removeCustomImage,
    clearCustomImages,
    showToast,
  } = useApp();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'video' | 'images' | 'official'>('video');

  // Video state
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [videoTitleInput, setVideoTitleInput] = useState(videoConfig.title);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<'16:9' | '4:3' | '1:1'>(
    videoConfig.aspectRatio || '16:9'
  );

  // Image upload state
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    'hunar' | 'menue' | 'knowledge' | 'services' | 'landscape' | 'artisan' | 'community'
  >('hunar');
  const [imageCaptionInput, setImageCaptionInput] = useState('');
  const [previewingImage, setPreviewingImage] = useState<string | null>(null);

  // Handle Video File Upload
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      updateVideoConfig({
        videoUrl: objectUrl,
        title: file.name.replace(/\.[^/.]+$/, ''),
        isCustomUploaded: true,
        uploadedFileName: file.name,
      });
      showToast(`Video "${file.name}" uploaded successfully and ready for playback!`, 'success', 'Video Configured');
    }
  };

  // Handle Video URL submission
  const handleApplyVideoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customVideoUrl.trim()) return;

    let finalUrl = customVideoUrl.trim();
    if (finalUrl.includes('youtube.com/watch?v=')) {
      finalUrl = finalUrl.replace('watch?v=', 'embed/');
    } else if (finalUrl.includes('youtu.be/')) {
      finalUrl = finalUrl.replace('youtu.be/', 'youtube.com/embed/');
    }

    updateVideoConfig({
      videoUrl: finalUrl,
      title: videoTitleInput.trim() || 'PAK-HOMECEO Platform Video',
      isCustomUploaded: true,
      uploadedFileName: 'Web Video Stream',
      aspectRatio: selectedAspectRatio,
    });
    setCustomVideoUrl('');
    showToast('Platform video stream configured successfully.', 'success', 'Video Ready');
  };

  // Reset video
  const handleResetVideo = () => {
    updateVideoConfig({
      videoUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
      isCustomUploaded: false,
      uploadedFileName: undefined,
      title: 'PAK-HOMECEO: Transforming Household Capability Into Scalable Enterprise',
      aspectRatio: '16:9',
    });
    setVideoTitleInput('PAK-HOMECEO: Transforming Household Capability Into Scalable Enterprise');
    showToast('Video settings reset to platform default showcase.', 'info', 'Video Reset');
  };

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          addCustomImage({
            name: file.name,
            dataUrl,
            category: selectedCategory,
            caption:
              imageCaptionInput.trim() ||
              `${file.name.replace(/\.[^/.]+$/, '')} · Pakistani Heritage Asset`,
          });
        }
      };
      reader.readAsDataURL(file);
    });

    setImageCaptionInput('');
    if (imageFileInputRef.current) {
      imageFileInputRef.current.value = '';
    }
  };

  const isVideoEmbed =
    videoConfig.videoUrl.includes('youtube.com') ||
    videoConfig.videoUrl.includes('vimeo.com') ||
    videoConfig.videoUrl.includes('player.');

  const categoryLabels = {
    hunar: 'HOMECEO HUNAR (Crafts)',
    menue: 'HOMECEO MENUE (Food Enterprise)',
    knowledge: 'HOMECEO KNOWLEDGE (Heritage)',
    services: 'HOMECEO SERVICES',
    landscape: 'Landscape & Architecture',
    artisan: 'Master Artisan Dignity',
    community: 'Community Commerce & Field',
  };

  return (
    <section className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden font-sans">
      {/* Header bar */}
      <div className="bg-[#FAF9F6] border-b border-stone-200/80 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[10px] font-bold uppercase tracking-wider text-[#01411C]">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Platform Media & Cultural Visual Studio</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A2E22] tracking-tight">
            Video Settings & Platform Visual Assets Upload Space
          </h2>
          <p className="text-xs sm:text-sm text-[#4A5D52]">
            Configure your uploaded platform overview video and curate additional authentic Pakistani images for product catalogs, stories, and background showcases.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-stone-200 rounded-2xl shrink-0 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'video'
                ? 'bg-[#01411C] text-white shadow-xs'
                : 'text-[#4A5D52] hover:text-[#01411C] hover:bg-stone-50'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video Settings</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'images'
                ? 'bg-[#01411C] text-white shadow-xs'
                : 'text-[#4A5D52] hover:text-[#01411C] hover:bg-stone-50'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Upload Images ({customImages.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('official')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'official'
                ? 'bg-[#01411C] text-white shadow-xs'
                : 'text-[#4A5D52] hover:text-[#01411C] hover:bg-stone-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Official Visuals (9)</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 sm:p-8">
        {/* TAB 1: VIDEO SETTINGS */}
        {activeTab === 'video' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Video Player Display */}
              <div className="lg:col-span-7 space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 shadow-lg aspect-video flex items-center justify-center">
                  {isVideoEmbed ? (
                    <iframe
                      src={videoConfig.videoUrl}
                      title={videoConfig.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : videoConfig.isCustomUploaded && videoConfig.videoUrl.startsWith('blob:') ? (
                    <video
                      src={videoConfig.videoUrl}
                      controls
                      className="w-full h-full object-cover"
                      poster={videoConfig.posterUrl}
                    >
                      Your browser does not support HTML5 video.
                    </video>
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src={videoConfig.videoUrl}
                        alt={videoConfig.title}
                        className="w-full h-full object-cover brightness-75"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-black/40 backdrop-blur-2xs space-y-3">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                          <Play className="w-6 h-6 text-white ml-1 fill-white" />
                        </div>
                        <div>
                          <p className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                            PAK-HOMECEO Cinematic Showcase
                          </p>
                          <h3 className="text-base sm:text-lg font-extrabold mt-1 max-w-md">
                            {videoConfig.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#FAF9F6] rounded-2xl border border-stone-200 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1A2E22]">Active Source:</span>
                    <span className="font-mono text-stone-600 truncate max-w-xs">
                      {videoConfig.isCustomUploaded
                        ? videoConfig.uploadedFileName || 'Custom Video Stream'
                        : 'Official Platform Showcase'}
                    </span>
                  </div>
                  {videoConfig.isCustomUploaded && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#01411C] font-bold text-[10px] border border-emerald-300">
                      Custom Configured
                    </span>
                  )}
                </div>
              </div>

              {/* Video Controls & Uploader */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-stone-200 space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-[#1A2E22] flex items-center gap-2">
                      <Upload className="w-4 h-4 text-[#01411C]" />
                      <span>Option A: Upload Your Video File</span>
                    </h3>
                    <p className="text-xs text-[#4A5D52]">
                      Upload your MP4, WebM, or MOV video file directly to showcase on the platform.
                    </p>
                  </div>

                  <input
                    ref={videoFileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileUpload}
                    className="hidden"
                  />

                  <Button
                    onClick={() => videoFileInputRef.current?.click()}
                    variant="executiveGreen"
                    className="w-full justify-center"
                    size="md"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    <span>Select Video File from Computer</span>
                  </Button>
                </div>

                {/* Option B: Stream URL */}
                <form
                  onSubmit={handleApplyVideoUrl}
                  className="bg-[#FAF9F6] p-6 rounded-2xl border border-stone-200 space-y-4"
                >
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-[#1A2E22] flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-[#01411C]" />
                      <span>Option B: Set Video Stream / Embed URL</span>
                    </h3>
                    <p className="text-xs text-[#4A5D52]">
                      Enter a YouTube, Vimeo, or direct MP4 URL to stream seamlessly.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#1A2E22] block mb-1">
                        Video Title
                      </label>
                      <input
                        type="text"
                        value={videoTitleInput}
                        onChange={(e) => setVideoTitleInput(e.target.value)}
                        placeholder="e.g. PAK-HOMECEO: Transforming Household Capability"
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-[#01411C]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#1A2E22] block mb-1">
                        Video URL / Embed Link
                      </label>
                      <input
                        type="url"
                        value={customVideoUrl}
                        onChange={(e) => setCustomVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=... or https://.../video.mp4"
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-[#01411C]"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        type="submit"
                        disabled={!customVideoUrl.trim()}
                        variant="primary"
                        size="sm"
                        className="flex-1 justify-center"
                      >
                        <Check className="w-4 h-4 mr-1.5" />
                        <span>Apply Video Stream</span>
                      </Button>

                      {videoConfig.isCustomUploaded && (
                        <Button
                          type="button"
                          onClick={handleResetVideo}
                          variant="outline"
                          size="sm"
                          className="text-stone-600"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1" />
                          <span>Reset</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: IMAGE UPLOAD & GALLERY SPACE */}
        {activeTab === 'images' && (
          <div className="space-y-8">
            {/* Upload Toolbar */}
            <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-stone-200 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-[#1A2E22] flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#01411C]" />
                    <span>Upload Authentic Pakistani Visuals</span>
                  </h3>
                  <p className="text-xs text-[#4A5D52]">
                    Add high-resolution photos of handicrafts, food enterprises, landscapes, and artisan work. All photos are stored in local platform assets.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <input
                    ref={imageFileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => imageFileInputRef.current?.click()}
                    variant="executiveGreen"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    <span>Upload Images from Device</span>
                  </Button>
                  {customImages.length > 0 && (
                    <Button
                      onClick={clearCustomImages}
                      variant="outline"
                      size="sm"
                      className="text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      <span>Clear All</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Tagging bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-[#1A2E22] block mb-1">
                    Assign Platform Category Tag
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-[#01411C]"
                  >
                    <option value="hunar">HOMECEO HUNAR (Handicrafts & Textiles)</option>
                    <option value="menue">HOMECEO MENUE (Food Enterprise & Kitchens)</option>
                    <option value="knowledge">HOMECEO KNOWLEDGE (Heritage & Pedagogy)</option>
                    <option value="services">HOMECEO SERVICES</option>
                    <option value="landscape">Pakistan Landscape & Architecture</option>
                    <option value="artisan">Experienced Artisan Story & Dignity</option>
                    <option value="community">Community Commerce & Bazaar</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-[#1A2E22] block mb-1">
                    Custom Photo Caption / Heritage Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={imageCaptionInput}
                    onChange={(e) => setImageCaptionInput(e.target.value)}
                    placeholder="e.g. Multan Silk Thread Looming by Artisan Collective"
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-[#01411C]"
                  />
                </div>
              </div>
            </div>

            {/* Uploaded Images Grid */}
            {customImages.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-stone-200 bg-[#FAF9F6] space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center mx-auto text-stone-400 shadow-2xs">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1A2E22]">No custom images uploaded yet</h4>
                  <p className="text-xs text-[#4A5D52] max-w-sm mx-auto mt-1">
                    Click the &quot;Upload Images from Device&quot; button above to add authentic photos for your PAK-HOMECEO platform.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#4A5D52]">
                  <span className="font-bold text-[#1A2E22]">
                    Uploaded Visual Pool ({customImages.length} images)
                  </span>
                  <span>Instant preview & platform allocation</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {customImages.map((img) => (
                    <div
                      key={img.id}
                      className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                        <img
                          src={img.dataUrl}
                          alt={img.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#01411C]/90 text-white text-[9px] font-bold uppercase tracking-wider backdrop-blur-xs">
                          {img.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeCustomImage(img.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600/90 hover:bg-red-700 text-white shadow-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Delete image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-3 space-y-1">
                        <p className="text-xs font-bold text-[#1A2E22] truncate">{img.caption}</p>
                        <p className="text-[10px] text-stone-500 truncate">{img.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: OFFICIAL VISUAL REFERENCE LIBRARY */}
        {activeTab === 'official' && (
          <div className="space-y-6">
            <div className="bg-[#F0FDF4] p-4 rounded-2xl border border-[#BBF7D0] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#01411C] font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#01411C]" />
                <span>9 Contextually Mapped Official Pakistani Cultural Visuals</span>
              </div>
              <span className="text-[10px] font-mono text-[#01411C] uppercase font-bold">
                100% Cultural Accuracy Guarded
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(OFFICIAL_VISUAL_LIBRARY).map(([key, item]) => (
                <div
                  key={key}
                  className="bg-[#FAF9F6] rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:border-[#01411C] transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-16/10 bg-stone-900 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-[#01411C]/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                      {item.mappedRole.toUpperCase()}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold text-[#1A2E22]">{item.titleEn}</h4>
                      <span className="text-xs font-serif text-amber-950 font-bold">{item.titleUr}</span>
                    </div>
                    <p className="text-xs text-[#4A5D52] leading-relaxed line-clamp-2">
                      {item.contextUsage}
                    </p>
                    <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between text-[11px] font-bold text-[#01411C]">
                      <span className="truncate max-w-[200px]">{item.culturalNotes}</span>
                      <span>Verified ✓</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
