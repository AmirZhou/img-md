# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Starting Development
- `npm run dev` - Starts both frontend (Vite) and backend (Convex) development servers in parallel
- `npm run dev:frontend` - Starts only the Vite frontend server with auto-open
- `npm run dev:backend` - Starts only the Convex backend development server

### Building and Validation
- `npm run build` - Creates production build using Vite
- `npm run lint` - Comprehensive lint command that checks TypeScript in both convex and src directories, runs convex dev once, and builds the project

## Architecture Overview

This is a **Markdown Image Generator** built with React, Vite, and Convex backend. The application allows users to upload SVG/PNG images and generates markdown-ready URLs for easy embedding in documentation.

### Tech Stack
- **Frontend**: React 19, TypeScript, Vite, TailwindCSS
- **Backend**: Convex (real-time database and file storage)
- **Authentication**: Convex Auth with anonymous authentication
- **UI Components**: Custom components with Tailwind styling
- **Notifications**: Sonner for toast notifications

### Project Structure
```
src/
├── components/
│   ├── Uploader.tsx          # File upload with drag-and-drop
│   ├── ImageGallery.tsx      # Grid display of uploaded images
│   └── MarkdownCopy.tsx      # Markdown generation and clipboard copy
├── App.tsx                   # Main application component
├── SignInForm.tsx            # Authentication form
└── SignOutButton.tsx         # Authentication logout

convex/
├── schema.ts                 # Database schema definition
├── files.ts                  # Image query functions
├── storage.ts                # File upload mutations
├── auth.ts & auth.config.ts  # Authentication setup
├── http.ts & router.ts       # HTTP API routes
└── _generated/               # Auto-generated Convex files
```

### Key Features Architecture

**File Upload Flow**:
1. `Uploader.tsx` validates SVG/PNG files and handles drag-and-drop
2. `storage.ts` mutations generate upload URLs and save metadata
3. `schema.ts` defines images table with userId, storageId, and format
4. `files.ts` queries retrieve user's images with generated URLs

**State Management**:
- Convex handles all backend state and real-time updates
- React local state for UI interactions (selected image, upload progress)
- `lastUploadedUrl` state tracks most recently uploaded image for markdown generation

**Authentication**:
- Anonymous auth for easy access without registration
- User-scoped image storage (images indexed by userId)

### File Upload Constraints
- Only SVG and PNG files accepted
- File validation happens client-side before upload
- Server-side storage handled by Convex storage API

### Styling System
- TailwindCSS with custom configuration
- Custom color palette (primary: #4F46E5, secondary: #6B7280)
- Responsive grid layouts for image gallery
- Custom shadows and border radius values defined in `tailwind.config.js`

### Development Notes
- Vite config includes Chef development tools integration for screenshot capabilities
- TypeScript path aliases: `@/*` maps to `./src/*`
- Project uses npm-run-all for parallel script execution
- Connected to Convex deployment: `outstanding-dodo-52`