import React from 'react';
import { PieChart, TrendingUp, CheckCircle, HelpCircle, XCircle, Clock, Sparkles } from 'lucide-react';
import { predictAttendanceProbability } from '../../services/attendanceAiService';

export default function AnalyticsCharts({ event, stats }) {
  const { going, maybe, notGoing, waitlist, checkedIn, available, utilizationPct, totalResponses } = stats;

  const total = Math.max(1, going + maybe + notGoing + waitlist);
  const goingPct = Math.round((going / total) * 100);
  const maybePct = Math.round((maybe / total) * 100);
  const notGoingPct = Math.round((notGoing / total) * 100);
  const waitlistPct = Math.round((waitlist / total) * 100);

  // Compute AI attendance turnout prediction
  const aiPrediction = predictAttendanceProbability({
    respondedAt: event?.createdAt,
    eventDate: event?.eventDate || new Date().toISOString(),
    guestsCount: stats.totalPlusOnes || 0,
    isVirtual: event?.isVirtual || false,
    priorTurnoutRatio: 0.88,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Chart 1: RSVP Distribution Breakdown */}
      <div className="glass-panel p-6 rounded-3xl border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-bold text-white">RSVP Distribution</h4>
          </div>
          <span className="text-xs font-mono text-zinc-400">{totalResponses} Responses</span>
        </div>

        {/* Stacked Percentage Bar */}
        <div className="w-full h-4 rounded-full overflow-hidden flex bg-zinc-800 p-0.5 border border-zinc-700/60">
          <div style={{ width: `${goingPct}%` }} className="bg-emerald-500 h-full transition-all duration-500" title={`Going: ${goingPct}%`} />
          <div style={{ width: `${maybePct}%` }} className="bg-amber-500 h-full transition-all duration-500" title={`Maybe: ${maybePct}%`} />
          <div style={{ width: `${notGoingPct}%` }} className="bg-zinc-600 h-full transition-all duration-500" title={`Not Going: ${notGoingPct}%`} />
          <div style={{ width: `${waitlistPct}%` }} className="bg-rose-500 h-full transition-all duration-500" title={`Waitlist: ${waitlistPct}%`} />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Going
            </span>
            <span className="font-mono font-bold text-emerald-400">{going} ({goingPct}%)</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              Maybe
            </span>
            <span className="font-mono font-bold text-amber-400">{maybe} ({maybePct}%)</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <XCircle className="w-3.5 h-3.5 text-zinc-400" />
              Can't Go
            </span>
            <span className="font-mono font-bold text-zinc-400">{notGoing} ({notGoingPct}%)</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              Waitlist
            </span>
            <span className="font-mono font-bold text-rose-400">{waitlist} ({waitlistPct}%)</span>
          </div>
        </div>
      </div>

      {/* Chart 2: Capacity Utilization & Door Check-Ins */}
      <div className="glass-panel p-6 rounded-3xl border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">Capacity & On-Site Rate</h4>
          </div>
          <span className="text-xs font-mono text-emerald-400">{utilizationPct}% Filled</span>
        </div>

        <div className="space-y-4 pt-1">
          <div>
            <div className="flex justify-between text-xs text-zinc-400 mb-1">
              <span>Seating Utilization</span>
              <span className="font-mono text-white">{going} / {event?.capacity || 100}</span>
            </div>
            <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/50">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-700"
                style={{ width: `${utilizationPct}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-zinc-400 mb-1">
              <span>Venue Door Check-in Rate</span>
              <span className="font-mono text-white">
                {checkedIn} of {going} attended ({going > 0 ? Math.round((checkedIn / going) * 100) : 0}%)
              </span>
            </div>
            <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/50">
              <div 
                className="h-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${going > 0 ? (checkedIn / going) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-zinc-400">Available Unallocated Seats:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">{available} seats</span>
          </div>
        </div>
      </div>

      {/* Card 3: AI Turnout Prediction & Smart Nudge Engine */}
      <div className="glass-panel p-6 rounded-3xl border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <h4 className="text-sm font-bold text-white">AI Turnout Prediction</h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
            ML Heuristic
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-white font-mono">{aiPrediction.score}%</span>
          <span className="text-xs text-zinc-400">Estimated Turnout Likelihood</span>
        </div>

        <div className={`p-2.5 rounded-xl border text-xs font-medium ${aiPrediction.badgeColor}`}>
          Turnout Rating: {aiPrediction.confidenceBand}
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300 space-y-1">
          <p className="font-semibold text-zinc-200">Recommended Smart Nudge:</p>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            {aiPrediction.suggestedAction}
          </p>
        </div>
      </div>

    </div>
  );
}
