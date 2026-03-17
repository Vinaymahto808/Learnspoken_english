# SpeakEase - Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- [ ] OpenAI API Key configured
- [ ] Supabase project set up (already configured)
- [ ] GitHub repository (if using Vercel/Netlify)
- [ ] Domain name (optional)

## Environment Variables

Your production deployment needs these environment variables:

```env
VITE_SUPABASE_URL=https://epihcsxhtfzrvctqoknf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwaWhjc3hodGZ6cnZjdHFva25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MzczNjAsImV4cCI6MjA4OTMxMzM2MH0.DKt6O33NHw6x_R56a8wXoVeXgixnc3TPlRzZ3kkpLlU
VITE_OPENAI_API_KEY=your-openai-api-key-here
```

## Option 1: Deploy to Vercel

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/speakease.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables:
   - Click "Environment Variables"
   - Add all three variables from above
6. Click "Deploy"
7. Wait for deployment to complete
8. Your app will be live at `https://your-project.vercel.app`

### Step 3: Configure Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-30 minutes)

## Option 2: Deploy to Netlify

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/speakease.git
git push -u origin main
```

### Step 2: Deploy on Netlify
1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add Environment Variables:
   - Click "Show advanced"
   - Add all three variables
6. Click "Deploy site"
7. Wait for deployment
8. Your app will be live at `https://your-site.netlify.app`

### Step 3: Configure Custom Domain (Optional)
1. Go to Site settings → Domain management
2. Add custom domain
3. Follow DNS configuration instructions

## Option 3: Deploy to Your Own Server

### Requirements
- Ubuntu/Debian server
- Node.js 18+
- Nginx
- SSL certificate (Let's Encrypt)

### Step 1: Prepare Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

### Step 2: Clone and Build
```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/yourusername/speakease.git
cd speakease

# Install dependencies
sudo npm install

# Create .env file
sudo nano .env
# Add your environment variables

# Build
sudo npm run build
```

### Step 3: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/speakease
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/speakease/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/speakease /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 4: Set Up SSL
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Step 5: Set Up PM2 (for API server)
```bash
sudo npm install -g pm2
cd /var/www/speakease
pm2 start server.ts --name speakease-api
pm2 startup
pm2 save
```

## Post-Deployment Checklist

- [ ] Test Google OAuth login
- [ ] Verify OpenAI API is working
- [ ] Test speech recording and transcription
- [ ] Check all lessons load correctly
- [ ] Test daily challenge creation
- [ ] Verify leaderboard displays
- [ ] Test AI tutor chat
- [ ] Check mobile responsiveness
- [ ] Test on different browsers
- [ ] Monitor error logs
- [ ] Set up error tracking (optional: Sentry)
- [ ] Set up analytics (optional: Google Analytics)

## Monitoring

### Check Logs (Vercel)
1. Go to your project dashboard
2. Click "Logs" tab
3. Monitor real-time logs

### Check Logs (Netlify)
1. Go to site dashboard
2. Click "Logs" in sidebar
3. View deploy and function logs

### Check Logs (Own Server)
```bash
# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# PM2 logs
pm2 logs speakease-api
```

## Troubleshooting

### OAuth Redirect Issues
If Google login doesn't work after deployment:
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your production URL to "Redirect URLs"
3. Example: `https://your-domain.com/**`

### API Key Issues
If OpenAI API doesn't work:
1. Verify environment variable is set correctly
2. Check API key has no extra spaces
3. Ensure key starts with `sk-`
4. Verify you have API credits

### Build Failures
Common issues:
1. Missing dependencies: Run `npm install`
2. Type errors: Run `npm run lint`
3. Environment variables not set
4. Node version mismatch

### Performance Optimization

#### Enable Gzip Compression (Nginx)
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

#### Enable Caching (Nginx)
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Security Best Practices

1. **Never commit `.env` file to Git**
   ```bash
   # Add to .gitignore
   echo ".env" >> .gitignore
   ```

2. **Use HTTPS only**
   - Force HTTPS redirect in Nginx
   - Enable HSTS headers

3. **Rotate API Keys regularly**
   - Every 3-6 months
   - Immediately if compromised

4. **Monitor API usage**
   - Set up billing alerts in OpenAI
   - Monitor Supabase usage

5. **Rate limiting**
   - Implement in Nginx or application level
   - Prevent API abuse

## Cost Optimization

### OpenAI API
- Monitor daily usage in OpenAI dashboard
- Set spending limits
- Cache common responses (future enhancement)

### Supabase
- Free tier includes:
  - 500 MB database
  - 5 GB bandwidth
  - 50k monthly active users
- Monitor usage in Supabase dashboard

### Hosting
- Vercel: Free tier available
- Netlify: Free tier (100 GB bandwidth)
- Own server: ~$5-10/month (DigitalOcean, Linode)

## Backup Strategy

### Database Backups
Supabase automatically backs up your database daily.

Manual backup:
1. Go to Supabase Dashboard
2. Database → Backups
3. Create manual backup

### Code Backups
- Use Git for version control
- Push to GitHub regularly
- Tag releases: `git tag v1.0.0`

## Updates and Maintenance

### Updating the App
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Rebuild
npm run build

# Restart server (if using PM2)
pm2 restart speakease-api
```

### Database Migrations
If schema changes are needed:
1. Create migration in Supabase
2. Test in staging environment
3. Apply to production
4. Monitor for errors

## Scaling Considerations

As your user base grows:

1. **Database**: Upgrade Supabase plan
2. **CDN**: Use Cloudflare or similar
3. **Caching**: Implement Redis
4. **Load Balancing**: Use multiple servers
5. **API Rate Limiting**: Protect against abuse
6. **Background Jobs**: Queue speech processing

---

Congratulations! Your SpeakEase app is now deployed and ready for users!
