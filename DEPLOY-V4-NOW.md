# 🚀 Deploy Reflect V4 to Vercel - Step by Step

## ✅ Prerequisites Checklist

- [x] V4 code pushed to GitHub ✅
- [x] Production build successful ✅
- [x] All tests passed ✅
- [ ] Vercel account ready
- [ ] Groq API key ready

---

## 🎯 Deployment Options

### Option 1: Deploy via Vercel Dashboard (Recommended for First Time)

#### Step 1: Go to Vercel
1. Visit: https://vercel.com
2. Sign in with GitHub
3. Click **"Add New Project"**

#### Step 2: Import Repository
1. Select your GitHub repository: `aymandwidar/reflect-pwa-v2`
2. Click **"Import"**

#### Step 3: Configure Build Settings
```
Framework Preset: Other
Build Command: npm run build:v4
Output Directory: dist-v4
Install Command: npm install
Node Version: 18.x
```

#### Step 4: Environment Variables (Optional)
Add these if you want error tracking:
```
VITE_ENCRYPTION_KEY=your_32_character_random_key_here
VITE_SENTRY_DSN=your_sentry_dsn (optional)
VITE_POSTHOG_KEY=your_posthog_key (optional)
```

**Note:** API keys are entered by users in the app, not in environment variables!

#### Step 5: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Get your live URL!

---

### Option 2: Deploy via Vercel CLI (Quick)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy V4
```bash
# From project root
vercel --prod
```

When prompted:
- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No (first time) or Yes (subsequent)
- **Project name?** reflect-pwa-v4
- **Directory?** ./
- **Override settings?** Yes
  - **Build Command:** `npm run build:v4`
  - **Output Directory:** `dist-v4`
  - **Development Command:** `npm run dev:v4`

#### Step 4: Wait for Deployment
```
✓ Production: https://reflect-pwa-v4.vercel.app [2m]
```

---

## 🧪 Post-Deployment Testing

### 1. Open Your Deployment URL
Visit the URL Vercel provides (e.g., `https://reflect-pwa-v4.vercel.app`)

### 2. Test Core Features
- [ ] Page loads correctly
- [ ] No console errors (F12 → Console)
- [ ] Settings tab accessible
- [ ] Can add API key
- [ ] API key saves (check encrypted in Firestore)

### 3. Test Security Features
- [ ] Session timeout setting visible
- [ ] High contrast mode works
- [ ] Text size changes work
- [ ] Dyslexia font toggles

### 4. Test Accessibility
- [ ] Tab through navigation (keyboard only)
- [ ] Press Ctrl+K (should focus chat input)
- [ ] Press Ctrl+M (should go to mood)
- [ ] Press Ctrl+S (should go to settings)
- [ ] Press Escape (should close modals)

### 5. Test Crisis Detection
- [ ] Type "I want to hurt myself" in chat
- [ ] Crisis modal should appear
- [ ] Emergency numbers visible
- [ ] Can close modal

### 6. Test AI Chat (After Adding API Key)
- [ ] Add Groq API key in Settings
- [ ] Save settings
- [ ] Go to Chat tab
- [ ] Send a message
- [ ] AI responds

---

## 🔧 Troubleshooting

### Build Fails
**Error:** "Command failed: npm run build:v4"

**Solution:**
1. Check build command is exactly: `npm run build:v4`
2. Check output directory is: `dist-v4`
3. Check Node version is: 18.x

### Page Shows 404
**Error:** "404 - This page could not be found"

**Solution:**
1. Verify output directory is `dist-v4`
2. Check that `dist-v4/index.html` exists
3. Redeploy with correct settings

### API Key Not Saving
**Error:** "Failed to save settings"

**Solution:**
1. Check Firebase configuration in index-v4.html
2. Verify Firestore rules allow writes
3. Check browser console for errors

### Session Timeout Not Working
**Error:** "No timeout warning appears"

**Solution:**
1. Set timeout to 2 minutes for testing
2. Wait without interaction
3. Warning should appear at 0 minutes left
4. Auto-logout should happen after 2 minutes

---

## 🎯 Custom Domain (Optional)

### Add Custom Domain in Vercel

1. Go to your project in Vercel
2. Click **"Settings"** → **"Domains"**
3. Add your domain (e.g., `reflect-v4.yourdomain.com`)
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic)

---

## 📊 Monitor Your Deployment

### Vercel Analytics (Free)
1. Go to your project in Vercel
2. Click **"Analytics"** tab
3. View:
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics

### Check Logs
1. Go to your project in Vercel
2. Click **"Deployments"** tab
3. Click on latest deployment
4. View **"Build Logs"** and **"Function Logs"**

---

## 🔐 Security Checklist

After deployment, verify:
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] API keys encrypted in Firestore
- [ ] No API keys in source code
- [ ] No API keys in environment variables (users enter them)
- [ ] Session timeout working
- [ ] Crisis detection active

---

## 🆘 Emergency Rollback

If V4 has issues, V3 is still running!

**V3 URL:** Your existing V3 deployment  
**V4 URL:** New V4 deployment

Both can run simultaneously. Users can access either version.

---

## ✅ Deployment Success Checklist

- [ ] Build successful on Vercel
- [ ] Live URL accessible
- [ ] No console errors
- [ ] Settings save correctly
- [ ] API key encryption working
- [ ] Session timeout functional
- [ ] Accessibility features work
- [ ] Crisis detection triggers
- [ ] Keyboard shortcuts work
- [ ] Mobile responsive

---

## 🎉 You're Live!

Once deployed, share your V4 URL:
- **Production URL:** `https://reflect-pwa-v4.vercel.app`
- **Custom Domain:** `https://your-domain.com` (if configured)

### Share With Users
```
🎉 Reflect V4 is now live!

✨ New Features:
🔐 Enhanced Security (encrypted API keys)
♿ Full Accessibility (WCAG 2.1 AA)
🆘 Crisis Detection (automatic safety)
⌨️ Keyboard Navigation (complete control)

Try it now: [Your V4 URL]
```

---

## 📞 Need Help?

### Vercel Support
- Documentation: https://vercel.com/docs
- Support: https://vercel.com/support

### V4 Documentation
- START-HERE-V4.md
- README-V4.md
- V4-QUICK-START.md

---

## 🔄 Continuous Deployment

Vercel automatically redeploys when you push to GitHub!

```bash
# Make changes to V4
git add .
git commit -m "Update V4 feature"
git push origin main

# Vercel automatically rebuilds and deploys!
```

---

**V4: Security First, Accessibility Always** 🛡️♿

**Status:** 🟢 **READY TO DEPLOY**

🚀 **Let's go live!**
