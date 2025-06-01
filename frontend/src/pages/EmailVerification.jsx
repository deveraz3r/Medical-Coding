import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Spin, Result, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import api from '../services/api';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyEmail(token);
    } else {
      setError('Invalid verification link');
      setLoading(false);
    }
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      const response = await api.get(`/auth/verify-email?token=${token}`);
      setVerified(true);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Verification failed');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <Spin size="large" />
          <p className="mt-4">Verifying your email...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full">
        <Result
          icon={verified ? <CheckCircleOutlined style={{ color: '#129990' }} /> : <CloseCircleOutlined />}
          status={verified ? 'success' : 'error'}
          title={verified ? 'Email Verified!' : 'Verification Failed'}
          subTitle={
            verified 
              ? 'Your email has been successfully verified. You can now login to your account.'
              : error
          }
          extra={[
            <Button 
              key="login" 
              type="primary" 
              style={{ background: '#129990' }}
              onClick={() => navigate('/login')}
            >
              {verified ? 'Go to Login' : 'Back to Login'}
            </Button>
          ]}
        />
      </Card>
    </div>
  );
};

export default EmailVerification;