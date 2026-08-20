# 🤖 AI Study Coach

An AI-powered study assistant that lets you upload your study materials and ask questions about them. The application is designed to make technical learning easier by combining personal study documents with AI-powered explanations.

---

## ✨ Features

### 📚 Study Material Management

- Upload study documents
- View available study materials
- Delete uploaded documents
- Use personal notes and study resources as the knowledge source

### 🧠 AI-Powered Study Assistance

- Ask questions about uploaded study material
- Get clear explanations of technical concepts
- Ask follow-up questions
- Generate study-focused responses using the available knowledge context

### ⚡ Serverless Backend

The application uses serverless functions for backend operations, including:

- AI question answering
- File uploads
- File listing
- File deletion
- Application health checks

### 🌐 Production Deployment

The application is configured for deployment with Netlify and supports:

- Vite production builds
- Netlify Functions
- Environment-based configuration
- Serverless API endpoints

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- JavaScript
- CSS

## Backend

- Node.js
- Netlify Functions

## AI

- OpenRouter API

## Database / Storage

- MongoDB
- Study document storage

## Deployment

- Netlify

---

# 🏗️ Architecture

```text
                    ┌───────────────────┐
                    │       User        │
                    │                   │
                    │  Upload Material  │
                    │  Ask Questions    │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │   React Frontend  │
                    │      + Vite       │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │  Netlify Functions│
                    │                   │
                    │ ask.js            │
                    │ upload.js         │
                    │ listFiles.js      │
                    │ deleteFile.js     │
                    │ health.js         │
                    └─────────┬─────────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
                 ▼                         ▼
        ┌─────────────────┐       ┌─────────────────┐
        │ Study Materials │       │  OpenRouter AI  │
        │                 │       │                 │
        │ MongoDB / Files │       │ AI Processing   │
        └─────────────────┘       └────────┬────────┘
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │ Generated Study │
                                  │     Answer      │
                                  └─────────────────┘
```

---

# 📁 Project Structure

```text
AI-Study-Coach-Agent/
│
├── functions/
│   ├── ask.js
│   ├── deleteFile.js
│   ├── health.js
│   ├── listFiles.js
│   └── upload.js
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
│
├── public/
│
├── package.json
├── netlify.toml
├── vite.config.js
├── index.html
└── README.md
```

---

# 🔄 How It Works

The application follows a simple study workflow.

## 1. Upload Study Material

The user uploads a study document through the application.

Examples:

```text
DBMS Notes
Java Notes
Operating Systems Notes
Computer Networks Notes
```

The uploaded material becomes available to the application.

---

## 2. Ask a Question

The user can ask a question related to the available study material.

Example:

```text
Explain normalization in DBMS in simple terms.
```

---

## 3. Backend Processing

The frontend sends the question to the backend.

The `ask.js` serverless function handles the request and communicates with the configured AI service.

```text
User Question
      │
      ▼
React Frontend
      │
      ▼
ask.js
      │
      ▼
OpenRouter
      │
      ▼
AI Response
      │
      ▼
React Frontend
```

---

## 4. Study Response

The generated response is returned to the frontend and displayed to the user.

The goal is to provide explanations that are useful for learning, revision, and technical interview preparation.

---

# ⚙️ Installation

## Prerequisites

Make sure the following are installed:

- Node.js 18+
- npm
- Git

You also need access to the external services used by the application.

---

## Clone the Repository

```bash
git clone https://github.com/HardikArora0843/Assessment-Backend-W5-AI-Study-Coach-Agent.git
```

Navigate into the project:

```bash
cd Assessment-Backend-W5-AI-Study-Coach-Agent
```

---

## Install Dependencies

```bash
npm install
```

---

# 🔐 Environment Variables

Create the required environment configuration for the project.

Example:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
MONGODB_URI=your_mongodb_connection_string
```

Do not commit real credentials to GitHub.

For production deployments, configure sensitive values through the hosting platform's environment-variable settings.

> Use the exact environment variable names expected by the current source code.

---

# 🚀 Run Locally

Start the development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

Open that URL in your browser.

---

# 📦 Production Build

Create a production build with:

```bash
npm run build
```

The command runs the Vite production build and generates the `dist` directory.

To preview the production build locally:

```bash
npm run preview
```

---

# ☁️ Netlify Deployment

The project is configured for Netlify deployment.

A production deployment follows this process:

```text
Git Repository
      │
      ▼
Install Dependencies
      │
      ▼
npm run build
      │
      ▼
Vite Production Build
      │
      ▼
Bundle Netlify Functions
      │
      ▼
Deploy
      │
      ▼
Live Application
```

The backend functions are packaged automatically from the `functions` directory.

---

# 🔌 Serverless Functions

## `ask.js`

Handles user study questions and the AI response workflow.

---

## `upload.js`

Handles study document uploads.

---

## `listFiles.js`

Retrieves the available study documents.

---

## `deleteFile.js`

Handles deletion of study documents.

---

## `health.js`

Provides an application health/status check.

---

# 💡 Example Questions

The Study Coach can be used for questions such as:

```text
Explain normalization in DBMS.
```

```text
What is the difference between a process and a thread?
```

```text
Explain polymorphism in Java with an example.
```

```text
What is the difference between TCP and UDP?
```

```text
What are the necessary conditions for deadlock?
```

```text
Explain the OSI model in simple terms.
```

---

# 🎯 Use Cases

The application can be used for:

- Technical exam preparation
- Interview preparation
- Revision of lecture notes
- Understanding difficult concepts
- Question answering from personal study material
- Quick explanations of technical topics

---

# 🔒 Security

The application uses environment variables for sensitive configuration.

Never commit:

```text
API keys
Database passwords
Authentication secrets
Private credentials
```

Sensitive configuration should be stored securely in environment variables.

---

# ⚠️ Known Limitations

The current version focuses on the core study-assistance workflow.

Potential improvements include:

- Flashcard generation
- Dedicated quiz mode
- Practice-question generation
- Study progress tracking
- Personalized learning recommendations
- Voice interaction
- Multi-language support
- PDF annotation
- Advanced retrieval
- Additional knowledge-source integrations
- Frontend bundle optimization

---

# 🔮 Future Improvements

Possible future development directions include:

### 📖 Better Learning Tools

- Automatic flashcards
- MCQ generation
- Coding-question generation
- Spaced-repetition support

### 🧠 Personalization

- Learning history
- Weak-topic detection
- Personalized study plans
- Progress analytics

### 🔎 Improved Knowledge Retrieval

- More advanced semantic search
- Better document chunking
- Source references in responses
- Multiple knowledge bases

### 🎙️ Multimodal Learning

- Voice questions
- Image-based questions
- Diagram explanations
- Additional document formats

---

# 📊 Project Status

```text
Application       : AI Study Coach
Frontend          : React + Vite
Backend           : Netlify Functions
AI Integration    : OpenRouter
Database/Storage  : MongoDB
Deployment        : Netlify
Status            : MVP Complete
```

---

# 👨‍💻 Author

**Hardik Arora**
