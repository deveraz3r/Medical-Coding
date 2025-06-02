import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Spin,
  Typography,
  Space,
  Divider,
  message,
  Alert
} from "antd";
import { GoogleOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import api from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', values);
      localStorage.setItem('token', res.data.token);
      setLoading(false);
      window.location = `/${values.role}`;
    } catch(err) {
      const errorData = err.response?.data;
            
            if (errorData?.requiresVerification) {
              setShowResendVerification(true);
              setUserEmail(values.email);
              message.error(errorData.message);
            } else {
              message.error(errorData?.message || 'Login failed');
            }
            setError(errorData?.message || 'An error occurred during login');
            setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await api.post('/auth/resend-verification', { email: userEmail });
      message.success('Verification email sent! Please check your inbox.');
      setShowResendVerification(false);
    } catch (err) {
      console.error('Error sending verification email:', err);
      message.error('Failed to send verification email');
    }
  };

  const roles = ["Patient", "Doctor", /* "Front Desk", "Admin", "Insurance" */];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBDE] p-4">
      <Spin spinning={loading}>
        <Card
          className="w-full max-w-md"
          style={{
            boxShadow: "0 8px 32px rgba(18, 153, 144, 0.5)",
            border: "1px solid rgba(144, 209, 202, 0.4)",
            background: "white",
          }}
        >
          <div className="text-center mb-8">
            <Title level={2} style={{ color: "#129990" }}>
              Welcome Back
            </Title>
            <Text type="secondary">Please sign in to continue</Text>
          </div>

          {showResendVerification && (
            <Alert
              message="Email Verification Required"
              description={
                <div>
                  <p>Please verify your email before logging in.</p>
                  <Button 
                    type="link" 
                    onClick={handleResendVerification}
                    className="p-0"
                  >
                    Resend verification email
                  </Button>
                </div>
              }
              type="warning"
              className="mb-4"
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
          >
            {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
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
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="role"
              rules={[{ required: true, message: "Please select your role!" }]}
            >
              <Select placeholder="Select Role" size="large">
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
                style={{
                  background: "#129990",
                  height: "48px",
                }}
              >
                Sign In
              </Button>
            </Form.Item>

            <Divider>Or</Divider>

            <Button
              icon={<GoogleOutlined />}
              block
              size="large"
              className="mb-4"
              style={{ height: "48px" }}
            >
              Continue with Google
            </Button>

            <div className="text-center mt-4">
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
        </Card>
      </Spin>
    </div>
  );
};

export default Login;
