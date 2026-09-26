export const RSVP_STATUS = {
  GOING: 'GOING',
  MAYBE: 'MAYBE',
  NOT_GOING: 'NOT_GOING',
  WAITLISTED: 'WAITLISTED',
};

export const EVENT_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  FULL: 'FULL',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const USER_ROLES = {
  ATTENDEE: 'attendee',
  ORGANIZER: 'organizer',
  ADMIN: 'admin',
};

export const EVENT_CATEGORIES = [
  'Tech & AI',
  'Webinar & Workshop',
  'College Festival',
  'Hackathon',
  'Networking & Meetup',
  'Conference',
  'Social & Community',
];

export const DEMO_USERS = {
  ORGANIZER: {
    uid: 'demo-org-101',
    email: 'organizer@cloudtracker.dev',
    displayName: 'Alex Rivers (Organizer)',
    role: USER_ROLES.ORGANIZER,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  ATTENDEE_A: {
    uid: 'demo-user-201',
    email: 'sarah.chen@techhub.io',
    displayName: 'Sarah Chen (Attendee A)',
    role: USER_ROLES.ATTENDEE,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  ATTENDEE_B: {
    uid: 'demo-user-202',
    email: 'marcus.vance@cloudlab.org',
    displayName: 'Marcus Vance (Attendee B)',
    role: USER_ROLES.ATTENDEE,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  }
};
