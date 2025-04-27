import React from "react";
import { Link, useLocation } from "wouter";

const Navigation: React.FC = () => {
  const [location] = useLocation();

  const getItemColor = (path: string) => {
    return location === path 
      ? "text-primary" 
      : "text-gray-500 hover:text-secondary";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-primary py-3 px-6 flex justify-around">
      <Link href="/">
        <button className={`flex flex-col items-center ${getItemColor("/")}`}>
          <i className="ri-home-4-line text-3xl"></i>
          <span className="text-sm font-['Comic_Neue']">Home</span>
        </button>
      </Link>
      
      <Link href="/results">
        <button className={`flex flex-col items-center ${getItemColor("/results")}`}>
          <i className="ri-gallery-line text-3xl"></i>
          <span className="text-sm font-['Comic_Neue']">Gallery</span>
        </button>
      </Link>
      
      <button className="flex flex-col items-center text-gray-500 hover:text-secondary" disabled>
        <i className="ri-user-smile-line text-3xl"></i>
        <span className="text-sm font-['Comic_Neue']">Profile</span>
      </button>
      
      <button className="flex flex-col items-center text-gray-500 hover:text-secondary" disabled>
        <i className="ri-settings-4-line text-3xl"></i>
        <span className="text-sm font-['Comic_Neue']">Settings</span>
      </button>
    </div>
  );
};

export default Navigation;
