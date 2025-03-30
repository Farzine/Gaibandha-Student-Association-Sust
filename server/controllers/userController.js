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
    if (existingUser && existingUser.emailVerified){
      return res.status(400).json({ message: "User already registered" });
    } else if (existingUser && !existingUser.emailVerified) {
      await User.findByIdAndDelete(existingUser._id);
    }


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
        queueIfLimit: false,
      });

     await User.updateMany({}, {
      $push: {
        notifications: {
          message: `Welcome ${name}, admin will verify your account soon.`,
          createdAt: new Date()
        }
      }
    });
  
      res.status(201).json({ 
        message: 'User registered successfully. Please check your email for the OTP to verify your account.' 
      });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};


exports.cancelRegistration = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user from the database
    await User.findByIdAndDelete(user._id);

    return res.status(200).json({
      success: true,
      message: "Cancelled user registration successfully",
    });
  } catch (error) {
    console.error("Error cancelling user registration:", error);
    return res.status(500).json({
      success: false,
      message: "Error cancelling user registration",
      error: error.message
    });
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

    res.status(200).json({ message: "Login successful", token,
      userData: {
        _id:user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        profession: user.profession,
      },
     });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
    console.error(error);
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 1) First, find the user in the DB
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2) Prepare the object of fields to update
    const updateFields = {};

    // If a new profile picture is provided, handle Cloudinary upload
    if (req.file) {
      // a) Remove old Cloudinary image if it exists
      if (user.profilePic && user.profilePic.includes("cloudinary.com")) {
      try {
        // Extract public_id from the URL
        const urlParts = user.profilePic.split("/");
        const filenameWithExtension = urlParts[urlParts.length - 1];
        const publicId = `GSAS/${filenameWithExtension.split('.')[0]}`;
        
        // Delete old image from Cloudinary
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Error deleting old Cloudinary image:", err.message);
        return res.status(400).json({
          success: false,
          message: "Error updating profile pic",
          error: err.message,
        });
      }
      }

      // b) Get the URL of the new profile pic (already uploaded by multer middleware)
      updateFields.profilePic = req.file.path || req.file.secure_url;
    }

    // 3) Only add fields that are present in the request body
    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.department) updateFields.department = req.body.department;
    if (req.body.session) updateFields.session = req.body.session;
    if (req.body.bloodGroup) updateFields.bloodGroup = req.body.bloodGroup;
    if (req.body.presentAddress) {
      updateFields.presentAddress = req.body.presentAddress;
    }
    if (req.body.permanentAddress) {
      updateFields.permanentAddress = req.body.permanentAddress;
    }
    if (req.body.profession) updateFields.profession = req.body.profession;
    if (req.body.facebookId) updateFields.facebookId = req.body.facebookId;
    if (req.body.linkedinId) updateFields.linkedinId = req.body.linkedinId;
    if (req.body.about) updateFields.about = req.body.about;
    if (req.body.religiousStatus) {
      updateFields.religiousStatus = req.body.religiousStatus;
    }
    if (req.body.schoolName) updateFields.schoolName = req.body.schoolName;
    if (req.body.collegeName) updateFields.collegeName = req.body.collegeName;
    if (req.body.phone) updateFields.phone = req.body.phone;

    // 4) (Optional) Update the updated_at timestamp if you want a custom field
    updateFields.updated_at = Date.now();

    // 5) Perform the update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      {
        new: true,            // Return the updated document
        runValidators: true,  // Run schema validators
        select: "-password -email -designation -member -alumni", // Exclude these fields
      }
    );

    // 6) If somehow not found (edge case), return 404
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found after update",
      });
    }


    // 7) Return success
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(400).json({
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
        queueIfLimit: false,
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
        queueIfLimit: false,
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
        queueIfLimit: false,
      });
  
      res
        .status(200)
        .json({ message: "Verification code resent. Please check your email." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to resend verification code" });
    }
  };

  exports.getUserDetails = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      // Find the user by ID and exclude sensitive fields
      const user = await User.findById(id).select(
        "-password -emailVerificationOTP -emailVerificationOTPExpire -resetPasswordOTP -resetPasswordOTPExpire"
      );
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving user details" });
    }
  };


  exports.logoutUser = async (req, res) => {
    try {
      // Clear the authentication token cookie
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  };

  exports.updatePassword = async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Old password and new password are required' });
      }
  
      // Validate password strength if needed
      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/;
      if (!strongPasswordRegex.test(newPassword)) {
        return res.status(400).json({
          message: 'Password must contain uppercase, lowercase, number, special character, and be at least 6 characters long',
        });
      }
  
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Old password is incorrect' });
      }
  
      // Update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
  
      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error updating password' });
    }
  }
  