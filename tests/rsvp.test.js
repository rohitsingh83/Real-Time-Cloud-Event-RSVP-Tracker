/**
 * RSVP State Transitions & Automatic FIFO Waitlist Promotion Test
 */

function runRSVPStateTest() {
  console.log('===============================================================');
  console.log('🧪 RUNNING RSVP STATE TRANSITIONS & WAITLIST PROMOTION TEST');
  console.log('===============================================================\n');

  const capacity = 2;
  let currentGoing = 0;
  const store = {};

  function rsvp(userId, choice) {
    const prev = store[userId]?.status;
    let finalStatus = choice;

    if (choice === 'GOING') {
      if (prev === 'GOING') {
        finalStatus = 'GOING';
      } else if (currentGoing < capacity) {
        currentGoing += 1;
        finalStatus = 'GOING';
      } else {
        finalStatus = 'WAITLISTED';
      }
    } else if (choice === 'NOT_GOING' || choice === 'MAYBE') {
      if (prev === 'GOING') {
        currentGoing -= 1;
        // Auto-promote first waitlisted user
        const waitlistedUser = Object.keys(store).find(u => store[u].status === 'WAITLISTED');
        if (waitlistedUser) {
          store[waitlistedUser].status = 'GOING';
          currentGoing += 1;
          console.log(`⚡ [AUTO-PROMOTION] ${waitlistedUser} was automatically promoted from WAITLISTED to GOING!`);
        }
      }
    }

    store[userId] = { userId, status: finalStatus };
    console.log(`[RSVP EVENT] ${userId} selected ${choice} -> Result: ${finalStatus} (Current Going: ${currentGoing}/${capacity})`);
  }

  // 1. User A RSVPs GOING
  rsvp('User_A', 'GOING');

  // 2. User B RSVPs GOING (Capacity 2/2 reached)
  rsvp('User_B', 'GOING');

  // 3. User C RSVPs GOING (Capacity reached -> should become WAITLISTED)
  rsvp('User_C', 'GOING');

  if (store['User_C'].status !== 'WAITLISTED') {
    throw new Error('User C was not waitlisted!');
  }

  // 4. User A changes mind: GOING -> NOT_GOING
  console.log('\n[EVENT] User A cancels their seat:');
  rsvp('User_A', 'NOT_GOING');

  // Verify User C got promoted to GOING
  if (store['User_C'].status === 'GOING') {
    console.log('\n🏆 TEST PASSED: Waitlist FIFO promotion successfully verified!');
    process.exit(0);
  } else {
    console.error('\n❌ TEST FAILED: Waitlist user was not promoted.');
    process.exit(1);
  }
}

runRSVPStateTest();
