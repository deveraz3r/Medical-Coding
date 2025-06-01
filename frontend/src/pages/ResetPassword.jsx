import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Result } from 'antd';
import { LockOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [error, setError] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      validateToken(token);
    } else {
      setError('Invalid reset link');
      setValidatingToken(false);
    }
  }, [token]);

  const validateToken = async (resetToken) => {
    try {
      const response = await api.get(`/auth/validate-reset-token?token=${resetToken}`);
      if (response.data.success) {
        setTokenValid(true);
      } else {
        setError('Invalid or expired reset link');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid or expired reset link');
    } finally {
      setValidatingToken(false);
    }
  };

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        password: values.password
      });

      if (response.data.success) {
        setResetSuccess(true);
        message.success('Password reset successfully!');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Card className="max-w-md w-full shadow-lg text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p>Validating reset link...</p>
        </Card>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Card className="max-w-md w-full shadow-lg">
          <Result
            icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
            status="error"
            title="Invalid Reset Link"
            subTitle={error || 'This password reset link is invalid or has expired.'}
            extra={[
              <Link key="forgot" to="/forgot-password">
                <Button type="primary" style={{ background: '#129990' }}>
                  Request New Reset Link
                </Button>
              </Link>,
              <Link key="login" to="/login">
                <Button>Back to Login</Button>
              </Link>
            ]}
          />
        </Card>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Card className="max-w-md w-full shadow-lg">
          <Result
            icon={<CheckCircleOutlined style={{ color: '#129990' }} />}
            status="success"
            title="Password Reset Successful!"
            subTitle="Your password has been successfully updated. You can now login with your new password."
            extra={[
              <Button 
                key="login" 
                type="primary" 
                style={{ background: '#129990' }}
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Reset Password</h2>
          <p className="text-gray-600">
            Enter your new password below.
          </p>
        </div>

        <Form
          name="reset-password"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your new password!' },
              { min: 8, message: 'Password must be at least 8 characters long!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter new password"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm new password"
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
              Reset Password
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <Link to="/login" className="text-teal-600 hover:text-teal-700">
            Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword;