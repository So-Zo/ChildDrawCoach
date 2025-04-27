import React from "react";
import { useLocation } from "wouter";
import Header from "../components/Header";
import MascotGuide from "../components/MascotGuide";
import Navigation from "../components/Navigation";

const Home: React.FC = () => {
  const [, navigate] = useLocation();

  return (
    <div>
      <Header />

      <MascotGuide
        message={{
          title: "Hi there, friend!",
          message: "What would you like to draw today? Tell me or show me, and I'll help you!",
          animation: "bounce"
        }}
      />

      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Text Input Option */}
          <div
            className="bg-white rounded-2xl shadow-lg p-6 border-4 border-primary hover:border-secondary transition-all duration-300 cursor-pointer"
            onClick={() => navigate("/text-input")}
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary rounded-full w-20 h-20 flex items-center justify-center mb-4">
                <i className="ri-chat-1-line text-white text-4xl"></i>
              </div>
              <h3 className="text-2xl font-['Bangers'] mb-2 tracking-wide text-primary">Tell Me What to Draw!</h3>
              <p className="text-lg mb-4 font-['Comic_Neue']">Type or speak what you want to draw</p>
              <button className="bg-accent hover:bg-amber-500 text-white text-xl py-3 px-8 rounded-full font-bold transition-all shadow-md hover:shadow-lg animate-pulse">
                Let's Go!
              </button>
            </div>
          </div>

          {/* Drawing Input Option */}
          <div
            className="bg-white rounded-2xl shadow-lg p-6 border-4 border-secondary hover:border-primary transition-all duration-300 cursor-pointer"
            onClick={() => navigate("/drawing-input")}
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-secondary rounded-full w-20 h-20 flex items-center justify-center mb-4">
                <i className="ri-paint-brush-line text-white text-4xl"></i>
              </div>
              <h3 className="text-2xl font-['Bangers'] mb-2 tracking-wide text-secondary">Show Me Your Drawing!</h3>
              <p className="text-lg mb-4 font-['Comic_Neue']">Upload your picture or drawing</p>
              <button className="bg-pink hover:bg-pink-600 text-white text-xl py-3 px-8 rounded-full font-bold transition-all shadow-md hover:shadow-lg animate-pulse">
                Let's Go!
              </button>
            </div>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Home;
