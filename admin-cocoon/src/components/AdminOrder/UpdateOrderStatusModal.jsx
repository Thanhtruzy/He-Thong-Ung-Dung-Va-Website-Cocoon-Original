import React, { useEffect, useState } from "react";
import { Modal, Form, Select, message, List, Typography } from "antd";
import axios from "axios";

const { Option } = Select;
const { Text } = Typography;

const UpdateOrderStatusModal = ({ isVisible, orderId, onCancel, onUpdate }) => {
    const [status, setStatus] = useState("");
    const [orderDetails, setOrderDetails] = useState(null); // State để lưu chi tiết đơn hàng
    const [form] = Form.useForm();

    useEffect(() => {
        if (isVisible && orderId) {
            fetchOrderDetails(orderId);
        }
    }, [isVisible, orderId]);

    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await axios.get(`http://localhost:4000/orders/${orderId}`);
            setStatus(response.data.status);
            setOrderDetails(response.data); // Lưu thông tin đơn hàng vào state
            form.setFieldsValue({ orderStatus: response.data.status });
        } catch (error) {
            message.error("Lỗi khi lấy thông tin đơn hàng!");
            console.error("Lỗi khi lấy thông tin đơn hàng:", error);
        }
    };

    const handleUpdateStatus = async () => {
        try {
            await axios.put(`http://localhost:4000/orders/${orderId}/status`, { status });
            message.success("Cập nhật trạng thái đơn hàng thành công!");
            onUpdate(); // Gọi lại hàm để cập nhật danh sách đơn hàng
            onCancel(); // Đóng modal sau khi cập nhật
        } catch (error) {
            message.error("Lỗi khi cập nhật trạng thái đơn hàng!");
            console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        }
    };

    return (
        <Modal
            title="Cập nhật trạng thái đơn hàng"
            open={isVisible}
            onOk={handleUpdateStatus}
            onCancel={onCancel}
            okText="Cập nhật"
            cancelText="Hủy"
        >
            {orderDetails && (
                <div>
                    <Text strong>Tên khách hàng: </Text>
                    <Text>{orderDetails.customerName}</Text>
                    <br />
                    <Text strong>Email khách hàng: </Text>
                    <Text>{orderDetails.customerEmail}</Text>
                    <br />
                    <Text strong>Ngày đặt hàng: </Text>
                    <Text>{new Date(orderDetails.order_date).toLocaleString()}</Text>
                    <br />
                    <Text strong>Tổng số tiền: </Text>
                    <Text>${parseFloat(orderDetails.total_amount.$numberDecimal).toFixed(2)}</Text>
                    <br /><br />

                    <Text strong>Sản phẩm trong đơn hàng:</Text>
                    <List
                        bordered
                        dataSource={orderDetails.items}
                        renderItem={(item) => (
                            <List.Item>
                                <Text>{item.productName || 'Không có tên sản phẩm'} - Số lượng: {item.quantity}</Text>
                            </List.Item>
                        )}
                    />

                    {/* Thêm khoảng cách trước Form */}
                    <div style={{ marginTop: '20px' }}>
                        <Form form={form}>
                            <Form.Item label={<Text strong>Trạng thái đơn hàng</Text>} name="orderStatus">
                                <Select onChange={(value) => setStatus(value)} value={status}>
                                    <Option value="chờ xử lý">Processing</Option>
                                    <Option value="đã giao">Shipped</Option>
                                    <Option value="hủy">Cancelled</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default UpdateOrderStatusModal;
