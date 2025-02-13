const verificationEmailTemplate = (otp) => {
    return `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Verify Your Email</h2>
        <p>Use the following One-Time Password (OTP) to verify your email:</p>
        <h1 style="color: #007BFF;">${otp}</h1>
        <p>This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
        <hr/>
        <p>Thank you for registering with us!</p>
      </div>
    `;
  };
  
  const resetPasswordTemplate = (otp) => {
    return `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Reset Your Password</h2>
        <p>Use the following One-Time Password (OTP) to reset your password:</p>
        <h1 style="color: #007BFF;">${otp}</h1>
        <p>This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
        <hr/>
        <p>If you did not request a password reset, please ignore this email.</p>
      </div>
    `;
  };
  
  module.exports = {
    verificationEmailTemplate,
    resetPasswordTemplate,
  };
  