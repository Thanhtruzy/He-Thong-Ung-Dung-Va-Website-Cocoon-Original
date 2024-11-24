import React, { useEffect, useState } from "react";
import { Col, Input, Button, Popover } from 'antd';
import { TextHeader, WrapperHeader, AccoutHeader, ContentPopup, Span } from "./style";
import { CaretDownOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { getUserById } from "../../services/UserSevices";
import { jwtDecode } from "jwt-decode";

const { Search } = Input;

const HomePageHeader = ({ setIsOpenDrawer }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            const decoded = jwtDecode(storedToken); // Giải mã token để lấy userId
            fetchUsername(decoded.userId); // Gọi hàm lấy tên người dùng
        }
    }, []);

    const fetchUsername = async (userId) => {
        try {
            const user = await getUserById(userId);
            setUsername(user.name); // Giả sử user có trường "name"
        } catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');  // Xóa token khỏi localStorage
        setToken('');  // Xóa token trong state
        setUsername('');  // Xóa tên người dùng
        navigate('/login');  // Chuyển hướng đến trang đăng nhập
    };

    const handleClickCart = () => {
        navigate('/cart');
    };

    const handleNavigateLogin = () => {
        if (username) {
            navigate('/profile');
        } else {
            navigate('/login');
        }
    };

    const handleProduct = () => {
        setIsOpenDrawer(true);
    };

    const content = (
        <div>
            <ContentPopup onClick={handleLogout}>Đăng xuất</ContentPopup>
            <ContentPopup onClick={() => navigate('/profile')} >Thông tin người dùng</ContentPopup>
        </div>
    );

    return (
        <div>
            <WrapperHeader>
                <Col span={3} style={{ padding: '18px 0px' }}>
                    <div onClick={handleProduct}>
                        <img
                            width={20}
                            src="https://cdn3.iconfinder.com/data/icons/remixicon-system/24/menu-unfold-line-1024.png"
                        />
                        <TextHeader style={{ marginLeft: 5 }}>Sản Phẩm</TextHeader>
                    </div>
                </Col>
                <Col span={7} style={{ padding: '18px 0px' }}>
                    <Search placeholder="Search" allowClear style={{ padding: '0px 50px' }} />
                </Col>
                <Col span={8}>
                    <img width={165} src="https://cocoonvietnam.com/_nuxt/img/logo.f502f17.svg" />
                </Col>
                <Col span={3} style={{ padding: '18px 0px' }}>
                    <img
                        width={20}
                        src="https://cdn4.iconfinder.com/data/icons/eon-ecommerce-i-1/32/cart_shop_buy_retail-1024.png"
                    />
                    <TextHeader style={{ marginLeft: 5 }} onClick={handleClickCart}>
                        Giỏ Hàng
                    </TextHeader>
                </Col>
                <Col span={3} style={{ padding: '18px 0px' }}>
                    <AccoutHeader>
                        <div>
                            <img
                                width={20}
                                src="https://cdn1.iconfinder.com/data/icons/web-essentials-6/24/user-128.png"
                            />
                        </div>
                        {token ? (
                            <div>
                                <Popover placement="bottom" content={content} trigger="click">
                                    <Span>Chào, {username}</Span>
                                </Popover>
                            </div>
                        ) : (
                            <div onClick={handleNavigateLogin}>
                                <Span>Đăng nhập</Span>
                                {/* <div>
                                    <span>Tài khoản</span>
                                    <CaretDownOutlined />
                                </div> */}
                            </div>
                        )}
                    </AccoutHeader>
                </Col>
            </WrapperHeader>
        </div>
    );
};

export default HomePageHeader;
