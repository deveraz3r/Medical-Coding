import React from "react";
import { Table, Button, Tag, Card, Modal } from "antd";
import { EyeOutlined } from "@ant-design/icons";

const Appointments = () => {
  const showAppointmentDetails = (record) => {
    Modal.info({
      title: "Appointment Details",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Patient:</strong> {record.patient}
          </p>
          <p>
            <strong>Date:</strong> {record.date}
          </p>
          <p>
            <strong>Time:</strong> {record.time}
          </p>
          <p>
            <strong>Status:</strong> {record.status}
          </p>
          <p>
            <strong>Reason:</strong> {record.reason}
          </p>
          <p>
            <strong>Notes:</strong> {record.notes}
          </p>
        </div>
      ),
      width: 600,
    });
  };

  const columns = [
    {
      title: "Patient",
      dataIndex: "patient",
      key: "patient",
      sorter: (a, b) => a.patient.localeCompare(b.patient),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = {
          Scheduled: "blue",
          "In Progress": "orange",
          Completed: "green",
          Cancelled: "red",
        }[status];
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => showAppointmentDetails(record)}
        >
          View Details
        </Button>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      patient: "Alice Johnson",
      date: "2024-03-15",
      time: "09:00 AM",
      status: "Scheduled",
      reason: "Annual Checkup",
      notes: "Patient reported mild symptoms of fatigue.",
    },
    {
      key: "2",
      patient: "Bob Smith",
      date: "2024-03-15",
      time: "10:00 AM",
      status: "In Progress",
      reason: "Follow-up",
      notes: "Review of previous treatment plan.",
    },
    {
      key: "3",
      patient: "Carol White",
      date: "2024-03-15",
      time: "11:00 AM",
      status: "Completed",
      reason: "Consultation",
      notes: "Prescribed new medication.",
    },
    {
      key: "4",
      patient: "David Brown",
      date: "2024-03-15",
      time: "02:00 PM",
      status: "Cancelled",
      reason: "Emergency",
      notes: "Patient rescheduled for next week.",
    },
  ];

  return (
    <Card title="Appointments" className="overflow-x-auto">
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </Card>
  );
};

export default Appointments;
