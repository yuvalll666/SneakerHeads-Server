const nodemailer = require("nodemailer");
// require("dotenv").config();

async function sendIt(user, url) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"SneakerHeads" <apiproject66550@gmail.com>',
    to: user.email,
    subject: "Verification ✔",
    text: "plain text",
    html: `<h1>Your vrification URL: </h1><p>please click this url to confirm your email: <br> <a href="${url}">${url}</a> </p>`,
  });
}

module.exports = {
  sendIt,
};
