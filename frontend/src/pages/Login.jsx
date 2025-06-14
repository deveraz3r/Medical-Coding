import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Typography, Space } from "antd";
import { GoogleOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import api from "../services/api";
import doctor3 from "../assets/doctor_3.jpg";

const { Title, Text } = Typography;
const { Option } = Select;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const [imagePath, setImagePath] = useState(""); // State for image path

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", values);
      localStorage.setItem("token", res.data.token);
      setLoading(false);
      window.location = `/${values.role}`;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login Failed");
      setLoading(false);
    }
  };

  const setLoginImage = () => {
    setImagePath(doctor3); // Use the imported image directly
  };

  useEffect(() => {
    setLoginImage();
  }, []);

  const roles = ["Patient", "Doctor", "Front Desk", "Admin", "Insurance"];

  return (
    <div className="h-screen flex">
      {/* Middle Section - Image */}
      <div className="w-3/5 bg-gray-100">
        {!imagePath && (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-500">Image Placeholder</span>
          </div>
        )}
        {imagePath && (
          <div
            className="w-13/10 h-14/9 bg-cover bg-center"
            style={{ backgroundImage: `url(${imagePath})` }}
          />
        )}
      </div>

      {/* Right Section - Login Form */}
      <div className="w-2/5 bg-[#FFFBDE] p-8 flex flex-col">
        <div className="mb-12">
          <Title level={1} style={{ color: "#129990", marginBottom: 0 }}>
            Welcome
          </Title>
          <Title level={1} style={{ color: "#129990", margin: 0 }}>
            Back
          </Title>
          <Text className="text-white">Please sign in to continue</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          className="w-full max-w-md"
        >
          {error && (
            <div
              style={{
                color: "red",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="role"
            rules={[{ required: true, message: "Please select your role!" }]}
          >
            <Select
              placeholder="Select Role"
              size="large"
              className="rounded-lg"
            >
              {roles.map((role) => (
                <Option key={role} value={role.toLowerCase()}>
                  {role}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="rounded-lg"
              style={{
                background: "#129990",
                height: "48px",
              }}
            >
              Sign In
            </Button>
          </Form.Item>

          <div className="text-center">
            <Text>Or</Text>
          </div>

          <Button
            icon={<GoogleOutlined />}
            block
            size="large"
            className="mt-4 rounded-lg"
          >
            Continue with Google
          </Button>

          <div className="text-center mt-8">
            <Space direction="vertical" size="small">
              <Link to="/forgot-password" style={{ color: "#129990" }}>
                Forgot Password?
              </Link>
              <Text type="secondary">
                Don't have an account?{" "}
                <Link to="/signup" style={{ color: "#129990" }}>
                  Sign Up
                </Link>
              </Text>
            </Space>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
