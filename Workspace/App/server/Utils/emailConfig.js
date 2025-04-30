const Nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");
const dotenv = require("dotenv");

dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;

// Test on hosting server
// const emailTransport = Nodemailer.createTransport(
//   MailtrapTransport({
//     token: TOKEN,
//   })
// );

// Test on local host
const emailTransport = Nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.MAIL_USER, // generated ethereal user
    pass: process.env.MAIL_PASS, // generated ethereal password
  },
});

const sender = {
  address: process.env.MAIL_USER,
  name: "Bearlander",
};
// const recipients = [
//   "gau74537@gmail.com",
// ];

module.exports = {
  emailTransport,
  sender,
  // recipients,
};
