const User = require('../../models/User');

exports.markNotificationAsRead = async (req, res) => {
  try {
    // We rely on the token for user
    const userId = req.user.id;
    // We get the notificationId from route params
    const { notificationId } = req.params;

    // Find the user 
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find the notification
    const notification = user.notifications.find(
      (n) => n._id.toString() === notificationId
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Mark as read
    notification.read = true;

    // Save
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      notification,
    });
  } catch (error) {
    return res.status(500).json({
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