import React from 'react';

interface AlertProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const isSuccess = type === 'success';
  const bgColor = isSuccess ? '[#34D399]' : '[#F87171]';
  const textColor = isSuccess ? '[#34D399]' : '[#B45454]';
  const messageColor = isSuccess ? 'body' : '[#CD5D5D]';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 p-4" onClick={onClose}>
      <div 
        className="mt-20 w-full max-w-md animate-slideDown rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex w-full border-l-6 border-${bgColor} bg-white bg-opacity-[100%] dark:bg-opacity-[100%] px-4 py-4 shadow-md dark:bg-[#1B1B24] sm:px-6`}>
          <div className={`mr-3 flex h-9 w-9 items-center justify-center rounded-lg bg-${bgColor} sm:mr-4`}>
            {isSuccess ? (
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.2984 0.826822L15.2868 0.811827L15.2741 0.797751C14.9173 0.401867 14.3238 0.400754 13.9657 0.794406L5.91888 9.45376L2.05667 5.2868C1.69856 4.89287 1.10487 4.89389 0.747996 5.28987C0.417335 5.65675 0.417335 6.22337 0.747996 6.59026L4.86742 11.0348C5.14445 11.3405 5.52858 11.5 5.89581 11.5C6.29242 11.5 6.65178 11.3355 6.92401 11.035L15.2162 2.11161C15.5833 1.74452 15.576 1.18615 15.2984 0.826822Z" fill="white" stroke="white"></path>
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639L1.89395 12.2645C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645L0.758358 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z" fill="#ffffff" stroke="#ffffff"></path>
              </svg>
            )}
          </div>
          <div className="w-full">
            <h5 className={`mb-1 text-base font-semibold text-${textColor} sm:text-lg`}>
              {isSuccess ? 'Success:' : 'Error:'}
            </h5>
            <p className={`text-sm leading-relaxed text-${messageColor} sm:text-base`}>
              {message}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="ml-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;