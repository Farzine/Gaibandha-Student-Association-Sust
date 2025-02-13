const nodemailer = require('nodemailer');
const { SMTP_USER,SMTP_HOST,SMTP_PASSWORD,EMAIL_FROM,SMTP_PORT } = require('../config/config');
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM, 
      to,
      subject,
      html,
    });
    console.log('Email sent: ', info.messageId);
  } catch (err) {
    console.error('Error sending email: ', err);
    throw err;
  }
}

module.exports = sendEmail;
