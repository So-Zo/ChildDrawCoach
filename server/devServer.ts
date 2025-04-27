import { createServer as createViteServer } from 'vite';
import type { Express } from 'express';
import type { Server } from 'http';
import path from 'path';
import fs from 'fs';

export async function setupDevServer(app: Express, server: Server) {
  try {
    // Create Vite server in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: path.resolve(process.cwd(), 'client')
    });

    // Use Vite's connect instance as middleware
    app.use(vite.middlewares);

    // Serve index.html for all other routes (client-side routing)
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;

      try {
        // Get the index.html from the client directory
        let template = fs.readFileSync(
          path.resolve(process.cwd(), 'client/index.html'),
          'utf-8'
        );

        // Apply Vite HTML transforms
        template = await vite.transformIndexHtml(url, template);

        // Send the transformed HTML
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        // If an error occurs, let Vite fix the stack trace
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } catch (error) {
    console.error('Error setting up dev server:', error);
    throw error;
  }
}
