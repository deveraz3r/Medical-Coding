import React from "react";
import { Table, Button, Modal, Typography, Card, Tag } from "antd";
import { FileTextOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const History = () => {
  const showDetails = (record) => {
    Modal.info({
      title: "Appointment Details",
      width: 600,
      content: (
        <div className="space-y-4">
          <div>
            <Text strong>Date: </Text>
            <Text>{record.date}</Text>
          </div>
          <div>
            <Text strong>Doctor: </Text>
            <Text>{record.doctor}</Text>
          </div>
          <div>
            <Text strong>Diagnosis: </Text>
            <Text>{record.diagnosis}</Text>
          </div>
          <div>
            <Text strong>Prescription: </Text>
            <Text>{record.prescription}</Text>
          </div>
          <div>
            <Text strong>Notes: </Text>
            <Text>{record.notes}</Text>
          </div>
          <div>
            <Text strong>Follow-up: </Text>
            <Text>{record.followUp}</Text>
          </div>
        </div>
      ),
      icon: <FileTextOutlined className="text-[#129990]" />,
      okText: "Close",
    });
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Doctor",
      dataIndex: "doctor",
      key: "doctor",
    },
    {
      title: "Diagnosis",
      dataIndex: "diagnosis",
      key: "diagnosis",
      render: (text) => <Tag color="#129990">{text}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colors = {
          completed: "success",
          pending: "warning",
          cancelled: "error",
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => showDetails(record)}
          style={{ color: "#129990" }}
        >
          View Details
        </Button>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      date: "2024-03-15",
      doctor: "Dr. Sarah Johnson",
      diagnosis: "Common Cold",
      status: "completed",
      prescription: "Paracetamol 500mg, Vitamin C",
      notes:
        "Patient reported fever and sore throat. Prescribed rest and fluids.",
      followUp: "Follow-up in 1 week if symptoms persist",
    },
    {
      key: "2",
      date: "2024-02-28",
      doctor: "Dr. Michael Chen",
      diagnosis: "Annual Checkup",
      status: "completed",
      prescription: "None",
      notes: "All vitals normal. Recommended regular exercise.",
      followUp: "Next annual checkup in 12 months",
    },
    {
      key: "3",
      date: "2024-03-20",
      doctor: "Dr. Emily Rodriguez",
      diagnosis: "Follow-up",
      status: "pending",
      prescription: "Pending",
      notes: "Scheduled follow-up appointment",
      followUp: "N/A",
    },
  ];

  return (
    <Card className="shadow-md">
      <Title level={2} className="text-[#129990] mb-6">
        Medical History
      </Title>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        className="bg-white"
      />
    </Card>
  );
};

export default History;
