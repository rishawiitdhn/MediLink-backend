const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.GOOGLE_APP_PASS,
  },
});

async function sendEmail({ to, subject, html, hospitalName}) {
  try {
    await transporter.sendMail({
      from:{
        email: process.env.EMAIL_FROM,
        name: hospitalName,
      },
      to,
      subject,
      html: `
  <div style="font-family:Arial,sans-serif">
    <h2>${hospitalName}</h2>
    <p>${html}</p>
    <hr />
    <p style="font-size:12px;color:#666">
      This is an automated message from MediLink.<br/>
      Please do not reply.
    </p>
  </div>
`,
    });
    console.log("Email sent successfully");
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

module.exports = sendEmail;
