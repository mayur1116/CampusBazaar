const Item = require('../models/Item');

// Create a new item listing
const createItem = async (req, res) => {
  try {
    const { title, description, price, category, condition } = req.body;

    // Get Cloudinary URLs from uploaded files
    const images = req.files ? req.files.map((file) => file.path) : [];

    const item = await Item.create({
      title,
      description,
      price,
      category,
      condition,
      images,
      seller: req.user._id,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all items with optional search, category, and condition filters
const getItems = async (req, res) => {
  try {
    const { search, category, condition } = req.query;
    const filter = {};

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }
    if (condition) {
      filter.condition = condition;
    }

    const items = await Item.find(filter)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single item by ID
const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      'seller',
      'name email profileImage college hostel course year phone whatsapp'
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an existing item
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if the current user is the seller
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    // Update fields from request body
    const { title, description, price, category, condition } = req.body;
    if (title) item.title = title;
    if (description) item.description = description;
    if (price) item.price = price;
    if (category) item.category = category;
    if (condition) item.condition = condition;

    // Update images if new ones were uploaded
    if (req.files && req.files.length > 0) {
      item.images = req.files.map((file) => file.path);
    }

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete an item
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await item.deleteOne();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark an item as sold
const markSold = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    item.isSold = true;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark an item as available
const markAvailable = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    item.isSold = false;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
  markSold,
  markAvailable,
};
