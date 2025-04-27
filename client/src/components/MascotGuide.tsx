import React from "react";
import { MascotMessage } from "../lib/types";

interface MascotGuideProps {
  message: MascotMessage;
}

const MascotGuide: React.FC<MascotGuideProps> = ({ message }) => {
  const animationClass = (() => {
    switch (message.animation) {
      case "bounce": return "animate-bounce-slow";
      case "wiggle": return "animate-wiggle";
      default: return "";
    }
  })();

  return (
    <div className="bg-soft-gray rounded-xl p-4 mx-4 mt-6 relative flex items-center mascot-bubble">
      <img 
        src="https://images.unsplash.com/photo-1560785477-d43d2b34e0df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Y3JheW9ufHx8fHx8MTcxMDgwMzYzOA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=100" 
        alt="Cartoon crayon character" 
        className={`w-16 h-16 mr-3 ${animationClass}`} 
      />
      <div>
        <h2 className="text-xl font-bold text-secondary mb-1">{message.title}</h2>
        <p className="text-lg font-['Comic_Neue']">{message.message}</p>
      </div>
    </div>
  );
};

export default MascotGuide;
