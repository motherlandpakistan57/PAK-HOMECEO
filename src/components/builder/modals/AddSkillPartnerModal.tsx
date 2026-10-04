import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Button } from '../../ui/Button';
import { X, UserPlus, ShieldCheck } from 'lucide-react';

interface AddSkillPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddSkillPartnerModal: React.FC<AddSkillPartnerModalProps> = ({ isOpen, onClose }) => {
  const { addNewSkillPartner, connectors } = useApp();

  const [name, setName] = useState('');
  const [skillTitle, setSkillTitle] = useState('Master Kashidakari Artisan');
  const [specialty, setSpecialty] = useState('Generational counted-thread silk resham embroidery and mirror setting');
  const [city, setCity] = useState('Multan');
  const [district, setDistrict] = useState('Old City Quarter');
  const [experience, setExperience] = useState(15);
  const [assignedConnector, setAssignedConnector] = useState(connectors[0]?.name || 'Fatima Zehra');
  const [voiceScript, setVoiceScript] = useState('Welcome to PAK-HOMECEO. Your materials have been dropped at your doorstep.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const initials = name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    const cityCode = city.slice(0, 3).toUpperCase();
    const randNum = Math.floor(100 + Math.random() * 900);
    const anonymizedCode = `${initials}-${cityCode}-${randNum}`;

    addNewSkillPartner({
      name: name.trim(),
      anonymizedCode,
      skillTitle: skillTitle.trim(),
      specialty: specialty.trim(),
      city: city.trim(),
      district: district.trim(),
      craftExperienceYears: Number(experience),
      voiceGuidanceScript: voiceScript.trim(),
      consentRecorded: true,
      assignedConnectorName: assignedConnector,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    });

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150 font-sans"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-stone-100 bg-[#FAF9F6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#01411C] text-white flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#1A2E22]">Onboard Skill Partner</h2>
              <p className="text-xs text-[#4A5D52]">Register master home producer & assign local connector</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Full Legal Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Parveen Akhtar"
              className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#1A2E22] block mb-1">City / Region *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Multan"
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-[#1A2E22] block mb-1">Craft Experience (Years)</label>
              <input
                type="number"
                min={1}
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Master Skill Title *</label>
            <input
              type="text"
              required
              value={skillTitle}
              onChange={(e) => setSkillTitle(e.target.value)}
              placeholder="e.g. Master Kashidakari Needlecraft Artisan"
              className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Craft Specialty & Materials</label>
            <textarea
              rows={2}
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Assigned Field Connector</label>
            <select
              value={assignedConnector}
              onChange={(e) => setAssignedConnector(e.target.value)}
              className="w-full p-2.5 text-xs border border-stone-300 rounded-xl bg-white"
            >
              <option value="Fatima Zehra">Fatima Zehra (Multan / Bahawalpur Coordinator)</option>
              <option value="Saima Parveen">Saima Parveen (Sargodha Coordinator)</option>
              <option value="Zainab Malik">Zainab Malik (Direct Hub Lead)</option>
            </select>
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="executiveGreen" size="md">
              Onboard Artisan & Generate Code
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
