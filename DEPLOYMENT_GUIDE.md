# 🚀 FitTracker Deployment Guide

This guide will help you deploy your FitTracker application to production using Render (backend) and Vercel (frontend).

## 📋 Prerequisites

- [GitHub](https://github.com/) account
- [Render](https://render.com/) account (for backend)
- [Vercel](https://vercel.com/) account (for frontend)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (for database)

## 🗄️ Step 1: Set Up MongoDB Atlas

1. **Create MongoDB Atlas Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster
   - Choose your preferred cloud provider and region
   - Create a database user with read/write permissions
   - Get your connection string

2. **Network Access**
   - Add `0.0.0.0/0` to IP Access List (allows connections from anywhere)
   - Or add specific IPs for better security

## 🔧 Step 2: Deploy Backend to Render

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Production ready for deployment"
   git push origin main
   ```

2. **Create Render Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Backend Service**
   - **Name**: `fit-tracker-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

4. **Environment Variables**
   Add these environment variables in Render:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/fit-tracker?retryWrites=true&w=majority
   SECRET_KEY=your-super-secret-jwt-key-at-least-32-characters-long
   FRONTEND_URL=https://your-app-name.vercel.app
   NODE_ENV=production
   PORT=4000
   RATE_LIMIT_MAX=100
   CORS_ORIGIN=https://your-app-name.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://fit-tracker-backend.onrender.com`)

## 🌐 Step 3: Deploy Frontend to Vercel

1. **Update Frontend Environment**
   - Create `.env.production` in frontend directory:
   ```
   VITE_BACKEND_URL=https://your-backend-url.onrender.com
   ```

2. **Deploy to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. **Environment Variables**
   Add in Vercel:
   ```
   VITE_BACKEND_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Copy your frontend URL

## 🔒 Step 4: Security & Production Settings

1. **Update Backend Environment**
   - Go back to Render
   - Update `FRONTEND_URL` with your actual Vercel domain
   - Update `CORS_ORIGIN` with your Vercel domain

2. **Generate Strong SECRET_KEY**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **MongoDB Security**
   - Use strong passwords
   - Consider IP restrictions for production
   - Enable MongoDB Atlas security features

## 🧪 Step 5: Testing Production

1. **Test Backend**
   - Visit your backend URL
   - Should see "Route not found" (404) - this is expected

2. **Test Frontend**
   - Visit your Vercel domain
   - Test login/registration
   - Test workout creation
   - Test calendar functionality

3. **Test Calendar Date Issue**
   - Create a workout from calendar
   - Verify it appears on the correct date

## 📊 Step 6: Monitoring & Maintenance

1. **Render Monitoring**
   - Check logs in Render dashboard
   - Monitor performance metrics
   - Set up alerts for downtime

2. **Vercel Analytics**
   - Enable Vercel Analytics
   - Monitor frontend performance
   - Check for errors

3. **MongoDB Monitoring**
   - Monitor database performance
   - Set up alerts for connection issues
   - Regular backups

## 🚨 Troubleshooting

### Backend Issues
- **Environment Variables**: Double-check all variables are set correctly
- **MongoDB Connection**: Verify connection string and network access
- **Port Issues**: Render automatically assigns ports

### Frontend Issues
- **API Calls**: Check browser console for CORS errors
- **Environment Variables**: Ensure `VITE_BACKEND_URL` is correct
- **Build Errors**: Check Vercel build logs

### Calendar Date Issues
- **Timezone**: Ensure dates are handled in local timezone
- **Date Format**: Verify YYYY-MM-DD format is maintained
- **Backend Processing**: Check backend date handling

## 🔄 Continuous Deployment

1. **Automatic Deployments**
   - Both Render and Vercel auto-deploy on git push
   - Ensure main branch is stable

2. **Environment Management**
   - Use different branches for staging/production
   - Test changes in staging first

3. **Database Migrations**
   - Test schema changes locally first
   - Backup production data before major changes

## 📈 Performance Optimization

1. **Backend**
   - Enable compression
   - Use CDN for static assets
   - Monitor database query performance

2. **Frontend**
   - Enable Vercel edge caching
   - Optimize bundle size
   - Use lazy loading for components

## 🎉 Success!

Your FitTracker application is now production-ready and deployed! Users can access it from anywhere in the world.

## 📞 Support

If you encounter issues:
1. Check Render and Vercel logs
2. Verify environment variables
3. Test locally with production environment
4. Check MongoDB Atlas connection

---

**Remember**: Always test thoroughly in staging before deploying to production!
