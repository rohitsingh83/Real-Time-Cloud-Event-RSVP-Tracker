import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Video, Users, Share2, Megaphone, 
  Clock, ShieldCheck, ArrowLeft, AlertCircle, Sparkles 
} from 'lucide-react';
import { useLiveEvent } from '../hooks/useLiveEvent';
import { useLiveRSVPStats } from '../hooks/useLiveRSVPStats';
import { subscribeToAnnouncements } from '../services/announcementService';
import { useAuth } from '../context/AuthContext';
import CapacityBar from '../components/event/CapacityBar';
import RSVPActionBar from '../components/event/RSVPActionBar';
import ShareModal from '../components/event/ShareModal';
import { RSVP_STATUS } from '../config/constants';

export default function EventDetailsPage() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { event, loading: eventLoading } = useLiveEvent(id);
  const stats = useLiveRSVPStats(id, event?.capacity || 100, currentUser?.uid);
  const [announcements, setAnnouncements] = useState([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const unsub = subscribeToAnnouncements(id, (list) => {
        setAnnouncements(list);
      });
      return unsub;
    }
  }, [id]);

  if (eventLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-mono text-zinc-400">Loading Cloud Event Stream...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold text-white">Event Not Found</h2>
        <p className="text-xs text-zinc-400">The requested event ID does not exist in the cloud registry.</p>
        <Link to="/" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
          Return to Events
        </Link>
      </div>
    );
  }

  const {
    title,
    description,
    bannerUrl,
    category,
    eventDate,
    startTime,
    endTime,
    venue,
    isVirtual,
    meetingLink,
    capacity = 100,
    organizerName,
    registrationDeadline,
  } = event;

  const dateObj = new Date(eventDate || Date.now());
  const monthStr = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const dayStr = dateObj.getDate();
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

  // Filter attendees who are GOING
  const goingAttendees = stats.rsvps.filter(r => r.status === RSVP_STATUS.GOING);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
      
      {/* Top Breadcrumb & Share */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>

        <button
          onClick={() => setShareModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl glass-panel hover:glass-panel-elevated border border-zinc-700/80 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Share & QR Code</span>
        </button>
      </div>

      {/* Main Hero Card (Luma Style) */}
      <div className="glass-panel-elevated rounded-3xl overflow-hidden border border-zinc-700/80 shadow-2xl">
        
        {/* Banner with Ambient Overlay */}
        <div className="relative aspect-[21/9] w-full bg-zinc-900 overflow-hidden">
          <img
            src={bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200'}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>

          <div className="absolute top-4 left-4">
            <span className="glass-pill px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/20 shadow-lg">
              {category || 'Special Event'}
            </span>
          </div>

          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
                {dayName} • {monthStr} {dayStr}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                {title}
              </h1>
            </div>

            {/* Host Badge */}
            <div className="glass-pill px-3 py-1.5 rounded-2xl flex items-center gap-2.5 shrink-0 border border-white/10 shadow-lg">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                {organizerName?.charAt(0) || 'H'}
              </div>
              <div className="text-left">
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Organized by</p>
                <p className="text-xs font-bold text-white flex items-center gap-1">
                  {organizerName || 'Verified Host'}
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Details Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Details & Announcements */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Live Announcements Banner (if any) */}
            {announcements.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
                  <Megaphone className="w-4 h-4 text-indigo-400" />
                  <span>Live Event Broadcasts</span>
                </div>

                <div className="space-y-2">
                  {announcements.map((ann) => (
                    <div
                      key={ann.announcementId}
                      className={`p-4 rounded-2xl border ${
                        ann.priority === 'urgent'
                          ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                          : 'bg-indigo-950/30 border-indigo-500/30 text-indigo-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span>{ann.title}</span>
                        <span className="font-mono text-[10px] opacity-75">
                          {new Date(ann.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">{ann.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* About Event */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">About this Event</h3>
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* Confirmed Attendees List */}
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Confirmed Attendees ({stats.going})</span>
                </h3>
                <span className="text-xs font-mono text-zinc-400">
                  {stats.totalResponses} Total Responded
                </span>
              </div>

              {goingAttendees.length === 0 ? (
                <p className="text-xs text-zinc-500 font-mono">
                  No confirmed attendees yet. Be the first to RSVP!
                </p>
              ) : (
                <div className="flex flex-wrap gap-2 pt-1">
                  {goingAttendees.slice(0, 15).map((att) => (
                    <div
                      key={att.rsvpId}
                      className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-zinc-900 border border-zinc-800 text-xs"
                      title={att.userName}
                    >
                      <img
                        src={att.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                        alt={att.userName}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-zinc-700"
                      />
                      <span className="text-zinc-200 font-medium truncate max-w-[100px]">
                        {att.userName}
                      </span>
                    </div>
                  ))}
                  {goingAttendees.length > 15 && (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-mono text-zinc-400">
                      +{goingAttendees.length - 15}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Right Col: Logistics & Real-Time Capacity */}
          <div className="space-y-6">
            
            {/* Logistics Card */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                Event Logistics
              </h4>

              <div className="space-y-3 text-xs">
                
                {/* Date & Time */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-zinc-800 text-indigo-400 shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{dayName}, {monthStr} {dayStr}</p>
                    <p className="text-zinc-400 font-mono">{startTime} - {endTime || 'Late'}</p>
                  </div>
                </div>

                {/* Venue */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-zinc-800 text-emerald-400 shrink-0">
                    {isVirtual ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {isVirtual ? 'Virtual Meeting' : 'Physical Venue'}
                    </p>
                    <p className="text-zinc-400">
                      {isVirtual ? (
                        meetingLink ? (
                          <a href={meetingLink} target="_blank" rel="noreferrer" className="text-indigo-400 underline">
                            Join Online Stream
                          </a>
                        ) : 'Meeting link provided upon RSVP'
                      ) : (
                        venue || 'Location TBA'
                      )}
                    </p>
                  </div>
                </div>

                {/* Deadline */}
                {registrationDeadline && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-zinc-800 text-amber-400 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">RSVP Deadline</p>
                      <p className="text-zinc-400 font-mono">
                        {new Date(registrationDeadline).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Live Capacity Card */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <CapacityBar
                currentGoing={stats.going}
                capacity={capacity}
                waitlistCount={stats.waitlist}
              />
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono text-zinc-400">
                <div className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <span>Maybe: </span>
                  <strong className="text-amber-400">{stats.maybe}</strong>
                </div>
                <div className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <span>Waitlist: </span>
                  <strong className="text-rose-400">{stats.waitlist}</strong>
                </div>
              </div>
            </div>

            {/* Ticket Pass (if user already RSVPed) */}
            {stats.myRSVP?.token && stats.myRSVP?.status === RSVP_STATUS.GOING && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-violet-950/60 border border-indigo-500/30 space-y-2">
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">
                  Your Verified Access Pass
                </span>
                <p className="text-xs text-zinc-300">
                  Show this token at the entrance kiosk for rapid check-in:
                </p>
                <div className="p-2.5 bg-black/40 rounded-xl border border-indigo-500/20 font-mono font-bold text-center text-sm text-indigo-200">
                  {stats.myRSVP.token}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Floating Sticky Bottom RSVP Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-40">
        <RSVPActionBar
          event={event}
          myRSVP={stats.myRSVP}
        />
      </div>

      {/* Share & QR Code Modal */}
      <ShareModal
        event={event}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        token={stats.myRSVP?.token}
      />

    </div>
  );
}
