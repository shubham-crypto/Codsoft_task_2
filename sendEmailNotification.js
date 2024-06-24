const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Service email account
    pass: process.env.EMAIL_PASS, // Service email account password or App Password
  }
});

const sendEmailNotification = (email, user_email,subject, message) => {
  const mailOptions = {
    from: user_email,
    to: email,
    subject: subject,
    text: message
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};
module.exports =sendEmailNotification