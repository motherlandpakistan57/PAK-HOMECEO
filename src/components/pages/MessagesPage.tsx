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

  const isCitizen = currentUser.role === 'citizen' || currentUser.role === 'patron';
  const isArtisanOrConnector = currentUser.role === 'partner' || currentUser.role === 'connector';

  const [selectedTopic, setSelectedTopic] = useState('Order Brief & Customization');
  const [content, setContent] = useState('');
  const [recipientId, setRecipientId] = useState(
    isCitizen || isArtisanOrConnector ? 'demo-builder' : 'demo-partner'
  );
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    let targetName = 'Zainab Malik';
    let targetRole: UserRole = 'builder';

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
      kicker="Closed-Loop Communications"
      title="Messages & Operational Coordination"
      description="Direct coordination channel. Citizens communicate exclusively with Business Builders, who orchestrate operations with Skill Partners and Community Connectors."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
        {/* Left: Message History List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#718579]">
              Cross-Team Communications ({messages.length})
            </h3>
            <span className="text-[10px] font-mono text-[#01411C] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
              Closed-Loop Channel Active
            </span>
          </div>

          {/* Department Channel Badges */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-[#718579] mr-1">Channels:</span>
            <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-[#01411C] font-semibold border border-emerald-300 text-[10px]">
              Citizen ↔ Manager
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-semibold border border-amber-300 text-[10px]">
              Manager ↔ Artisan
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-blue-100 text-blue-900 font-semibold border border-blue-300 text-[10px]">
              Manager ↔ Field Connector
            </span>
          </div>

          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-[#BBF7D0] shadow-2xs space-y-2.5 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[#1A2E22]">
                      {msg.senderName}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#01411C] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                      {msg.senderRole}
                    </span>
                    <span className="text-stone-300 font-mono">➔</span>
                    <span className="text-xs font-medium text-[#4A5D52]">
                      {msg.recipientName}
                    </span>
                    <span className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded font-mono">
                      ({msg.recipientRole})
                    </span>
                  </div>

                  <span className="text-[10px] text-[#718579] flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{msg.timestamp}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[#1A2E22]">{msg.topic}</h4>
                  {msg.priority === 'urgent' && (
                    <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-300">
                      Urgent Alert
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#4A5D52] leading-relaxed bg-[#FAF9F6] p-3 rounded-xl border border-stone-100">
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
                {isCitizen ? (
                  <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#01411C]">
                      <span>Zainab Malik (Enterprise Lead & Business Builder)</span>
                    </div>
                    <p className="text-[10px] text-[#4A5D52]">
                      Citizens communicate directly with the Business Builder, who manages production batches with artisans & connectors.
                    </p>
                  </div>
                ) : isArtisanOrConnector ? (
                  <select
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
                  >
                    <option value="demo-builder">Zainab Malik (Business Builder · Operations Lead)</option>
                    <option value="demo-connector">Fatima Zehra (Field Connector · Bahawalpur)</option>
                  </select>
                ) : (
                  <select
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#01411C]"
                  >
                    <option value="demo-citizen">Amina Siddiqui (Citizen / Patron · Islamabad)</option>
                    <option value="demo-partner">Kalsoom Bibi (Skill Partner · Multan)</option>
                    <option value="demo-connector">Fatima Zehra (Field Connector · Bahawalpur)</option>
                  </select>
                )}
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
