import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, InputNumber, message, Modal } from "antd";
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import api from '../../../services/api';

const Profile = () => {
  const [form] = Form.useForm();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [doctorId, setDoctorId] = useState(null);

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
          setDoctorId(doctorData._id); // Save doctorId for delete
        }
      } catch (err) {
        console.error('Error fetching doctor profile:', err);
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
      
      setSaveModalOpen(true);
    } catch (err) {
      console.error('Error updating profile:', err);
      message.error('Error updating Profile');
    }
  };

  const handleDeleteProfile = () => {
    setDeleteModalOpen(true);
  };

  const confirmDeleteProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Please login again');
        return;
      }
      const decodedToken = jwtDecode(token);
      const userID = decodedToken.id;

      // Delete doctor profile
      if (doctorId) {
        await api.delete(`/doctors/${doctorId}`);
      }
      // Delete user profile
      await api.delete(`/users/${userID}`);

      message.success('Profile deleted successfully');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      message.error('Failed to delete profile');
      console.error('Delete error:', error);
    } finally {
      setDeleteModalOpen(false);
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
          <Button
            danger
            type="default"
            className="w-full md:w-auto ml-2"
            onClick={handleDeleteProfile}
          >
            Delete Profile
          </Button>
        </Form.Item>
      </Form>

      {/* Save Changes Success Modal */}
      <Modal
        open={saveModalOpen}
        title="Changes Saved Successfully"
        onOk={() => setSaveModalOpen(false)}
        onCancel={() => setSaveModalOpen(false)}
        okText="OK"
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        Your profile has been updated successfully!
      </Modal>

      <Modal
        open={deleteModalOpen}
        title="Delete Profile"
        onOk={confirmDeleteProfile}
        onCancel={() => setDeleteModalOpen(false)}
        okText="Yes, Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        Are you sure you want to delete your profile? This action cannot be undone.
      </Modal>
    </Card>
  );
};

export default Profile;