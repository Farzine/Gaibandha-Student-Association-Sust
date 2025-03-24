import React, { useState, useEffect } from 'react';
import { Editor } from 'primereact/editor';


type MessageFormProps = {
  initialData?: { 
    _id?: string;
    name: string; 
    designation: string; 
    message: string; 
    path: string 
  } | null;
  isEditMode?: boolean;
  onSubmit: (formData: FormData) => Promise<boolean>;
  onCancel: () => void;
};

const MessageForm: React.FC<MessageFormProps> = ({ 
  initialData, 
  isEditMode = false, 
  onSubmit, 
  onCancel 
}) => {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDesignation(initialData.designation || '');
      setMessage(initialData.message || '');
      setImagePreview(initialData.path || '');
    } else {
      resetForm();
    }
  }, [initialData]);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(image);
    }
  }, [image]);

  const resetForm = () => {
    setName('');
    setDesignation('');
    setMessage('');
    setImage(null);
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('designation', designation);
    formData.append('message', message);
    if (image) formData.append('image', image);

    try {
      const success = await onSubmit(formData);
      if (success) {
        resetForm();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow-lg p-8 border border-[#f3f4f6] dark:border-[#374151] transition-all duration-300">
      <h2 className="text-2xl font-bold text-[#1f2937] dark:text-white mb-6 flex items-center">
        <span className="inline-block w-1 h-8 bg-primary mr-3 rounded"></span>
        {isEditMode ? 'Update Message' : 'Create Message'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151] dark:text-[#e5e7eb]">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-[#f9fafb] dark:bg-[#374151] rounded-lg border border-[#e5e7eb] dark:border-[#4b5563] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-[#1f2937] dark:text-white"
              placeholder="Enter full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#374151] dark:text-[#e5e7eb]">
              Designation
            </label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full p-3 bg-[#f9fafb] dark:bg-[#374151] rounded-lg border border-[#e5e7eb] dark:border-[#4b5563] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-[#1f2937] dark:text-white"
              placeholder="Enter position or title"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#374151] dark:text-[#e5e7eb]">
            Message
          </label>
          <div className="rounded-lg overflow-hidden border border-[#e5e7eb] dark:border-[#4b5563]">
            <Editor
              value={message}
              onTextChange={(e) => setMessage(e.htmlValue || '')}
              style={{ height: '320px' }}
              className="w-full bg-white dark:bg-bodydark text-black focus:outline-none"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#374151] dark:text-[#e5e7eb]">
            Profile Image
          </label>
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center ${dragActive ? 'border-primary bg-[#eff6ff] dark:bg-[#374151]' : 'border-[#d1d5db] dark:border-[#4b5563]'} transition-all duration-200`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-2">
              <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-[#f9fafb]0 dark:text-gray-400">Drag and drop an image, or</p>
              <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-white dark:bg-[#4b5563] border border-[#d1d5db] dark:border-[#f9fafb] rounded-md font-medium text-[#374151] dark:text-[#e5e7eb] hover:bg-[#f9fafb] dark:hover:bg-[#374151] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200">
                <span>Select an image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && setImage(e.target.files[0])}
                  className="sr-only"
                />
              </label>
            </div>
            {imagePreview && (
              <div className="mt-4">
                <div className="relative rounded-lg overflow-hidden w-40 h-40 mx-auto border border-[#e5e7eb] dark:border-[#4b5563]">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview('');
                    }}
                    className="absolute top-1 right-1 bg-[#ef4444] text-white rounded-full p-1 hover:bg-[#dc2626] focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-[#f3f4f6] dark:border-[#374151]">
          {isEditMode && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 bg-[#e5e7eb] dark:bg-[#374151] text-[#1f2937] dark:text-[#e5e7eb] rounded-lg font-medium hover:bg-[#d1d5db] dark:hover:bg-[#4b5563] focus:outline-none focus:ring-2 focus:ring-[#d1d5db] dark:focus:ring-[#f9fafb] transition-all duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 transition-all duration-200 flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              isEditMode ? 'Update Message' : 'Create Message'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageForm;