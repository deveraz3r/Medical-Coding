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
  DatePicker,
} from "antd";
import { GoogleOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import api from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [error, setError] = useState('');

  const handleSubmit = async (values) => {
    const { confirmPassword, ...signupData } = values;
    const formattedValues = { ...signupData, dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null };
    setLoading(true);
    try {
      await api.post('/auth/signup', formattedValues);
      setLoading(false);
      window.location = '/login';
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Signup Failed');
      setLoading(false);
    }
  };

  const roles = ["Patient", "Doctor", "Front Desk", "Admin", "Insurance"];
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBDE] p-4">
      <Spin spinning={loading}>
        <Card
          className="w-full max-w-2xl"
          style={{
            boxShadow: "0 8px 32px rgba(18, 153, 144, 0.5)",
            border: "1px solid rgba(144, 209, 202, 0.4)",
            background: "white",
          }}
        >
          <div className="text-center mb-8">
            <Title level={2} style={{ color: "#129990" }}>
              Create Account
            </Title>
            <Text type="secondary">Join our healthcare platform</Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
          >
            {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
              }}
            >
              <Form.Item
                name="firstName"
                rules={[
                  { required: true, message: "Please input your first name!" },
                ]}
              >
                <Input placeholder="First Name" size="large" />
              </Form.Item>

              <Form.Item
                name="lastName"
                rules={[
                  { required: true, message: "Please input your last name!" },
                ]}
              >
                <Input placeholder="Last Name" size="large" />
              </Form.Item>
            </div>

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

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
              }}
            >
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  {
                    min: 8,
                    message: "Password must be at least 8 characters!",
                  },
                ]}
              >
                <Input.Password placeholder="Password" size="large" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm Password" size="large" />
              </Form.Item>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
              }}
            >
              <Form.Item
                name="gender"
                rules={[
                  { required: true, message: "Please select your gender!" },
                ]}
              >
                <Select placeholder="Gender" size="large">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="dateOfBirth"
                rules={[
                  {
                    required: true,
                    message: "Please select your date of birth!",
                  },
                ]}
              >
                <DatePicker
                  placeholder="Date of Birth"
                  size="large"
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
              }}
            >
              <Form.Item name="bloodGroup">
                <Select placeholder="Blood Group (Optional)" size="large">
                  {bloodGroups.map((group) => (
                    <Option key={group} value={group}>
                      {group}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone number!",
                  },
                ]}
              >
                <Input placeholder="Phone Number" size="large" />
              </Form.Item>
            </div>

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
                Create Account
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
              Sign up with Google
            </Button>

            <div className="text-center mt-4">
              <Text type="secondary">
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#129990" }}>
                  Sign In
                </Link>
              </Text>
            </div>
          </Form>
        </Card>
      </Spin>
    </div>
  );
};

export default Signup;
