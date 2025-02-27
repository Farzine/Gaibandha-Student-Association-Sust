const dailyEmailLimit = 300;
let currentEmailCount = 0;
const emailQueue = [];

// Returns true if we can send another email today.
function canSendEmail() {
  return currentEmailCount < dailyEmailLimit;
}

// Increment the count when an email is sent.
function incrementEmailCount() {
  currentEmailCount++;
}

// Queue an email to be sent later.
function queueEmail(emailData) {
  emailQueue.push(emailData);
}

// Process queued emails (up to the remaining daily limit).
async function processQueue(sendEmailFunc) {
  while (emailQueue.length > 0 && canSendEmail()) {
    // Remove the next email from the queue.
    const emailData = emailQueue.shift();
    try {
      // When processing the queue, you want to actually send the email.
      // Here we force queueIfLimit to false because we want an error if something goes wrong.
      await sendEmailFunc({ ...emailData, queueIfLimit: false });
    } catch (err) {
      console.error('Error sending queued email:', err);
      // Optionally, you could push the emailData back into the queue.
    }
  }
}

// Reset the counter (and optionally empty the queue if needed).
function resetDailyCount() {
  currentEmailCount = 0;
}

module.exports = {
  canSendEmail,
  incrementEmailCount,
  queueEmail,
  processQueue,
  resetDailyCount,
  dailyEmailLimit,
};
