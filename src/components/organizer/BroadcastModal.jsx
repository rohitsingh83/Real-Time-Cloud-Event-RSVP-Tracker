import React, { useState } from 'react';
import { Megaphone, X, Send, AlertTriangle, CheckCircle } from 'lucide-react';
import { broadcastAnnouncement } from '../../services/announcementService';

export default function BroadcastModal({ eventId, isOpen, onClose, onBroadcastSuccess }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('normal');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setSending(true);
    try {
      await broadcastAnnouncement(eventId, { title, message, priority });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setTitle('');
        setMessage('');
        onClose();
        if (onBroadcastSuccess) onBroadcastSuccess();
      }, 1200);
    } catch (err) {
      console.error('Broadcast failed:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel-elevated rounded-3xl p-6 border border-zinc-700 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Broadcast Announcement</h3>
              <p className="text-xs text-zinc-400">Push instant live update to all attendee dashboards</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-2 text-emerald-400">
            <CheckCircle className="w-12 h-12 animate-bounce" />
            <p className="font-bold text-sm">Announcement Broadcasted!</p>
            <p className="text-xs text-zinc-400">Synced to all active attendee screens.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Title */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Announcement Headline
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Venue Updated to Hall B / Keynote starts in 15 mins"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Detailed Message
              </label>
              <textarea
                required
                rows={3}
                placeholder="Write instructions, room numbers, or links for attendees..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Priority Selection */}
            <div className="flex items-center gap-4 text-xs">
              <span className="text-zinc-400 font-medium">Notification Level:</span>
              <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  checked={priority === 'normal'}
                  onChange={() => setPriority('normal')}
                  className="text-indigo-600 focus:ring-0"
                />
                Normal Info
              </label>
              <label className="flex items-center gap-1.5 text-rose-300 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  checked={priority === 'urgent'}
                  onChange={() => setPriority('urgent')}
                  className="text-rose-600 focus:ring-0"
                />
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  Urgent Alert
                </span>
              </label>
            </div>

            {/* Submit */}
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-medium hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-indigo-600/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{sending ? 'Broadcasting...' : 'Publish Update'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
