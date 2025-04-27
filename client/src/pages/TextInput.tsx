import React, { useState, useRef } from "react";
import { useLocation } from "wouter";
import Header from "../components/Header";
import MascotGuide from "../components/MascotGuide";
import Navigation from "../components/Navigation";
import { useToast } from "../hooks/use-toast";
import { generateDrawingFromText } from "../lib/drawingService";
import { DrawingState } from "../lib/types";
import ErrorHandling from "../components/ErrorHandling";

interface TextInputProps {
  setDrawingState: React.Dispatch<React.SetStateAction<DrawingState>>;
}

const TextInput: React.FC<TextInputProps> = ({ setDrawingState }) => {
  const [, navigate] = useLocation();
  const [prompt, setPrompt] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // For speech recognition
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleSpeechRecognition = () => {
    // Check if SpeechRecognition is available
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser doesn't support voice input. Try typing instead!",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (isListening) {
      // Stop listening
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsListening(false);
      return;
    }

    // Start listening
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setPrompt(speechResult);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast({
          title: "Couldn't hear you",
          description: "Try speaking again or type your idea instead!",
          variant: "destructive"
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } catch (err) {
      console.error('Speech recognition error:', err);
      toast({
        title: "Couldn't start listening",
        description: "Try typing your idea instead!",
        variant: "destructive"
      });
    }
  };

  const handleGenerateDrawing = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Oops!",
        description: "Please tell me what you want to draw first!",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Update state to show loading
      setDrawingState({
        inputType: "text",
        prompt,
        steps: [],
        isLoading: true
      });

      // Call the API
      const response = await generateDrawingFromText(prompt);

      // Update drawing state with the response
      setDrawingState({
        id: response.drawingId,
        inputType: "text",
        prompt,
        outputImageUrl: response.finalImageUrl,
        steps: response.steps,
        isLoading: false
      });

      // Navigate to results page
      navigate("/results");

    } catch (err) {
      console.error("Error generating drawing:", err);
      setError("I couldn't create that drawing. Can you try describing it differently?");
      setDrawingState(prev => ({ ...prev, isLoading: false, error: "Failed to generate drawing" }));
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <>
        <Header />
        <ErrorHandling
          errorMessage={error}
          onRetry={() => {
            setError(null);
            setPrompt("");
          }}
          clarificationOptions={[
            {
              label: "Try with simpler words",
              action: () => {
                setError(null);
                setPrompt(prompt.split(' ').slice(0, 3).join(' '));
              }
            },
            {
              label: "Draw an animal instead",
              action: () => {
                setError(null);
                setPrompt("A cute animal");
              }
            }
          ]}
        />
        <Navigation />
      </>
    );
  }

  return (
    <div>
      <Header />

      <MascotGuide
        message={{
          title: "Let's get creative!",
          message: "Tell me what you want to draw and I'll show you how!",
          animation: "wiggle"
        }}
      />

      <div className="container mx-auto px-4 my-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-primary">
          <h3 className="text-2xl font-['Bangers'] mb-4 tracking-wide text-primary text-center">Tell Me What You Want to Draw!</h3>

          {/* Text Input */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                className="w-full text-xl p-4 border-4 border-secondary rounded-xl font-['Comic_Neue']"
                placeholder="Example: A horse jumping over a rainbow"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
              />
              <button
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isListening ? 'bg-pink' : 'bg-secondary'} text-white rounded-full w-10 h-10 flex items-center justify-center`}
                onClick={handleSpeechRecognition}
                disabled={isLoading}
                aria-label={isListening ? "Stop listening" : "Start voice input"}
              >
                <i className={isListening ? "ri-mic-fill text-xl" : "ri-mic-line text-xl"}></i>
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2 font-['Comic_Neue']">You can type or click the microphone to speak!</p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              className={`${isLoading ? 'bg-gray-400' : 'bg-success hover:bg-green-600'} text-white text-xl py-3 px-12 rounded-full font-bold transition-all shadow-md hover:shadow-lg flex items-center`}
              onClick={handleGenerateDrawing}
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2 text-2xl"></i>
                  Making Magic...
                </>
              ) : (
                <>
                  <i className="ri-magic-line mr-2 text-2xl"></i>
                  Make Magic!
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default TextInput;
