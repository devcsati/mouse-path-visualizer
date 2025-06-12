# Mouse Path Visualizer

This is an advanced web application built with Next.js and TypeScript. It allows users to draw paths with their mouse, which the application then smooths and displays with a highly configurable animation.

The project is architected using a modern, hook-based approach with a central state management store powered by the React Context API.

## Core Features

-   **Mouse Path Recording:** Captures mouse coordinates and timestamps within a designated drawing area.
-   **Path Segmentation:** Automatically detects pauses during drawing to segment a single gesture into multiple, continuous paths.
-   **Path Smoothing:** Implements a Catmull-Rom spline algorithm to transform the raw, angular mouse data into a smooth, aesthetic curve.
-   **Advanced, Configurable Animation:**
    -   Animates a cursor along the smoothed path.
    -   Features a three-phase (ease-in, linear, ease-out) animation profile.
    -   Allows for unique, per-segment configuration of animation parameters.
    -   Provides a selection of different easing functions for the acceleration and deceleration phases.
    -   Accurately replays the pauses between drawn segments.
-   **Visual Debugging Tools:** Includes a real-time graph that visualizes the unique animation velocity curve for each segment.

## Project Architecture

The application's logic is cleanly separated for maintainability and scalability, following the principle of "separation of concerns."

-   **`src/lib`:** Contains all core business logic, including algorithms (`algorithms.ts`), type definitions (`types.ts`), and global constants (`constants.ts`). This layer is completely UI-agnostic.
-   **`src/hooks`:** A collection of custom React hooks, each responsible for a specific piece of application logic:
    -   `useMouseDrawing`: Manages the state and events for drawing on the canvas.
    -   `usePathProcessing`: Takes raw points from drawing and converts them into processed, smoothed paths and segments.
    -   `useAnimationPlayback`: Handles the logic for playing and stopping the animation along the generated paths.
    -   `useUserInteraction`: Manages user-facing interactions like clearing the canvas, selecting a segment, and changing animation parameters.
-   **`src/context`:**
    -   `AnimationContext.tsx`: Acts as a central "store." It composes the custom hooks and provides all application state and functionality to the component tree via the `useAnimation` hook.
-   **`src/components`:** Contains all the presentational React components, which receive their state and logic from the context.
-   **`src/app/page.tsx`:** The main page, which acts as a simple container that composes the UI components and wraps them in the `AnimationProvider`.

## Tech Stack

-   **Next.js** (React Framework)
-   **TypeScript**
-   **CSS Modules** (for component-scoped styling)
-   **React Context API** (for state management)

## Getting Started

### Prerequisites

-   You must have Node.js and npm installed.

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository_url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd mouse-path-visualizer
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

1.  Execute the following command:
    ```bash
    npm run dev
    ```
2.  Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## How to Use the Application

1.  Click and drag your mouse within the large white canvas to draw one or more paths. Pausing will create a new segment.
2.  Use the **"Segment Selector"** dropdown (which appears if you draw more than one path) to choose which path segment you wish to configure.
3.  Adjust the **"Animation Parameters"** using the sliders and dropdowns to change the animation behavior for the selected segment.
4.  Observe the **"Animation Profile"** graph for a real-time visualization of the velocity curve for each segment.
5.  Click the **"Play Animation"** button to watch the orange dot traverse the smoothed path. The animation will respect the pauses you made during drawing.
