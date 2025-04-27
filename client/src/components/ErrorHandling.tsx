import React from "react";
import { useToast } from "../hooks/use-toast";
import MascotGuide from "./MascotGuide";

interface ErrorHandlingProps {
  errorMessage: string;
  onRetry: () => void;
  clarificationOptions?: Array<{
    label: string;
    action: () => void;
  }>;
}

const ErrorHandling: React.FC<ErrorHandlingProps> = ({
  errorMessage,
  onRetry,
  clarificationOptions = []
}) => {
  const { toast } = useToast();

  const handleRetry = () => {
    toast({
      title: "Let's try again!",
      description: "Starting fresh with a new drawing.",
    });
    onRetry();
  };

  return (
    <div className="container mx-auto px-4 my-10">
      <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-pink">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-pink rounded-full w-12 h-12 flex items-center justify-center mr-2 animate-bounce-slow">
            <i className="ri-question-line text-white text-2xl"></i>
          </div>
          <h3 className="text-2xl font-['Bangers'] tracking-wide text-pink">
            Hmm, I'm Not Sure What That Is
          </h3>
        </div>

        <MascotGuide
          message={{
            title: "Let's figure this out together!",
            message: errorMessage || "I didn't quite understand. Let's try a different way!",
            animation: "none"
          }}
        />

        {/* Clarification Options */}
        {clarificationOptions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 mt-6">
            {clarificationOptions.map((option, index) => (
              <button
                key={index}
                onClick={option.action}
                className="bg-primary hover:bg-blue-700 text-white text-xl py-3 px-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg h-20 flex items-center justify-center"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {/* Try Again Option */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleRetry}
            className="bg-success hover:bg-green-600 text-white text-xl py-3 px-12 rounded-full font-bold transition-all shadow-md hover:shadow-lg flex items-center"
          >
            <i className="ri-restart-line mr-2 text-2xl"></i>
            Let's Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorHandling;
