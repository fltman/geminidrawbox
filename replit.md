# Overview

This is a digital drawing application built with React and Express that allows users to create, save, and manage drawings through an interactive canvas interface. The application features a full-stack architecture with a React frontend for the drawing interface and an Express backend for handling drawing persistence and file storage. The app provides real-time drawing capabilities with customizable brush controls, color selection, and undo/redo functionality, along with cloud storage integration for saving user creations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client-side application is built with **React 18** and **TypeScript**, utilizing a modern component-based architecture:

- **UI Framework**: Uses shadcn/ui components built on Radix UI primitives for consistent, accessible UI elements
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: React hooks and custom state management through `useDrawing` hook for canvas operations
- **Data Fetching**: TanStack Query (React Query) for server state management and API interactions
- **Routing**: Wouter for lightweight client-side routing
- **Canvas Operations**: HTML5 Canvas API for drawing functionality with touch and mouse support

The frontend follows a component-driven design with dedicated components for brush controls, color picker, drawing actions, and the main canvas interface. The architecture supports both desktop and mobile interfaces with responsive design patterns.

## Backend Architecture

The server-side is built with **Express.js** and **TypeScript**:

- **API Design**: RESTful API endpoints for drawing operations and file management
- **Request Processing**: Express middleware for JSON parsing, logging, and error handling
- **File Upload**: Integration with object storage services for handling drawing image uploads
- **Development Tools**: Vite integration for hot module replacement and development server capabilities

The backend implements a clean separation of concerns with dedicated modules for storage operations, object storage management, and API route handling.

## Data Storage Solutions

**Primary Storage**: Currently uses in-memory storage (`MemStorage` class) for drawings data, which stores:
- Drawing metadata (title, creation date, unique ID)
- File path references to stored images
- Temporary session data

**Database Schema**: Prepared for PostgreSQL with Drizzle ORM, defining:
- `users` table for user authentication (username, password)
- `drawings` table for drawing metadata (title, image path, timestamps)
- UUID-based primary keys for all entities

**File Storage**: Google Cloud Storage integration for persisting drawing images:
- Object storage service with ACL (Access Control List) support
- Public object serving capabilities
- Upload URL generation for client-side file uploads

## Authentication and Authorization

The application includes infrastructure for user authentication:
- User schema with username/password authentication
- Prepared authentication routes and middleware
- Object-level access control system with configurable permissions (read/write)
- Group-based access control supporting various access patterns (user lists, email domains, group membership)

Currently operating without active authentication, but the foundation is established for future implementation.

# External Dependencies

## Core Frameworks and Libraries
- **React 18**: Frontend UI framework with hooks and modern features
- **Express.js**: Backend web framework for Node.js
- **TypeScript**: Type safety across the entire application stack
- **Vite**: Build tool and development server with HMR support

## UI and Design System
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **shadcn/ui**: Pre-built component library based on Radix UI
- **Lucide React**: Icon library for consistent iconography

## Data Management
- **Drizzle ORM**: Type-safe database ORM for PostgreSQL
- **TanStack Query**: Server state management and data fetching
- **Zod**: Schema validation for API inputs and data parsing

## Cloud Services
- **Google Cloud Storage**: Object storage service for file persistence
- **Neon Database**: PostgreSQL database hosting (configured but not actively used)

## Development and Build Tools
- **esbuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration
- **React Hook Form**: Form state management and validation
- **Wouter**: Lightweight routing library for React

## File Upload and Processing
- **Uppy**: File upload library with multiple adapters
- **AWS S3 integration**: Alternative cloud storage option through Uppy

The application is designed to run on Replit with specific integrations for the Replit development environment, including error overlays and cartographer tooling for enhanced development experience.