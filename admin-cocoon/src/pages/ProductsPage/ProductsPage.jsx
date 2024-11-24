import { ShoppingOutlined } from '@ant-design/icons';
import { Button, message, Card } from 'antd';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductsPage = ({ products, categories }) => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);  // State to store userId

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            const decoded = jwtDecode(storedToken); // Decode token to get userId
            const userId = decoded.userId;
            setUserId(userId);
        }
    }, []);

    const goToProductDetail = (_id) => {
        if (_id) {
            navigate(`/product/${_id}`);
        } else {
            console.error("Product ID is undefined in goToProductDetail");
        }
    };

    const handleAddToCart = async (_id) => {
        if (!_id) {
            alert("Product ID is required");
            return;
        }
        const data = {
            userId: userId, // Replace with actual userId
            productId: _id,
            quantity: 1,
        };
        try {
            const response = await axios.post('http://localhost:400/carts/add', data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log('Response:', response);  // Log the response

            if (response.status === 201) {
                message.success('Product added to cart successfully');
            } else {
                message.error('Failed to add product to cart');
            }
        } catch (error) {
            console.error(error.response ? error.response.data : error);  // Log full error response
            message.error('Error adding product to cart');
        }
    };


    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.categoryId === categoryId);
        return category ? category.categoryName : "Unknown Category";
    };

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', padding: '20px' }}>
            {products.map((product) => (
                <Card
                    key={product._id}
                    hoverable
                    style={{ width: 220 }}
                    cover={
                        product.imageUrl && (
                            <img
                                src={product.imageUrl}
                                alt="product"
                                style={{ marginLeft: '5%', marginTop: '5%', height: '240px', width: '90%', objectFit: 'cover' }}
                            />
                        )
                    }
                    onClick={() => goToProductDetail(product._id)}
                >
                    <Card.Meta
                        title={product.name}
                        description={`${product.price.toLocaleString('vi-VN')} đ`}
                    />
                    {/* Uncomment to show category name */}
                    {/* <p style={{ fontSize: 15, color: 'gray' }}>{getCategoryName(product.categoryId)}</p> */}

                    <Button
                        icon={<ShoppingOutlined style={{ color: '#08c' }} />}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product._id);  // Passing product._id here
                        }}
                        style={{ marginTop: '10px' }}
                    >
                        Add to cart
                    </Button>
                </Card>
            ))}
        </div>
    );
};

export default ProductsPage;
