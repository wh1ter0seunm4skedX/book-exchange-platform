import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'default' }) => {
  // Handle Escape key press and lock scrolling when modal is open
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    // Clean up when modal closes
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Don't render anything if the modal isn't open
  if (!isOpen) return null;

  const sizeClasses = {
    default: 'sm:max-w-lg',
    large: 'sm:max-w-3xl',
    medium: 'sm:max-w-2xl',
    small: 'sm:max-w-md',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Dimmed background that closes the modal on click */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* The actual modal window */}
        <div className={`inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full ${sizeClasses[size]} sm:p-6 sm:align-middle`}>
          {/* Close button for desktop */}
          <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal content */}
          <div className="sm:flex sm:items-start">
            <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                {title}
              </h3>
              <div className="mt-2">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;