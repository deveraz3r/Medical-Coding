import React from "react";
import { Typography, Space, Row, Col } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  InstagramOutlined,
} from "@ant-design/icons";

const { Title, Link, Text } = Typography;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: ["About Us", "Contact", "Careers", "Press"],
    Product: ["Features", "Pricing", "Security", "API"],
    Resources: ["Documentation", "Support", "Blog", "Partners"],
    Legal: ["Privacy Policy", "Terms of Service", "Compliance", "Security"],
  };

  const socialLinks = [
    { icon: <FacebookOutlined />, url: "#" },
    { icon: <TwitterOutlined />, url: "#" },
    { icon: <LinkedinOutlined />, url: "#" },
    { icon: <InstagramOutlined />, url: "#" },
  ];

  return (
    <footer className="bg-[#096B68] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="mb-8">
          <Row gutter={[32, 32]}>
            {/* Company Info */}
            <Col xs={24} sm={24} md={8} lg={8}>
              <div className="mb-8 md:mb-0">
                <Title level={3} className="text-white mb-4">
                  HealthCare
                </Title>
                <Text className="text-gray-400 block mb-6">
                  Revolutionizing healthcare with blockchain and AI technology.
                </Text>
                <Space size="large" className="text-2xl">
                  {socialLinks.map((social, index) => (
                    <Link
                      key={index}
                      href={social.url}
                      className="text-gray-400 hover:text-teal-500 transition-colors"
                    >
                      {social.icon}
                    </Link>
                  ))}
                </Space>
              </div>
            </Col>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <Col xs={12} sm={12} md={4} lg={4} key={category}>
                <div>
                  <Title level={4} className="text-white mb-4">
                    {category}
                  </Title>
                  <ul className="space-y-2">
                    {links.map((link, index) => (
                      <li key={index}>
                        <Link
                          href="#"
                          className="text-gray-400 hover:text-teal-500"
                        >
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <Row justify="space-between" align="middle">
            <Col>
              <Text className="text-gray-400">
                © {currentYear} HealthCare. All rights reserved.
              </Text>
            </Col>
            <Col>
              <Space size="large" className="text-gray-400">
                <Link href="#" className="text-gray-400 hover:text-teal-500">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-gray-400 hover:text-teal-500">
                  Terms of Service
                </Link>
              </Space>
            </Col>
          </Row>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
