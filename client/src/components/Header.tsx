import React from "react";
import { Link } from "wouter";

const Header: React.FC = () => {
  return (
    <header className="bg-primary py-4 px-6 flex justify-between items-center">
      <Link href="/">
        <div className="flex items-center cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1560785496-3c9d27877182?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Y3JheW9ufHx8fHx8MTcxMDgwMzYxMw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=60" 
            alt="Colorful crayon logo" 
            className="w-12 h-12 mr-3 rounded-full"
          />
          <h1 className="text-3xl md:text-4xl font-['Bangers'] text-white tracking-wider">Draw What You See!</h1>
        </div>
      </Link>
      <button 
        aria-label="Help" 
        className="bg-accent hover:bg-amber-500 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all"
        onClick={() => alert("Welcome to Draw What You See! This app helps kids draw better by taking their ideas and turning them into step-by-step guides. Try typing what you want to draw or upload a picture!")}
      >
        <i className="ri-question-line text-xl"></i>
      </button>
    </header>
  );
};

export default Header;
