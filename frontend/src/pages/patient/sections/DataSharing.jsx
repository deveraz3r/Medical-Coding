import React, { useState } from "react";
import { Switch, Card, Typography, Tag, List, Modal, message } from "antd";
import {
  SecurityScanOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const DataSharing = () => {
  const [permissions, setPermissions] = useState({
    medicalHistory: true,
    prescriptions: false,
    research: true,
    insurance: true,
    emergencyAccess: true,
  });

  const handlePermissionChange = (key, checked) => {
    Modal.confirm({
      title: `${checked ? "Enable" : "Disable"} Data Sharing`,
      icon: <SecurityScanOutlined />,
      content: `Are you sure you want to ${
        checked ? "enable" : "disable"
      } this data sharing permission?`,
      onOk: () => {
        setPermissions((prev) => ({ ...prev, [key]: checked }));
        message.success(
          `Permission ${checked ? "enabled" : "disabled"} successfully`
        );
      },
    });
  };

  const showInfo = (title, content) => {
    Modal.info({
      title,
      content: <Paragraph>{content}</Paragraph>,
      icon: <QuestionCircleOutlined />,
    });
  };

  const sharingOptions = [
    {
      key: "medicalHistory",
      title: "Medical History Access",
      description: "Allow doctors to view your complete medical history",
      info: "Doctors will have access to your past medical records, diagnoses, and treatments.",
    },
    {
      key: "prescriptions",
      title: "Prescription History",
      description: "Share prescription history with pharmacies",
      info: "Pharmacies can view your prescription history to prevent drug interactions.",
    },
    {
      key: "research",
      title: "Research Data Usage",
      description: "Allow anonymous data usage for medical research",
      info: "Your data will be anonymized and used for medical research purposes.",
    },
    {
      key: "insurance",
      title: "Insurance Information",
      description: "Share medical data with insurance providers",
      info: "Insurance providers can access relevant medical information for claims processing.",
    },
    {
      key: "emergencyAccess",
      title: "Emergency Access",
      description: "Allow emergency access to critical health information",
      info: "Emergency responders can access vital health information in critical situations.",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <Title level={2} className="text-[#129990] mb-6">
          Data Sharing Preferences
        </Title>
        <Paragraph className="mb-6">
          Manage how your medical information is shared with healthcare
          providers and services.
        </Paragraph>

        <List
          itemLayout="horizontal"
          dataSource={sharingOptions}
          renderItem={(item) => (
            <List.Item>
              <Card className="w-full shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Text strong className="text-lg">
                        {item.title}
                      </Text>
                      <QuestionCircleOutlined
                        className="text-gray-400 cursor-pointer"
                        onClick={() => showInfo(item.title, item.info)}
                      />
                    </div>
                    <Text type="secondary" className="block">
                      {item.description}
                    </Text>
                  </div>
                  <div className="space-y-2 text-right">
                    <Switch
                      checked={permissions[item.key]}
                      onChange={(checked) =>
                        handlePermissionChange(item.key, checked)
                      }
                      className={permissions[item.key] ? "bg-[#129990]" : ""}
                    />
                    <div>
                      <Tag
                        color={permissions[item.key] ? "success" : "default"}
                      >
                        {permissions[item.key] ? "Active" : "Inactive"}
                      </Tag>
                    </div>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Card>

      <Card className="shadow-md">
        <Title level={3} className="text-[#129990] mb-4">
          Data Access Log
        </Title>
        <List
          size="small"
          dataSource={[
            {
              title: "Dr. Sarah Johnson accessed medical history",
              time: "2024-03-15 10:30 AM",
              type: "view",
            },
            {
              title: "Insurance claim processed",
              time: "2024-03-14 02:15 PM",
              type: "process",
            },
            {
              title: "Pharmacy viewed prescription history",
              time: "2024-03-13 11:45 AM",
              type: "view",
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={item.title} description={item.time} />
              <Tag color={item.type === "view" ? "blue" : "green"}>
                {item.type.toUpperCase()}
              </Tag>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default DataSharing;
