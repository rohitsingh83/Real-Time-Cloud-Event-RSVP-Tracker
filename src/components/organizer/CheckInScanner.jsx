import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Search, CheckCircle2, AlertCircle, Volume2, UserCheck, ShieldAlert } from 'lucide-react';
import { checkInAttendee } from '../../services/rsvpService';

export default function CheckInScanner({ eventId, onCheckInComplete }) {
  const [tokenInput, setTokenInput] = useState('');
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const scannerRef = useRef(null);

  // Synthesize pleasant success/error chime using Web Audio API
  const playSound = (isSuccess) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (isSuccess) {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      }
    } catch {
      // AudioContext fallback
    }
  };

  const handleProcessToken = async (targetToken) => {
    const cleanToken = targetToken.trim();
    if (!cleanToken) return;

    const res = await checkInAttendee(eventId, cleanToken);
    setResult(res);
    playSound(res.success);

    if (res.success && onCheckInComplete) {
      onCheckInComplete(res.attendee);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleProcessToken(tokenInput);
    setTokenInput('');
  };

  // HTML5 Webcam QR Scanner initialization
  const toggleCameraScanner = async () => {
    if (scanning) {
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch (e) {
          console.error(e);
        }
      }
      setScanning(false);
      return;
    }

    setCameraError(null);
    try {
      const { Html5QrcodeScanner } = await import('html5-qrcode');
      setScanning(true);

      setTimeout(() => {
        const scanner = new Html5QrcodeScanner(
          'qr-reader-target',
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        );
        scannerRef.current = scanner;

        scanner.render(
          (decodedText) => {
            // Extracted URL or raw token
            let scannedToken = decodedText;
            if (decodedText.includes('t=')) {
              scannedToken = new URL(decodedText).searchParams.get('t');
            }
            handleProcessToken(scannedToken);
            scanner.clear();
            setScanning(false);
          },
          (err) => {
            // frame scanning error (expected during continuous capture)
          }
        );
      }, 200);

    } catch (err) {
      setCameraError('Webcam unavailable or permissions denied. You can manually enter ticket tokens.');
      setScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch {}
      }
    };
  }, []);

  return (
    <div className="glass-panel p-6 rounded-3xl border border-zinc-800 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Digital Check-In Kiosk</h3>
            <p className="text-xs text-zinc-400">Scan ticket QR code or enter attendee ticket token</p>
          </div>
        </div>

        <button
          onClick={toggleCameraScanner}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            scanning
              ? 'bg-rose-600 hover:bg-rose-500 text-white'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>{scanning ? 'Stop Camera' : 'Open Camera Scanner'}</span>
        </button>
      </div>

      {/* Camera Viewport Container */}
      {scanning && (
        <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex flex-col items-center">
          <div id="qr-reader-target" className="w-full max-w-sm rounded-xl overflow-hidden"></div>
          <p className="text-xs text-zinc-400 mt-2 font-mono">Align the attendee QR code within the frame</p>
        </div>
      )}

      {cameraError && (
        <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-xs text-amber-200 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Manual Token Verification Input */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <label className="text-xs font-semibold text-zinc-300 block">
          Manual Ticket ID / Token Verification
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="e.g. TKT-CH3N-9841 or rsvp-1"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-600/20"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Verify & Check In</span>
          </button>
        </div>
      </form>

      {/* Live Result Feedback Card */}
      {result && (
        <div className={`p-4 rounded-2xl border transition-all ${
          result.success
            ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
            : result.alreadyCheckedIn
            ? 'bg-amber-950/50 border-amber-500/40 text-amber-200'
            : 'bg-rose-950/50 border-rose-500/40 text-rose-200'
        }`}>
          <div className="flex items-start gap-3">
            {result.success ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 shrink-0" />
            )}
            <div className="space-y-1 flex-1">
              <div className="font-bold text-sm">
                {result.message}
              </div>

              {result.attendee && (
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-white font-bold">{result.attendee.userName}</span>
                    <span className="text-zinc-400 ml-2">({result.attendee.userEmail})</span>
                  </div>
                  <div className="text-zinc-300">
                    Badge: <strong className="text-white">+{result.attendee.guestsCount} guests</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
