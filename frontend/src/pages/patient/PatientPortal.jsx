import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  HistoryOutlined,
  ShareAltOutlined,
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import Profile from "./sections/Profile";
import BookAppointment from "./sections/BookAppointment";
import History from "./sections/History";
import DataSharing from "./sections/DataSharing";
import EHR from "./sections/EHR";
import "./PatientPortal.css";

const { Sider, Content } = Layout;

const PatientPortal = () => {
  const [selectedKey, setSelectedKey] = useState("profile");
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { key: "profile", icon: <UserOutlined />, label: "Profile" },
    {
      key: "appointments",
      icon: <CalendarOutlined />,
      label: "Book Appointment",
    },
    { key: "history", icon: <HistoryOutlined />, label: "History" },
    { key: "sharing", icon: <ShareAltOutlined />, label: "Data Sharing" },
    { key: "ehr", icon: <FileTextOutlined />, label: "EHR" },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case "profile":
        return <Profile />;
      case "appointments":
        return <BookAppointment />;
      case "history":
        return <History />;
      case "sharing":
        return <DataSharing />;
      case "ehr":
        return <EHR />;
      default:
        return <Profile />;
    }
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        collapsed={collapsed}
        collapsible
        trigger={null}
        width={200}
        collapsedWidth={80}
        style={{
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          bottom: 0,
          backgroundColor: "#129990",
        }}
      >
        <div className="p-4 text-center flex items-center justify-between">
          <h1
            className={`text-xl font-bold text-[#FFFBDE] ${
              collapsed ? "hidden" : "block"
            }`}
          >
            Patient Portal
          </h1>
          <button
            className="text-[#FFFBDE] p-2 hover:text-[#90D1CA]"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => setSelectedKey(key)}
          items={menuItems}
          className="border-r-0"
        />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "margin-left 0.2s",
        }}
      >
        <Content className="p-6 bg-[#FFFBDE] min-h-screen">
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default PatientPortal;
