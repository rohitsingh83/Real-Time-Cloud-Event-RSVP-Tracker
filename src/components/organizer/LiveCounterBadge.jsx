import React from 'react';

export default function LiveCounterBadge({ value, label, color = 'indigo', subtext = null }) {
  const colorMap = {
    indigo: {
      border: 'border-indigo-500/30',
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      dot: 'bg-indigo-500',
    },
    emerald: {
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      dot: 'bg-emerald-500',
    },
    amber: {
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      dot: 'bg-amber-500',
    },
    rose: {
      border: 'border-rose-500/30',
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      dot: 'bg-rose-500',
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div className={`p-4 rounded-2xl glass-panel border ${scheme.border} relative overflow-hidden transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
          {label}
        </span>
        <span className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${scheme.dot} animate-pulse`}></span>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">Live</span>
        </span>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className={`text-3xl font-extrabold tracking-tight ${scheme.text} font-mono`}>
          {value}
        </span>
        {subtext && (
          <span className="text-xs text-zinc-500 font-mono">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}
