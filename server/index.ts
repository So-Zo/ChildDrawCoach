import express from 'express';
import path from 'path';
import { createServer } from 'http';
import multer from 'multer';
import { z } from 'zod';
import { findDrawingTutorial, analyzeDrawing, getDrawingCategories, getDrawingsInCategory, getDrawingTutorialById } from './drawingService';
import { storage } from './storage';

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define a request interface with the file property
interface FileRequest extends express.Request {
  file?: Express.Multer.File;
}

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Simple request logger
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api')) {
      console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

// Serve static assets for drawing tutorials
app.use('/assets', express.static(path.join(process.cwd(), 'server/data/assets')));

// API endpoint to generate drawing from text prompt
app.post('/api/drawing/text', async (req, res) => {
  try {
    // Validate request
    const schema = z.object({
      prompt: z.string().min(1).max(500),
    });
    
    const validationResult = schema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ message: 'Invalid prompt' });
    }
    
    const { prompt } = validationResult.data;
    
    // Find a drawing tutorial based on the prompt
    const result = findDrawingTutorial(prompt);
    const { steps, finalImageUrl } = result;
    
    // Save drawing to storage (optional user ID)
    const userId = req.body.userId || null;
    
    const drawing = await storage.createDrawing({
      userId,
      prompt,
      inputType: 'text',
      inputImageUrl: null,
      outputImageUrl: finalImageUrl,
      steps,
    });
    
    // Return the drawing data
    res.status(200).json({ drawingId: drawing.id, steps, finalImageUrl });
  } catch (error) {
    console.error('Error generating drawing:', error);
    res.status(500).json({ message: 'Failed to generate drawing' });
  }
});

// API endpoint to generate drawing from uploaded image
app.post('/api/drawing/image', upload.single('image'), async (req: FileRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    
    // Convert image buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    
    // Analyze the drawing
    const analysisResult = analyzeDrawing(base64Image);
    const { description, subject } = analysisResult;
    
    // Find a drawing tutorial based on the subject
    const drawingResult = findDrawingTutorial(subject);
    const { steps, finalImageUrl } = drawingResult;
    
    // Create a data URL for the input image
    const inputImageUrl = `data:${req.file.mimetype};base64,${base64Image}`;
    
    // Save drawing to storage (optional user ID)
    const userId = req.body.userId || null;
    
    const drawing = await storage.createDrawing({
      userId,
      prompt: description,
      inputType: 'image',
      inputImageUrl,
      outputImageUrl: finalImageUrl,
      steps,
    });
    
    // Return the drawing data
    res.status(200).json({
      drawingId: drawing.id,
      description,
      subject,
      steps,
      finalImageUrl,
      inputImageUrl,
    });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ message: 'Failed to process image' });
  }
});

// API endpoint to get a specific drawing
app.get('/api/drawing/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid drawing ID' });
    }
    
    const drawing = await storage.getDrawing(id);
    if (!drawing) {
      return res.status(404).json({ message: 'Drawing not found' });
    }
    
    res.status(200).json(drawing);
  } catch (error) {
    console.error('Error retrieving drawing:', error);
    res.status(500).json({ message: 'Failed to retrieve drawing' });
  }
});

// API endpoint to get all drawing categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = getDrawingCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error retrieving categories:', error);
    res.status(500).json({ message: 'Failed to retrieve categories' });
  }
});

// API endpoint to get all drawings in a category
app.get('/api/category/:id', (req, res) => {
  try {
    const categoryId = req.params.id;
    const drawings = getDrawingsInCategory(categoryId);
    
    if (drawings.length === 0) {
      return res.status(404).json({ message: 'Category not found or empty' });
    }
    
    res.status(200).json(drawings);
  } catch (error) {
    console.error('Error retrieving category drawings:', error);
    res.status(500).json({ message: 'Failed to retrieve category drawings' });
  }
});

// API endpoint to get a specific drawing tutorial
app.get('/api/tutorial/:categoryId/:drawingId', (req, res) => {
  try {
    const { categoryId, drawingId } = req.params;
    const tutorial = getDrawingTutorialById(categoryId, drawingId);
    
    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }
    
    res.status(200).json(tutorial);
  } catch (error) {
    console.error('Error retrieving tutorial:', error);
    res.status(500).json({ message: 'Failed to retrieve tutorial' });
  }
});

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.error(err);
  res.status(status).json({ message });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the dist/public directory
  app.use(express.static(path.join(process.cwd(), 'dist/public')));
  
  // Serve index.html for all other routes (client-side routing)
  app.get('*', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist/public/index.html'));
  });
} else {
  // In development, we'll use Vite's dev server
  import('./devServer.js').then(({ setupDevServer }) => {
    const server = createServer(app);
    setupDevServer(app, server);
    
    // Start the server
    const port = process.env.PORT || 5000;
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }).catch(err => {
    console.error('Failed to start dev server:', err);
  });
}

// Only start the server directly in production
// In development, it's started after setting up the dev server
if (process.env.NODE_ENV === 'production') {
  const server = createServer(app);
  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
