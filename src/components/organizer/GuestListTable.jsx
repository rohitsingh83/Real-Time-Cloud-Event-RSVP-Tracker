import React, { useState, useMemo } from 'react';
import { Search, Download, CheckCircle, Clock, User, QrCode, Filter } from 'lucide-react';
import { RSVP_STATUS } from '../../config/constants';
import { checkInAttendee } from '../../services/rsvpService';

export default function GuestListTable({ eventId, rsvps = [], onListRefresh }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = useMemo(() => {
    return rsvps.filter((r) => {
      const matchSearch = 
        (r.userName || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.userEmail || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.token || '').toLowerCase().includes(search.toLowerCase());
      
      const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [rsvps, search, statusFilter]);

  const handleToggleCheckIn = async (attendee) => {
    await checkInAttendee(eventId, attendee.token || attendee.rsvpId);
    if (onListRefresh) onListRefresh();
  };

  const handleExportCSV = () => {
    if (!rsvps.length) return;
    const headers = ['Name,Email,Status,GuestsCount,Token,CheckedIn,CheckInTime,RespondedAt'];
    const rows = rsvps.map(r => 
      `"${r.userName || ''}","${r.userEmail || ''}","${r.status}","${r.guestsCount || 0}","${r.token || ''}","${r.checkInStatus ? 'YES' : 'NO'}","${r.checkInTime || ''}","${r.respondedAt || ''}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `event_${eventId}_attendees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel rounded-3xl border border-zinc-800 overflow-hidden space-y-4">
      
      {/* Controls Bar */}
      <div className="p-6 border-b border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name, email, or token..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filter and CSV Export */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
            >
              <option value="ALL">All Statuses ({rsvps.length})</option>
              <option value={RSVP_STATUS.GOING}>Going Only</option>
              <option value={RSVP_STATUS.MAYBE}>Maybe Only</option>
              <option value={RSVP_STATUS.WAITLISTED}>Waitlist Only</option>
              <option value={RSVP_STATUS.NOT_GOING}>Can't Go</option>
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-zinc-200 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800/80 text-[11px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-900/40">
              <th className="py-3 px-6">Attendee</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">+1 Guests</th>
              <th className="py-3 px-4">Ticket Token</th>
              <th className="py-3 px-4">Check-In Status</th>
              <th className="py-3 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50 text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-zinc-500 font-mono">
                  No RSVP records found matching criteria.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const isGoing = item.status === RSVP_STATUS.GOING;
                const isWaitlist = item.status === RSVP_STATUS.WAITLISTED;
                const isMaybe = item.status === RSVP_STATUS.MAYBE;

                return (
                  <tr key={item.rsvpId} className="hover:bg-zinc-800/30 transition-colors">
                    
                    {/* Attendee Name & Avatar */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                          alt={item.userName}
                          className="w-8 h-8 rounded-full ring-1 ring-zinc-700 object-cover"
                        />
                        <div>
                          <div className="font-semibold text-white">{item.userName || 'Anonymous'}</div>
                          <div className="text-[11px] text-zinc-400 font-mono">{item.userEmail}</div>
                        </div>
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-4">
                      {isGoing ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          GOING
                        </span>
                      ) : isWaitlist ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          WAITLIST
                        </span>
                      ) : isMaybe ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          MAYBE
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
                          CAN'T GO
                        </span>
                      )}
                    </td>

                    {/* Guests */}
                    <td className="py-3.5 px-4 font-mono text-zinc-300">
                      +{item.guestsCount || 0}
                    </td>

                    {/* Token */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-indigo-300">
                        {item.token || 'N/A'}
                      </span>
                    </td>

                    {/* Check-In Badge */}
                    <td className="py-3.5 px-4">
                      {item.checkInStatus ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Checked In
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-6 text-right">
                      {isGoing && (
                        <button
                          onClick={() => handleToggleCheckIn(item)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            item.checkInStatus
                              ? 'bg-zinc-800 text-zinc-400 hover:text-white'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                          }`}
                        >
                          {item.checkInStatus ? 'Undo' : 'Check In'}
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
