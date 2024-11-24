import React, { useEffect, useState } from "react";
import { message } from "antd";
import { getAllCategory } from "../../services/CategorySevices";
import { getAllProduct, getProductByCate } from "../../services/ProductServices";
import HomePageHeader from "../../components/HeaderComponents/HomePageHeader";
import DrawerCompoment from "../../components/DrawerComponent/DrawerComponent";
import { TextHeader } from "./style";
import ProductsPage from "../ProductsPage/ProductsPage";

const HomePage = () => {
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [categories, setAllCategories] = useState([]);
    const [productDetails, setProductDetails] = useState([]);
    const [cart, setCart] = useState([]);

    const fetchGetDetailProduct = async (categoryId) => {
        try {
            const res = await getProductByCate(categoryId);
            if (res) {
                setProductDetails(res);
                setIsOpenDrawer(false);
            }
        } catch (error) {
            message.error("Failed to load product details. Please try again.");
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await getAllCategory();
            setAllCategories(res.map(item => ({ ...item, key: item.categoryId })));
        } catch (error) {
            message.error("Failed to load categories.");
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await getAllProduct();
            setProductDetails(res.map(item => ({ ...item, key: item._id })));
        } catch (error) {
            message.error("Failed to load products.");
        }
    };

    const handleAddToCart = (product) => {
        if (!cart.some(item => item._id === product._id)) {
            setCart((prevCart) => [...prevCart, product]);
            message.success(`${product.name} has been added to your cart.`);
        } else {
            message.info(`${product.name} is already in your cart.`);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    return (
        <div>
            <HomePageHeader setIsOpenDrawer={setIsOpenDrawer} />

            <ProductsPage products={productDetails} categories={categories} addToCart={handleAddToCart} />

            <DrawerCompoment
                title="Sản Phẩm"
                placement="left"
                isOpen={isOpenDrawer}
                onClose={() => setIsOpenDrawer(false)}
                width="25%"
            >
                <div>
                    <TextHeader
                        onClick={() => {
                            fetchProducts();
                            setIsOpenDrawer(false);
                        }}
                        style={{ marginTop: 5, marginLeft: 5, marginBottom: 10, fontSize: 20 }}
                    >
                        Tất cả sản Phẩm
                    </TextHeader>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>

                    {categories.map((category) => (
                        <div
                            key={category.categoryId}
                            style={{ height: '120px', width: '120px', marginTop: 10, cursor: 'pointer' }}
                            onClick={() => fetchGetDetailProduct(category.categoryId)}
                        >
                            <div>
                                {category.image && (
                                    <img
                                        src={category.image}
                                        alt="category"
                                        style={{ height: '100px', width: '100px', borderRadius: '20%' }}
                                    />
                                )}
                                <p style={{ marginTop: 5, marginLeft: 5 }}>{category.categoryName}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </DrawerCompoment>
        </div>
    );
};

export default HomePage;
    