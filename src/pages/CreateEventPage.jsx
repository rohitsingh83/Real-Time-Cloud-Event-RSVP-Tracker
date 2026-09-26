import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Sparkles, MapPin, Video, Users, Clock, Image, ArrowRight } from 'lucide-react';
import { createEvent } from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import { EVENT_CATEGORIES, EVENT_STATUS } from '../config/constants';

const SAMPLE_BANNERS = [
  { label: 'Tech Conference', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200' },
  { label: 'AI Workshop', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200' },
  { label: 'Startup Pitch', url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200' },
  { label: 'Campus Festival', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200' },
];

export default function CreateEventPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: EVENT_CATEGORIES[0],
    bannerUrl: SAMPLE_BANNERS[0].url,
    eventDate: '2026-11-10',
    startTime: '14:00',
    endTime: '17:30',
    isVirtual: false,
    venue: '',
    meetingLink: '',
    capacity: 50,
    registrationDeadline: '2026-11-09T23:59',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newEvent = await createEvent({
        ...formData,
        capacity: parseInt(formData.capacity, 10) || 50,
        status: EVENT_STATUS.PUBLISHED,
      }, currentUser);

      navigate(`/event/${newEvent.eventId}`);
    } catch (err) {
      alert(err.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 pb-20">
      
      <div>
        <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block">
          Event Architect Studio
        </span>
        <h1 className="text-3xl font-extrabold text-white mt-1">Create New Cloud Event</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Publish an event with atomic capacity protection, real-time subscriber listeners, and instant tokenized links.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-zinc-700/80 shadow-2xl space-y-6">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">1. Event Identity</h3>
          
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Event Title</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. NextGen Cloud Architecture & Microservices 2026"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white focus:outline-none"
              >
                {EVENT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Event Banner Preset</label>
              <select
                name="bannerUrl"
                value={formData.bannerUrl}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white focus:outline-none"
              >
                {SAMPLE_BANNERS.map(b => (
                  <option key={b.url} value={b.url}>{b.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Description</label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Describe the agenda, speakers, refreshments, prerequisites, and instructions..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>

        {/* Schedule & Location */}
        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">2. Date, Timing & Venue</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Event Date</label>
              <input
                type="date"
                name="eventDate"
                required
                value={formData.eventDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white focus:outline-none"
              >
              </input>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Start Time</label>
              <input
                type="time"
                name="startTime"
                required
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isVirtual"
              name="isVirtual"
              checked={formData.isVirtual}
              onChange={handleChange}
              className="rounded bg-zinc-900 border-zinc-700 text-indigo-600 focus:ring-0"
            />
            <label htmlFor="isVirtual" className="text-xs font-medium text-zinc-300 cursor-pointer">
              This is a Virtual Online Event (Google Meet / Zoom / YouTube Live)
            </label>
          </div>

          {formData.isVirtual ? (
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Meeting Link</label>
              <input
                type="url"
                name="meetingLink"
                placeholder="https://meet.google.com/abc-defg-hij"
                value={formData.meetingLink}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Physical Venue Location</label>
              <input
                type="text"
                name="venue"
                required={!formData.isVirtual}
                placeholder="e.g. Auditorium Hall 4, Innovation Building, Tech Park"
                value={formData.venue}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Capacity & Limits */}
        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">3. Capacity & Deadlines</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Max Capacity (Enforces Concurrency Lock)
              </label>
              <input
                type="number"
                name="capacity"
                min={1}
                max={5000}
                required
                value={formData.capacity}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white focus:outline-none font-mono"
              />
              <p className="text-[11px] text-zinc-500 mt-1 font-mono">
                Additional RSVP requests will safely transition to WAITLIST.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Registration Cutoff Deadline</label>
              <input
                type="datetime-local"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xl shadow-indigo-600/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>{submitting ? 'Publishing Event...' : 'Publish Event to Cloud'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
