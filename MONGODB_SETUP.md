# MongoDB Setup Guide

This guide will help you set up MongoDB for persistent file storage in your AI Study Coach Agent.

## What is MongoDB?

MongoDB is a popular NoSQL database that provides:
- Persistent document storage
- Scalable architecture
- Free tier (MongoDB Atlas)
- Rich query capabilities
- Perfect for storing document metadata and content

## Setup Steps

### 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new project
4. Create a new cluster (free tier M0)

### 2. Get Connection String

1. In MongoDB Atlas, go to **Database → Connect**
2. Choose **Connect your application**
3. Select **Node.js** and version **6.0 or later**
4. Copy the connection string

Your connection string will look like:
```
mongodb+srv://username:password@cluster.mongodb.net/study-coach?retryWrites=true&w=majority
```

### 3. Set Environment Variables

In your Netlify dashboard → Site settings → Environment variables, add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/study-coach?retryWrites=true&w=majority
```

**Important:** Replace `username` and `password` with your actual MongoDB credentials.

### 4. Configure Network Access

1. In MongoDB Atlas, go to **Network Access**
2. Add IP address: `0.0.0.0/0` (allows access from anywhere)
3. This is required for Netlify Functions to access your database

### 5. Configure Database Access

1. In MongoDB Atlas, go to **Database Access**
2. Create a database user with read/write permissions
3. Use these credentials in your connection string

## Database Structure

The application uses a single collection:

**Collection:** `documents`

**Document Schema:**
```javascript
{
  _id: ObjectId,
  id: String (UUID),
  filename: String,
  type: String (.pdf, .docx, .txt),
  size: Number,
  extractedText: String,
  pageCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## How It Works

### Storage Structure

Documents are stored in MongoDB with the following structure:

```
Database: study-coach
Collection: documents
Documents: Each uploaded document as a separate document
```

### Key Operations

**Upload:**
- Extract text from uploaded file
- Store metadata and content in MongoDB
- Return document ID for future reference

**List Files:**
- Query all documents from MongoDB
- Return metadata only (not full text content)

**Ask Question:**
- Retrieve all documents with content
- Prepare context for AI processing
- Return AI-generated answer

**Delete File:**
- Remove document from MongoDB by ID
- Return success confirmation

## Benefits of MongoDB

✅ **Persistent Storage** - Data persists permanently
✅ **Scalable** - Handles growth automatically
✅ **Free Tier** - 512MB storage available
✅ **Rich Queries** - Powerful query capabilities
✅ **Flexible Schema** - Easy to modify structure
✅ **Industry Standard** - Widely used in production

## Troubleshooting

### Issue: "MongoDB connection failed"

**Solution:** 
- Verify MONGODB_URI is set correctly in Netlify environment variables
- Check network access allows 0.0.0.0/0
- Verify database user has correct permissions
- Check connection string format

### Issue: "Authentication failed"

**Solution:**
- Verify username and password in connection string
- Ensure database user exists in MongoDB Atlas
- Check user has read/write permissions

### Issue: "Timeout connecting to database"

**Solution:**
- Check network access settings
- Verify cluster is running in MongoDB Atlas
- Check for any IP whitelisting issues

## Monitoring

You can monitor your MongoDB usage:

1. Go to MongoDB Atlas dashboard
2. View database metrics
3. Monitor storage usage
4. Check query performance

## Cost

- **Free Tier:** 512MB storage, shared RAM
- **Paid Plans:** Available if you need more storage

For most student projects and MVPs, the free tier is sufficient.

## Security Best Practices

1. **Never commit credentials** - Keep MongoDB URI in environment variables
2. **Use strong passwords** - Create strong database user passwords
3. **Limit network access** - Use specific IP addresses when possible
4. **Regular backups** - Enable automated backups in MongoDB Atlas
5. **Monitor usage** - Keep an eye on storage and performance metrics

## Next Steps

Once MongoDB is set up:

1. Test file upload functionality
2. Verify AI chat works with uploaded content
3. Test file deletion
4. Monitor database usage in MongoDB Atlas

## Connection String Example

Your final MONGODB_URI should look like:
```
mongodb+srv://studycoach_user:securePassword@cluster0.abcde.mongodb.net/study-coach?retryWrites=true&w=majority
```

Replace:
- `studycoach_user` with your database username
- `securePassword` with your database password
- `cluster0.abcde` with your cluster name

---

Your AI Study Coach Agent now has robust MongoDB storage! 🎉
