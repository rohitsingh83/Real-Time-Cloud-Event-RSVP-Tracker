# Top 10 Technical Interview Questions & Answers
## Real-Time Cloud-Based Event Planning & RSVP Tracker

---

### Q1: Explain your project in simple and architectural terms.
**Answer:**
"I built **CloudRSVP**, a high-concurrency cloud-native event planning and real-time RSVP tracking platform inspired by modern applications like Luma and Partiful. 

Architecturally, the application solves the critical concurrency and visibility issues that occur with spreadsheets or static websites. When an organizer publishes an event with a strict capacity—say 50 seats—attendees can RSVP with Going, Maybe, or Can't Go via frictionless tokenized URLs or authenticated accounts. 

Instead of relying on inefficient polling, the organizer's command center and attendees' screens connect to managed cloud real-time listeners (`onSnapshot` / WebSockets), allowing headcount counts and announcements to synchronize across devices with sub-second latency. To prevent overbooking when multiple users click 'Going' simultaneously for the last seat, I implemented atomic database transactions (`runTransaction`) with optimistic locking. Any surplus requests automatically overflow into an automated FIFO waitlist that auto-promotes when an attendee cancels. The entire project is hosted on zero-cost cloud tiers (Vercel and Google Cloud/Firebase) and includes an on-site QR check-in terminal."

---

### Q2: What does "real-time" mean in this project, and how does it differ from traditional polling?
**Answer:**
"In traditional web apps, achieving updated counts requires **Short Polling**—the client repeatedly sends HTTP `GET` requests every few seconds. This creates severe server overhead, wasteful network bandwidth, and stale data between intervals.

In my project, 'real-time' means a persistent, bi-directional event stream. Using Firebase Firestore `onSnapshot` (which operates on long-lived WebSockets / HTTP/2 streaming connections), the cloud server pushes delta changes only when the underlying document changes. When Attendee A clicks 'Going' on their mobile device in London, the organizer's dashboard in New York receives the delta payload and increments the attendee count instantly without any page refresh."

---

### Q3: What is a Race Condition in the context of an RSVP system, and how did you prevent it?
**Answer:**
"A race condition occurs when two or more concurrent processes access shared mutable data and attempt to alter state based on an initial read.

Consider an event with a capacity of 50 and 49 confirmed attendees—leaving exactly 1 seat open. If User A and User B click 'Going' at the same instant:
1. A naive backend executes: `if (event.currentGoing < event.capacity) { insertRSVP(); updateCapacity(); }`
2. Both requests read `49 < 50` as true.
3. Both proceed to execute the write, leading to 51 attendees—a catastrophic overbooking.

To eliminate this, I wrapped the read-validate-write sequence inside an **atomic Database Transaction (`runTransaction`)**. The cloud database engine places an optimistic lock on the event document. If another write commits while User B's transaction is executing, User B's transaction automatically aborts and retries with the refreshed count. Seeing `50 == 50`, User B is safely diverted to `WAITLISTED` with a timestamp, ensuring zero overbooking."

---

### Q4: How does your FIFO waitlist system operate?
**Answer:**
"The waitlist is implemented as an asynchronous queue. When the transaction detects that `currentGoing >= capacity`, the RSVP record is created with the status `WAITLISTED` and a server timestamp. 

If a confirmed attendee subsequently changes their status to `MAYBE` or `NOT_GOING`, the decrement triggers a secondary transaction: it queries the earliest `WAITLISTED` attendee ordered by `respondedAt ASC` (First-In, First-Out), updates their status to `GOING`, and generates an in-app notification and email token alerting them that their seat has been confirmed."

---

### Q5: How did you implement authentication and Role-Based Access Control (RBAC)?
**Answer:**
"I used a hybrid security model. For registered users, Firebase Cloud IAM handles JWT token issuance and session persistence. Roles (`organizer`, `attendee`, `admin`) are stored in the user profile and protected by declarative **Firestore Security Rules**:
- Only authenticated organizers can mutate event metadata or delete events.
- Attendees can only modify their own RSVP record.
- Public read access is granted only for published events.

For frictionless guest access, I implemented **Stateless Cryptographic Token Authorization**: organizers can generate secure 16-character invite tokens (`/rsvp?e={eventId}&t={token}`). The backend validates the token against the event subcollection, allowing invited guests to RSVP in one click without forcing them through a tedious signup wall."

---

### Q6: How would you scale this architecture to handle 100,000 concurrent RSVPs in 5 minutes?
**Answer:**
"To handle a massive traffic spike—such as concert ticket drops—a direct write to a single document would bottleneck on row-level lock contention. I would evolve the architecture to an **Event-Driven Distributed Pipeline**:
1. **Edge API Gateway & CDN**: Vercel/Cloudflare Edge absorbs incoming requests, serving static event landing pages from edge cache.
2. **Message Queuing**: Instead of synchronously writing to the database, requests are pushed to a high-throughput message queue like **Google Cloud Pub/Sub** or **AWS SQS**.
3. **Worker Processing with Leases**: Serverless consumers (Cloud Run / Lambda) drain the queue sequentially using distributed locks (Redis Redlock) or counter sharding (Distributed Counters) to allocate seats.
4. **Read/Write Segregation (CQRS)**: Read traffic for public event counts is served from an in-memory cache (Redis), which is invalidated via change streams only when counts update."

---

### Q7: Why did you choose a NoSQL Document Store (Firestore) over a Relational SQL Database?
**Answer:**
"Firestore provides three critical benefits for this specific use case:
1. **Native Client Synchronization**: Out-of-the-box WebSocket listener subscriptions (`onSnapshot`) that eliminate the need to maintain custom WebSocket server clusters or socket.io infrastructure.
2. **Subcollection Isolation**: Subcollections like `/events/{eventId}/rsvps` offer horizontal scalability and document partitioning per event, preventing high traffic on Event A from degrading performance on Event B.
3. **Zero Maintenance & Free Tier**: It scales automatically to zero when idle, making it completely free for portfolio hosting while handling millions of document reads in production."

---

### Q8: How does your on-site venue check-in terminal work without specialized hardware?
**Answer:**
"Rather than requiring dedicated RFID readers or barcode scanners, I developed a browser-based Edge Kiosk using the device's camera via `html5-qrcode`. 
1. When an attendee's RSVP is confirmed as `GOING`, the app generates a dynamic QR code containing their unique ticket token.
2. At the venue gate, door staff open the `/kiosk` page. The camera scans the QR code in real time, parses the ticket token, and sends an atomic verification request.
3. The server checks whether the attendee is valid and whether `checkInStatus == true` (preventing pass sharing / duplicate entry).
4. Audio feedback is synthesized on the fly via the Web Audio API (success chime vs. error buzzer), giving staff instantaneous sensory confirmation."

---

### Q9: How does the AI Attendance Prediction feature work?
**Answer:**
"Event hosts typically suffer a 20% to 40% no-show rate. I implemented a predictive scoring heuristic modeled after Logistic Regression. It extracts four key behavioral features:
- **Lead Time (Days)**: How early the attendee RSVPed. Last-minute RSVPs (<48h) correlate with higher show-up commitment.
- **Plus-Ones**: Attendees bringing guests have an 18% lower cancellation rate.
- **Event Modality**: Virtual events suffer higher attrition (50% drop-off) than in-person events.
- **Historical Ratio**: Prior check-in consistency.

The model computes an Attendance Probability Percentage (`0-100%`) and categorizes guests into 'High Turnout' or 'At-Risk'. This allows organizers to send targeted automated nudges 48 hours prior or safely overbook slightly based on statistical confidence."

---

### Q10: What were the most challenging bugs you encountered during development, and how did you resolve them?
**Answer:**
"The most intricate challenge was managing **Multi-Tab State Synchronization during local testing**. In development mode, if a student opens two browser windows (one as Host, one as Attendee), changes made in one window need to propagate across the other without a backend server running full socket daemons. 

I resolved this by implementing a dual-layer sync protocol: if valid Firebase credentials are provided, it hooks directly into cloud Firestore listeners. If running locally or offline, it activates a `BroadcastChannel` and `StorageEvent` bus that broadcasts atomic state transitions between browser tabs in sub-10ms. This made the application resilient, self-healing, and easily verifiable during live academic demonstrations."
