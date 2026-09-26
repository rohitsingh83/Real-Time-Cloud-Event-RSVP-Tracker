import React from 'react';
import { Users, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function CapacityBar({ currentGoing, capacity, waitlistCount = 0 }) {
  const cap = Math.max(1, capacity);
  const going = currentGoing || 0;
  const pct = Math.min(100, Math.round((going / cap) * 100));
  const remaining = Math.max(0, cap - going);

  let barColor = 'bg-gradient-to-r from-emerald-500 to-teal-400';
  let badgeColor = 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';

  if (pct >= 100) {
    barColor = 'bg-gradient-to-r from-rose-600 to-amber-500';
    badgeColor = 'text-rose-400 border-rose-500/20 bg-rose-500/10';
  } else if (pct >= 80) {
    barColor = 'bg-gradient-to-r from-amber-500 to-emerald-400';
    badgeColor = 'text-amber-400 border-amber-500/20 bg-amber-500/10';
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
          <Users className="w-3.5 h-3.5 text-zinc-400" />
          <span>Capacity Status</span>
        </div>

        <div className="flex items-center gap-2">
          {pct >= 100 ? (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-mono font-medium ${badgeColor}`}>
              <AlertTriangle className="w-3 h-3" />
              Event Full ({waitlistCount > 0 ? `${waitlistCount} on waitlist` : 'Waitlist Open'})
            </span>
          ) : (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-mono font-medium ${badgeColor}`}>
              <CheckCircle2 className="w-3 h-3" />
              {remaining} {remaining === 1 ? 'seat' : 'seats'} left
            </span>
          )}
          <span className="font-mono text-zinc-400">{going} / {cap}</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2.5 bg-zinc-800/80 rounded-full overflow-hidden p-0.5 border border-zinc-700/50">
        <div 
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
