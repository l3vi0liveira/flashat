const nodemailer = require("nodemailer");

const user = "flashat.software@gmail.com";
const pass = "hlfzkkwvictwdojb";

exports.sendEmail = async (emailUser, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // 587
    auth: { user, pass },
  });
  transporter
    .sendMail({
      from: user,
      to: emailUser,
      replyTo: "flashat.software@gmail.com",
      subject,
      text,
    })
    .then((info) => {
      return console.log(info);
    })
    .catch((error) => {
      return console.log(error);
    });
};
