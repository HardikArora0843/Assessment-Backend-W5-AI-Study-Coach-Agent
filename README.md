# AI Study Coach Agent

A production-quality AI-powered study coach that helps students learn from their own study materials. Upload your documents (PDF, DOCX, TXT) and ask questions to get instant, accurate answers powered by OpenAI's latest AI technology.

![AI Study Coach](https://img.shields.io/badge/React-19-blue) ![Vite](https://img.shields.io/badge/Vite-6.0-purple) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan) ![Netlify](https://img.shields.io/badge/Netlify-Deployed-teal)

## 🌟 Features

### Core Functionality
- **Document Upload**: Support for PDF, DOCX, and TXT files with drag-and-drop interface
- **AI-Powered Q&A**: Ask questions about your uploaded materials and get accurate answers
- **Smart Context Management**: Automatically handles large documents by chunking and retrieving relevant sections
- **Real-time Chat**: Modern chat interface with typing indicators and markdown rendering
- **Document Management**: View, manage, and delete uploaded documents

### User Experience
- **Modern UI/UX**: Beautiful, responsive design inspired by ChatGPT and Claude
- **Dark/Light Mode**: Toggle between themes for comfortable studying
- **Chat History**: Persistent chat history saved locally
- **Dashboard**: Overview of learning progress and statistics
- **Loading States**: Smooth loading animations and skeletons
- **Toast Notifications**: Instant feedback for user actions

### Technical Excellence
- **Netlify Functions**: Serverless backend for easy deployment
- **MongoDB Integration**: Persistent document storage with MongoDB Atlas
- **OpenAI Integration**: Uses the latest OpenAI Responses API
- **Type-Safe**: Built with modern JavaScript best practices
- **Optimized Performance**: Fast loading and efficient rendering
- **Secure**: Environment variable management for API keys
- **Scalable Architecture**: Clean, modular code structure

## 📁 Project Structure

```
study-coach-agent/
├── functions/                 # Netlify Functions (Backend)
│   ├── health.js             # Health check endpoint
│   ├── upload.js             # File upload and processing
│   ├── ask.js                # AI question answering
│   ├── deleteFile.js         # File deletion
│   ├── listFiles.js          # List all documents
│   ├── models/               # MongoDB models
│   │   └── Document.js       # Document model
│   ├── utils/                # Utility functions
│   │   └── mongodb.js        # MongoDB connection
│   └── package.json          # Backend dependencies
├── src/
│   ├── components/           # React Components
│   │   ├── Chat/            # Chat interface components
│   │   ├── Common/          # Shared components
│   │   ├── Dashboard/       # Dashboard components
│   │   ├── Documents/       # Document management
│   │   ├── Layout/          # Layout components
│   │   └── Upload/          # Upload components
│   ├── hooks/               # Custom React Hooks
│   │   ├── useChat.js       # Chat state management
│   │   ├── useDocuments.js  # Document state management
│   │   └── useTheme.js      # Theme management
│   ├── pages/               # Page Components
│   │   ├── Home.jsx         # Landing page
│   │   ├── Dashboard.jsx    # Dashboard
│   │   ├── Chat.jsx         # Chat interface
│   │   └── Settings.jsx     # Settings page
│   ├── services/            # API Services
│   │   └── api.js           # API client
│   ├── utils/               # Utility Functions
│   │   ├── formatters.js    # Data formatting
│   │   ├── storage.js       # Local storage
│   │   └── validation.js    # Input validation
│   ├── App.jsx              # Main App component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
│   ├── favicon.svg
│   └── robots.txt
├── uploads/                 # Local file storage (dev only)
├── knowledge/               # Processed knowledge (dev only)
├── .env.example             # Environment variables template
├── .gitignore
├── netlify.toml             # Netlify configuration
├── package.json             # Frontend dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- MongoDB Atlas account ([Get one here](https://www.mongodb.com/cloud/atlas))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd study-coach-agent
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd functions
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key and MongoDB URI:
   ```env
   OPENAI_API_KEY=your_actual_api_key_here
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/study-coach?retryWrites=true&w=majority
   MODEL=gpt-4.1-mini
   MAX_CONTEXT_CHARS=12000
   MAX_UPLOAD_SIZE=10485760
   ```
   
   See [MONGODB_SETUP.md](MONGODB_SETUP.md) for detailed MongoDB setup instructions.

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🌐 Netlify Deployment

### Manual Deployment

1. **Push your code to GitHub**

2. **Create a new site on Netlify**
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

3. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Set environment variables**
   - Go to Site settings → Environment variables
   - Add the following variables:
     - `OPENAI_API_KEY`: Your OpenAI API key
     - `MODEL`: `gpt-4.1-mini`
     - `MAX_CONTEXT_CHARS`: `12000`
     - `MAX_UPLOAD_SIZE`: `10485760`

5. **Deploy**
   - Netlify will automatically deploy when you push to GitHub

### Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | Required |
| `MONGODB_URI` | MongoDB Atlas connection string | Required |
| `MODEL` | OpenAI model to use | `gpt-4.1-mini` |
| `MAX_CONTEXT_CHARS` | Maximum context characters | `12000` |
| `MAX_UPLOAD_SIZE` | Maximum file size in bytes | `10485760` (10MB) |

### Tailwind CSS Configuration

The project uses Tailwind CSS with custom configuration in `tailwind.config.js`:

- Custom color palette (primary, accent)
- Custom animations (fade-in, slide-up, slide-down)
- Dark mode support
- Responsive breakpoints

## 📡 API Documentation

### Endpoints

#### Health Check
```http
GET /.netlify/functions/health
```

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "uptime": {
    "seconds": 3600,
    "formatted": "1h 0m 0s"
  },
  "memory": {
    "used": 128,
    "total": 256
  },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

#### Upload File
```http
POST /.netlify/functions/upload
Content-Type: multipart/form-data
```

**Body:** `file` (multipart file)

**Response:**
```json
{
  "success": true,
  "id": "uuid",
  "filename": "document.pdf",
  "type": ".pdf",
  "size": 1024000,
  "pages": 10,
  "uploadDate": "2025-01-15T10:30:00.000Z",
  "textLength": 15000
}
```

#### Ask Question
```http
POST /.netlify/functions/ask
Content-Type: application/json
```

**Body:**
```json
{
  "question": "What are the main concepts?"
}
```

**Response:**
```json
{
  "answer": "The main concepts are...",
  "sources": [
    {
      "filename": "document.pdf",
      "type": ".pdf",
      "uploadDate": "2025-01-15T10:30:00.000Z"
    }
  ],
  "model": "gpt-4.1-mini",
  "tokensUsed": 500
}
```

#### List Files
```http
GET /.netlify/functions/listFiles
```

**Response:**
```json
{
  "success": true,
  "documents": [
    {
      "id": "uuid",
      "filename": "document.pdf",
      "type": ".pdf",
      "size": 1024000,
      "pageCount": 10,
      "uploadDate": "2025-01-15T10:30:00.000Z",
      "textLength": 15000
    }
  ],
  "total": 1
}
```

#### Delete File
```http
DELETE /.netlify/functions/deleteFile
Content-Type: application/json
```

**Body:**
```json
{
  "fileId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully",
  "filename": "document.pdf"
}
```

## 🎨 UI Components

### Key Components

- **Header**: Navigation with theme toggle and mobile menu
- **FileUpload**: Drag-and-drop file upload with progress tracking
- **ChatInterface**: Real-time chat with markdown rendering
- **DocumentList**: Document management with delete functionality
- **StatsCard**: Dashboard statistics display
- **MainLayout**: Consistent layout across pages

### Custom Hooks

- **useChat**: Manages chat state and message operations
- **useDocuments**: Manages document state and operations
- **useTheme**: Manages theme switching

## 🔒 Security

- API keys are never exposed to the client
- File uploads are validated for type and size
- Input sanitization prevents XSS attacks
- CORS configured for Netlify Functions
- Environment-specific configurations

## 🐛 Troubleshooting

### Common Issues

**Issue**: Upload fails with "Invalid file type"
- **Solution**: Ensure you're uploading PDF, DOCX, or TXT files

**Issue**: AI responses are slow
- **Solution**: Check your OpenAI API quota and rate limits

**Issue**: Documents not persisting
- **Solution**: In production, files are stored in Netlify Functions. This is expected behavior.

**Issue**: Build fails on Netlify
- **Solution**: Ensure all environment variables are set in Netlify dashboard

## 🚧 Future Improvements

- [ ] User authentication and accounts
- [ ] Vector database for better semantic search
- [ ] Chat history persistence in database
- [ ] Multiple document comparison
- [ ] Flashcard generation
- [ ] Quiz generation
- [ ] Study schedule integration
- [ ] Export chat as PDF
- [ ] Voice input/output
- [ ] Mobile app (React Native)


