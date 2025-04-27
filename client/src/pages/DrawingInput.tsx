import React, { useState, useRef } from "react";
import { useLocation } from "wouter";
import Header from "../components/Header";
import MascotGuide from "../components/MascotGuide";
import Navigation from "../components/Navigation";
import { useToast } from "../hooks/use-toast";
import { generateDrawingFromImage } from "../lib/drawingService";
import { DrawingState } from "../lib/types";
import ErrorHandling from "../components/ErrorHandling";

interface DrawingInputProps {
  setDrawingState: React.Dispatch<React.SetStateAction<DrawingState>>;
}

const DrawingInput: React.FC<DrawingInputProps> = ({ setDrawingState }) => {
  const [, navigate] = useLocation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Not an image",
          description: "Please select a picture file!",
          variant: "destructive"
        });
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too big",
          description: "Please select a smaller picture (under 5MB)!",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = () => {
    // This will just open the file selector since we can't directly
    // access the camera in this environment
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChoosePicture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleGenerateDrawing = async () => {
    if (!selectedFile) {
      toast({
        title: "No drawing selected",
        description: "Please upload your drawing first!",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Update state to show loading
      setDrawingState({
        inputType: "image",
        inputImageUrl: previewUrl || undefined,
        steps: [],
        isLoading: true
      });

      // Call the API
      const response = await generateDrawingFromImage(selectedFile);

      // Update drawing state with the response
      setDrawingState({
        id: response.drawingId,
        inputType: "image",
        prompt: response.description,
        inputImageUrl: response.inputImageUrl,
        outputImageUrl: response.finalImageUrl,
        steps: response.steps,
        isLoading: false
      });

      // Navigate to results page
      navigate("/results");

    } catch (err) {
      console.error("Error processing drawing:", err);
      setError("I couldn't understand your drawing. Can you try a clearer picture or a different drawing?");
      setDrawingState(prev => ({ ...prev, isLoading: false, error: "Failed to process drawing" }));
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
            setSelectedFile(null);
            setPreviewUrl(null);
          }}
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
          title: "Show me your art!",
          message: "Upload your drawing and I'll help make it even better!",
          animation: "bounce"
        }}
      />

      <div className="container mx-auto px-4 my-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-secondary">
          <h3 className="text-2xl font-['Bangers'] mb-4 tracking-wide text-secondary text-center">Show Me Your Drawing!</h3>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />

          {previewUrl ? (
            /* Preview area when file is selected */
            <div className="mb-6 border-4 border-soft-gray rounded-xl p-4 flex flex-col items-center">
              <div className="w-full max-w-md aspect-square mb-4 relative">
                <img
                  src={previewUrl}
                  alt="Preview of your drawing"
                  className="w-full h-full object-contain rounded-lg"
                />
                <button
                  className="absolute top-2 right-2 bg-pink hover:bg-pink-600 text-white rounded-full w-10 h-10 flex items-center justify-center"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  disabled={isLoading}
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              <p className="text-lg font-['Comic_Neue'] text-secondary mb-2">Nice drawing! Ready to make magic?</p>
            </div>
          ) : (
            /* Upload Area when no file is selected */
            <div className="mb-6 border-4 border-dashed border-soft-gray rounded-xl p-8 flex flex-col items-center justify-center">
              <div className="bg-secondary rounded-full w-20 h-20 flex items-center justify-center mb-4">
                <i className="ri-image-add-line text-white text-4xl"></i>
              </div>
              <h4 className="text-xl font-['Comic_Neue'] text-secondary mb-2">Tap to Upload Your Drawing</h4>
              <p className="text-center text-gray-500 mb-4 font-['Comic_Neue']">You can take a photo or choose one from your pictures</p>
              <div className="flex gap-4 flex-wrap justify-center">
                <button
                  className="bg-pink hover:bg-pink-600 text-white text-lg py-2 px-6 rounded-full font-bold transition-all shadow-md hover:shadow-lg flex items-center"
                  onClick={handleTakePhoto}
                  disabled={isLoading}
                >
                  <i className="ri-camera-line mr-2"></i>
                  Take Photo
                </button>
                <button
                  className="bg-accent hover:bg-amber-500 text-white text-lg py-2 px-6 rounded-full font-bold transition-all shadow-md hover:shadow-lg flex items-center"
                  onClick={handleChoosePicture}
                  disabled={isLoading}
                >
                  <i className="ri-image-line mr-2"></i>
                  Choose Picture
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              className={`${!selectedFile || isLoading ? 'opacity-50 cursor-not-allowed bg-success' : 'bg-success hover:bg-green-600'} text-white text-xl py-3 px-12 rounded-full font-bold transition-all shadow-md hover:shadow-lg flex items-center`}
              onClick={handleGenerateDrawing}
              disabled={!selectedFile || isLoading}
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

export default DrawingInput;
