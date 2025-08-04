# Notice & Project Philosophy

**Disclaimer:** I am not the original author of this codebase. The initial version of this project was created on Replit and has since been adapted here. 

You are encouraged to fork or use this project as you wish. There are currently no contribution standards, as none of the projects like this on my GitHub are my active focus right now. It may take some time before I revisit each project and bring them to a point where I would consider them ready for open source contributions. These repositories are primarily meant to demonstrate ideas I have, the front ends I think suit them, and my ability to think beyond just the technical implementation.

**About this project:**
This project is intended to use AI (with specific boundaries yet to be defined) to transform a child's drawing into something unique and inspired solely by what the child can see and draw. The goal is to create ways to teach and inspire children to draw more and improve, without the constraints of predetermined coloring or drawing books.

---

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
