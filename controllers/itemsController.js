const Item = require('../models/item'); // Import your Item model

// Create a new item (POST)
const createItem = async (req, res) => {
    const { name, description, quantity, price, category, image, createdAt } = req.body;
  
    // Logging the request body to verify what data is being sent
    console.log(req.body);
  
    try {
      const newItem = new Item({
        name,
        description,
        quantity,
        price,
        category,
        image,
        createdAt
      });
  
      await newItem.save();
      res.status(201).json({ message: 'Item created successfully', item: newItem });
    } catch (error) {
      console.error('Error creating item:', error);
      res.status(400).json({ message: 'Error creating item', error: error });
    }
  };

// Get all items (GET)
const getItems = async (req, res) => {
  try {
    const items = await Item.find(); // Fetch all items from DB
    res.status(200).json(items); // Return items with 200 status
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving items', error });
  }
};

// Get a single item by ID (GET)
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id); // Find item by ID
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving item', error });
  }
};

// Update an item by ID (PUT)
const updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated item
    });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: 'Error updating item', error });
  }
};

// Delete an item by ID (DELETE)
const deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id); // Delete item by ID
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error });
  }
};

module.exports = { createItem, getItems, getItemById, updateItem, deleteItem };
