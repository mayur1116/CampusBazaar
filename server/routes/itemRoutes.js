const express = require('express');
const router = express.Router();
const {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
  markSold,
  markAvailable,
} = require('../controllers/itemController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, upload.array('images', 5), createItem);
router.get('/', getItems);
router.get('/:id', getItem);
router.put('/:id', auth, upload.array('images', 5), updateItem);
router.delete('/:id', auth, deleteItem);
router.put('/:id/sold', auth, markSold);
router.put('/:id/available', auth, markAvailable);

module.exports = router;
