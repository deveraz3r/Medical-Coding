import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const location = useLocation();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 64;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "hero",
        "features",
        "testimonials",
        "why-us",
        "contact",
      ];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          if (top <= 100 && bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { id: "hero", label: "Home" },
    { id: "features", label: "Features" },
    { id: "testimonials", label: "Testimonials" },
    { id: "why-us", label: "Why Us" },
    { id: "contact", label: "Contact" },
  ];

  // Only show navigation items on the home page
  const isHomePage = location.pathname === "/";

  return (
    <nav className="fixed w-full z-50 bg-[#FFFBDE]/95 backdrop-blur-sm border-b border-[#90D1CA]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <h1 className="text-2xl font-bold text-[#129990] cursor-pointer">
                HealthCare
              </h1>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            {isHomePage &&
              menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-2 text-base font-medium transition-colors hover:text-[#129990] ${
                    activeSection === item.id
                      ? "text-[#129990] relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#129990]"
                      : "text-gray-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button
                  type="link"
                  className="text-[#129990] hover:text-[#096B68]"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  type="primary"
                  style={{
                    background: "#129990",
                    borderColor: "#129990",
                  }}
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
