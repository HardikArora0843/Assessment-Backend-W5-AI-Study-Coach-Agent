# 🤖 AI Study Coach

An AI-powered study assistant that enables students and self-learners to upload their study materials and ask questions about them. The application combines personal study documents with AI-powered explanations to make revision, concept clarification, and technical interview preparation more effective.

---

## 🎯 Who Is It For?

AI Study Coach is designed for:

- Computer Science and Engineering students
- Self-learners preparing for technical subjects
- Students revising lecture notes
- Job seekers preparing for technical interviews
- Anyone who wants AI-assisted learning using their own study material

---

## ✨ Features

### 📚 Study Material Management

- Upload study documents
- View uploaded study materials
- Delete study documents
- Use personal notes as the knowledge source

### 🧠 AI-Powered Study Assistance

- Ask questions about uploaded study material
- Receive AI-generated explanations
- Ask follow-up questions
- Learn technical concepts in simple language
- Get context-aware responses based on available study resources

### ⚡ Serverless Backend

The application uses Netlify Serverless Functions for:

- AI question answering
- File uploads
- File listing
- File deletion
- Health monitoring

### 🌐 Production Ready

- Netlify deployment support
- Vite production builds
- Environment-based configuration
- Serverless API architecture

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

## Deployment

- Netlify

---

# 🏗️ Architecture

```text
                    ┌───────────────────┐
                    │       User        │
                    │                   │
                    │ Upload Material   │
                    │ Ask Questions     │
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
                    │ Netlify Functions │
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
        │ MongoDB Storage │       │ Language Model  │
        └─────────────────┘       └────────┬────────┘
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │ AI Study Answer │
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

### Step 1 – Upload Study Material

Users upload their study documents through the application.

Example study materials:

```text
DBMS Notes
Java Notes
Operating Systems Notes
Computer Networks Notes
```

The uploaded material becomes the knowledge source for future questions.

---

### Step 2 – Ask a Question

Users ask questions related to the uploaded study material.

Example:

```text
Explain normalization in DBMS in simple terms.
```

---

### Step 3 – AI Processing

The frontend sends the request to the backend.

The `ask.js` Netlify Function communicates with OpenRouter to generate a response.

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
OpenRouter AI
      │
      ▼
Generated Answer
      │
      ▼
React Frontend
```

---

### Step 4 – Study Response

The generated answer is displayed to the user.

The goal is to provide useful explanations for learning, revision, and interview preparation.

---

# ⚙️ Installation

## Prerequisites

Install the following:

- Node.js (18 or later)
- npm
- Git
- MongoDB database
- OpenRouter API Key

---

## Clone Repository

```bash
git clone https://github.com/HardikArora0843/Assessment-Backend-W5-AI-Study-Coach-Agent.git
```

Move into the project directory.

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

Create a `.env` file and configure the required environment variables.

```env
OPENROUTER_API_KEY=your_openrouter_api_key
MONGODB_URI=your_mongodb_connection_string
```

Replace the placeholder values with your own credentials.

Do **not** commit sensitive information to GitHub.

---

# 🚀 Run the Project

Start the development server.

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`) in your browser.

---

# 📦 Production Build

Create a production build.

```bash
npm run build
```

Preview the production build.

```bash
npm run preview
```

---

# ☁️ Deployment

The application is configured for Netlify deployment.

Deployment workflow:

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
Vite Build
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

---

# 💡 Usage Example

### Example Workflow

1. Launch the application.
2. Upload a study document.
3. Wait for the upload to complete.
4. Enter a study-related question.
5. Click **Ask**.
6. Read the AI-generated response.

Example question:

```text
Explain normalization in DBMS.
```

---

# 📊 v2 Evaluation Results

| Test Case | Expected Result | Actual Result | Status |
|------------|----------------|---------------|--------|
| Upload study material | File uploads successfully | Passed | ✅ |
| List uploaded files | Files displayed correctly | Passed | ✅ |
| Delete uploaded file | Selected file removed | Passed | ✅ |
| Ask study-related question | AI generates response | Passed | ✅ |
| Empty question submission | Validation prevents request | Passed | ✅ |
| Health endpoint | Returns application status | Passed | ✅ |
| Invalid request handling | Error handled gracefully | Passed | ✅ |

---

# 🧩 Design Decisions

### Serverless Backend

Netlify Functions were chosen to simplify deployment and remove the need to manage a dedicated backend server.

### OpenRouter API

OpenRouter provides a single API interface to modern language models, making the application flexible and easier to extend.

### React + Vite

React with Vite provides a fast development experience and lightweight frontend performance.

---

# ⚠️ Current Limitations

- Requires an active internet connection.
- Depends on OpenRouter API availability.
- Response quality depends on the uploaded study material.
- Large documents may increase processing time.
- Only supported document formats can be uploaded.
- AI-generated responses may occasionally contain inaccuracies and should be verified against trusted study resources.

---

# 🔮 Future Improvements

### Learning Features

- Flashcard generation
- Quiz mode
- MCQ generation
- Coding question generation
- Spaced repetition

### Personalization

- Learning history
- Weak topic detection
- Personalized study plans
- Progress tracking dashboard

### Knowledge Retrieval

- Better document chunking
- Semantic search improvements
- Source citations
- Multiple knowledge bases

### Multimodal Support

- Voice interaction
- Image-based questions
- Diagram explanations
- Additional document formats

---

# 🎯 Use Cases

- Technical exam preparation
- Interview preparation
- Revision using personal notes
- Learning difficult concepts
- Question answering from uploaded study material
- Quick concept explanations

---

# 🔒 Security

Sensitive information is stored using environment variables.

Never commit:

```text
API Keys
Database Credentials
Authentication Secrets
Private Tokens
```

---

# 📌 Project Status

```text
Project            : AI Study Coach
Frontend           : React + Vite
Backend            : Netlify Functions
AI Integration     : OpenRouter API
Database           : MongoDB
Deployment         : Netlify
Status             : MVP Complete
```

---

# 🌐 Live Demo

**Application:** https://ai-study-coach-agent.netlify.app/

**Repository:** https://github.com/HardikArora0843/Assessment-Backend-W5-AI-Study-Coach-Agent

**Demo Video:** *(Add the unlisted YouTube link after recording the assignment demo.)*

---

# 👨‍💻 Author

**Hardik Arora**
````
