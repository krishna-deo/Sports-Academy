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
        throw err;
      }
    } else {
      console.log(`\n========================================`);
      console.log(`[EMAIL SERVICE FALLBACK LOG]`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message:\n${textFallback}`);
      console.log(`========================================\n`);
      return { success: true, fallback: true };
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
}

module.exports = new EmailService();
