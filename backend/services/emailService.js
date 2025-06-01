require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS 
  }
});

const sendVerificationEmail = async (email, token, firstName) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #129990; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome ${firstName}!</h1>
        </div>
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Please verify your email address</h2>
          <p style="color: #666; line-height: 1.6;">
            Thank you for signing up! To complete your registration and start using our platform, 
            please click the button below to verify your email address.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #129990; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #999; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${verificationUrl}">${verificationUrl}</a>
          </p>
          <p style="color: #999; font-size: 12px;">
            This verification link will expire in 24 hours.
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

module.exports = sendVerificationEmail;