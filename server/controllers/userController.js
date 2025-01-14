const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, department, session, bloodGroup, religiousStatus } = req.body;

        // Validate password for strength
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/;
        if (!password || !strongPasswordRegex.test(password)) {
            return res.status(400).json({ message: 'Password must contain uppercase, lowercase, number, special character, and be at least 6 characters long' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already registered' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            department,
            session,
            bloodGroup,
            religiousStatus
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        if (!password || typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Wrong password' });

        const token = jwt.sign({ email: user.email, id:user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
        res.cookie('token', token, { maxAge: 1 * 24 * 60 * 60 * 1000});

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed' });
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
                folder: 'user_profiles', // Optional: Specify folder in Cloudinary
                use_filename: true,
                unique_filename: true
            });
            updateFields.profilePic = uploadResult.secure_url;
        }

        // Only add fields that are present in the request body
        if (req.body.name) updateFields.name = req.body.name;
        if (req.body.department) updateFields.department = req.body.department;
        if (req.body.session) updateFields.session = req.body.session;
        if (req.body.bloodGroup) updateFields.bloodGroup = req.body.bloodGroup;
        if (req.body.presentAddress) updateFields.presentAddress = req.body.presentAddress;
        if (req.body.permanentAddress) updateFields.permanentAddress = req.body.permanentAddress;
        if (req.body.profession) updateFields.profession = req.body.profession;
        if (req.body.facebookId) updateFields.facebookId = req.body.facebookId;
        if (req.body.linkedinId) updateFields.linkedinId = req.body.linkedinId;
        if (req.body.about) updateFields.about = req.body.about;
        if (req.body.religiousStatus) updateFields.religiousStatus = req.body.religiousStatus;
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
                select: '-password -email -designation -member -alumni' // Exclude these fields from the response
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};
