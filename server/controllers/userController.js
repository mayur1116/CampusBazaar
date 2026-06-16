const User = require('../models/User');

// Get the current user's profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update the current user's profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, college, hostel, course, year, phone, whatsapp } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (college !== undefined) updateData.college = college;
    if (hostel !== undefined) updateData.hostel = hostel;
    if (course !== undefined) updateData.course = course;
    if (year !== undefined) updateData.year = year;
    if (phone !== undefined) updateData.phone = phone;
    if (whatsapp !== undefined) updateData.whatsapp = whatsapp;

    // If a profile image was uploaded, use its Cloudinary URL
    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
    }).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getProfile, updateProfile };
