import nodemailer from "nodemailer";

function ensureEnv() {
  const user = (process.env.EMAIL || process.env.EMAIL_USER || "").trim();
  const pass = (process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS || "").trim();
  if (!user || !pass) {
    const missing = [];
    if (!user) missing.push("EMAIL or EMAIL_USER");
    if (!pass) missing.push("EMAIL_PASSWORD or EMAIL_PASS");
    throw new Error(
      `Missing env: ${missing.join(", ")}. For Gmail, use a 16-character App Password (with 2FA enabled).`
    );
  }
  return { user, pass };
}

function createTransporter() {
  const { user, pass } = ensureEnv();
  if ((process.env.NODE_ENV || 'development') === 'development') {
    console.log("[mailer] EMAIL set:", !!user, "PASSWORD set:", !!pass);
  }
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL
    auth: { user, pass },
  });
}

export async function sendOTP(email, otp) {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `EventPro <${process.env.EMAIL}>`,
    to: email,
    replyTo: process.env.EMAIL,
    subject: "Your EventPro Verification Code",
    text: `Hi,\n\nHere is your EventPro verification code: ${otp}\n\nThis code will expire in 5 minutes. If you did not request this, please ignore this email.\n\nThanks,\nEventPro Team`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#111;line-height:1.6">
        <h2 style="margin:0 0 12px">Your EventPro Verification Code</h2>
        <p>Hi,</p>
        <p>Here is your EventPro verification code:</p>
        <p style="font-size:24px;font-weight:bold;letter-spacing:3px">${otp}</p>
        <p>This code will expire in 5 minutes. If you did not request this, please ignore this email.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
        <p style="font-size:12px;color:#666;margin:0">Sent by EventPro</p>
      </div>
    `,
    headers: { 'X-Mailer': 'EventPro' },
  });
}




export async function WelcomOrganizerOTP(email,OrgnizerName){
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `EventPro <${process.env.EMAIL}>`,
    to: email,
    replyTo: process.env.EMAIL,
    subject: "Welcome to EventPro",
    text: `Hi ${OrgnizerName},\n\nWelcome to EventPro.\n\nThanks,\nEventPro Team`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#111;line-height:1.6">
        <h2 style="margin:0 0 12px">Welcome to EventPro</h2>
        <p>Hi ${OrgnizerName},</p>
        <p>Welcome to EventPro.</p>
        <p>After the Admin Verify your Documents you're able to Login and create Events.</p>
        <p>Have a Nice Day.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
        <p style="font-size:12px;color:#666;margin:0">Sent by EventPro</p>
      </div>
    `,
    headers: { 'X-Mailer': 'EventPro' },
  });
}

export async function WelcomUserEmail(email,userName){
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `EventPro <${process.env.EMAIL}>`,
    to: email,
    replyTo: process.env.EMAIL,
    subject: "Welcome to EventPro",
    text: `Hi ${userName},\n\nWelcome to EventPro.\n\nThanks,\nEventPro Team`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#111;line-height:1.6">
        <h2 style="margin:0 0 12px">Welcome to EventPro</h2>
        <p>Hi ${userName},</p>
        <p>Welcome to EventPro.</p>
        <p>You're Resigstration is Successfully completed.</p>
        <p>Now you can Login and Visit Events.</p>
        <p>Have a Nice Day.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
        <p style="font-size:12px;color:#666;margin:0">Sent by EventPro</p>
      </div>
    `,
    headers: { 'X-Mailer': 'EventPro' },
  });
}

export async function VerifiedOrganizer(email, OrganizerName){
  const transporter = createTransporter();
    await transporter.sendMail({
      from: `EventPro <${process.env.EMAIL}>`,
      to: email,
      replyTo: process.env.EMAIL,
      subject: "EventPro | Your Documents are Verified",
      text: `Hi ${OrganizerName},\n\nWelcome to EventPro.\n\nThanks,\nEventPro Team`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#111;line-height:1.6">
          <h2 style="margin:0 0 12px">Welcome to EventPro</h2>
          <p>Hi ${OrganizerName},</p>
          <p>Your Documents are Verified.</p>
          <p>Now you can Login and create Events.</p>
          <p>Have a Nice Day.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
          <p style="font-size:12px;color:#666;margin:0">Sent by EventPro</p>
        </div>
      `,
      headers: { 'X-Mailer': 'EventPro' },
    })
  
}

export async function RejectedOrganizer(email, OrganizerName){
  const transporter = createTransporter();
    await transporter.sendMail({
      from: `EventPro <${process.env.EMAIL}>`,
      to: email,
      replyTo: process.env.EMAIL,
      subject: "EventPro | Your Documents are Rejected",
      text: `Hi ${OrganizerName},\n\nWelcome to EventPro.\n\nThanks,\nEventPro Team`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#111;line-height:1.6">
          <h2 style="margin:0 0 12px">Alert ! Your Documents are Rejected</h2>
          <p>Hi ${OrganizerName},</p>
          <p>Your Documents are Rejected.</p>
          <p>The Document which can submitted by you is not valid Documents.</p>
          <p>Your account has been parmanetly Deleted by EventPro Team.</p>
          <p>For more information please contact to EventPro Team or Signup with valid Documents.</p>
          <p>Have a Nice Day.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
          <p style="font-size:12px;color:#666;margin:0">Sent by EventPro</p>
        </div>
      `,
      headers: { 'X-Mailer': 'EventPro' },
    })
}


// Forgot Password OTP (User)
export async function ForgotPasswordUserOTP(email, otp){
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `EventPro <${process.env.EMAIL}>`,
    to: email,
    replyTo: process.env.EMAIL,
    subject: "Reset your EventPro password",
    text: `Hi,\n\nUse this code to reset your EventPro password: ${otp}\n\nThis code expires in 5 minutes. If you didn’t request a password reset, please ignore this email.\n\nThanks,\nEventPro Team`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#111;line-height:1.6">
        <h2 style="margin:0 0 12px">Reset your password</h2>
        <p>Use this code to reset your EventPro password:</p>
        <p style="font-size:24px;font-weight:bold;letter-spacing:3px">${otp}</p>
        <p>This code expires in 5 minutes. If you didn’t request a password reset, please ignore this email.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
        <p style="font-size:12px;color:#666;margin:0">Sent by EventPro</p>
      </div>
    `,
    headers: { 'X-Mailer': 'EventPro' },
  });
}

// Forgot Password OTP (Organizer)
export async function ForgotPasswordOrganizerOTP(email, otp){
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `EventPro <${process.env.EMAIL}>`,
    to: email,
    replyTo: process.env.EMAIL,
    subject: "Organizer password reset for EventPro",
    text: `Hi,\n\nUse this code to reset your EventPro organizer account password: ${otp}\n\nThis code expires in 5 minutes. If you didn’t request a password reset, please ignore this email.\n\nThanks,\nEventPro Team`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#111;line-height:1.6">
        <h2 style="margin:0 0 12px">Organizer password reset</h2>
        <p>Use this code to reset your EventPro organizer account password:</p>
        <p style="font-size:24px;font-weight:bold;letter-spacing:3px">${otp}</p>
        <p>This code expires in 5 minutes. If you didn’t request a password reset, please ignore this email.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
        <p style="font-size:12px;color:#666;margin:0">Sent by EventPro</p>
      </div>
    `,
    headers: { 'X-Mailer': 'EventPro' },
  });
}
