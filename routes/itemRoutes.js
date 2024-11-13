const express = require('express');
const router = express.Router();
const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
} = require('../controllers/itemsController');

// POST: Create a new item
router.post('/', createItem);

// GET: Get all items
router.get('/', getItems);

// GET: Get a specific item by ID
router.get('/:id', getItemById);

// PUT: Update a specific item by ID
router.put('/:id', updateItem);

// DELETE: Delete a specific item by ID
router.delete('/:id', deleteItem);

module.exports = router;
