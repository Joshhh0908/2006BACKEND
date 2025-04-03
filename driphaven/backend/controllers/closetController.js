// controllers/closetController.js
const ClothingItem = require('../models/clothingItem');

exports.getAllItems = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get all clothing items
    const clothingItems = await ClothingItem.getAll(req.db, userId);
    
    res.status(200).json(clothingItems);
  } catch (error) {
    console.error('Get clothing items error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch clothing items', 
      error: error.message 
    });
  }
};

exports.getUnusedItems = async (req, res) => {
  try {
    const userId = req.userId;
    const { days } = req.query;
    
    // Get unused clothing items
    const unusedItems = await ClothingItem.getUnused(
      req.db, 
      userId, 
      days ? parseInt(days) : 30
    );
    
    res.status(200).json(unusedItems);
  } catch (error) {
    console.error('Get unused items error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch unused items', 
      error: error.message 
    });
  }
};

exports.addItem = async (req, res) => {
  try {
    const userId = req.userId;
    const itemData = {
      ...req.body,
      userId
    };
    
    // Add clothing item
    const itemId = await ClothingItem.create(req.db, itemData);
    
    res.status(201).json({ 
      success: true, 
      message: 'Item added successfully',
      itemId
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to add item', 
      error: error.message 
    });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.params;
    const itemData = req.body;
    
    // Update clothing item
    await ClothingItem.update(req.db, itemId, itemData, userId);
    
    res.status(200).json({ 
      success: true, 
      message: 'Item updated successfully' 
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update item', 
      error: error.message 
    });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.params;
    
    // Delete clothing item
    await ClothingItem.delete(req.db, itemId, userId);
    
    res.status(200).json({ 
      success: true, 
      message: 'Item deleted successfully' 
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete item', 
      error: error.message 
    });
  }
};