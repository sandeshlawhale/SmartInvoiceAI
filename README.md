# Smart Invoice AI

A complete AI-powered invoice management system built with Next.js, TypeScript, MongoDB, and OpenAI.

## Features

- 🤖 AI-powered invoice generation and auto-fill
- 📄 OCR-based invoice reading
- 📊 Dashboard with analytics and GST summaries
- 👥 Customer and product management
- 📈 Reports and exports
- 🔐 Secure authentication with NextAuth

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, TailwindCSS, ShadCN UI
- **Backend**: Next.js API Routes, Mongoose
- **AI**: OpenAI API (direct calls)
- **OCR**: Tesseract.js
- **Auth**: NextAuth.js

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your MongoDB URI, OpenAI API key, and NextAuth secret
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app
  /api          # API routes
  /dashboard    # Dashboard page
  /invoice      # Invoice pages
  /products     # Products page
  /customers    # Customers page
  /reports      # Reports page
  /settings     # Settings page
  /login        # Login page
  /register     # Register page

/components     # Reusable components
/lib            # Utilities and configurations
/hooks          # Custom React hooks
/models         # Mongoose models
/utils          # Helper functions
```
