import React, { useState } from 'react';
import { Mail, Linkedin, Facebook, UniversityIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface profile {
    user: {
    _id: string;
    name: string;
    profession?: string;
    department: string;
    photoUrl?: string;
    email: string;
    facebookId?: string;
    linkedinId?: string;
    designation?: string;
    };
  };
  

const ProfileCard:React.FC<profile> = ({user}) => {
    const router = useRouter();
    const handleProfileClick = () => {
        router.push(`/members/${user._id}`);
      };
  
  return (
        <div onClick={handleProfileClick} className="w-full h-full max-w-sm rounded-lg shadow-md overflow-hidden transition duration-200 hover:shadow-lg dark:bg-[#1f2937] dark:text-white bg-white text-[#1f2937] border border-[#e5e7eb] dark:border-[#374151] flex flex-col">  
            {/* Profile photo and basic info - fixed height section */}
            <div className="flex flex-col items-center p-5 flex-grow">
                <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-opacity-20 border-current relative">
                    {user.photoUrl ? (
                        <Image 
                            src={user.photoUrl} 
                            alt={user.name} 
                            fill
                            sizes="(max-width: 768px) 100vw, 96px"
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-[#e5e7eb] dark:bg-[#4b5563] flex items-center justify-center">
                            <span className="text-xl font-semibold">{user.name.charAt(0)}</span>
                        </div>
                    )}
                </div>
                <h2 className="text-lg font-semibold line-clamp-1 text-center">{user.name}</h2>
                {user.profession && (
                    <p className="text-sm font-medium dark:text-[#d1d5db] text-[#4b5563] line-clamp-1 text-center">
                        {user.profession}
                    </p>
                )}
                <div className="flex flex-col mt-2 text-xs">
                    {user.designation && (
                        <div className="flex items-center mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 dark:text-[#9ca3af] text-[#6b7280]" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <span className="text-[#4b5563] dark:text-[#9ca3af]">{user.designation} @GSA</span>
                        </div>
                    )}
                    <div className="flex items-center">
                        <UniversityIcon size={14} className='mr-1 dark:text-[#9ca3af] text-[#6b7280]' />
                        <span className="text-[#4b5563] dark:text-[#9ca3af]">
                            {user.department}
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Contact links - fixed height footer */}
            <div className="px-4 py-3 flex justify-center space-x-4 dark:bg-[#111827] bg-[#f9fafb] border-t border-[#e5e7eb] dark:border-[#374151]">
                <Link 
                    href={`mailto:${user.email}`} 
                    className="p-2 rounded-full bg-[#e5e7eb] dark:bg-[#374151] text-[#2563eb] dark:text-[#60a5fa] hover:bg-[#d1d5db] dark:hover:bg-[#4b5563] transition-colors"
                    title="Email"
                    aria-label="Send email"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Mail size={18} />
                </Link>
                {user.linkedinId && (
                    <Link 
                        href={user.linkedinId} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 rounded-full bg-[#e5e7eb] dark:bg-[#374151] text-[#2563eb] dark:text-[#60a5fa] hover:bg-[#d1d5db] dark:hover:bg-[#4b5563] transition-colors"
                        title="LinkedIn"
                        aria-label="Visit LinkedIn profile"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Linkedin size={18} />
                    </Link>
                )}
                {user.facebookId && (
                    <Link 
                        href={user.facebookId} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 rounded-full bg-[#e5e7eb] dark:bg-[#374151] text-[#2563eb] dark:text-[#60a5fa] hover:bg-[#d1d5db] dark:hover:bg-[#4b5563] transition-colors"
                        title="Facebook"
                        aria-label="Visit Facebook profile"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Facebook size={18} />
                    </Link>
                )}
            </div>
        </div>
  );
};

export default ProfileCard;