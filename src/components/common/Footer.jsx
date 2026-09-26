import React from 'react';
import { Cloud, Radio, Shield, Zap, GitBranch, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Cloud className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">CloudRSVP</span>
            </div>
            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
              A high-concurrency, real-time event planning and live RSVP tracker engineered for zero-latency synchronization, atomic race-condition prevention, and frictionless token invitations.
            </p>
            <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                ACID Transactions
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                WebSocket & onSnapshot
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Zero-Cost Cloud Tier
              </span>
            </div>
          </div>

          {/* Cloud Concepts Covered */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-200 mb-3 uppercase tracking-wider font-mono">
              Cloud Concepts
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>• Real-Time Cloud DB Sync</li>
              <li>• Atomic Concurrency Locks</li>
              <li>• Role-Based Access Control</li>
              <li>• Frictionless Tokenized Auth</li>
              <li>• Observability & Live Counters</li>
              <li>• ML Attendance Prediction</li>
            </ul>
          </div>

          {/* GitHub & Placement Credentials */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-200 mb-3 uppercase tracking-wider font-mono">
              Architecture Reference
            </h4>
            <p className="text-xs text-zinc-400 mb-3">
              Engineered with React 18, Vite, Tailwind CSS, Firebase Firestore & Functions, and Framer Motion.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
              <GitBranch className="w-3.5 h-3.5" />
              <span>Placement Ready v1.0.0</span>
            </div>
          </div>

        </div>

        <div className="border-t border-zinc-800/60 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 CloudRSVP. Built for Cloud Computing Engineering Capstone Showcase.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for cloud portfolio excellence.
          </p>
        </div>
      </div>
    </footer>
  );
}
