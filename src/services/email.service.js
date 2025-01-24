const nodemailer = require("nodemailer");
const config = require("../config/config");
const logger = require("../config/logger");

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch(() =>
      logger.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      )
    );
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, html) => {
  const msg = {
    from: config.email.from,
    to,
    subject,
    text,
    html: html || text,
  };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = "Reset password";
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = "Email Verification";

  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;

  // Plain text version (for email clients that don't support HTML)
  const text = `Hello,\n\nThank you for creating an account with us. We're excited to have you on board!\n\nTo complete your registration and verify your email address, please click on the link below:\n${verificationEmailUrl}\n\nThis link will expire in 24 hours for security reasons.\n\nIf you didn't create an account with us, you can safely ignore this email.\n\nBest regards,\nThe [Your Company Name] Team\n\nNote: This is an automated message, please do not reply to this email.`;

  // HTML version
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: Arial, sans-serif; line-height: 1.5;">
      <table role="presentation" width="100%" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
              <tr>
                <td style="padding: 40px;">
                  <!-- Logo placeholder -->
                  <div style="text-align: center; margin-bottom: 30px;">
                    <img src="[YOUR_LOGO_URL]" alt="Company Logo" style="max-width: 150px; height: auto;">
                  </div>
                  
                  <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px; text-align: center;">Verify Your Email Address</h1>
                  
                  <p style="color: #4c4c4c; font-size: 16px; margin-bottom: 20px;">Hello,</p>
                  
                  <p style="color: #4c4c4c; font-size: 16px; margin-bottom: 20px;">Thank you for creating an account with us. We're excited to have you on board! To complete your registration, please verify your email address by clicking the button below:</p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationEmailUrl}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; text-transform: uppercase; font-size: 14px;">Verify Email Address</a>
                  </div>
                  
                  <p style="color: #4c4c4c; font-size: 16px; margin-bottom: 20px;">Or copy and paste this URL into your browser:</p>
                  <p style="color: #4c4c4c; font-size: 14px; margin-bottom: 20px; word-break: break-all;">${verificationEmailUrl}</p>
                  
                  <p style="color: #4c4c4c; font-size: 14px; margin-bottom: 20px;">This link will expire in 24 hours for security reasons.</p>
                  
                  <p style="color: #4c4c4c; font-size: 14px; margin-bottom: 20px;">If you didn't create an account with us, you can safely ignore this email.</p>
                  
                  <hr style="border: none; border-top: 1px solid #e6e6e6; margin: 30px 0;">
                  
                  <p style="color: #666666; font-size: 14px; margin-bottom: 10px; text-align: center;">Best regards,<br>The [Your Company Name] Team</p>
                  
                  <p style="color: #999999; font-size: 12px; margin-top: 20px; text-align: center;">This is an automated message, please do not reply to this email.</p>
                </td>
              </tr>
            </table>
            
            <table role="presentation" style="width: 600px; margin: 0 auto;">
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <p style="color: #999999; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} [Your Company Name]. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail(to, subject, text, html);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
};
