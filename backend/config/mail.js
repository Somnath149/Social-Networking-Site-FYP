import dotenv from "dotenv"
import nodemailer from "nodemailer"
dotenv.config()

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, 
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
    from: `"${userName || from} via Psync Support" <${process.env.EMAIL}>`,
    to: process.env.EMAIL, 
    replyTo: from,
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

export const contentRemovedMail = async ({ to, userName, contentType, reason }) => {
  await transporter.sendMail({
    from: `"Psync Moderation" <${process.env.EMAIL}>`,
    to,
    subject: "Content Removed Notification",
    html: `
      <h3>Hello ${userName}</h3>
      <p>Your <b>${contentType}</b> was removed due to community guideline violation.</p>
      <p><b>Reason:</b> ${reason}</p>
      <p>If you think this is a mistake, contact support.</p>
      <br/>
      <p>— Psync Team</p>
    `
  });
};

export const userBlockMail = async ({ to, userName, reason }) => {
  await transporter.sendMail({
    from: `"Psync Moderation" <${process.env.EMAIL}>`,
    to,
    subject: "Your Account Has Been Blocked",
    html: `
      <h3>Hello ${userName || "User"}</h3>
      <p>Your account has been <b>blocked</b> due to violation of our community guidelines.</p>
      <p><b>Reason:</b> ${reason}</p>
      <p>If you believe this is a mistake, please contact support.</p>
      <br/>
      <p>— Psync Team</p>
    `
  });
};

export const userUnblockMail = async ({ to, userName }) => {
  await transporter.sendMail({
    from: `"Psync Moderation" <${process.env.EMAIL}>`,
    to,
    subject: "Your Account Has Been Unblocked",
    html: `
      <h3>Hello ${userName || "User"}</h3>
      <p>Good news 🎉</p>
      <p>Your account has been <b>unblocked</b>. You can now access all features again.</p>
      <p>Please follow our community guidelines to avoid future restrictions.</p>
      <br/>
      <p>— Psync Team</p>
    `
  });
};
