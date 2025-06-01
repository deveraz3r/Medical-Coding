import React from "react";
import { Layout } from "antd";
import { Link } from "react-router-dom";

const { Content } = Layout;

const AuthLayout = ({ children }) => {
  return (
    <Layout className="min-h-screen bg-[#FFFBDE]">
      <Content>
        <div className="p-4">
          <Link
            to="/"
            className="fixed top-4 left-4 text-2xl font-bold text-[#129990]"
          >
            HealthCare
          </Link>
        </div>
        {children}
      </Content>
    </Layout>
  );
};

export default AuthLayout;
