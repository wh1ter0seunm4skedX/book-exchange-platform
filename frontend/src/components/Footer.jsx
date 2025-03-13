import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerLinks = [
    { name: 'About', href: '#' },
    { name: 'Terms', href: '#' },
    { name: 'Privacy', href: '#' },
    { name: 'Contact', href: '#' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex justify-center space-x-4 sm:space-x-6 sm:order-2 mb-4 sm:mb-0">
            {footerLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-500 hover:text-blue-600 transition-colors text-xs sm:text-sm"
                onClick={(e) => e.preventDefault()}
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="sm:order-1">
            <p className="text-center sm:text-left text-xs sm:text-sm text-gray-500">
              &copy; {currentYear} BookExchange. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
