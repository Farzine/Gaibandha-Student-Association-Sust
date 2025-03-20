"use client"
import { useState } from 'react';
import Link from 'next/link';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for message field to track character count
    if (name === 'message') {
      setCharCount(value.length);
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset message states
    setShowError(false);
    setShowSuccess(false);
    
    // Validate form according to schema
    const errors = [];
    
    // Name validation (2-50 characters)
    if (!formData.name) {
      errors.push('Name is required');
    } else if (formData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    } else if (formData.name.trim().length > 50) {
      errors.push('Name cannot exceed 50 characters');
    }
    
    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!formData.email) {
      errors.push('Email is required');
    } else if (!emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }
    
    // Message validation (5-1000 characters)
    if (!formData.message) {
      errors.push('Message is required');
    } else if (formData.message.trim().length < 5) {
      errors.push('Message must be at least 5 characters long');
    } else if (formData.message.trim().length > 1000) {
      errors.push('Message cannot exceed 1000 characters');
    }
    
    if (errors.length > 0) {
      setErrorMessage(errors.join('. '));
      setShowError(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/sendMessage/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          status: 'unread' // Setting default status as per schema
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage(data.message || 'Your message has been sent successfully!');
        setShowSuccess(true);
        // Reset form after successful submission
        setFormData({ name: '', email: '', message: '' });
        setCharCount(0);
      } else {
        setErrorMessage(data.message || 'Failed to submit the form');
        setShowError(true);
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again later.');
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <div>
        <span className="absolute left-0 top-0 z-[-1]">
          <svg
            width="287"
            height="254"
            viewBox="0 0 287 254"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.1"
              d="M286.5 0.5L-14.5 254.5V69.5L286.5 0.5Z"
              fill="url(#paint0_linear_111:578)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_111:578"
                x1="-40.5"
                y1="117"
                x2="301.926"
                y2="-97.1485"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span className="absolute right-0 top-0 z-[-1]">
          <svg
            width="628"
            height="258"
            viewBox="0 0 628 258"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.1"
              d="M669.125 257.002L345.875 31.9983L524.571 -15.8832L669.125 257.002Z"
              fill="url(#paint0_linear_0:1)"
            />
            <path
              opacity="0.1"
              d="M0.0716344 182.78L101.988 -15.0769L142.154 81.4093L0.0716344 182.78Z"
              fill="url(#paint1_linear_0:1)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_0:1"
                x1="644"
                y1="221"
                x2="429.946"
                y2="37.0429"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_0:1"
                x1="18.3648"
                y1="166.016"
                x2="105.377"
                y2="32.3398"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </div>
    <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28 pt-28 lg:pt-[150px]">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary dark:text-white md:text-4xl">Contact Us</h2>
            <div className="mx-auto mb-2 h-1 w-24 bg-primary"></div>
            <p className="text-lg text-[#4b5563] dark:text-[#d1d5db]">
              Gaibandha Student Association of SUST is here to help you
            </p>
          </div>
          
          <div className="flex flex-wrap -mx-4">
            {/* Contact Info Card */}
            <div className="w-full px-4 lg:w-4/12 mb-8 lg:mb-0">
              <div className="h-full rounded-lg bg-white p-8 shadow-lg dark:bg-[#1f2937]">
                <h3 className="mb-6 text-xl font-bold text-[#111827] dark:text-white">Get in Touch</h3>
                
                <div className="mb-6 flex items-start">
                  <div className="mr-4 flex h-10 w-10 min-w-[40px] items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="mb-1 text-base font-medium text-[#111827] dark:text-white">Our Location</h4>
                    <p className="text-sm text-[#4b5563] dark:text-[#9ca3af]">
                      Shahjalal University of Science and Technology, Sylhet-3114, Bangladesh
                    </p>
                  </div>
                </div>
                
                <div className="mb-6 flex items-start">
                  <div className="mr-4 flex h-10 w-10 min-w-[40px] items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="mb-1 text-base font-medium text-[#111827] dark:text-white">Email Address</h4>
                    <p className="text-sm text-[#4b5563] dark:text-[#9ca3af]">
                      gsa.sust@gmail.com
                    </p>
                  </div>
                </div>
                
                <div className="mb-6 flex items-start">
                  <div className="mr-4 flex h-10 w-10 min-w-[40px] items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="mb-1 text-base font-medium text-[#111827] dark:text-white">Phone</h4>
                    <p className="text-sm text-[#4b5563] dark:text-[#9ca3af]">
                      +880 17XX-XXXXXX
                    </p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="mb-3 text-base font-medium text-[#111827] dark:text-white">Follow Us On</h4>
                  <div className="flex space-x-4">
                    <Link href="https://www.facebook.com/gaibandhastudentsassociationsust" className="text-[#6b7280] hover:text-primary dark:text-[#9ca3af] dark:hover:text-primary">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 4.99 3.656 9.126 8.437 9.879v-6.988h-2.54v-2.891h2.54V9.798c0-2.508 1.493-3.891 3.776-3.891 1.094 0 2.24.195 2.24.195v2.459h-1.264c-1.24 0-1.628.772-1.628 1.563v1.875h2.771l-.443 2.891h-2.328v6.988C18.344 21.129 22 16.992 22 12.001c0-5.522-4.477-9.999-9.999-9.999z"/>
                      </svg>
                    </Link>
                    <Link href="#" className="text-[#6b7280] hover:text-primary dark:text-[#9ca3af] dark:hover:text-primary">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.599-.1-.899a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"/>
                      </svg>
                    </Link>
                    <Link href="#" className="text-[#6b7280] hover:text-primary dark:text-[#9ca3af] dark:hover:text-primary">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.999 7.377a4.623 4.623 0 1 0 0 9.248 4.623 4.623 0 0 0 0-9.248zm0 7.627a3.004 3.004 0 1 1 0-6.008 3.004 3.004 0 0 1 0 6.008z"/>
                        <circle cx="16.806" cy="7.207" r="1.078"/>
                        <path d="M20.533 6.111A4.605 4.605 0 0 0 17.9 3.479a6.606 6.606 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 0 0-2.184.42 4.6 4.6 0 0 0-2.633 2.632 6.585 6.585 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71 0 2.442 0 2.753.056 3.71.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 0 0 2.186-.419 4.613 4.613 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 0 0-.421-2.217zm-1.218 9.532a5.043 5.043 0 0 1-.311 1.688 2.987 2.987 0 0 1-1.712 1.711 4.985 4.985 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055-2.438 0-2.687 0-3.655-.055a4.96 4.96 0 0 1-1.669-.311 2.985 2.985 0 0 1-1.719-1.711 5.08 5.08 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654 0-2.437 0-2.686.053-3.655a5.038 5.038 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5.01 5.01 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a4.96 4.96 0 0 1 1.67.311 2.991 2.991 0 0 1 1.712 1.712 5.08 5.08 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655 0 2.436 0 2.698-.043 3.654h-.011z"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Card */}
            <div className="w-full px-4 lg:w-8/12">
              <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-[#1f2937]">
                <h3 className="mb-6 text-xl font-bold text-[#111827] dark:text-white">Send Us a Message</h3>
                
                {/* Display error or success messages */}
                {showError && errorMessage && (
                  <div
                    className="mb-6 rounded-lg border border-[#fca5a5] bg-[#fef2f2] p-4 text-[#b91c1c] dark:border-[#dc2626] dark:bg-[#374151] dark:text-[#f87171]"
                    role="alert"
                  >
                    <div className="flex items-center">
                      <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Error:</span>
                      <span className="ml-1">{errorMessage}</span>
                    </div>
                    <div className="mt-2 text-right">
                      <button
                        type="button"
                        onClick={() => setShowError(false)}
                        className="text-sm font-medium text-[#b91c1c] hover:underline dark:text-[#f87171]"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
                
                {showSuccess && successMessage && (
                  <div
                    className="mb-6 rounded-lg border border-[#86efac] bg-[#f0fdf4] p-4 text-[#15803d] dark:border-[#16a34a] dark:bg-[#374151] dark:text-[#4ade80]"
                    role="alert"
                  >
                    <div className="flex items-center">
                      <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Success:</span>
                      <span className="ml-1">{successMessage}</span>
                    </div>
                    <div className="mt-2 text-right">
                      <button
                        type="button"
                        onClick={() => setShowSuccess(false)}
                        className="text-sm font-medium text-[#15803d] hover:underline dark:text-[#4ade80]"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-6 grid gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium text-[#111827] dark:text-white"
                      >
                        Full Name <span className="text-[#fef2f2]">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="w-full rounded-lg border border-[#d1d5db] bg-white px-4 py-3 text-[#374151] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-[#4b5563] dark:bg-[#374151] dark:text-white dark:focus:border-primary"
                      />
                      <p className="mt-1 text-xs text-[#6b7280] dark:text-[#9ca3af]">
                        {formData.name.length > 0 ? `${formData.name.length}/50 characters` : '2-50 characters required'}
                      </p>
                    </div>
                    
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-[#111827] dark:text-white"
                      >
                        Email Address <span className="text-[#fef2f2]">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your email address"
                        className="w-full rounded-lg border border-[#d1d5db] bg-white px-4 py-3 text-[#374151] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-[#4b5563] dark:bg-[#374151] dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-medium text-[#111827] dark:text-white"
                    >
                      Your Message <span className="text-[#fef2f2]">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="How can we help you?"
                      maxLength={1000}
                      className="w-full rounded-lg border border-[#d1d5db] bg-white px-4 py-3 text-[#374151] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-[#4b5563] dark:bg-[#374151] dark:text-white dark:focus:border-primary"
                    ></textarea>
                    <p className={`mt-1 text-xs ${charCount > 1000 ? 'text-[#fef2f2]' : 'text-[#6b7280] dark:text-[#9ca3af]'}`}>
                      {charCount}/1000 characters {charCount < 5 && charCount > 0 ? '(minimum 5 required)' : ''}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-lg bg-primary px-6 py-3 text-center text-base font-medium text-white shadow-md transition duration-200 ease-in hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:focus:ring-offset-[#1f2937]"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending Message...
                        </div>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* Footer note */}
          <div className="mt-10 text-center">
            <p className="text-sm text-[#4b5563] dark:text-[#9ca3af]">
              Gaibandha Student Association of SUST is committed to helping students from Gaibandha district excel in their academic journey at Shahjalal University of Science and Technology.
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Contact;