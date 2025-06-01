import React from "react";
import { Carousel, Card, Avatar, Rate, Typography } from "antd";

const { Title, Paragraph } = Typography;

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "Chief Medical Officer",
    avatar: "/avatars/sarah.jpg",
    quote:
      "This platform has revolutionized how we manage patient records. The blockchain security gives us peace of mind.",
    rating: 5,
  },
  {
    name: "Dr. Michael Chen",
    role: "Healthcare IT Director",
    avatar: "/avatars/michael.jpg",
    quote:
      "The AI-powered coding system has significantly reduced our administrative workload and improved accuracy.",
    rating: 5,
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "Primary Care Physician",
    avatar: "/avatars/emily.jpg",
    quote:
      "The scheduling system is intuitive and has greatly improved our patient management efficiency.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 bg-[#FFFBDE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Title
            level={2}
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
          >
            What Our Users Say
          </Title>
          <Paragraph className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from healthcare professionals who have transformed their
            practice with our platform.
          </Paragraph>
        </div>

        <div className="max-w-4xl mx-auto">
          <Carousel autoplay dots={true} className="pb-12" dotPosition="bottom">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="px-4 pb-12">
                <Card
                  className="mx-auto rounded-2xl border-1 border-[#90D1CA]/50"
                  style={{
                    boxShadow: "0 4px 30px rgba(144, 209, 202, 0.15)",
                    background: "white",
                  }}
                >
                  <div className="flex flex-col items-center gap-6 py-8">
                    <Avatar
                      src={testimonial.avatar}
                      size={120}
                      className="border-4 border-[#90D1CA]/20"
                    />
                    <Title
                      level={3}
                      className="text-2xl font-bold text-gray-900 mb-0"
                    >
                      {testimonial.name}
                    </Title>
                    <Paragraph className="text-lg text-[#129990] mt-0">
                      {testimonial.role}
                    </Paragraph>
                    <Rate
                      disabled
                      defaultValue={testimonial.rating}
                      className="text-[#129990] text-2xl"
                    />
                    <Paragraph className="text-xl italic text-gray-600 text-center max-w-2xl mt-4">
                      "{testimonial.quote}"
                    </Paragraph>
                  </div>
                </Card>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
