import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function capture() {
  console.log('🚀 Launching Chrome to capture high-res LinkedIn showcase screenshots...');
  
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,960']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 2 }); // Retina 2x crisp quality

  const targets = [
    {
      name: '01_home_and_events.png',
      url: 'https://rohitsingh83.github.io/Real-Time-Cloud-Event-RSVP-Tracker/#/',
      waitFor: 3500,
      title: 'Luma-Style Event Discovery & Landing Showcase'
    },
    {
      name: '02_event_details_rsvp.png',
      url: 'https://rohitsingh83.github.io/Real-Time-Cloud-Event-RSVP-Tracker/#/event/evt-cloud-summit-2026',
      waitFor: 3500,
      title: 'Event Details & Interactive RSVP Action Bar'
    },
    {
      name: '03_organizer_command_center.png',
      url: 'https://rohitsingh83.github.io/Real-Time-Cloud-Event-RSVP-Tracker/#/dashboard',
      waitFor: 3500,
      title: 'Organizer Command Center & Live Telemetry'
    },
    {
      name: '04_venue_checkin_kiosk.png',
      url: 'https://rohitsingh83.github.io/Real-Time-Cloud-Event-RSVP-Tracker/#/kiosk',
      waitFor: 3500,
      title: 'Contactless Gate Check-In Kiosk & QR Scanner'
    },
    {
      name: '05_github_repository.png',
      url: 'https://github.com/rohitsingh83/Real-Time-Cloud-Event-RSVP-Tracker',
      waitFor: 4000,
      title: 'GitHub Repository & Cloud Architecture Showcase'
    }
  ];

  for (const target of targets) {
    const filePath = path.join(OUTPUT_DIR, target.name);
    console.log(`📸 Capturing: ${target.title} -> ${target.name}`);
    try {
      await page.goto(target.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, target.waitFor));
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`✅ Saved: ${target.name}`);
    } catch (err) {
      console.error(`⚠️ Error capturing ${target.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('\n🎉 All high-resolution screenshots saved to screenshots/ folder!');
}

capture();
