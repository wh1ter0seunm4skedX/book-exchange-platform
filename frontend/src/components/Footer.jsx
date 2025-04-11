import React from 'react';
import { version } from '../../package.json';

// Footer with a shoutout for us :) and version number
const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center space-x-3"> 
          <p className="text-center text-sm text-gray-600 font-medium">
            Guy & Michael 🤝 – Teamwork makes the dream work! 🚀
          </p>
          <div className="flex items-center bg-gray-100 rounded-full px-2.5 py-0.5 border border-gray-200">
            <div className="flex items-center mr-1">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-xs text-gray-600 font-mono">v{version}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;