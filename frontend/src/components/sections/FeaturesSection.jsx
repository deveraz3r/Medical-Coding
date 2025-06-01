import React from "react";
import { Card, Typography } from "antd";
import {
  MedicineBoxOutlined,
  RobotOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const features = [
  {
    icon: <MedicineBoxOutlined className="text-5xl text-[#129990]" />,
    title: "Blockchain EHR",
    description:
      "Secure and transparent health records using advanced blockchain technology.",
  },
  {
    icon: <RobotOutlined className="text-5xl text-[#129990]" />,
    title: "AI-Powered Coding",
    description:
      "Intelligent medical coding automation powered by advanced AI algorithms.",
  },
  {
    icon: <CalendarOutlined className="text-5xl text-[#129990]" />,
    title: "Smart Scheduling",
    description:
      "Efficient appointment management with intelligent scheduling system.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-[#FFFBDE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Title
            level={2}
            className="text-4xl sm:text-5xl font-bold text-[#096B68] mb-6"
          >
            Powerful Features
          </Title>
          <Paragraph className="text-xl text-[#129990] max-w-2xl mx-auto">
            Experience the next generation of healthcare management with our
            innovative features.
          </Paragraph>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-2 border-[#90D1CA]"
              bordered={false}
            >
              <div className="space-y-6 text-center">
                {feature.icon}
                <Title
                  level={3}
                  className="text-2xl font-semibold text-[#096B68] !mt-4"
                >
                  {feature.title}
                </Title>
                <Paragraph className="text-lg text-[#129990]">
                  {feature.description}
                </Paragraph>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
