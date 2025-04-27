import React, { useState } from "react";
import { useLocation } from "wouter";
import Header from "../components/Header";
import MascotGuide from "../components/MascotGuide";
import Navigation from "../components/Navigation";
import { DrawingState } from "../lib/types";
import ErrorHandling from "../components/ErrorHandling";
import { useToast } from "../hooks/use-toast";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

interface ResultsProps {
  drawingState: DrawingState;
}

const Results: React.FC<ResultsProps> = ({ drawingState }) => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(true);
  const { width, height } = useWindowSize();

  // Handle confetti timeout
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // If there's no drawing data, show an error
  if (!drawingState.steps.length && !drawingState.isLoading) {
    return (
      <>
        <Header />
        <ErrorHandling
          errorMessage="Oops! There's no drawing to show. Let's create one!"
          onRetry={() => navigate("/")}
        />
        <Navigation />
      </>
    );
  }

  // If still loading, show a loading state
  if (drawingState.isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 my-10 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-primary">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="animate-spin w-20 h-20 border-8 border-primary border-t-transparent rounded-full mb-4"></div>
              <h2 className="text-2xl font-['Bangers'] text-primary">Making Magic...</h2>
              <p className="text-lg font-['Comic_Neue']">Creating your awesome drawing step by step!</p>
            </div>
          </div>
        </div>
        <Navigation />
      </>
    );
  }

  const handleSaveDrawing = () => {
    if (drawingState.outputImageUrl) {
      // Create an anchor element and set attributes
      const link = document.createElement('a');
      link.href = drawingState.outputImageUrl;
      link.download = `my-drawing-${Date.now()}.png`;
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Drawing Saved!",
        description: "Your awesome drawing has been saved to your device!",
      });
    }
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Printing...",
      description: "Your drawing is being sent to the printer!",
    });
  };

  const handleShare = () => {
    // In a real app, this would use the Web Share API if available
    // For now, we'll just show a toast message
    toast({
      title: "Sharing Not Available",
      description: "In a full app, you could share your drawing with friends!",
    });
  };

  return (
    <div>
      <Header />

      {showConfetti && <Confetti width={width} height={height} recycle={false} />}

      <div className="container mx-auto px-4 my-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-accent">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-accent rounded-full w-12 h-12 flex items-center justify-center mr-2">
              <i className="ri-star-line text-white text-2xl"></i>
            </div>
            <h3 className="text-2xl font-['Bangers'] tracking-wide text-accent">Here's How to Draw Your Picture!</h3>
          </div>

          {/* Before and After */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Input/Idea */}
            <div className="border-4 border-secondary rounded-xl p-4">
              <h4 className="text-xl font-['Comic_Neue'] text-secondary text-center mb-2">Your Idea</h4>
              <div className="aspect-square bg-soft-gray rounded-lg flex items-center justify-center">
                {drawingState.inputImageUrl ? (
                  <img
                    src={drawingState.inputImageUrl}
                    alt="Your original drawing or idea"
                    className="max-w-full max-h-full rounded-lg object-contain"
                  />
                ) : (
                  <div className="text-center p-4">
                    <i className="ri-chat-1-line text-4xl text-gray-400 mb-2"></i>
                    <p className="text-gray-500 font-['Comic_Neue']">{drawingState.prompt || "Your drawing idea"}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Output/Drawing */}
            <div className="border-4 border-primary rounded-xl p-4">
              <h4 className="text-xl font-['Comic_Neue'] text-primary text-center mb-2">Our Drawing</h4>
              <div className="aspect-square bg-soft-gray rounded-lg flex items-center justify-center">
                {drawingState.outputImageUrl ? (
                  <img
                    src={drawingState.outputImageUrl}
                    alt="Simplified, cleaner drawing based on your idea"
                    className="max-w-full max-h-full rounded-lg object-contain"
                  />
                ) : (
                  <div className="animate-pulse bg-gray-200 w-full h-full rounded-lg"></div>
                )}
              </div>
            </div>
          </div>

          {/* Step by Step Instructions */}
          <div className="mb-8">
            <h4 className="text-2xl font-['Bangers'] tracking-wide text-success text-center mb-6">Let's Draw it Step by Step!</h4>

            <div className="step-container">
              {drawingState.steps.map((step, index) => {
                // Use different colors for each step number
                const colors = ["bg-primary", "bg-secondary", "bg-accent", "bg-pink", "bg-success"];
                const color = colors[index % colors.length];

                // Use matching text colors
                const textColors = ["text-primary", "text-secondary", "text-accent", "text-pink", "text-success"];
                const textColor = textColors[index % textColors.length];

                return (
                  <div key={index} className="flex gap-6 mb-8 items-center flex-col md:flex-row">
                    <div className={`step-item ${color} text-4xl font-['Bangers'] text-white w-16 h-16 rounded-full flex items-center justify-center shrink-0`}>
                      {/* Step number auto-generated via CSS counter */}
                    </div>
                    <div className="border-4 border-soft-gray rounded-xl p-4 flex-grow">
                      <h5 className={`text-xl font-['Comic_Neue'] ${textColor} mb-3`}>{step.instruction}</h5>
                      <div className="aspect-video bg-soft-gray rounded-lg flex items-center justify-center">
                        <img
                          src={step.imageUrl}
                          alt={`Drawing step ${index + 1}: ${step.instruction}`}
                          className="max-w-full max-h-full rounded-lg object-contain"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Encouraging Message */}
          <MascotGuide
            message={{
              title: "Amazing job!",
              message: "Your drawing looks fantastic! Keep practicing and you'll be an artist in no time!",
              animation: "wiggle"
            }}
          />

          {/* Save/Share Options */}
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <button
              className="bg-primary hover:bg-blue-700 text-white text-xl py-3 px-8 rounded-full font-bold transition-all shadow-md hover:shadow-lg flex items-center"
              onClick={handleSaveDrawing}
            >
              <i className="ri-save-line mr-2"></i>
              Save Drawing
            </button>
            <button
              className="bg-pink hover:bg-pink-600 text-white text-xl py-3 px-8 rounded-full font-bold transition-all shadow-md hover:shadow-lg flex items-center"
              onClick={handlePrint}
            >
              <i className="ri-printer-line mr-2"></i>
              Print
            </button>
            <button
              className="bg-secondary hover:bg-purple-700 text-white text-xl py-3 px-8 rounded-full font-bold transition-all shadow-md hover:shadow-lg flex items-center"
              onClick={handleShare}
            >
              <i className="ri-share-line mr-2"></i>
              Share
            </button>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Results;
