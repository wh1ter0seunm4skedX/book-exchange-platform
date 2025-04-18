import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../api/apiUtils';
import { HiOutlineBookOpen, HiOutlineLogout, HiMenu, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Close mobile menu when the page changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Add scroll listener for header effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) { // Adjust scroll threshold as needed
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Check if a nav link is active
  const isActive = (path) => location.pathname === path;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Profile', href: '/profile' },
  ];

  // Handle logout and close the menu
  const handleLogout = () => {
    logout();
    // Delay closing the menu slightly to allow animation if needed
    setTimeout(() => setIsMobileMenuOpen(false), 100);
  };

  // Animation settings for the mobile menu
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

  // Framer Motion variants for nav link hover
  const linkVariants = {
    initial: { y: 0 },
    hover: { y: -3, transition: { duration: 0.2 } },
    active: { y: 0 }, // Define active state if needed
  };

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out
        ${isScrolled ? 'bg-white shadow-lg backdrop-blur-sm bg-opacity-80' : 'bg-white shadow-sm'}`}> {/* Added scroll effect */}
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="flex h-16 items-center justify-between">
            {/* Logo with enhanced hover animation using Framer Motion */}
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center group" aria-label="BookExchange Home">
                <motion.div
                   whileHover={{ scale: 1.15, rotate: -5 }} // Enhanced hover animation
                   whileTap={{ scale: 0.95 }} // Add a press effect
                   className="flex items-center"
                >
                   <HiOutlineBookOpen
                    className="h-8 w-8 mr-2 text-blue-600 transition-colors duration-300 ease-in-out group-hover:text-blue-700"
                    aria-hidden="true"
                   />
                   <span className="text-2xl font-bold text-blue-600 transition-colors duration-300 ease-in-out group-hover:text-blue-700">
                    BookExchange
                   </span>
                </motion.div>
              </Link>
            </div>

            {/* Navigation for desktop with Framer Motion hover */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="flex items-center space-x-4">
                {navigation.map((item) => (
                  <motion.div
                    key={item.name}
                    variants={linkVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }} // Add a subtle press effect
                  >
                    <Link
                      to={item.href}
                      className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ease-in-out overflow-hidden
                        ${isActive(item.href)
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-500 hover:text-gray-900 focus:text-gray-900'
                      }`}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                    >
                      {item.name}
                       {/* Subtle underline animation */}
                      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 origin-left transition-transform duration-300 ease-out ${isActive(item.href) ? 'scale-x-100' : 'group-hover:scale-x-100'}`}></span>
                    </Link>
                  </motion.div>
                ))}
                {/* Logout button for desktop with Framer Motion press effect */}
                <motion.button
                  onClick={handleLogout}
                  whileTap={{ scale: 0.95 }} // Add a press effect
                  className="ml-4 flex items-center rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                >
                  <HiOutlineLogout className="-ml-1 mr-1 h-5 w-5" aria-hidden="true" />
                  Logout
                </motion.button>
              </div>
            </div>

            {/* Button to toggle mobile menu */}
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

          {/* Mobile menu with animation */}
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
                     <motion.div
                       key={item.name}
                       whileTap={{ scale: 0.98 }} // Subtle press effect on mobile links
                     >
                      <Link
                        to={item.href}
                        className={`block rounded-md px-3 py-2 text-base font-medium transition-colors duration-150 ease-in-out
                          ${isActive(item.href)
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none'
                        }`}
                        aria-current={isActive(item.href) ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                  {/* Logout button for mobile with Framer Motion press effect */}
                  <motion.button
                     onClick={handleLogout}
                     whileTap={{ scale: 0.98 }} // Subtle press effect on mobile logout
                     className="mt-2 flex w-full items-center rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 focus:outline-none transition-colors duration-150 ease-in-out"
                  >
                    <HiOutlineLogout className="mr-2 h-5 w-5" aria-hidden="true" />
                    Logout
                  </motion.button>
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