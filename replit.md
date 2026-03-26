# SpeakEase

A React + TypeScript web application with an Express backend, integrating Firebase, Stripe, and Google Gemini AI.

## Architecture

- **Frontend**: React 19 + Vite 6 + TailwindCSS 4
- **Backend**: Express (embedded in Vite dev server via `server.ts`)
- **Database/Auth**: Firebase (Firestore + Authentication)
- **Payments**: Stripe (checkout sessions)
- **AI**: Google Gemini (`@google/genai`)

## Project Structure

- `server.ts` — Express server that embeds Vite in dev mode, serves static build in production
- `src/` — React frontend source
  - `main.tsx` — Entry point
  - `App.tsx` — Root component
  - `firebase.ts` — Firebase initialization
  - `index.css` — Global styles
  - `lib/` — Utility libraries
  - `services/` — API/service layer
  - `types.ts` — TypeScript type definitions
- `index.html` — HTML entry point
- `vite.config.ts` — Vite configuration
- `tsconfig.json` — TypeScript configuration

## Development

The app runs on port 5000. Start it with:
```
npm run dev
```

This runs `tsx server.ts` which starts Express (with Vite middleware in dev mode) on port 5000.

## Environment Variables

- `VITE_FIREBASE_*` — Firebase configuration (in `.env`)
- `STRIPE_SECRET_KEY` — Stripe secret key (optional, for payment features)
- `GEMINI_API_KEY` — Google Gemini API key (optional, for AI features)
- `APP_URL` — Application URL for Stripe redirect URLs

## Deployment

Configured for autoscale deployment:
- Build: `npm run build` (Vite build to `dist/`)
- Run: `node --import tsx/esm server.ts`

## Key Features

- CSRF protection for state-changing API routes
- Stripe checkout session creation
- Firebase authentication and Firestore integration
- Google Gemini AI integration
