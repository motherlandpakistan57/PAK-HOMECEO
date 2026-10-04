import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ProductCategory } from '../../../types';
import { Button } from '../../ui/Button';
import { X, Layers, Calendar, Users, Package } from 'lucide-react';

interface CreateBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateBatchModal: React.FC<CreateBatchModalProps> = ({ isOpen, onClose }) => {
  const { skillPartners, createProductionBatch, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('HUNAR');
  const [skillPartnerId, setSkillPartnerId] = useState(skillPartners[0]?.id || '');
  const [targetUnits, setTargetUnits] = useState(6);
  const [deadline, setDeadline] = useState('2026-10-25');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createProductionBatch({
      title: title.trim(),
      category,
      skillPartnerId,
      targetUnits: Number(targetUnits),
      deadline,
      notes: notes.trim() || 'Raw material distribution scheduled via field connector.',
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
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#1A2E22]">Form Production Batch</h2>
              <p className="text-xs text-[#4A5D52]">Aggregate demand into a structured artisan run</p>
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Batch Title / Product Run *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Multani Kashidakari Crimson Shawls Run #4"
              className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#1A2E22] block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl bg-white"
              >
                <option value="HUNAR">HUNAR (Crafts)</option>
                <option value="RASOI">RASOI (Foods)</option>
                <option value="KNOWLEDGE">KNOWLEDGE</option>
                <option value="SERVICES">SERVICES</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#1A2E22] block mb-1">Target Units *</label>
              <input
                type="number"
                min={1}
                required
                value={targetUnits}
                onChange={(e) => setTargetUnits(Number(e.target.value))}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Assigned Skill Partner *</label>
            <select
              value={skillPartnerId}
              onChange={(e) => setSkillPartnerId(e.target.value)}
              className="w-full p-2.5 text-xs border border-stone-300 rounded-xl bg-white"
            >
              {skillPartners.map((sp) => (
                <option key={sp.id} value={sp.id}>
                  {sp.name} ({sp.anonymizedCode}) · {sp.city} ({sp.craftExperienceYears}y exp)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Target Completion Deadline</label>
            <input
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full p-2.5 text-xs border border-stone-300 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Logistics & Material Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Packaging requirements, thread lot codes, connector drop schedule..."
              className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
            />
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="executiveGreen" size="md">
              Create & Dispatch Materials
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
