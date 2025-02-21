const Notice = require('../models/Notice');

// Create new notice
exports.createNotice = async (req, res) => {
  try {
    const { title } = req.body;

    // Validate input
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Notice title is required'
      });
    }

    // Create new notice
    const notice = await Notice.create({
      title,
      created_at: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Notice created successfully',
      data: notice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating notice',
      error: error.message
    });
  }
};

// Get all notices with pagination
exports.getAllNotices = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Sorting (newest first by default)
    const sort = req.query.sort || '-created_at';

    const notices = await Notice.find()
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Notice.countDocuments();

    res.status(200).json({
      success: true,
      count: notices.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: notices,
      message: 'Notices fetched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving notices',
      error: error.message
    });
  }
};

// Get single notice
exports.getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    res.status(200).json({
      success: true,
      data: notice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving notice',
      error: error.message
    });
  }
};

// Update notice
exports.updateNotice = async (req, res) => {
  try {
    const { title } = req.body;

    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true, runValidators: true }
    );

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notice updated successfully',
      data: notice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating notice',
      error: error.message
    });
  }
};

// Delete notice
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notice deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting notice',
      error: error.message
    });
  }
};