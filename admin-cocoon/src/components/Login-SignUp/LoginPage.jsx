import { login } from '../../services/UserSevices';
import './LoginPageStyles.css';
import Video from "./video/video.mp4";
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, message } from 'antd';

function LoginPage() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(data);
      localStorage.setItem('token', res.token);
      message.success('Đăng nhập thành công');
      navigate('/');
    } catch (err) {
      message.error(err.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <div className="containers">
      <div className="container">
        <div className="left">
          <video className="background-video" src={Video} autoPlay loop muted />
          <div className="text-overlay">
            <div className="headline">
              <span className="line1">Create And Sell</span>
              <span className="line2">Extraordinary</span>
              <span className="line3">Products</span>
            </div>
            <p>Adopt the peace of nature!</p>
          </div>
          <div className="footer-signup">
            <p>Don't have an account?</p>
            <Link to="/signup" className="signup-button">Sign Up</Link>
          </div>
        </div>
        <div className="right">
          <h2>Welcome Back!</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Input
                type="email"
                id="email"
                placeholder="Enter Email"
                value={data.email}
                onChange={handleChange}
                required
                style={{ height: '40px' }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Input.Password
                type="password"
                id="password"
                placeholder="Enter Password"
                value={data.password}
                onChange={handleChange}
                required
                style={{ height: '40px' }}
              />
            </div>
            <button type="submit" className="btn">Login</button>
            <div className="form-footer">
              <p style={{ textAlign: 'center' }}>
                Forgot your password? <a href="#">Click Here</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
