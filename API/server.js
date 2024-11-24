const express = require('express');
const productRouters = require('./routers/productRouters');
const categoryRouters = require('./routers/categoryRouters');
const userRouters = require('./routers/userRouters');
const cartRouters = require('./routers/cartRouters');
const vnpay = require('./routers/vnpay')
const mongoose = require('mongoose');
const cors = require('cors');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/cocoon_original');
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
        process.exit(1);
    };
}

const app = express();

app.use(cors());

const port = 4000;

connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Sử dụng các routes cho sản phẩm và danh mục
app.use('/products', productRouters);
app.use('/categories', categoryRouters);
app.use('/users', userRouters);
app.use('/carts', cartRouters);
app.use('/vnpay', vnpay);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

