const nodemailer = require('nodemailer');
const { SMTP_USER,SMTP_HOST,SMTP_PASSWORD,EMAIL_FROM,SMTP_PORT } = require('../config/config');
const { canSendEmail, incrementEmailCount, queueEmail } = require('./emailLimiter');

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

async function sendEmail({ to, subject, html, queueIfLimit = true }) {
  try {
    if (canSendEmail()){
      incrementEmailCount();
      const info = await transporter.sendMail({
        from: EMAIL_FROM, 
        to,
        subject,
        html,
      });
      console.log('Email sent: ', info.messageId);
     } else{
      // If the limit has been reached...
      if (queueIfLimit) {
        // For non-critical emails, add them to the queue.
        queueEmail({ to, subject, html });
        console.log('Daily limit reached, email queued for next day');
      } else {
        // For critical emails, throw an error so the controller can respond accordingly.
        throw new Error('Daily email limit reached. Please try again tomorrow.');
      }
     }
  } catch (err) {
    console.error('Error sending email: ', err);
    throw err;
  }
}

module.exports = sendEmail;
