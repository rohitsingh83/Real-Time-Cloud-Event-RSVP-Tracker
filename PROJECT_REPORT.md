# Academic Capstone Project Report
# Title: Real-Time Cloud-Based Event Planning & RSVP Tracker

**Domain**: Cloud Computing, Distributed Systems, Full-Stack Web Development  
**Author**: Engineering Candidate  
**Platform**: Vercel Edge + Google Cloud Firestore / Firebase Serverless  
**Tech Stack**: React 18, Vite, Tailwind CSS, Firestore, WebSockets, HTML5-Qrcode  

---

## 1. ABSTRACT
Modern event management often relies on fragmented communication channels such as spreadsheets, email threads, and group chats, which frequently fail under concurrent usage, leading to duplicate entries, overbooking, lack of real-time visibility, and venue entrance chaos. This capstone project introduces **CloudRSVP**, a cloud-native, high-concurrency event planning and live RSVP tracking platform. By leveraging cloud real-time document listeners (`onSnapshot`), atomic database transactions (`runTransaction`), and stateless cryptographic token authorization, the system guarantees zero-latency state synchronization and strict race-condition prevention for constrained capacity events. Furthermore, an edge-based camera QR check-in terminal and a predictive turnout heuristic enhance venue logistics and attendance reliability. The application is architected to operate entirely within free-tier cloud environments, providing a scalable, placement-ready solution.

---

## 2. PROBLEM STATEMENT & OBJECTIVES
### Problem Statement
When high-demand events open for registration, standard database architectures face critical bottlenecks:
1. **Concurrent Overbooking (Race Conditions)**: Simultaneous RSVP requests for the final available seats cause inventory inconsistencies.
2. **High Latency & Stale State**: Organizers must refresh screens to obtain updated headcounts, impeding dynamic logistics (catering, seat layout).
3. **Friction in User Onboarding**: Mandatory registration barriers cause guest abandonment.
4. **Entrance Bottlenecks**: Manual paper lists or non-synchronized check-in apps cause door congestion and pass counterfeiting.

### Project Objectives
- Construct an event-driven cloud architecture with sub-second synchronization.
- Implement ACID-compliant atomic transactions to safeguard capacity constraints.
- Provide a dual-role authorization matrix (Organizers, Attendees, and Staff).
- Create frictionless tokenized invitations with dynamic QR generation.
- Implement an automated First-In-First-Out (FIFO) waitlist promotion engine.
- Deploy the complete application to global cloud edge networks at zero infrastructure cost.

---

## 3. CLOUD COMPUTING CONCEPTS DEMONSTRATED

| Cloud Computing Concept | Specific Project Manifestation |
| :--- | :--- |
| **SaaS (Software as a Service)** | Fully web-accessible event creation and attendance tracking platform. |
| **PaaS (Platform as a Service)** | Hosted on Vercel Edge Runtime and Google Cloud Firebase App Engines. |
| **BaaS (Backend as a Service)** | Firebase Firestore providing managed authentication, document store, and real-time sockets. |
| **Event-Driven Architecture** | Real-time push updates triggered on document mutations via WebSocket streams. |
| **ACID Transactions & Optimistic Concurrency** | Firestore `runTransaction` preventing double-booking during traffic surges. |
| **Zero-Trust Security & RBAC** | Declarative security rules verifying user UID, ownership tokens, and event statuses. |
| **Edge Computing & Caching** | Static assets served from Vercel's global CDN points of presence (PoP). |
| **Observability & Telemetry** | Real-time metrics tracking Going, Maybe, Waitlist, and Gate Check-In percentages. |

---

## 4. SYSTEM ARCHITECTURE & ER MODEL

### Entity-Relationship (ER) Design:
```
[USERS] (1) ─────────────< (Many) [EVENTS]
   │                                 │ (1)
   │                                 │
   │ (1)                             │ (Many)
   v                                 v
[NOTIFICATIONS]               [RSVPS] (Many) 
                                     │ (1)
                                     v
                              [ANNOUNCEMENTS]
```

### Key Schemas:
- **`events`**: `eventId` (PK), `organizerId` (FK), `title`, `capacity`, `currentGoing`, `currentMaybe`, `status`, `eventDate`, `deadline`.
- **`events/{id}/rsvps`**: `rsvpId` (PK), `userId`, `status` (`GOING`, `MAYBE`, `NOT_GOING`, `WAITLISTED`), `guestsCount`, `token`, `checkInStatus`.
- **`events/{id}/announcements`**: `announcementId` (PK), `title`, `message`, `priority`, `createdAt`.

---

## 5. CONCURRENCY & TRANSACTION MECHANICS

### The Double-Booking Vulnerability:
$$\text{Available Seats} = \text{Capacity} - \text{CurrentGoing}$$
If $\text{Available Seats} = 1$, and two requests $R_1$ and $R_2$ execute simultaneously:
$$T_0: R_1 \text{ reads } \text{Available} = 1$$
$$T_1: R_2 \text{ reads } \text{Available} = 1$$
$$T_2: R_1 \text{ updates } \text{CurrentGoing} = 50$$
$$T_3: R_2 \text{ updates } \text{CurrentGoing} = 51 \quad \implies \text{Overbooked Failure}$$

### The Atomic Transaction Solution:
CloudRSVP utilizes optimistic locking:
```javascript
await runTransaction(db, async (transaction) => {
  const event = await transaction.get(eventRef);
  if (event.data().currentGoing + requestedSpots <= event.data().capacity) {
    transaction.update(eventRef, { currentGoing: increment(requestedSpots) });
    transaction.set(rsvpRef, { status: 'GOING' });
  } else {
    transaction.set(rsvpRef, { status: 'WAITLISTED' });
  }
});
```

---

## 6. VERIFICATION & TEST RESULTS

Automated tests verified system integrity:
1. **Concurrency Stress Test (`tests/concurrency.test.js`)**:
   - Dispatched 10 concurrent requests to contest 1 remaining seat.
   - Result: Exactly 1 request accepted as `GOING`; 9 requests diverted to `WAITLISTED`. **0% Overbooking Error Rate**.
2. **FIFO Waitlist Promotion (`tests/rsvp.test.js`)**:
   - Confirmed attendee cancellation triggered automatic promotion of the earliest waitlisted guest to `GOING`.

---

## 7. CONCLUSION & FUTURE SCOPE
CloudRSVP successfully proves that cloud-native serverless primitives (real-time listeners, atomic transactions, edge deployments) can replace brittle traditional spreadsheets and deliver a modern, resilient user experience comparable to enterprise platforms like Luma and Partiful. Future expansions will include SMS/WhatsApp notifications via Twilio, automated calendar integration (.ics files), and multi-tier ticketing passes.
