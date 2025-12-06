# Smart Invoice AI - Setup Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or cloud)
- OpenAI API key

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/smart-invoice-ai
   
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here-change-in-production
   
   # OpenAI
   OPENAI_API_KEY=your-openai-api-key-here
   
   # Node Environment
   NODE_ENV=development
   ```

   **Important:** 
   - Generate a secure random string for `NEXTAUTH_SECRET` (you can use `openssl rand -base64 32`)
   - Replace `your-openai-api-key-here` with your actual OpenAI API key
   - Update `MONGODB_URI` if using a remote MongoDB instance

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Register a new account
   - Start using the application!

## Project Structure

```
/app
  /api              # API routes
    /auth           # Authentication routes
    /ai             # AI endpoints
    /ocr            # OCR endpoint
    /customers      # Customer CRUD
    /products       # Product CRUD
    /invoices       # Invoice CRUD
    /company-profile # Company profile
    /dashboard      # Dashboard stats
  /dashboard        # Dashboard page
  /invoice          # Invoice pages
    /generator      # Invoice generator
    /reader         # Invoice reader
  /products         # Products page
  /customers        # Customers page
  /reports          # Reports page
  /settings         # Settings page
  /login            # Login page
  /register         # Register page

/components         # Reusable components
  /ui              # ShadCN UI components
  /layout          # Layout components

/lib               # Utilities and configurations
/models            # Mongoose models
/hooks             # Custom React hooks
/types             # TypeScript type definitions
/utils             # Helper functions
```

## Features

✅ **Authentication**
- User registration and login
- NextAuth with credentials provider
- Protected routes

✅ **Invoice Management**
- Generate invoices with AI auto-fill
- Read invoices using OCR + AI
- Track all invoices with filters
- PDF export functionality

✅ **Customer & Product Management**
- CRUD operations for customers
- CRUD operations for products
- Auto-complete in invoice forms

✅ **AI Features**
- Natural language invoice generation
- OCR-based invoice reading
- Smart data extraction

✅ **Analytics & Reports**
- Dashboard with charts
- GST summaries
- Monthly sales trends
- Export capabilities

✅ **Company Profile**
- Manage business information
- Bank details
- Logo upload support

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### AI & OCR
- `POST /api/ai/fill-invoice` - AI auto-fill invoice from text
- `POST /api/ai/read-invoice` - Extract structured data from OCR text
- `POST /api/ocr` - Perform OCR on uploaded image

### CRUD Operations
- `GET/POST /api/customers` - List/Create customers
- `GET/PUT/DELETE /api/customers/[id]` - Customer operations
- `GET/POST /api/products` - List/Create products
- `GET/PUT/DELETE /api/products/[id]` - Product operations
- `GET/POST /api/invoices` - List/Create invoices
- `GET/PUT/DELETE /api/invoices/[id]` - Invoice operations
- `GET/POST /api/company-profile` - Get/Update company profile

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Tech Stack

- **Frontend:** Next.js 14+ (App Router), TypeScript, TailwindCSS, ShadCN UI
- **Backend:** Next.js API Routes, Mongoose
- **AI:** OpenAI API (direct calls, no LangChain)
- **OCR:** Tesseract.js
- **Auth:** NextAuth.js
- **Charts:** Recharts
- **PDF:** jsPDF + html2canvas

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network connectivity if using remote MongoDB

### OpenAI API Errors
- Verify your API key is correct
- Check your OpenAI account has credits
- Ensure API key has proper permissions

### OCR Not Working
- Tesseract.js requires time to initialize on first use
- Ensure uploaded images are clear and readable
- PDF support is limited (use JPG/PNG for best results)

## Next Steps

1. Set up your company profile in Settings
2. Add customers and products
3. Create your first invoice using the generator
4. Try the AI auto-fill feature
5. Upload an invoice image to test OCR functionality

## Support

For issues or questions, please check the codebase documentation or create an issue in the repository.

