const express = require('express');
const {
    addCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

const router = express.Router();

// Route để thêm mới danh mục
router.post('/addCategory', addCategory);

// Route để lấy tất cả danh mục
router.get('/', getAllCategories);

// Route để lấy thông tin danh mục theo categoryId
router.get('/:categoryId', getCategoryById);

// Route để cập nhật danh mục
router.put('/:categoryId', updateCategory);

// Route để xóa danh mục
router.delete('/:categoryId', deleteCategory);

module.exports = router;
