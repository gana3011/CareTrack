import React from 'react';

const CustomFooter = () => (
  <footer
    className="w-full bg-white border-t border-gray-200 flex justify-center items-center"
    style={{
      height: '40px'
    }}
  >
    <span className="text-sm sm:text-base font-bold" style={{ color: '#1677ff' }}>
      © {new Date().getFullYear()} Healthcare App
    </span>
  </footer>
);

export default CustomFooter;
