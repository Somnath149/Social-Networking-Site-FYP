import dotenv from "dotenv"
import nodemailer from "nodemailer"
dotenv.config()

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

export const sendMail= async (to,otp) => {
    await transporter.sendMail({
        from:`${process.env.EMAIL}`,
        to,
        subject:"Reset your password",
        html: `<p>Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`
    })
}

export const usersMail = async ({ from, userName, issue }) => {
  await transporter.sendMail({
    from: `"Psync Support" <${process.env.EMAIL}>`,
    to: process.env.EMAIL, // admin/support email
    replyTo: from, // user ko reply kar sake
    subject: `Support Request from ${userName || from}`,
    html: `
      <h3>New Support Request</h3>
      <p><b>User Email:</b> ${from}</p>
      <p><b>Username:</b> ${userName}</p>
      <p><b>Issue:</b></p>
      <p>${issue}</p>
    `
  });
};

