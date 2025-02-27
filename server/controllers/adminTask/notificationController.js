const User = require('../../models/User');

exports.markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params.id; 

    // Remove the notification with the given id from the user's notifications array
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { notifications: { _id: notificationId } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read and removed',
      notifications: user.notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message
    });
  }
};


exports.getAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById (userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    } 

    res.status(200).json({
      success: true,
      notifications: user.notifications
    });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving notifications',
        error: error.message
      });
    }
}