import React, { useState, useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { getUserById } from "../../services/UserSevices";
import { jwtDecode } from 'jwt-decode';


const UserProfile = () => {
  // Giá trị state
  const [form] = Form.useForm(); // Sử dụng instance Form của Ant Design
  const [token, setToken] = useState('');

  // Lấy thông tin người dùng dựa vào token
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      const decoded = jwtDecode(storedToken); // Giải mã token để lấy userId
      fetchUser(decoded.userId); // Lấy dữ liệu người dùng dựa vào userId
    }
  }, []);

  const fetchUser = async (userId) => {
    try {
      const user = await getUserById(userId); // Lấy dữ liệu người dùng từ API
      // Cập nhật các trường trong form với dữ liệu người dùng
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      });
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu người dùng:', error);
    }
  };

  // Xử lý khi submit form
  const handleSave = (values) => {
    // Thực hiện logic lưu tại đây
    console.log('Lưu hồ sơ với các giá trị:', values);
  };

  return (
    <div style={{ margin: 50 }}>
      <div>
        <h1 style={{ fontSize: 20 }}>Hồ sơ của tôi</h1>
        <div>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <hr />

      <Form
        form={form}
        name="basic"
        wrapperCol={{ span: 14 }}
        onFinish={handleSave}
        autoComplete="off"
        initialValues={{
          name: '',
          email: '',
          phone: '',
          address: '',
        }}
      >
        <Form.Item label="Tên" name="name">
          <Input onChange={(e) => form.setFieldsValue({ name: e.target.value })} />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email của bạn!' },
            { type: 'email', message: 'Vui lòng nhập email hợp lệ!' },
          ]}
        >
          <Input onChange={(e) => form.setFieldsValue({ email: e.target.value })} />
        </Form.Item>

        <Form.Item label="Mật khẩu" name="password">
          <Input.Password onChange={(e) => form.setFieldsValue({ password: e.target.value })} />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phone">
          <Input onChange={(e) => form.setFieldsValue({ phone: e.target.value })} />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input onChange={(e) => form.setFieldsValue({ address: e.target.value })} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserProfile;
