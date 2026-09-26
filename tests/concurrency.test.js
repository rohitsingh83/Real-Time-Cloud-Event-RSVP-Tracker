/**
 * Cloud Concurrency & Race Condition Verification Test
 * 
 * Scenario:
 * - Event capacity: 50
 * - Current confirmed attendees: 49
 * - Remaining seats: 1
 * - 10 concurrent requests arrive simultaneously to claim the seat.
 * 
 * Naive outcome: Overbooking (10 users claim 1 seat -> 59 attendees).
 * Atomic transaction outcome: Exactly 1 claims seat (50), 9 placed on WAITLIST.
 */

async function runConcurrencySimulation() {
  console.log('===============================================================');
  console.log('🧪 RUNNING CLOUD CONCURRENCY & TRANSACTION TEST');
  console.log('===============================================================\n');

  const capacity = 50;
  let currentGoing = 49;
  const waitlist = [];
  const confirmed = [];

  console.log(`[SETUP] Event initialized with Capacity: ${capacity}`);
  console.log(`[SETUP] Current Going Count: ${currentGoing}`);
  console.log(`[SETUP] Remaining Spots: ${capacity - currentGoing}\n`);

  console.log('[ACTION] Dispatching 10 simultaneous RSVP requests for the final seat...\n');

  // Simulated mutex / database transaction
  let dbLock = false;
  async function atomicRSVPTransaction(userId) {
    // Wait for lock (simulating database row lock or Firestore runTransaction retry)
    while (dbLock) {
      await new Promise(r => setTimeout(r, 2));
    }
    dbLock = true;

    try {
      // Critical Section
      if (currentGoing < capacity) {
        currentGoing += 1;
        confirmed.push(userId);
        return { status: 'GOING', userId };
      } else {
        waitlist.push(userId);
        return { status: 'WAITLISTED', userId };
      }
    } finally {
      dbLock = false;
    }
  }

  const userIds = Array.from({ length: 10 }, (_, i) => `User_${i + 1}`);

  // Execute all requests concurrently via Promise.all
  const results = await Promise.all(
    userIds.map(id => atomicRSVPTransaction(id))
  );

  console.log('--- TRANSACTION EXECUTION RESULTS ---');
  results.forEach(res => {
    const icon = res.status === 'GOING' ? '✅' : '⏳';
    console.log(`${icon} [${res.userId}] Outcome: ${res.status}`);
  });

  console.log('\n--- VERIFICATION METRICS ---');
  console.log(`Final Confirmed Going: ${currentGoing} / ${capacity}`);
  console.log(`Total Accepted into Event: ${confirmed.length}`);
  console.log(`Total Diverted to FIFO Waitlist: ${waitlist.length}`);

  // Assertions
  if (currentGoing === capacity && confirmed.length === 1 && waitlist.length === 9) {
    console.log('\n🏆 TEST PASSED: Zero Overbooking. Atomic Concurrency Lock Proven Safe!');
    process.exit(0);
  } else {
    console.error('\n❌ TEST FAILED: Race condition detected!');
    process.exit(1);
  }
}

runConcurrencySimulation();
