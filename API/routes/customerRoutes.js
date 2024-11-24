const express = require('express');
const router = express.Router();
const Customer = require('../models/customerModel');

// Đăng ký
router.post('/register', async (req, res) => {
    const { name, email, password, phone, address } = req.body;
    try {
        // Kiểm tra xem email đã tồn tại chưa
        let customer = await Customer.findOne({ email });
        if (customer) {
            return res.status(400).json({ error: 'Email đã tồn tại' });
        }
        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);
        // Tạo khách hàng mới
        customer = new Customer({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
        });
        // Lưu vào cơ sở dữ liệu
        await customer.save();
        res.status(201).json({ message: 'Đăng ký thành công', customer });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi đăng ký', details: err });
    }
});

// Đăng nhập
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Kiểm tra email có tồn tại không
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(400).json({ error: 'Email không tồn tại' });
        }
        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Mật khẩu không đúng' });
        }
        // Tạo token JWT
        const token = jwt.sign({ customerId: customer._id }, 'jwt_secret_key', { expiresIn: '1h' });

        res.status(200).json({ message: 'Đăng nhập thành công', token });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi đăng nhập', details: err });
    }
});

// Lấy tất cả khách hàng
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách khách hàng', details: err });
    }
});

// Lấy khách hàng theo customerId
router.get('/:customerId', async (req, res) => {
    try {
        const customer = await Customer.findOne({ customerId: req.params.customerId });
        if (!customer) {
            return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
        }
        res.status(200).json(customer);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy thông tin khách hàng', details: err });
    }
});

// Thêm khách hàng mới
router.post('/', async (req, res) => {
    const { customerId, name, email, password, phone, address } = req.body;
    try {
        const newCustomer = new Customer({
            customerId,
            name,
            email,
            password,
            phone,
            address
        });
        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi thêm khách hàng', details: err });
    }
});

// Sửa thông tin khách hàng
router.put('/:customerId', async (req, res) => {
    try {
        const updatedCustomer = await Customer.findOneAndUpdate(
            { customerId: req.params.customerId },
            req.body,
            { new: true }
        );
        if (!updatedCustomer) {
            return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
        }
        res.status(200).json(updatedCustomer);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi cập nhật khách hàng', details: err });
    }
});

// Xóa khách hàng
router.delete('/:customerId', async (req, res) => {
    try {
        const deletedCustomer = await Customer.findOneAndDelete({ customerId: req.params.customerId });
        if (!deletedCustomer) {
            return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
        }
        res.status(200).json({ message: 'Đã xóa khách hàng thành công' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi xóa khách hàng', details: err });
    }
});

module.exports = router;
