import React, { useEffect } from "react";
import { Form, Input, Select, Button, Card, Typography, message, DatePicker } from "antd";
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import api from '../../../services/api';

const { Title } = Typography;
const { Option } = Select;

const Profile = () => {
  const [form] = Form.useForm();

  useEffect(() => { fetchUserProfile(); }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found. Please login again.');
        return;
      }
      const decodedToken = jwtDecode(token);
      const userID = decodedToken.id;
      if (!userID) {
        console.error('User id not found. Please login again.');
        return;
      }
      
      const response = await api.get(`/users/${userID}`);
      const user = response.data;
      
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        bloodGroup: user.bloodGroup,
        dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found. Please login again.');
        return;
      }
      const decodedToken = jwtDecode(token);
      const userID = decodedToken.id;
      if (!userID) {
        console.error('User id not found. Please login again.');
        return;
      }
      
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null
      };
      
      await api.put(`/users/${userID}`, formattedValues);
      message.success('Profile Updated Successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Error updating Profile');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-md">
        <Title level={2} className="text-[#129990] mb-6">
          Profile Information
        </Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[
                { required: true, message: "Please enter your first name" },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[
                { required: true, message: "Please enter your last name" },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: "Please enter your phone number" },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: "Please select your gender" }]}
            >
              <Select size="large">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="bloodGroup"
              label="Blood Group"
              rules={[
                { required: true, message: "Please select your blood group" },
              ]}
            >
              <Select size="large">
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (group) => (
                    <Option key={group} value={group}>
                      {group}
                    </Option>
                  )
                )}
              </Select>
            </Form.Item>

            <Form.Item
                name="dateOfBirth"
                label="Date of Birth"
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

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{ background: "#129990" }}
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
