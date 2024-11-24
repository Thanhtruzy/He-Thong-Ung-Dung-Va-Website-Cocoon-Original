const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Đăng ký
router.post('/register', async (req, res) => {
    const { name, email, password, phone, address } = req.body;
    const reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const isCheckEmail = reg.test(email)
    try {
        // Kiểm tra xem email đã tồn tại chưa
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'Email đã tồn tại' });
        }
        console.log('isCheckEmail', isCheckEmail)
        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);
        // Tạo người dùng mới
        user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
        });
        // Lưu vào cơ sở dữ liệu
        await user.save();
        res.status(201).json({ message: 'Đăng ký thành công', user });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Lỗi đăng ký', details: err });
    }
});

// Đăng nhập
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Kiểm tra email có tồn tại không
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Email không tồn tại' });
        }       
        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Mật khẩu không đúng' });
        }
        // Tạo token JWT
        const token = jwt.sign({ userId: user._id }, 'jwt_secret_key', { expiresIn: '1h' });

        res.status(200).json({ message: 'Đăng nhập thành công', token });
    } catch (err) {
        console.error('Login error:', err); // Log the full error in the server console
        res.status(500).json({ error: 'Lỗi đăng nhập', details: err.message });
    }
});

// Lấy tất cả người dùng
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách người dùng', details: err });
    }
});

// Lấy người dùng theo userId
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId });
        if (!user) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy thông tin người dùng', details: err });
    }
});

// Thêm người dùng mới
router.post('/', async (req, res) => {
    const { name, email, password, phone, address } = req.body;
    try {
        const newUser = new User({
            name,
            email,
            password,
            phone,
            address
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi thêm người dùng', details: err });
    }
});

// Sửa thông tin người dùng
router.put('/:userId', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.params.userId },
            req.body,
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi cập nhật người dùng', details: err });
    }
});

// Xóa người dùng
router.delete('/:userId', async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ _id: req.params.userId });
        if (!deletedUser) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }
        res.status(200).json({ message: 'Đã xóa người dùng thành công' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi xóa người dùng', details: err });
    }
});

module.exports = router;
