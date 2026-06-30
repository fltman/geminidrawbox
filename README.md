# Gemini Drawbox

[![Support me on Patreon](https://img.shields.io/badge/Patreon-Support%20my%20work-FF424D?style=flat&logo=patreon&logoColor=white)](https://www.patreon.com/AndersBjarby)

A full-stack digital drawing app with an interactive HTML5 canvas and AI image transformation. Draw on a mobile-friendly, ultra-minimal canvas, then transform your sketch with Google Gemini (via OpenRouter) using one of the built-in prompts, and compare the original and generated images side by side.

## Features

- HTML5 canvas drawing with brush size, color, undo/redo, and touch support
- Mobile-first, full-screen canvas with floating controls
- AI image generation from your drawing using Google Gemini
- Save/load drawings with cloud persistence (Google Cloud Storage)
- Side-by-side comparison of original and AI-generated images

## Setup

```bash
npm install

# Development (Express + Vite with HMR)
npm run dev

# Production build and start
npm run build
npm start
```

Expects environment configuration for the AI provider, object storage (Google Cloud Storage), and optionally a PostgreSQL database (`npm run db:push` applies the Drizzle schema).

## Tech

React 18, TypeScript, Vite, Tailwind CSS + shadcn/ui (Radix), Express, Drizzle ORM (PostgreSQL/Neon), TanStack Query, Wouter, Google Cloud Storage, Google Gemini via OpenRouter.
