import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Result } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', {
        email: values.email
      });

      if (response.data.success) {
        setEmail(values.email);
        setEmailSent(true);
        message.success('Password reset link sent to your email!');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Card className="max-w-md w-full shadow-lg">
          <Result
            icon={<MailOutlined style={{ color: '#129990', fontSize: '64px' }} />}
            title="Check Your Email"
            subTitle={
              <div>
                <p>We've sent a password reset link to:</p>
                <p className="font-semibold text-teal-600">{email}</p>
                <p className="mt-2 text-gray-600">
                  Click the link in the email to reset your password. 
                  The link will expire in 1 hour.
                </p>
              </div>
            }
            extra={[
              <Button key="resend" type="link" onClick={() => setEmailSent(false)}>
                Didn't receive email? Try again
              </Button>,
              <Link key="back" to="/login">
                <Button type="primary" style={{ background: '#129990' }}>
                  Back to Login
                </Button>
              </Link>
            ]}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Card className="max-w-md w-full shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-teal-600 mb-2">HealthCare</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Forgot Password?</h2>
          <p className="text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <Form
          name="forgot-password"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email address!' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter your email address"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full rounded-lg"
              style={{ 
                background: '#129990', 
                borderColor: '#129990',
                height: '48px',
                fontSize: '16px'
              }}
            >
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <Link to="/login" className="text-teal-600 hover:text-teal-700">
            <ArrowLeftOutlined className="mr-1" />
            Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;