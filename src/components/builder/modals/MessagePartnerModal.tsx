import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { SkillPartnerProfile } from '../../../types';
import { Button } from '../../ui/Button';
import { X, Send, Lock, MessageSquare } from 'lucide-react';

interface MessagePartnerModalProps {
  partner: SkillPartnerProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MessagePartnerModal: React.FC<MessagePartnerModalProps> = ({ partner, isOpen, onClose }) => {
  const { sendMessage, showToast } = useApp();

  const [topic, setTopic] = useState('Production Timeline & Material Drop');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');

  if (!isOpen || !partner) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    sendMessage({
      recipientId: partner.id,
      recipientName: partner.name,
      recipientRole: 'partner',
      topic,
      content: content.trim(),
      priority,
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
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-stone-100 bg-[#FAF9F6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#01411C] text-white flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#1A2E22]">Send Message</h2>
              <p className="text-xs text-[#4A5D52]">To {partner.name} ({partner.anonymizedCode})</p>
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
          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 flex items-center gap-2 text-amber-950 text-[11px]">
            <Lock className="w-4 h-4 text-amber-800 shrink-0" />
            <span>Encrypted internal channel. Personal phone numbers and addresses are protected.</span>
          </div>

          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'normal' | 'urgent')}
              className="w-full p-2.5 text-xs border border-stone-300 rounded-xl bg-white"
            >
              <option value="normal">Normal Priority</option>
              <option value="urgent">Urgent Operational Notice</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-[#1A2E22] block mb-1">Message Content *</label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Assalam-o-Alaikum, your raw materials have been packed..."
              className="w-full p-3 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
            />
          </div>

          <div className="pt-2 border-t border-stone-200 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="executiveGreen" size="md" leftIcon={<Send className="w-4 h-4" />}>
              Send Direct Message
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
