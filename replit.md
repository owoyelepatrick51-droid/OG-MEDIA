# OG MEDIA - News Website & PWA

## Overview

OG MEDIA is a full-stack news aggregation website that automatically fetches real, up-to-date news from the internet. The platform organizes content by categories (World, Nigeria, Crypto, Sports, Technology, Business, Entertainment), displays trending topics, supports user accounts with bookmarking, and is designed to be installable as a Progressive Web App (PWA).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, bundled via Vite
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme configuration supporting light/dark modes
- **Animations**: Framer Motion for page transitions and card animations
- **Typography**: Inter (body) and Playfair Display (headings) fonts

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript compiled with TSX for development, esbuild for production
- **API Pattern**: RESTful endpoints under `/api/*` prefix
- **Session Management**: Express sessions with memory store (development) or PostgreSQL store (production)
- **Authentication**: Passport.js with local strategy (username/password)

### Data Layer
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` contains all database table definitions
- **Tables**: 
  - `users` - user accounts with preferences
  - `bookmarks` - saved articles per user

### News Data Fetching
- **Primary Source**: ok.surf news-feed API for general news categories
- **Nigeria Sources**: RSS feeds parsed via rss-parser (Premium Times, Gist Lover, NotJustOk, Vanguard)
- **Caching**: Server-side cache with 5-minute TTL to reduce API calls
- **Categories**: general, business, technology, science, health, sports, entertainment, crypto, nigeria_trending, nigeria_entertainment, nigeria_music, nigeria_sports

### Build & Deployment
- **Development**: Vite dev server with HMR proxied through Express
- **Production Build**: Vite builds frontend to `dist/public`, esbuild bundles server to `dist/index.cjs`
- **Database Migrations**: Drizzle Kit with `db:push` command

### Project Structure
```
client/           # React frontend application
  src/
    components/   # UI components including shadcn/ui
    pages/        # Route page components
    hooks/        # Custom React hooks (auth, bookmarks, news)
    lib/          # Utilities and query client
server/           # Express backend
  routes.ts       # API route definitions
  storage.ts      # Database access layer
  db.ts           # Database connection
shared/           # Shared code between frontend/backend
  schema.ts       # Drizzle database schema
  routes.ts       # API contract types
```

## External Dependencies

### APIs & Services
- **News APIs**: ok.surf news-feed API (free, updates every few minutes)
- **RSS Feeds**: Nigerian news sources (Premium Times, Vanguard, NotJustOk, Gist Lover)

### Database
- **PostgreSQL**: Required for production, connection via `DATABASE_URL` environment variable
- **Session Store**: connect-pg-simple for production sessions

### Key NPM Packages
- **Frontend**: react, wouter, @tanstack/react-query, framer-motion, date-fns, tailwindcss
- **Backend**: express, passport, passport-local, express-session, rss-parser
- **Database**: drizzle-orm, pg, drizzle-zod
- **Build**: vite, esbuild, tsx