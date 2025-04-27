# Child Draw Coach

A simplified drawing tutorial application for children, designed to provide step-by-step drawing guides.

## Project Overview

This application helps children learn to draw by providing simple, step-by-step drawing tutorials. It features:

- Text-based drawing requests ("Draw a cat")
- Upload your own drawing for improvement suggestions
- Step-by-step drawing instructions with images
- Simple, child-friendly interface

## Technical Details

This is a simplified version of the original application, with:

- React frontend with Tailwind CSS
- Express.js backend
- File-based storage instead of PostgreSQL
- Local drawing library instead of OpenAI integration

## Project Structure

```
ChildDrawCoach/
├── client/               # React frontend
│   ├── src/              # Source code
│   │   ├── components/   # UI components
│   │   ├── lib/          # Utility functions and API clients
│   │   └── pages/        # Page components
│   └── index.html        # HTML entry point
├── server/               # Express backend
│   ├── data/             # Data storage
│   │   ├── assets/       # Drawing tutorial images
│   │   └── drawingLibrary.json # Drawing tutorial data
│   ├── drawingService.ts # Drawing tutorial service
│   ├── storage.ts        # File-based storage service
│   └── index.ts          # Server entry point
└── package.json          # Project dependencies
```

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Build for production:
   ```
   npm run build
   ```

4. Start the production server:
   ```
   npm start
   ```

## Adding Drawing Tutorials

To add new drawing tutorials, edit the `server/data/drawingLibrary.json` file and add images to the `server/data/assets/` directory.

Each tutorial should include:
- A unique ID
- A name
- Keywords for search
- A final image
- Step-by-step instructions with images

## License

MIT
