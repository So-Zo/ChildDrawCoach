import express, { type Express, type Request } from "express";
import multer from "multer";
import { z } from "zod";
import path from "path";
import fs from "fs";

// Define a request interface with the file property
interface FileRequest extends Request {
  file?: Express.Multer.File;
}

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Simple in-memory storage for drawings
const drawings = new Map<number, any>();
let nextDrawingId = 1;

export function registerRoutes(app: Express) {
  // Serve static assets for drawing tutorials
  app.use('/assets', express.static(path.join(process.cwd(), 'server/data/assets')));

  // API endpoint to generate drawing from text prompt
  app.post("/api/drawing/text", async (req, res) => {
    try {
      // Validate request
      const schema = z.object({
        prompt: z.string().min(1).max(500),
      });
      
      const validationResult = schema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ message: "Invalid prompt" });
      }
      
      const { prompt } = validationResult.data;
      
      // For now, just return a mock response
      const steps = [
        {
          instruction: "Draw a big circle for the main shape",
          imageUrl: "/assets/default/step1.jpg"
        },
        {
          instruction: "Add details to make it look like a " + prompt,
          imageUrl: "/assets/default/step2.jpg"
        },
        {
          instruction: "Color it with your favorite colors!",
          imageUrl: "/assets/default/step3.jpg"
        }
      ];
      
      const finalImageUrl = "/assets/default/final.jpg";
      
      // Save drawing to storage
      const drawingId = nextDrawingId++;
      const drawing = {
        id: drawingId,
        userId: null,
        prompt,
        inputType: "text",
        inputImageUrl: null,
        outputImageUrl: finalImageUrl,
        steps,
        createdAt: new Date()
      };
      
      drawings.set(drawingId, drawing);
      
      // Return the drawing data
      res.status(200).json({ drawingId, steps, finalImageUrl });
    } catch (error) {
      console.error("Error generating drawing:", error);
      res.status(500).json({ message: "Failed to generate drawing" });
    }
  });

  // API endpoint to generate drawing from uploaded image
  app.post("/api/drawing/image", upload.single("image"), async (req: FileRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }
      
      // Convert image buffer to base64
      const base64Image = req.file.buffer.toString("base64");
      
      // For now, just return a mock response
      const description = "This looks like a creative drawing! Let me help you improve it.";
      const subject = "Creative Drawing";
      
      const steps = [
        {
          instruction: "Draw a big circle for the main shape",
          imageUrl: "/assets/default/step1.jpg"
        },
        {
          instruction: "Add details to make it look better",
          imageUrl: "/assets/default/step2.jpg"
        },
        {
          instruction: "Color it with your favorite colors!",
          imageUrl: "/assets/default/step3.jpg"
        }
      ];
      
      const finalImageUrl = "/assets/default/final.jpg";
      
      // Create a data URL for the input image
      const inputImageUrl = `data:${req.file.mimetype};base64,${base64Image}`;
      
      // Save drawing to storage
      const drawingId = nextDrawingId++;
      const drawing = {
        id: drawingId,
        userId: null,
        prompt: description,
        inputType: "image",
        inputImageUrl,
        outputImageUrl: finalImageUrl,
        steps,
        createdAt: new Date()
      };
      
      drawings.set(drawingId, drawing);
      
      // Return the drawing data
      res.status(200).json({
        drawingId,
        description,
        subject,
        steps,
        finalImageUrl,
        inputImageUrl,
      });
    } catch (error) {
      console.error("Error processing image:", error);
      res.status(500).json({ message: "Failed to process image" });
    }
  });

  // API endpoint to get a specific drawing
  app.get("/api/drawing/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid drawing ID" });
      }
      
      const drawing = drawings.get(id);
      if (!drawing) {
        return res.status(404).json({ message: "Drawing not found" });
      }
      
      res.status(200).json(drawing);
    } catch (error) {
      console.error("Error retrieving drawing:", error);
      res.status(500).json({ message: "Failed to retrieve drawing" });
    }
  });
  
  // API endpoint to get all drawing categories
  app.get("/api/categories", (req, res) => {
    try {
      // Mock categories
      const categories = [
        { id: "animals", name: "Animals", itemCount: 3 },
        { id: "objects", name: "Objects", itemCount: 2 },
        { id: "nature", name: "Nature", itemCount: 2 }
      ];
      
      res.status(200).json(categories);
    } catch (error) {
      console.error("Error retrieving categories:", error);
      res.status(500).json({ message: "Failed to retrieve categories" });
    }
  });
  
  // API endpoint to get all drawings in a category
  app.get("/api/category/:id", (req, res) => {
    try {
      const categoryId = req.params.id;
      
      // Mock drawings for the category
      const drawings = [
        { id: "cat", name: "Cat", finalImageUrl: "/assets/default/final.jpg" },
        { id: "dog", name: "Dog", finalImageUrl: "/assets/default/final.jpg" }
      ];
      
      res.status(200).json(drawings);
    } catch (error) {
      console.error("Error retrieving category drawings:", error);
      res.status(500).json({ message: "Failed to retrieve category drawings" });
    }
  });
  
  // API endpoint to get a specific drawing tutorial
  app.get("/api/tutorial/:categoryId/:drawingId", (req, res) => {
    try {
      const { categoryId, drawingId } = req.params;
      
      // Mock tutorial
      const tutorial = {
        name: "Sample Drawing",
        steps: [
          {
            instruction: "Draw a big circle for the main shape",
            imageUrl: "/assets/default/step1.jpg"
          },
          {
            instruction: "Add details to make it look better",
            imageUrl: "/assets/default/step2.jpg"
          },
          {
            instruction: "Color it with your favorite colors!",
            imageUrl: "/assets/default/step3.jpg"
          }
        ],
        finalImageUrl: "/assets/default/final.jpg"
      };
      
      res.status(200).json(tutorial);
    } catch (error) {
      console.error("Error retrieving tutorial:", error);
      res.status(500).json({ message: "Failed to retrieve tutorial" });
    }
  });
}
