const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Service email account
    pass: process.env.EMAIL_PASS, // Service email account password or App Password
  },
});

const sendFeedbackEmail = (userEmail,name, feedback) => {
  const mailOptions = {
    from: userEmail, // Logged-in user's email
    name: name,
    to: process.env.EMAIL_USER, // Service email account to receive the feedback
    subject: 'Feedback from Contact Form',
    text: `Feedback from: ${userEmail}\n\n${name}\n\n${feedback}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      throw new Error('Error sending email');
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

module.exports = sendFeedbackEmail;
