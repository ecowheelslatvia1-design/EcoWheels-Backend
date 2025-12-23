# Backend Deployment Guide

## Recommended Deployment Platforms

Based on your backend stack (Node.js/Express, MongoDB, Cloudinary), here are the best deployment options:

### 🥇 **Top Recommendation: Render**

**Why Render is best for your backend:**
- ✅ Free tier available (with limitations)
- ✅ Easy MongoDB Atlas integration
- ✅ Automatic HTTPS
- ✅ Simple deployment from GitHub
- ✅ Environment variables management
- ✅ Good for Node.js/Express apps
- ✅ Auto-deploy on git push

**Pricing:** Free tier (with sleep after 15min inactivity) or $7/month for always-on

**Setup Steps:**
1. Sign up at [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new "Web Service"
4. Select your backend repository
5. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
6. Add environment variables (see below)
7. Deploy!

---

### 🥈 **Alternative: Railway**

**Why Railway:**
- ✅ Very simple setup
- ✅ Free tier with $5 credit/month
- ✅ Easy MongoDB integration
- ✅ Auto-deploy from GitHub
- ✅ Good developer experience

**Pricing:** Pay-as-you-go, ~$5-10/month for small apps

**Setup Steps:**
1. Sign up at [railway.app](https://railway.app)
2. Create new project from GitHub
3. Add MongoDB service (or use MongoDB Atlas)
4. Add environment variables
5. Deploy!

---

### 🥉 **Alternative: Cyclic**

**Why Cyclic:**
- ✅ Very simple for Node.js apps
- ✅ Free tier available
- ✅ Automatic deployments
- ✅ Built-in database options

**Pricing:** Free tier available

---

## Required Setup Steps (For Any Platform)

### 1. **MongoDB Atlas Setup** (Required - Cloud Database)

Your backend uses MongoDB, so you need a cloud database:

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
2. Create a new cluster (choose free M0 tier)
3. Create a database user
4. Whitelist IP addresses (use `0.0.0.0/0` for Render/Railway)
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/cycle-ecommerce?retryWrites=true&w=majority
   ```

### 2. **Cloudinary Setup** (Already configured)

You're already using Cloudinary for images. Make sure you have:
- Cloud Name
- API Key
- API Secret

### 3. **Environment Variables**

Add these to your deployment platform:

```env
# Server
PORT=5000
NODE_ENV=production

# Database (MongoDB Atlas connection string)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cycle-ecommerce?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-very-secure-secret-key-change-this-in-production

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. **Update package.json (if needed)**

Your current setup looks good. Make sure you have:

```json
{
  "scripts": {
    "start": "node src/server.js"
  }
}
```

---

## Platform-Specific Configuration

### Render Configuration

Create `render.yaml` in your backend root (optional):

```yaml
services:
  - type: web
    name: ecowheel-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
```

### Railway Configuration

Railway auto-detects Node.js apps. No special config needed!

### Cyclic Configuration

Cyclic auto-detects Express apps. Just connect your repo!

---

## Deployment Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Database user created with proper permissions
- [ ] IP whitelist configured (0.0.0.0/0 for cloud platforms)
- [ ] Cloudinary credentials ready
- [ ] JWT_SECRET set to a secure random string
- [ ] Environment variables added to deployment platform
- [ ] Repository connected to deployment platform
- [ ] Build and start commands configured
- [ ] Health check endpoint tested (`/api/health`)
- [ ] CORS configured (already done in app.js)

---

## Post-Deployment

1. **Test the API:**
   ```bash
   curl https://your-app.onrender.com/api/health
   ```

2. **Update Frontend:**
   Update your frontend's `REACT_APP_API_URL` to point to your deployed backend:
   ```env
   REACT_APP_API_URL=https://your-app.onrender.com/api
   ```

3. **Monitor Logs:**
   - Render: Dashboard → Your Service → Logs
   - Railway: Deployments → View Logs
   - Cyclic: Dashboard → Logs

---

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error:**
   - Check MongoDB Atlas IP whitelist (add 0.0.0.0/0)
   - Verify connection string format
   - Check database user credentials

2. **Port Issues:**
   - Render/Railway provide PORT via environment variable
   - Your code already uses `process.env.PORT || 5000` ✅

3. **Build Failures:**
   - Check Node.js version (should be 14+)
   - Verify all dependencies in package.json
   - Check build logs for specific errors

4. **Environment Variables:**
   - Make sure all required vars are set
   - Check for typos in variable names
   - Restart service after adding new vars

---

## Cost Comparison

| Platform | Free Tier | Paid Tier | Best For |
|----------|-----------|-----------|----------|
| **Render** | ✅ (sleeps after 15min) | $7/mo | Best overall |
| **Railway** | ✅ ($5 credit/mo) | Pay-as-you-go | Simple setup |
| **Cyclic** | ✅ | Free for small apps | Very simple |
| **Heroku** | ❌ | $7/mo+ | Legacy choice |
| **DigitalOcean** | ❌ | $5/mo | Reliable |
| **AWS** | ❌ | Complex pricing | Enterprise |

---

## Recommendation Summary

**For your use case, I recommend Render because:**
1. Free tier to start
2. Easy MongoDB Atlas integration
3. Simple deployment process
4. Good documentation
5. Automatic HTTPS
6. Perfect for Node.js/Express apps

**Next Steps:**
1. Set up MongoDB Atlas (free)
2. Deploy to Render (free tier)
3. Configure environment variables
4. Test your API endpoints
5. Update frontend to use new API URL

---

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [Railway Documentation](https://docs.railway.app)
- [Cyclic Documentation](https://docs.cyclic.sh)







