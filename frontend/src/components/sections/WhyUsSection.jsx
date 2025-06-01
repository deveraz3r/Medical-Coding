import React from "react";
import { Typography, List, Statistic, Row, Col } from "antd";
import {
  SafetyOutlined,
  RocketOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const benefits = [
  "Advanced blockchain security for patient data",
  "AI-powered medical coding with 99.9% accuracy",
  "Intuitive scheduling system reduces wait times by 60%",
  "Seamless integration with existing healthcare systems",
  "Real-time access to patient records",
  "24/7 technical support and training",
];

const stats = [
  {
    title: "Hospitals",
    value: 500,
    suffix: "+",
    icon: <SafetyOutlined className="text-teal-500 text-3xl" />,
  },
  {
    title: "Patient Records",
    value: 1,
    suffix: "M+",
    icon: <TeamOutlined className="text-teal-500 text-3xl" />,
  },
  {
    title: "Efficiency Increase",
    value: 85,
    suffix: "%",
    icon: <RocketOutlined className="text-teal-500 text-3xl" />,
  },
];

const WhyUsSection = () => {
  return (
    <section
      id="why-us"
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Title
            level={2}
            className="text-3xl sm:text-4xl font-bold text-gray-900"
          >
            Why Choose Us
          </Title>
          <Paragraph className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Leading the healthcare revolution with innovative technology and
            proven results.
          </Paragraph>
        </div>

        {/* Statistics */}
        <Row gutter={[32, 32]} className="mb-16">
          {stats.map((stat, index) => (
            <Col xs={24} md={8} key={index} className="text-center">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                {stat.icon}
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  suffix={stat.suffix}
                  className="mt-2"
                />
              </div>
            </Col>
          ))}
        </Row>

        {/* Benefits */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <Title
            level={3}
            className="text-2xl font-bold text-gray-900 mb-8 text-center"
          >
            Key Benefits
          </Title>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 3,
              xl: 3,
              xxl: 3,
            }}
            dataSource={benefits}
            renderItem={(item) => (
              <List.Item>
                <div className="flex items-center space-x-2">
                  <div className="flex-shrink-0 w-2 h-2 bg-teal-500 rounded-full" />
                  <span className="text-gray-700">{item}</span>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
