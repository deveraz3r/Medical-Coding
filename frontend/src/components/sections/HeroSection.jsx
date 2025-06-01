import React from "react";
import { Button, Typography } from "antd";

const { Title, Paragraph } = Typography;

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="min-h-screen relative bg-gradient-to-b from-[#129990] to-[#096B68]"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-15 bg-[url('/medical-pattern.png')] bg-repeat"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center">
          <Title className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#FFFBDE] mb-8">
            Revolutionizing Healthcare
            <span className="block mt-4">
              Secure Blockchain EHR with AI-Powered Coding
            </span>
          </Title>

          <Paragraph className="text-2xl text-[#90D1CA] mb-12 max-w-3xl mx-auto">
            Transform your healthcare experience with our cutting-edge
            blockchain technology and AI-powered solutions.
          </Paragraph>

          <div className="flex justify-center gap-6">
            <Button
              type="primary"
              size="large"
              className="bg-[#FFFBDE] text-[#129990] hover:bg-[#90D1CA] hover:text-[#096B68] min-w-[180px] h-[50px] text-lg"
              onClick={() =>
                document
                  .getElementById("features")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Get Started
            </Button>
            <Button
              size="large"
              className="border-[#FFFBDE] text-[#FFFBDE] hover:bg-[#90D1CA] hover:text-[#096B68] min-w-[180px] h-[50px] text-lg"
              onClick={() =>
                document
                  .getElementById("why-us")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
