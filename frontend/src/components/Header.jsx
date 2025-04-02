import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../api/apiUtils';
import { HiOutlineBookOpen, HiOutlineLogout, HiMenu, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  // const navigate = useNavigate(); // Keep if needed

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);


  const isActive = (path) => location.pathname === path;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Profile', href: '/profile' },
  ];

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50 w-full">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center group" aria-label="BookExchange Home">
                <HiOutlineBookOpen
                  className="h-8 w-8 mr-2 text-blue-600 transition-transform duration-300 ease-in-out group-hover:scale-110 group-focus:scale-110"
                  aria-hidden="true"
                />
                <span className="text-2xl font-bold text-blue-600 transition-colors duration-300 ease-in-out group-hover:text-blue-700 group-focus:text-blue-700">
                  BookExchange
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {/* THIS IS THE CORRECTED LINE: changed items-baseline to items-center */}
              <div className="flex items-center space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ease-in-out ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none'
                    }`}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
                {/* Logout Button - Desktop */}
                <button
                  onClick={handleLogout}
                  className="ml-4 flex items-center rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                >
                  <HiOutlineLogout className="-ml-1 mr-1 h-5 w-5" aria-hidden="true" />
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <HiMenu className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <HiX className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Panel */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="sm:hidden overflow-hidden"
                id="mobile-menu"
                initial="closed"
                animate="open"
                exit="closed"
                variants={mobileMenuVariants}
              >
                <div className="space-y-1 px-2 pb-3 pt-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`block rounded-md px-3 py-2 text-base font-medium transition-colors duration-150 ease-in-out ${
                        isActive(item.href)
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none'
                      }`}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {/* Logout Button - Mobile */}
                  <button
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 focus:outline-none transition-colors duration-150 ease-in-out"
                  >
                    <HiOutlineLogout className="mr-2 h-5 w-5" aria-hidden="true" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
    </>
  );
};

export default Header;