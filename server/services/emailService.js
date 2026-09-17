const nodemailer = require('nodemailer');

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || 'no-reply@sportsacademy.com';

let transporter = null;

if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  console.log(`[EMAIL SERVICE] Initializing SMTP Transporter for host: ${SMTP_HOST}`);
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT),
    secure: parseInt(SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
} else {
  console.log(`[EMAIL SERVICE] SMTP details missing in .env. Falling back to local console logger.`);
}

/**
 * Common HTML email wrapper style template
 */
function getHtmlTemplate(title, preheader, contentHtml) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #f4f5f7;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }
        .header {
          background-color: #047857; /* RLBSA Emerald Green */
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        .body {
          padding: 40px 30px;
          color: #1f2937;
          line-height: 1.6;
        }
        .body p {
          margin: 0 0 20px 0;
          font-size: 14px;
        }
        .otp-box {
          background-color: #f0fdf4;
          border: 2px dashed #34d399;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin: 30px 0;
        }
        .otp-code {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: 6px;
          color: #047857;
          margin: 0;
        }
        .footer {
          background-color: #f9fafb;
          padding: 20px 30px;
          text-align: center;
          border-top: 1px solid #f3f4f6;
          font-size: 11px;
          color: #6b7280;
        }
        .footer p {
          margin: 0 0 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Rani Laxmibai Sports Academy</h1>
        </div>
        <div class="body">
          ${contentHtml}
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Rani Laxmibai Sports Academy. All rights reserved.</p>
          <p>Siwan, Bihar, India &bull; Admin Portal Security Notification</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

class EmailService {
  /**
   * Helper method to send emails with logging fallback
   */
  async sendMail({ to, subject, html, textFallback }) {
    if (transporter) {
      try {
        const info = await transporter.sendMail({
          from: SMTP_FROM,
          to,
          subject,
          html,
          text: textFallback
        });
        console.log(`[EMAIL SERVICE] Email sent successfully to ${to}. MessageId: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
      } catch (err) {
        console.error(`[EMAIL SERVICE] Error sending email to ${to}:`, err);
        console.log(`\n========================================`);
        console.log(`[EMAIL SERVICE FALLBACK LOG]`);
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Message:\n${textFallback}`);
        console.log(`========================================\n`);
        return { success: true, isDevFallback: true };
      }
    } else {
      console.log(`\n========================================`);
      console.log(`[EMAIL SERVICE FALLBACK LOG]`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message:\n${textFallback}`);
      console.log(`========================================\n`);
      return { success: true, isDevFallback: true };
    }
  }

  /**
   * Send Password Recovery Code
   */
  async sendPasswordResetEmail(email, resetCode) {
    const subject = "RLBSA Admin Panel - Password Reset Verification Code";
    const textFallback = `Your verification reset code is ${resetCode}. It will expire in 10 minutes.`;
    
    const htmlContent = `
      <p>Hello,</p>
      <p>We received a request to reset the password for your administrative account at Rani Laxmibai Sports Academy.</p>
      <p>Please use the following 6-digit verification code to complete the process. This code is valid for <strong>10 minutes</strong>:</p>
      <div class="otp-box">
        <h2 class="otp-code">${resetCode}</h2>
      </div>
      <p>If you did not request this password reset, please ignore this email or secure your account credentials immediately.</p>
    `;

    const html = getHtmlTemplate("Password Reset Code", "Password Reset OTP Verification", htmlContent);
    return this.sendMail({ to: email, subject, html, textFallback });
  }

  /**
   * Send Email Change Verification Code
   */
  async sendEmailVerificationCode(newEmail, verificationCode) {
    const subject = "RLBSA Admin Panel - Verify Your New Email Address";
    const textFallback = `Your email verification code is ${verificationCode}. It will expire in 10 minutes.`;

    const htmlContent = `
      <p>Hello,</p>
      <p>You have requested to change the primary administrative email address to <strong>${newEmail}</strong>.</p>
      <p>To confirm this email change and update your contact records, please enter the following 6-digit verification code. This code is valid for <strong>10 minutes</strong>:</p>
      <div class="otp-box">
        <h2 class="otp-code">${verificationCode}</h2>
      </div>
      <p>If you did not initiate this profile update, please verify your account security logs or contact the administrator.</p>
    `;

    const html = getHtmlTemplate("Email Change OTP Verification", "Email Verification OTP Code", htmlContent);
    return this.sendMail({ to: newEmail, subject, html, textFallback });
  }

  /**
   * Send New Website Enquiry Notification to Admin & Auto-Reply to User
   */
  async sendEnquiryNotificationEmail({ name, email, phone, subject, message, enquiryId }) {
    const adminEmail = process.env.SMTP_USER || 'foundationrlbsa@gmail.com';
    const emailSubject = `[RLBSA Enquiry ${enquiryId}] ${subject || 'New Contact Form Submission'}`;
    const textFallback = `New Enquiry from ${name} (${email}): ${message}`;

    const adminHtmlContent = `
      <p>Hello Admin,</p>
      <p>You have received a new inquiry from the website contact form:</p>
      <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:15px; border-radius:8px; margin:15px 0;">
        <p style="margin:5px 0;"><strong>Enquiry ID:</strong> ${enquiryId}</p>
        <p style="margin:5px 0;"><strong>Name:</strong> ${name}</p>
        <p style="margin:5px 0;"><strong>Sender Email:</strong> ${email}</p>
        <p style="margin:5px 0;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p style="margin:5px 0;"><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
        <hr style="border:0; border-top:1px solid #cbd5e1; margin:10px 0;" />
        <p style="margin:5px 0;"><strong>Message:</strong></p>
        <p style="white-space:pre-wrap; margin:5px 0; color:#334155;">${message}</p>
      </div>
      <p>You can also review and respond to this message directly from the Admin Panel under Enquiries.</p>
    `;

    const adminHtml = getHtmlTemplate("New Website Enquiry Received", "New Website Contact Enquiry", adminHtmlContent);
    
    // 1. Send alert to Admin
    await this.sendMail({ to: adminEmail, subject: emailSubject, html: adminHtml, textFallback });

    // 2. Send acknowledgement auto-reply to Sender
    const userSubject = `We received your message - Rani Laxmibai Sports Academy`;
    const userTextFallback = `Dear ${name}, Thank you for contacting RLBSA. We have received your inquiry (${enquiryId}) and will get back to you shortly.`;
    const userHtmlContent = `
      <p>Dear <strong>${name}</strong>,</p>
      <p>Thank you for reaching out to Rani Laxmibai Sports Academy.</p>
      <p>We have successfully received your inquiry regarding <strong>${subject || 'General Inquiry'}</strong> (Reference ID: <strong>${enquiryId}</strong>).</p>
      <div style="background:#f0fdf4; border:1px border-emerald-200; padding:15px; border-radius:8px; margin:15px 0;">
        <p style="margin:0 0 10px 0; font-size:13px; color:#047857; font-weight:bold;">Summary of your submitted message:</p>
        <p style="white-space:pre-wrap; margin:0; font-size:13px; color:#15803d;">"${message}"</p>
      </div>
      <p>Our administration team is reviewing your message and will respond to your email as soon as possible.</p>
      <p>Warm regards,<br/><strong>Rani Laxmibai Sports Academy Team</strong></p>
    `;

    const userHtml = getHtmlTemplate("Enquiry Confirmation", "Message Received Confirmation", userHtmlContent);
    await this.sendMail({ to: email, subject: userSubject, html: userHtml, textFallback: userTextFallback });
  }
}

module.exports = new EmailService();
