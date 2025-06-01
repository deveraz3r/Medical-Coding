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
      
      const userResponse = await api.get(`/users/${userID}`);
      const user = userResponse.data;
      
      let doctorData = {};
      try {
        const doctorResponse = await api.get('/doctors');
        if (doctorResponse.data && doctorResponse.data.length > 0) {
          doctorData = doctorResponse.data[0];
        }
      } catch (err) {
        console.console.error('Error fetching doctor profile:', err);
        message.error('Error fetching doctor profile data');
      }
      
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        bloodGroup: user.bloodGroup,
        dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
        specialization: doctorData.specialization || '',
        licenseNumber: doctorData.licenseNumber || '',
        yearsExperience: doctorData.experience || 0,
        address: doctorData.address || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      message.error('Error fetching profile data');
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

      const userResponse = await api.get(`/users/${userID}`);
      const user = userResponse.data;
      
      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        gender: user.gender,
        bloodGroup: user.bloodGroup,
        dateOfBirth: user.dateOfBirth
      };
      
      const doctorData = {
        specialization: values.specialization,
        licenseNumber: values.licenseNumber,
        experience: values.yearsExperience,
        address: values.address
      };
      
      await api.put(`/users/${userID}`, userData);
      message.success('User Profile Updated Successfully');
      
      try {
        const doctorResponse = await api.get('/doctors');
        if (doctorResponse.data && doctorResponse.data.length > 0) {
          const doctorId = doctorResponse.data[0]._id;
          await api.put(`/doctors/${doctorId}`, doctorData);
        } else {
          await api.post('/doctors', doctorData);
        }
      } catch (err) {
        await api.post('/doctors', doctorData);
        console.error('Error updating doctor profile:', err);
      }
      
      message.success('Profile Updated Successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
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
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Personal Information</h3>
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
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Professional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Specialization"
              name="specialization"
              rules={[
                { required: true, message: "Please input your specialization!" },
              ]}
            >
              <Input placeholder="e.g., Cardiology, Pediatrics, etc." />
            </Form.Item>

            <Form.Item
              label="License Number"
              name="licenseNumber"
              rules={[
                { required: true, message: "Please input your license number!" },
              ]}
            >
              <Input placeholder="Medical license number" />
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
              <InputNumber min={0} max={50} className="w-full" placeholder="Years" />
            </Form.Item>
          </div>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Clinic/Hospital address where you practice" 
            />
          </Form.Item>
        </div>

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
