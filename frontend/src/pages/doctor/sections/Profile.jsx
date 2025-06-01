import React, { useEffect } from "react";
import { Form, Input, Button, Card, InputNumber, message } from "antd";
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import api from '../../../services/api';

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

  const onFinish = async (values) => {
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
    <Card title="Doctor Profile" className="max-w-3xl mx-auto">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              { required: true, message: "Please input your last name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Specialization"
            name="specialization"
            rules={[
              { required: true, message: "Please input your specialization!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="License Number"
            name="licenseNumber"
            rules={[
              { required: true, message: "Please input your license number!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Years of Experience"
            name="yearsExperience"
            rules={[
              {
                required: true,
                message: "Please input your years of experience!",
              },
            ]}
          >
            <InputNumber min={0} max={50} className="w-full" />
          </Form.Item>
        </div>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please input your address!" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full md:w-auto">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Profile;
