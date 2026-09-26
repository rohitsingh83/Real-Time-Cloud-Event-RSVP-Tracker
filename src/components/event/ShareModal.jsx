import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, QrCode, Share2, ExternalLink } from 'lucide-react';
import { generateQRCode, getInviteUrl } from '../../services/qrService';

export default function ShareModal({ event, isOpen, onClose, token = null }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const inviteUrl = getInviteUrl(event?.eventId, token);

  useEffect(() => {
    if (isOpen && event) {
      generateQRCode(inviteUrl).then((url) => setQrDataUrl(url));
    }
  }, [isOpen, event, inviteUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${event?.title || 'event'}-QR.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-panel-elevated rounded-3xl p-6 border border-zinc-700/80 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Share & Invite Link</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Code Presentation */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-indigo-500/20">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Event QR Code" className="w-48 h-48 rounded-lg" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-zinc-400 text-xs">
                Generating QR...
              </div>
            )}
          </div>
          <p className="text-xs text-zinc-400 text-center font-mono">
            Scan with smartphone camera to RSVP instantly
          </p>
        </div>

        {/* Invite Link Copy Box */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-300">Direct Invitation URL</label>
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700/80 rounded-xl p-1.5 pl-3">
            <input
              type="text"
              readOnly
              value={inviteUrl}
              className="bg-transparent text-xs text-zinc-300 w-full focus:outline-none font-mono"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleDownloadQR}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center justify-center gap-2 border border-zinc-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download QR
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`You're invited to ${event?.title}! RSVP here: ${inviteUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            WhatsApp Share
          </a>
        </div>

      </div>
    </div>
  );
}
