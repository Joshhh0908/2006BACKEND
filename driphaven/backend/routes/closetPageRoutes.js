// routes/closetPageRoutes.js
const express = require('express');
const router = express.Router();
const closetController = require('../controllers/closetController');

// GET /api/closet
router.get('/', closetController.getAllItems);

// GET /api/closet/unused
//doesnt work for now... are we still doing this thing?
router.get('/unused', closetController.getUnusedItems);

// POST /api/closet
router.post('/', closetController.addItem);

// PUT /api/closet/:itemId
router.put('/:itemId', closetController.updateItem);

// DELETE /api/closet/:itemId
router.delete('/:itemId', closetController.deleteItem);

module.exports = router;