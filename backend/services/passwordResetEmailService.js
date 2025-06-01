require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS 
  }
});

const sendResetPasswordEmail = async (email, resetToken, firstName) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Your Password - HealthCare',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #129990 0%, #0d7377 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">HealthCare</h1>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 40px 30px; background-color: white; margin: 0 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${firstName || 'there'}!</h2>
          
          <p style="color: #666; line-height: 1.6; font-size: 16px; margin-bottom: 25px;">
            We received a request to reset your password for your HealthCare account. 
            Click the button below to create a new password.
          </p>
          
          <!-- Reset Button -->
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #129990 0%, #0d7377 100%); 
                      color: white; 
                      padding: 15px 35px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block;
                      font-weight: bold;
                      font-size: 16px;
                      box-shadow: 0 4px 15px rgba(18, 153, 144, 0.3);">
              Reset My Password
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; line-height: 1.5; margin-top: 30px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #129990; word-break: break-all;">${resetUrl}</a>
          </p>
          
          <!-- Security Notice -->
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #129990; margin-top: 30px;">
            <h3 style="color: #333; margin: 0 0 10px 0; font-size: 16px;">Security Notice:</h3>
            <ul style="color: #666; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li>This link will expire in <strong>1 hour</strong></li>
              <li>If you didn't request this reset, you can safely ignore this email</li>
              <li>Your password won't change until you click the link above</li>
            </ul>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #999; font-size: 12px;">
          <p style="margin: 0;">
            This email was sent by HealthCare. If you have any questions, please contact our support team.
          </p>
          <p style="margin: 10px 0 0 0;">
            © ${new Date().getFullYear()} HealthCare. All rights reserved.
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

module.exports = sendResetPasswordEmail;