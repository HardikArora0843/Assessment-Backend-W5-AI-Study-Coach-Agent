# Netlify Blobs Setup Guide

This guide will help you set up Netlify Blobs for persistent file storage in your AI Study Coach Agent.

## What is Netlify Blobs?

Netlify Blobs is a serverless object storage service that works seamlessly with Netlify Functions. It provides:
- Persistent file storage
- Easy API integration
- Free tier (1GB storage)
- Perfect for file uploads and data storage

## Setup Steps

### 1. Enable Netlify Blobs for Your Site

1. Go to your Netlify dashboard
2. Select your site
3. Navigate to **Site settings → Functions → Blobs**
4. Click **"Enable Blobs"**
5. Note the **Store ID** (or use the default)

### 2. Update Environment Variables

In your Netlify dashboard → Site settings → Environment variables, add:

```
NETLIFY_BLOBS_STORE_ID=study-coach-uploads
```

**Note:** The `NETLIFY_SITE_ID` and `NETLIFY_ACCESS_TOKEN` are automatically provided by Netlify during function execution, so you don't need to set them manually.

### 3. Deploy Your Updated Code

The code has been updated to use Netlify Blobs instead of file-based storage. Commit and push the changes:

```bash
git add .
git commit -m "Implement Netlify Blobs for persistent storage"
git push
```

### 4. Verify the Deployment

After deployment, test the functionality:

1. **Upload a file** - It should be stored in Netlify Blobs
2. **List files** - You should see your uploaded documents
3. **Ask a question** - The AI should access the content from Blobs
4. **Delete a file** - It should be removed from Blobs

## How It Works

### Storage Structure

Files are stored in Netlify Blobs with the following structure:

```
knowledge/
  ├── {fileId}.json  (metadata and extracted text)
```

### Key Changes from File-Based Storage

**Before (File-based):**
```javascript
await fs.writeFile('uploads/file.pdf', buffer);
await fs.readJson('knowledge/file.json');
```

**After (Netlify Blobs):**
```javascript
await store.set('knowledge/fileId.json', jsonString);
const data = await store.get('knowledge/fileId.json');
```

## Benefits of Netlify Blobs

✅ **Persistent Storage** - Files persist between function invocations
✅ **Scalable** - Handles growth automatically
✅ **Secure** - Built-in security features
✅ **Fast** - Optimized for Netlify Functions
✅ **Free Tier** - 1GB storage available
✅ **Easy Integration** - Simple API

## Troubleshooting

### Issue: "Store not found" error

**Solution:** Make sure you've enabled Blobs in your Netlify dashboard and set the `NETLIFY_BLOBS_STORE_ID` environment variable.

### Issue: Files not persisting

**Solution:** Verify that:
1. Blobs is enabled in your Netlify dashboard
2. Environment variables are set correctly
3. The deployment has completed successfully

### Issue: Upload succeeds but content not accessible

**Solution:** Check the function logs in Netlify dashboard for any errors during the upload process.

## Monitoring

You can monitor your Blobs usage:

1. Go to Netlify dashboard → Site settings → Functions → Blobs
2. View storage usage and file count
3. Monitor performance metrics

## Cost

- **Free Tier:** 1GB storage, 1GB bandwidth per month
- **Paid Plans:** Available if you need more storage

For most student projects and MVPs, the free tier is sufficient.

## Next Steps

Once Netlify Blobs is set up:

1. Test file upload functionality
2. Verify AI chat works with uploaded content
3. Test file deletion
4. Monitor storage usage in Netlify dashboard

## Support

If you encounter issues:

1. Check Netlify Blobs documentation: https://docs.netlify.com/functions/blobs/
2. Review function logs in Netlify dashboard
3. Verify environment variables are set correctly
4. Ensure your deployment is successful

---

Your AI Study Coach Agent now has persistent storage! 🎉
