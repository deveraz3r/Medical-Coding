import React, { useState, useEffect } from "react";
import { UpOutlined } from "@ant-design/icons";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 bg-teal-500 text-white rounded-full shadow-lg hover:bg-teal-600 transition-colors duration-300"
          aria-label="Scroll to top"
        >
          <UpOutlined className="text-xl" />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
