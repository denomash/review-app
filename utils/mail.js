const nodemailer = require("nodemailer");

exports.generateMailTransporter = () =>
  nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.nodemailerUser,
      pass: process.env.nodemailerPass,
    },
  });
