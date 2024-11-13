const Item = require('../models/item'); // Import your Item model

// Create a new item (POST)
/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create a new item
 *     description: Adds a new item to the inventory.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Item created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
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
/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Get all items
 *     description: Fetches all the items available in the inventory.
 *     responses:
 *       200:
 *         description: List of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   quantity:
 *                     type: integer
 *                   price:
 *                     type: number
 *                   category:
 *                     type: string
 *                   image:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date
 *       500:
 *         description: Internal server error
 */
const getItems = async (req, res) => {
  try {
    const items = await Item.find(); // Fetch all items from DB
    res.status(200).json(items); // Return items with 200 status
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving items', error });
  }
};

// Get a single item by ID (GET)
/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Get an item by ID
 *     description: Fetch a single item by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the item to fetch
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 quantity:
 *                   type: integer
 *                 price:
 *                   type: number
 *                 category:
 *                   type: string
 *                 image:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */
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
/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *     summary: Update an item by ID
 *     description: Updates a specific item in the inventory.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the item to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       404:
 *         description: Item not found
 *       400:
 *         description: Invalid data provided
 *       500:
 *         description: Internal server error
 */
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
/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Delete an item by ID
 *     description: Removes a specific item from the inventory.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the item to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */
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
