const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendNewRegistrationToAdmin(user) {
  const adminEmail = process.env.SUPERADMIN_EMAIL;
  if (!adminEmail || !process.env.SMTP_USER) return; // Skip if no config

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: adminEmail,
    subject: 'New User Registration Awaiting Approval',
    html: `
      <h2>New Registration Alert</h2>
      <p>A new user has registered and is pending your approval.</p>
      <ul>
        <li><strong>Name:</strong> ${user.name}</li>
        <li><strong>Email:</strong> ${user.email}</li>
        <li><strong>Role:</strong> ${user.role}</li>
        ${user.department_name ? `<li><strong>Department:</strong> ${user.department_name}</li>` : ''}
      </ul>
      <p>Please log in to the admin panel to accept or decline this registration.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Failed to send admin notification email:', err.message);
  }
}

async function sendOtpToUser(email, otpCode) {
  if (!process.env.SMTP_USER) return;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Your Account Has Been Approved - OTP Enclosed',
    html: `
      <h2>Registration Approved</h2>
      <p>Your registration request has been accepted by the super admin!</p>
      <p>Your OTP to activate your account is: <strong>${otpCode}</strong></p>
      <p>Please log in with your credentials and verify this OTP to continue.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Failed to send OTP email:', err.message);
  }
}

async function sendRejectionToUser(email) {
  if (!process.env.SMTP_USER) return;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Registration Update',
    html: `
      <h2>Registration Declined</h2>
      <p>We are writing to inform you that your registration request has been declined by the system administrator.</p>
      <p>If you believe this is a mistake, please contact support.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Failed to send rejection email:', err.message);
  }
}

module.exports = {
  sendNewRegistrationToAdmin,
  sendOtpToUser,
  sendRejectionToUser,
};
