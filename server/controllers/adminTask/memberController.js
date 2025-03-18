const User = require("../../models/User");

exports.getAllMemberRequests = async (req, res) => {
    try {
      // Find all users who are not yet approved as members
      const memberRequests = await User.find(
        { 
          member: false,
          emailVerified: true // Only show verified users
        },
        // Exclude sensitive information
        {
          password: 0,
          resetPasswordOTP: 0,
          resetPasswordOTPExpire: 0,
          emailVerificationOTP: 0
        }
      ).sort({ createdAt: -1 }); // Sort by newest first
  
      res.status(200).json({
        success: true,
        count: memberRequests.length,
        data: memberRequests,
        message: "Member requests fetched successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching member requests",
        error: error.message
      });
    }
  };

  exports.getMemberRequestById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      res.status(200).json({ success: true, data: user , message: "Member request fetched successfully" });
    } catch (error) { 
      res.status(500).json({ success: false, message: "Error fetching member request", error: error.message });
    } 
  };

  exports.handleMemberRequest = async (req, res) => {
    try {
      const { userId, action } = req.body;
  
      if (!userId || !action) {
        return res.status(400).json({
          success: false,
          message: "User ID and action are required"
        });
      }
  
      if (!["approve", "reject"].includes(action)) {
        return res.status(400).json({
          success: false,
          message: "Invalid action. Use 'approve' or 'reject'"
        });
      }
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
  
      if (action === "approve") {
        // Approve member request
        user.member = true;
        await user.save();
  
        return res.status(200).json({
          success: true,
          message: "Member request approved successfully",
          data: {
            userId: user._id,
            name: user.name,
            email: user.email,
            member: user.member
          }
        });
      } else {
        // Reject member request - delete the user
        await User.findByIdAndDelete(userId);
  
        return res.status(200).json({
          success: true,
          message: "Member request rejected and user deleted successfully"
        });
      }
    } catch (error) {
      console.error("Member request error:", error);
  
      // 1) Check if it's a Mongoose validation error
      if (error.name === "ValidationError") {
        // Collect all messages
        const validationErrors = {};
  
        // Loop over each field that failed validation
        for (let field in error.errors) {
          validationErrors[field] = error.errors[field].message;
        }
  
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validationErrors,
        });
      }
  
      // 2) Otherwise, send a generic 500 error response
      res.status(500).json({
        success: false,
        message: "Error handling member request",
        error: error.message,
      });
    }
  };


// Get all members categorized by their roles
exports.getCategorizedMembers = async (req, res) => {
  try {
    // Get all members (where member = true)
    const users = await User.find({ member: true });

    // Categorize members
    const categorizedMembers = {
      committee: users.filter(user => [
        "President",
        "Senior Vice President",
        "Vice-President",
        "General Secretary",
        "Joint General Secretary",
        "Assistant General Secretary",
        "Treasurer",
        "Assistant Treasurer",
        "Organizing Secretary",
        "Assistant Organizing Secretary",
        "Office Secretary",
        "Assistant Office Secretary",
        "Women's Affairs Secretary",
        "Assistant Women's Affairs Secretary",
        "Sports Secretary",
        "Assistant Sports Secretary",
        "Publication Secretary",
        "Assistant Publication Secretary",
        "IT Secretary",
        "Assistant IT Secretary",
        "Cultural Secretary",
        "Assistant Cultural Secretary",
      ].includes(user.designation)),
      advisors: users.filter(user => user.designation === "Advisor"),
      alumni: users.filter(user => user.alumni === true),
      generalMembers: users.filter(user => user.designation === "Member" && !user.alumni)
    };

    res.status(200).json({
      success: true,
      data: categorizedMembers,
      message: "Members fetched successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching members",
      error: error.message
    });
  }
};

// Update member designation
exports.updateMemberDesignation = async (req, res) => {
  try {
    const { userId, designation } = req.body;

    // Validate if user exists and is a member
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.member) {
      return res.status(400).json({
        success: false,
        message: "User is not a member"
      });
    }

    // Update designation
    user.designation = designation;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Member designation updated successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating member designation",
      error: error.message
    });
  }
};



// Update alumni status
exports.updateAlumniStatus = async (req, res) => {
  try {
    const { userId, alumniStatus } = req.body;

    // Validate if user exists and is a member
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }


    // Update alumni status
    user.alumni = alumniStatus;
    
    await user.save();

    res.status(200).json({
      success: true,
      message: "Alumni status updated successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating alumni status",
      error: error.message
    });
  }
}
