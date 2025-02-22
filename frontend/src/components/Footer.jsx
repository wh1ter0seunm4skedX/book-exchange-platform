import React from 'react';

const Footer = () => {
  const footerLinks = [
    { name: 'About', href: '#' },
    { name: 'Terms', href: '#' },
    { name: 'Privacy', href: '#' },
    { name: 'Contact', href: '#' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            {footerLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-400 hover:text-gray-500"
                onClick={(e) => e.preventDefault()}
              >
                <span className="text-sm">{link.name}</span>
              </a>
            ))}
          </div>
          <div className="mt-4 md:order-1 md:mt-0">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} BookExchange. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
