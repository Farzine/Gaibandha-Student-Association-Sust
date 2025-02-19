const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const sendEmail = require("../config/emailService");
const { verificationEmailTemplate } = require("../config/emailTemplates");
const { resetPasswordTemplate } = require('../config/emailTemplates');

function generateOTP() {
  // A simple 6-digit OTP generator
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department,
      session,
      bloodGroup,
      religiousStatus,
    } = req.body;

    // Validate password for strength
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/;
    if (!password || !strongPasswordRegex.test(password)) {
      return res
        .status(400)
        .json({
          message:
            "Password must contain uppercase, lowercase, number, special character, and be at least 6 characters long",
        });
    }
    // Validate session format
    const sessionRegex = /^\d{4}-\d{4}$/;
    if (!session || !sessionRegex.test(session)) {
      return res.status(400).json({
        message: "Session must be in the format YYYY-YYYY(2020-2021)",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email verification OTP
    const emailOTP = generateOTP();

    // Create new user with unverified email
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      department,
      session,
      bloodGroup,
      religiousStatus,
      emailVerified: false,
      emailVerificationOTP: emailOTP,
    });

    await newUser.save();

    // Send OTP via email
    await sendEmail({
        to: email,
        subject: 'Verify Your Email',
        html: verificationEmailTemplate(emailOTP),
      });
  
      res.status(201).json({ 
        message: 'User registered successfully. Please check your email for the OTP to verify your account.' 
      });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/;
    if (!password || typeof password !== "string" || !strongPasswordRegex.test(password)) {
      return res.status(400).json({ message: "Invalid password, Password must contain uppercase, lowercase, number, special character, and be at least 6 characters long" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, {httpOnly: true, secure: process.env.NODE_ENV, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
    console.error(error);
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    // Get user ID from the authenticated user
    const userId = req.user.id;

    // Create an object with allowed update fields
    const updateFields = {};

    // Upload profile picture to Cloudinary if provided
    if (req.files && req.files.profilePic) {
      const file = req.files.profilePic.tempFilePath; // Assuming you're using a library like `express-fileupload`
      const uploadResult = await cloudinary.uploader.upload(file, {
        folder: "user_profiles", // Optional: Specify folder in Cloudinary
        use_filename: true,
        unique_filename: true,
      });
      updateFields.profilePic = uploadResult.secure_url;
    }

    // Only add fields that are present in the request body
    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.department) updateFields.department = req.body.department;
    if (req.body.session) updateFields.session = req.body.session;
    if (req.body.bloodGroup) updateFields.bloodGroup = req.body.bloodGroup;
    if (req.body.presentAddress)
      updateFields.presentAddress = req.body.presentAddress;
    if (req.body.permanentAddress)
      updateFields.permanentAddress = req.body.permanentAddress;
    if (req.body.profession) updateFields.profession = req.body.profession;
    if (req.body.facebookId) updateFields.facebookId = req.body.facebookId;
    if (req.body.linkedinId) updateFields.linkedinId = req.body.linkedinId;
    if (req.body.about) updateFields.about = req.body.about;
    if (req.body.religiousStatus)
      updateFields.religiousStatus = req.body.religiousStatus;
    if (req.body.schoolName) updateFields.schoolName = req.body.schoolName;
    if (req.body.collegeName) updateFields.collegeName = req.body.collegeName;
    if (req.body.phone) updateFields.phone = req.body.phone;

    // Update the updated_at timestamp
    updateFields.updated_at = Date.now();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators
        select: "-password -email -designation -member -alumni", // Exclude these fields from the response
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};



exports.verifyEmail = async (req, res) => {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      // Check if the OTP matches
      if (user.emailVerificationOTP !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }

      // Mark email as verified
      user.emailVerified = true;
      // Clear the OTP fields
      user.emailVerificationOTP = undefined;
      await user.save();
  
      res.status(200).json({ message: 'Email verified successfully, now login to enter your account' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Email verification failed' });
    }
  };

  exports.forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User with this email does not exist' });
      }
  
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
      const expireTime = Date.now() + 10 * 60 * 1000; // 10 min from now
  
      // Save OTP and expiration
      user.resetPasswordOTP = otp;
      user.resetPasswordOTPExpire = expireTime;
      await user.save();
  
      // Send email
      await sendEmail({
        to: email,
        subject: 'Reset Your Password',
        html: resetPasswordTemplate(otp),
      });
  
      return res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error sending reset password OTP' });
    }
  };


  exports.resetPassword = async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
      if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: 'Email, OTP and new password are required' });
      }
  
      // Validate password strength if needed
      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/;
      if (!strongPasswordRegex.test(newPassword)) {
        return res.status(400).json({
          message: 'Password must contain uppercase, lowercase, number, special character, and be at least 6 characters long',
        });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      if (user.resetPasswordOTP !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
      if (!user.resetPasswordOTPExpire || user.resetPasswordOTPExpire < Date.now()) {
        return res.status(400).json({ message: 'OTP expired' });
      }
  
      // Update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
  
      // Clear OTP fields
      user.resetPasswordOTP = undefined;
      user.resetPasswordOTPExpire = undefined;
      await user.save();
  
      res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error resetting password' });
    }
  };


  exports.resendCodeForResetPassword = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      // Generate a new OTP using your helper function
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expireTime = Date.now() + 10 * 60 * 1000; // 10 min from now
  
      // Save OTP and expiration
      user.resetPasswordOTP = otp;
      user.resetPasswordOTPExpire = expireTime;
      await user.save();
  
      // Send the new OTP via email using your email service
      await sendEmail({
        to: email,
        subject: "Reset Your Password",
        html: verificationEmailTemplate(otp),
      });
  
      res
        .status(200)
        .json({ message: "Verification code resent. Please check your email." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to resend verification code" });
    }
  };
  

  exports.resendCode = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      // Generate a new OTP using your helper function
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expireTime = Date.now() + 5 * 60 * 1000;
  
      // Update the user's OTP field
      user.emailVerificationOTP = otp;
      user.emailVerificationOTPExpire = expireTime;
      await user.save();
  
      // Send the new OTP via email using your email service
      await sendEmail({
        to: email,
        subject: "Verify Your Email",
        html: verificationEmailTemplate(otp),
      });
  
      res
        .status(200)
        .json({ message: "Verification code resent. Please check your email." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to resend verification code" });
    }
  };