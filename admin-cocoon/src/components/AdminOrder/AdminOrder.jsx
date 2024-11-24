import React, { useState } from "react";
import { WapperHeader } from "./style";
import { Button, Table, Tag, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddOrderModal from "./AddOrderModal/AddOrderModal";

const columns = [
    {
        title: 'Order ID',
        dataIndex: 'orderId',
        render: (text) => <a href="/#">{text}</a>,
    },
    {
        title: 'Tên khách hàng',
        dataIndex: 'customerName',
    },
    {
        title: 'Ngày đặt hàng',
        dataIndex: 'date',
    },
    {
        title: 'trạng thái thanh toán',
        dataIndex: 'paymentStatus',
        render: (status) => (
            <Tag color={status === 'Paid' ? 'red' : 'green'}>
                {status}
            </Tag>
        ),
    },
    {
        title: 'Tổng cộng',
        dataIndex: 'total',
        render: (total) => `$${total}`,
    },
    {
        title: 'Phương thức thanh toán',
        dataIndex: 'paymentMethod',
    },
    {
        title: 'Trạng thái đơn hàng',
        dataIndex: 'orderStatus',
        render: (status) => (
            <Tag color={status === 'Shipped' ? 'green' : 'orange'}>
                {status}
            </Tag>
        ),
    },
    {
        title: 'Thao tác',
        key: 'action',
        render: () => (
            <Space size="middle">
                <Button icon={<EditOutlined />} />
                <Button icon={<DeleteOutlined />} danger />
            </Space>
        ),
    },
];

const data = [
    // {
    //     key: '1',
    //     orderId: '#Kz025418',
    //     customerName: 'Mendorcart',
    //     date: 'Mar 24, 2022 04:26 PM',
    //     paymentStatus: 'Paid',
    //     total: 11250,
    //     paymentMethod: 'Mastercard',
    //     orderStatus: 'Shipped',
    // },
    // {
    //     key: '2',
    //     orderId: '#Kz025419',
    //     customerName: 'Mendorcart',
    //     date: 'Mar 24, 2022 04:26 PM',
    //     paymentStatus: 'Paid',
    //     total: 11250,
    //     paymentMethod: 'Mastercard',
    //     orderStatus: 'Shipped',
    // },
];

const AdminOrder = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleAddOrder = (values) => {
        console.log("New Order:", values);
        // Thêm logic để xử lý đơn hàng mới tại đây, ví dụ: gửi dữ liệu lên server
        setIsModalVisible(false);
    };

    return (
        <div>
            <WapperHeader> Order List </WapperHeader>
            <div style={{ padding: '10px' }}>
                <Button
                    style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }}
                    onClick={showModal}
                >
                    <PlusOutlined style={{ fontSize: '40px' }} />
                </Button>
            </div>
            <Table columns={columns} dataSource={data} />
            <AddOrderModal
                isVisible={isModalVisible}
                onCancel={handleCancel}
                onSubmit={handleAddOrder}
            />
        </div>
    );
};

export default AdminOrder;
