import React, { useState } from 'react';
import { Button, Input, notification, Radio } from 'antd';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './CreateOrder.css';

const CreateOrder = () => {
  const location = useLocation();
  const initialTotalPrice = location.state?.totalPrice || 0;
  const [totalPrice, setTotalPrice] = useState(initialTotalPrice);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    address: '',
    shipping: 'standard',  // Default shipping method
    payment: 'cod',        // Default payment method
  });

  const [orderSummary] = useState([
    
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, address } = formData;

    if (!name || !email || !phone || !address) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin!',
      });
      return;
    }

    if (formData.payment === 'online') {
      await handlePayment();
    } else {
      notification.success({
        message: 'Đặt hàng thành công!',
        description: `Tổng cộng: ${totalPrice.toLocaleString()} VND`,
      });
    }
  };

  async function handlePayment() {
    try {
      const newPayment = {
        products: orderSummary.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        amount: totalPrice,
      };

      const response = await axios.post(
        'http://localhost:4000/vnpay/create_payment_url',
        newPayment
      );

      if (response.status === 200 && response.data) {
        window.location.href = response.data;
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi thanh toán',
        description: `Không thể xử lý thanh toán: ${error?.message || error}`,
      });
    }
  }

  return (
    <div className="CreateOrder">
      <header className="checkout-header">
      </header>
      <main className="checkout-container">
        <div className="form-container">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <section className="billing-info">
              <h2>Thông tin liên hệ</h2>
              <label htmlFor="name">Họ và tên</label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Nhập họ và tên"
                value={formData.name}
                onChange={handleChange}
              />
              <label htmlFor="phone">Số điện thoại</label>
              <Input
                type="text"
                id="phone"
                name="phone"
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                onChange={handleChange}
              />
             
              <label htmlFor="address">Địa chỉ</label>
              <Input.TextArea
                id="address"
                name="address"
                placeholder="Nhập địa chỉ cụ thể"
                value={formData.address}
                onChange={handleChange}
              />
               {/* Shipping Method */}
            <section className="shipping-method">
             
            </section>

            {/* Payment Method */}
            <section className="payment-method">
              <h2>Phương thức thanh toán</h2>
              <Radio.Group
                name="payment"
                value={formData.payment}
                onChange={handleChange}
              >
             <Radio style={{ display: 'block' }} value="cod">Thanh toán khi giao hàng (COD)</Radio>
            <Radio style={{ display: 'block' }} value="vnpay">Thanh toán bằng Ví VNPAY</Radio>
            
            </Radio.Group>

            </section>
            </section>

          
          </form>

          <section className="order-summary">
            <h2>Thông tin đơn hàng</h2>
            <ul>
              {orderSummary.map((item, index) => (
                <li key={index}>
                  <span>{item.name}</span> 
                  <span>{item.quantity}</span> 
                  <span>{item.price.toLocaleString()} VND</span> 
                  <span>{item.total.toLocaleString()} VND</span>
                </li>
              ))}
            </ul>
            

            <div className="price-summary">
              <p>Tạm tính: <span>{totalPrice.toLocaleString()} VND</span></p>
              <p>Giảm giá: <span>0 VND</span></p>
              <p>Phí vận chuyển: <span>0 VND</span></p>
              <p><b>Tổng cộng: <span>{totalPrice.toLocaleString()} VND</span></b></p>
            </div>
            <p className="note">
              * Khi nhấn nút Đặt hàng nghĩa là bạn đã đọc và đồng ý với các điều khoản, chính sách bán hàng và bảo mật của chúng tôi tại Website.
            </p>
            <Button type="primary" htmlType="submit" className="checkout-btn" onClick={handlePayment}>
              Đặt hàng
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default CreateOrder;
