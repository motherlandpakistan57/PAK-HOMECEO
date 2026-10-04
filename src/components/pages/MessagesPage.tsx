import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../layout/PageContainer';
import { Button } from '../ui/Button';
import { MessageSquare, Send, User, AlertCircle, Clock } from 'lucide-react';
import { UserRole } from '../../types';

export const MessagesPage: React.FC = () => {
  const {
    messages,
    sendMessage,
    currentUser,
    skillPartners,
    connectors,
    businessBuilders,
    citizens,
  } = useApp();

  const [selectedTopic, setSelectedTopic] = useState('Production Timeline & Materials');
  const [content, setContent] = useState('');
  const [recipientId, setRecipientId] = useState('demo-partner');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    let targetName = 'Kalsoom Bibi';
    let targetRole: UserRole = 'partner';

    if (recipientId === 'demo-partner') {
      targetName = 'Kalsoom Bibi';
      targetRole = 'partner';
    } else if (recipientId === 'demo-builder') {
      targetName = 'Zainab Malik';
      targetRole = 'builder';
    } else if (recipientId === 'demo-connector') {
      targetName = 'Fatima Zehra';
      targetRole = 'connector';
    } else {
      targetName = 'Amina Siddiqui';
      targetRole = 'citizen';
    }

    sendMessage({
      recipientId,
      recipientName: targetName,
      recipientRole: targetRole,
      topic: selectedTopic,
      content,
      priority,
    });

    setContent('');
  };

  return (
    <PageContainer
      kicker="Operational Communications"
      title="Messages & Field Coordination"
      description="Direct coordination channel between Business Builders, Home Artisans, Connectors, and Citizens."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
        {/* Left: Message History List */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#718579]">
            Recent Communications ({messages.length})
          </h3>

          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-[#BBF7D0] shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1A2E22]">
                      {msg.senderName}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#01411C] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                      {msg.senderRole}
                    </span>
                    <span className="text-stone-300">→</span>
                    <span className="text-xs font-medium text-[#4A5D52]">
                      {msg.recipientName}
                    </span>
                  </div>

                  <span className="text-[10px] text-[#718579] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{msg.timestamp}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[#1A2E22]">{msg.topic}</h4>
                  {msg.priority === 'urgent' && (
                    <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-300">
                      Urgent
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#4A5D52] leading-relaxed">
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Dispatch Message Form */}
        <div className="lg:col-span-5">
          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4 sticky top-24">
            <div>
              <h3 className="text-sm font-bold text-[#1A2E22]">Dispatch Direct Message</h3>
              <p className="text-xs text-[#4A5D52] mt-0.5">
                Posting as <strong>{currentUser.name}</strong> ({currentUser.role})
              </p>
            </div>

            <form onSubmit={handleSend} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#1A2E22] block mb-1">
                  Recipient
                </label>
                <select
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
                >
                  <option value="demo-partner">Kalsoom Bibi (Skill Partner · Multan)</option>
                  <option value="demo-builder">Zainab Malik (Business Builder · Lahore)</option>
                  <option value="demo-connector">Fatima Zehra (Connector · Bahawalpur)</option>
                  <option value="demo-citizen">Amina Siddiqui (Citizen · Islamabad)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1A2E22] block mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  placeholder="e.g. Raw Material Drop Coordination"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1A2E22] block mb-1">
                  Message Content
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type operational update, supply confirmation, or craft question..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs text-[#4A5D52] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={priority === 'urgent'}
                    onChange={(e) => setPriority(e.target.checked ? 'urgent' : 'normal')}
                    className="accent-[#01411C]"
                  />
                  <span>Mark as Urgent Alert</span>
                </label>

                <Button type="submit" variant="executiveGreen" size="sm">
                  <Send className="w-3.5 h-3.5 mr-1" />
                  <span>Send Message</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
