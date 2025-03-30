import React from 'react';
import { version } from '../../package.json';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center space-x-2"> 
          <p className="text-center text-sm text-gray-600 font-medium">
            Guy & Michael 🤝 – Teamwork makes the dream work! 🚀
          </p>
          <span className="text-xs text-gray-400 font-mono">v{version}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
