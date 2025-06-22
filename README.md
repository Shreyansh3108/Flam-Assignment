# Flam-Assignment
This is a web application built with Next.js that provides real-time edge detection on a live camera feed directly in your browser. It's a demonstration of modern web capabilities for real-time video manipulation.

## Features

- **Real-time Video Processing**: Captures video from your webcam.
- **Edge Detection**: Applies a filter to create a visual edge detection effect.
- **Camera Controls**: Easily start and stop the camera feed.
- **Performance Display**: Shows the current frames per second (FPS) to monitor performance.
- **Modern UI**: Clean and responsive user interface built with shadcn/ui.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Deployment**: Ready for [Firebase App Hosting](https://firebase.google.com/docs/app-hosting).

## Getting Started

### Prerequisites

- Node.js (v20 or later recommended)
- npm, pnpm, or yarn

### Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

To run the app in development mode, use the following command:
npm run dev

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result. You will be prompted to allow camera access.

## How it Works

The application uses the `getUserMedia` API to access the webcam. The video stream is then rendered onto a `<canvas>` element.

The "edge detection" is a visual effect achieved using a combination of CSS filters (`filter: grayscale(1) contrast(3) brightness(0.9)`) applied to the canvas, not a true computer vision algorithm. This provides a lightweight and performant way to demonstrate real-time video manipulation in the browser.

The main component for this is located at `src/components/visionary-edge.tsx`.
