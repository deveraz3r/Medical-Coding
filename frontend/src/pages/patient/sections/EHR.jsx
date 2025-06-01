import React from "react";
import { Table, Button, Card, Typography, Tag, message, Tooltip } from "antd";
import {
  DownloadOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const EHR = () => {
  const handleDownload = (record) => {
    message
      .loading("Preparing PDF for download...", 1.5)
      .then(() => message.success("PDF downloaded successfully"));
  };

  const handleVerify = (record) => {
    message.loading("Verifying record integrity...", 2.0).then(() => {
      message.success({
        content: (
          <div>
            <CheckCircleOutlined className="text-green-500 mr-2" />
            Record verified successfully
          </div>
        ),
        duration: 3,
      });
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
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => <Tag color="#129990">{text}</Tag>,
    },
    {
      title: "Doctor",
      dataIndex: "doctor",
      key: "doctor",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colors = {
          verified: "success",
          pending: "warning",
          processing: "processing",
        };
        const icons = {
          verified: <CheckCircleOutlined />,
          pending: <SyncOutlined spin />,
          processing: <SyncOutlined spin />,
        };
        return (
          <Tag color={colors[status]} icon={icons[status]}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="space-x-2">
          <Tooltip title="Download PDF">
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record)}
              style={{ color: "#129990" }}
            >
              Download
            </Button>
          </Tooltip>
          <Tooltip title="Verify Record Integrity">
            <Button
              icon={<SafetyCertificateOutlined />}
              onClick={() => handleVerify(record)}
              style={{ color: "#129990" }}
            >
              Verify
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      date: "2024-03-15",
      type: "Consultation",
      doctor: "Dr. Sarah Johnson",
      status: "verified",
      department: "Cardiology",
    },
    {
      key: "2",
      date: "2024-03-10",
      type: "Lab Results",
      doctor: "Dr. Michael Chen",
      status: "verified",
      department: "Pathology",
    },
    {
      key: "3",
      date: "2024-03-05",
      type: "Prescription",
      doctor: "Dr. Emily Rodriguez",
      status: "pending",
      department: "General Medicine",
    },
    {
      key: "4",
      date: "2024-03-01",
      type: "Imaging",
      doctor: "Dr. James Wilson",
      status: "processing",
      department: "Radiology",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <div className="flex justify-between items-center mb-6">
          <Title level={2} className="text-[#129990] mb-0">
            Electronic Health Records
          </Title>
          <Text type="secondary">
            Last updated: {new Date().toLocaleDateString()}
          </Text>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} records`,
          }}
          className="bg-white"
        />
      </Card>

      <Card className="shadow-md">
        <Title level={3} className="text-[#129990] mb-4">
          Record Statistics
        </Title>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center">
            <Text strong className="text-lg block">
              Total Records
            </Text>
            <Text className="text-2xl text-[#129990]">24</Text>
          </Card>
          <Card className="text-center">
            <Text strong className="text-lg block">
              Verified Records
            </Text>
            <Text className="text-2xl text-green-500">20</Text>
          </Card>
          <Card className="text-center">
            <Text strong className="text-lg block">
              Pending Verification
            </Text>
            <Text className="text-2xl text-orange-500">4</Text>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default EHR;
