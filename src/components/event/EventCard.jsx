import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Video, Users, ArrowUpRight } from 'lucide-react';
import CapacityBar from './CapacityBar';
import { EVENT_STATUS } from '../../config/constants';

export default function EventCard({ event }) {
  const {
    eventId,
    title,
    description,
    bannerUrl,
    category,
    eventDate,
    startTime,
    venue,
    isVirtual,
    capacity = 100,
    currentGoing = 0,
    status,
    organizerName,
  } = event;

  const dateObj = new Date(eventDate || Date.now());
  const monthStr = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const dayStr = dateObj.getDate();

  const isFull = currentGoing >= capacity || status === EVENT_STATUS.FULL;

  return (
    <div className="group relative rounded-2xl glass-panel hover:glass-panel-elevated transition-all duration-300 overflow-hidden border border-zinc-800/80 hover:border-zinc-700 flex flex-col justify-between hover:-translate-y-1">
      
      {/* Banner & Floating Badges */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900">
        <img
          src={bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent"></div>

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="glass-pill px-2.5 py-1 rounded-full text-[11px] font-medium text-zinc-200 border border-white/10 shadow-lg">
            {category || 'Event'}
          </span>
        </div>

        {/* Real-Time Live Status Pill */}
        <div className="absolute top-3 right-3">
          {isFull ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-rose-500/90 text-white shadow-lg backdrop-blur-md">
              CAPACITY FULL
            </span>
          ) : (
            <span className="glass-pill px-2.5 py-1 rounded-full text-[11px] font-mono font-medium text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {capacity - currentGoing} Spots Left
            </span>
          )}
        </div>

        {/* Date Box overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-xl bg-zinc-900/90 border border-zinc-700/80 flex flex-col items-center justify-center backdrop-blur-md shadow-xl">
            <span className="text-[10px] font-bold text-indigo-400 font-mono tracking-wider">{monthStr}</span>
            <span className="text-base font-extrabold text-white leading-none">{dayStr}</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-white drop-shadow">Hosted by {organizerName || 'Verified Host'}</p>
            <p className="text-[11px] text-zinc-300 drop-shadow flex items-center gap-1">
              <Calendar className="w-3 h-3 text-zinc-400" />
              {startTime || 'TBD'}
            </p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Venue Information */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          {isVirtual ? (
            <span className="flex items-center gap-1 text-violet-400 font-medium">
              <Video className="w-3.5 h-3.5" />
              Virtual / Live Stream
            </span>
          ) : (
            <span className="flex items-center gap-1 text-zinc-400 truncate">
              <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              {venue || 'Location TBA'}
            </span>
          )}
        </div>

        {/* Live Capacity Bar */}
        <CapacityBar currentGoing={currentGoing} capacity={capacity} />

        {/* Action Link */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <Users className="w-3.5 h-3.5 text-zinc-500" />
            <span>{currentGoing} confirmed</span>
          </div>

          <Link
            to={`/event/${eventId}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all"
          >
            <span>RSVP & Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
