import fs from 'fs';
import path from 'path';

// Define the DrawingStep type
export type DrawingStep = {
  instruction: string;
  imageUrl: string;
};

// Load the drawing library from JSON file
const drawingLibraryPath = path.resolve(process.cwd(), 'server/data/drawingLibrary.json');

// Function to load the drawing library
export function loadDrawingLibrary() {
  try {
    if (fs.existsSync(drawingLibraryPath)) {
      return JSON.parse(fs.readFileSync(drawingLibraryPath, 'utf-8'));
    } else {
      console.warn('Drawing library file not found, creating default library');
      const defaultLibrary = createDefaultLibrary();
      saveDrawingLibrary(defaultLibrary);
      return defaultLibrary;
    }
  } catch (error) {
    console.error('Error loading drawing library:', error);
    const defaultLibrary = createDefaultLibrary();
    saveDrawingLibrary(defaultLibrary);
    return defaultLibrary;
  }
}

// Function to save the drawing library
function saveDrawingLibrary(library: any) {
  try {
    // Ensure the directory exists
    const dir = path.dirname(drawingLibraryPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(drawingLibraryPath, JSON.stringify(library, null, 2));
  } catch (error) {
    console.error('Error saving drawing library:', error);
  }
}

// Create a default library if none exists
function createDefaultLibrary() {
  return {
    categories: [
      {
        id: "animals",
        name: "Animals",
        items: [
          {
            id: "cat",
            name: "Cat",
            keywords: ["cat", "kitten", "kitty", "feline"],
            finalImageUrl: "/assets/cat/final.jpg",
            steps: [
              {
                instruction: "Draw a circle for the cat's head",
                imageUrl: "/assets/cat/step1.jpg"
              },
              {
                instruction: "Add two triangles on top for the ears",
                imageUrl: "/assets/cat/step2.jpg"
              },
              {
                instruction: "Draw two small circles for the eyes",
                imageUrl: "/assets/cat/step3.jpg"
              },
              {
                instruction: "Add a small triangle for the nose and curved lines for the mouth",
                imageUrl: "/assets/cat/step4.jpg"
              },
              {
                instruction: "Draw whiskers and color your cat!",
                imageUrl: "/assets/cat/step5.jpg"
              }
            ]
          },
          {
            id: "dog",
            name: "Dog",
            keywords: ["dog", "puppy", "canine"],
            finalImageUrl: "/assets/dog/final.jpg",
            steps: [
              {
                instruction: "Draw a circle for the dog's head",
                imageUrl: "/assets/dog/step1.jpg"
              },
              {
                instruction: "Add two floppy ears on the sides",
                imageUrl: "/assets/dog/step2.jpg"
              },
              {
                instruction: "Draw two circles for the eyes",
                imageUrl: "/assets/dog/step3.jpg"
              },
              {
                instruction: "Add a round nose and a smiling mouth",
                imageUrl: "/assets/dog/step4.jpg"
              },
              {
                instruction: "Draw a body and legs, then color your dog!",
                imageUrl: "/assets/dog/step5.jpg"
              }
            ]
          }
        ]
      },
      {
        id: "objects",
        name: "Objects",
        items: [
          {
            id: "house",
            name: "House",
            keywords: ["house", "home", "building"],
            finalImageUrl: "/assets/house/final.jpg",
            steps: [
              {
                instruction: "Draw a square for the main part of the house",
                imageUrl: "/assets/house/step1.jpg"
              },
              {
                instruction: "Add a triangle on top for the roof",
                imageUrl: "/assets/house/step2.jpg"
              },
              {
                instruction: "Draw a rectangle for the door",
                imageUrl: "/assets/house/step3.jpg"
              },
              {
                instruction: "Add squares for windows",
                imageUrl: "/assets/house/step4.jpg"
              },
              {
                instruction: "Color your house with your favorite colors!",
                imageUrl: "/assets/house/step5.jpg"
              }
            ]
          }
        ]
      }
    ],
    default: {
      id: "default",
      name: "Simple Drawing",
      finalImageUrl: "/assets/default/final.jpg",
      steps: [
        {
          instruction: "Draw a big circle",
          imageUrl: "/assets/default/step1.jpg"
        },
        {
          instruction: "Add some shapes inside",
          imageUrl: "/assets/default/step2.jpg"
        },
        {
          instruction: "Draw details to make it special",
          imageUrl: "/assets/default/step3.jpg"
        },
        {
          instruction: "Color your drawing with your favorite colors!",
          imageUrl: "/assets/default/step4.jpg"
        }
      ]
    }
  };
}

// Find a drawing tutorial based on text input
export function findDrawingTutorial(prompt: string): {
  steps: DrawingStep[];
  finalImageUrl: string;
} {
  const drawingLibrary = loadDrawingLibrary();
  const normalizedPrompt = prompt.toLowerCase().trim();
  
  // Search through all categories and items
  for (const category of drawingLibrary.categories) {
    for (const item of category.items) {
      // Check if any keywords match the prompt
      if (item.keywords.some((keyword: string) => normalizedPrompt.includes(keyword))) {
        return {
          steps: item.steps,
          finalImageUrl: item.finalImageUrl
        };
      }
    }
  }
  
  // If no match found, return the default drawing
  return {
    steps: drawingLibrary.default.steps,
    finalImageUrl: drawingLibrary.default.finalImageUrl
  };
}

// Analyze an uploaded drawing and suggest a tutorial
export function analyzeDrawing(imageBase64: string): {
  description: string;
  subject: string;
} {
  // In a real implementation, this would analyze the image
  // For now, we'll just return a generic response
  return {
    description: "This looks like a creative drawing! Let me help you improve it.",
    subject: "Creative Drawing"
  };
}

// Get all available drawing categories
export function getDrawingCategories() {
  const drawingLibrary = loadDrawingLibrary();
  return drawingLibrary.categories.map((category: any) => ({
    id: category.id,
    name: category.name,
    itemCount: category.items.length
  }));
}

// Get all drawing tutorials in a category
export function getDrawingsInCategory(categoryId: string) {
  const drawingLibrary = loadDrawingLibrary();
  const category = drawingLibrary.categories.find((cat: any) => cat.id === categoryId);
  
  if (!category) {
    return [];
  }
  
  return category.items.map((item: any) => ({
    id: item.id,
    name: item.name,
    finalImageUrl: item.finalImageUrl
  }));
}

// Get a specific drawing tutorial by ID
export function getDrawingTutorialById(categoryId: string, drawingId: string): {
  steps: DrawingStep[];
  finalImageUrl: string;
  name: string;
} | null {
  const drawingLibrary = loadDrawingLibrary();
  const category = drawingLibrary.categories.find((cat: any) => cat.id === categoryId);
  
  if (!category) {
    return null;
  }
  
  const drawing = category.items.find((item: any) => item.id === drawingId);
  
  if (!drawing) {
    return null;
  }
  
  return {
    steps: drawing.steps,
    finalImageUrl: drawing.finalImageUrl,
    name: drawing.name
  };
}
