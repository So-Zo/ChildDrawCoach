// Define the DrawingStep type locally since we're removing the shared schema
export type DrawingStep = {
  instruction: string;
  imageUrl: string;
};

export interface TextInputResponse {
  drawingId: number;
  steps: DrawingStep[];
  finalImageUrl: string;
}

export interface ImageInputResponse {
  drawingId: number;
  description: string;
  subject: string;
  steps: DrawingStep[];
  finalImageUrl: string;
  inputImageUrl: string;
}

export interface DrawingState {
  id?: number;
  prompt?: string;
  inputType: "text" | "image";
  inputImageUrl?: string;
  outputImageUrl?: string;
  steps: DrawingStep[];
  isLoading: boolean;
  error?: string;
}

export interface MascotMessage {
  title: string;
  message: string;
  animation?: "bounce" | "wiggle" | "none";
}

export type DrawingInput = {
  prompt?: string;
  imageFile?: File;
};

export interface CategoryResponse {
  id: string;
  name: string;
  itemCount: number;
}

export interface DrawingTutorialResponse {
  name: string;
  steps: DrawingStep[];
  finalImageUrl: string;
}
