import QRCode from 'qrcode';

/**
 * Generate a high-contrast QR Data URL for a ticket or invite link
 */
export async function generateQRCode(text) {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: 320,
      margin: 2,
      color: {
        dark: '#09090b',
        light: '#ffffff',
      },
    });
    return dataUrl;
  } catch (err) {
    console.error('QR Generation Failed:', err);
    return null;
  }
}

/**
 * Format public invite and check-in links
 */
export function getInviteUrl(eventId, token) {
  const origin = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://rohitsingh83.github.io/Real-Time-Cloud-Event-RSVP-Tracker';
  const cleanOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
  if (token) {
    return `${cleanOrigin}/#/rsvp?e=${eventId}&t=${token}`;
  }
  return `${cleanOrigin}/#/event/${eventId}`;
}
