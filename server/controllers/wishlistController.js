const User = require('../models/User');

// Get the current user's wishlist
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      populate: { path: 'seller', select: 'name email' },
    });

    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add an item to the wishlist
const addToWishlist = async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.user._id);

    // Check if item is already in the wishlist
    if (user.wishlist.includes(itemId)) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }

    user.wishlist.push(itemId);
    await user.save();

    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove an item from the wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== itemId
    );
    await user.save();

    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
