# 🚀 Deploy V5 as Separate Project

## 🎯 Goal

Keep V4 running at its current URL and deploy V5 to a new URL.

**Result:**
- **V4:** https://reflect-v3.vercel.app (unchanged)
- **V5:** https://reflect-v5.vercel.app (new)

---

## 📋 Step-by-Step Deployment

### **Step 1: Go to Vercel Dashboard**

Visit: https://vercel.com/dashboard

### **Step 2: Create New Project**

1. Click **"Add New..." → "Project"**
2. Click **"Import"** next to your repository: `aymandwidar/reflect-pwa-v2`

### **Step 3: Configure Project**

**Important Settings:**

```
Project Name: reflect-v5
(or reflect-pwa-v5, or any name you prefer)

Root Directory: ./ (leave empty or use dot)

Framework Preset: Other

Build Command: npm run build:v5

Output Directory: dist-v5

Install Command: npm install

Node Version: 18.x
```

### **Step 4: Deploy**

Click **"Deploy"** button and wait 2-3 minutes.

---

## ✅ **Verification**

Once deployed, you'll get a URL like:
- `https://reflect-v5.vercel.app`
- `https://reflect-v5-[your-username].vercel.app`
- `https://reflect-pwa-v5.vercel.app`

### **Check It's V5:**
1. Visit the new URL
2. Header should say **"Reflect V5"**
3. Subtitle: **"Intelligence Meets Connection"**
4. Should have **11 tabs** (including 🧠 Insights and 👥 Community)
5. Settings should have **Custom Themes** section
6. Journal should have **AI Writing Prompt** at top

---

## 📊 **Your URLs After Deployment**

| Version | URL | Status |
|---------|-----|--------|
| **V3** | https://reflect-v3.vercel.app | ✅ Original |
| **V4** | https://reflect-v3.vercel.app | ✅ Current (same URL) |
| **V5** | https://reflect-v5.vercel.app | 🆕 New! |

---

## 🔧 **Alternative: Use Vercel CLI**

If you prefer command line:

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login
vercel login

# Deploy V5 as new project
vercel --prod --name reflect-v5

# When prompted:
# - Build Command: npm run build:v5
# - Output Directory: dist-v5
```

---

## 🎨 **Custom Domain (Optional)**

After deployment, you can add a custom domain:

1. Go to your V5 project in Vercel
2. Click **"Settings"** → **"Domains"**
3. Add domain like: `v5.yourdomain.com` or `reflect-v5.yourdomain.com`
4. Follow DNS configuration instructions

---

## 🧪 **Test Both Versions**

### **Test V4:**
Visit: https://reflect-v3.vercel.app
- Should show "Reflect V4"
- 9 tabs
- No Insights or Community tabs

### **Test V5:**
Visit: https://reflect-v5.vercel.app (your new URL)
- Should show "Reflect V5"
- 11 tabs
- Has Insights 🧠 and Community 👥 tabs
- Has Custom Themes in Settings
- Has AI Prompts in Journal

---

## 📝 **Important Notes**

### **Both Versions Will:**
- ✅ Use the same Firebase database
- ✅ Share the same user data
- ✅ Work independently
- ✅ Have separate URLs
- ✅ Auto-deploy on git push (if configured)

### **Data Sharing:**
- User settings are version-specific (V4 settings vs V5 settings)
- Mood logs, journal entries, etc. are shared
- API keys are shared (encrypted)
- Custom themes are V5-only

---

## 🔄 **Continuous Deployment**

### **For V4:**
- Vercel watches `main` branch
- Uses `vercel.json` (configured for V4)
- Auto-deploys to https://reflect-v3.vercel.app

### **For V5:**
- Create separate Vercel project
- Also watches `main` branch
- Uses build settings from project config
- Auto-deploys to https://reflect-v5.vercel.app

---

## 🐛 **Troubleshooting**

### **Build Fails**
- Check build command is exactly: `npm run build:v5`
- Check output directory is: `dist-v5`
- Check Node version is: 18.x

### **Wrong Version Deployed**
- Verify project name is different from V4 project
- Check build command in project settings
- Redeploy with correct settings

### **Can't Find New Project**
- Check Vercel dashboard for all projects
- Look for project named `reflect-v5` or similar
- Check deployment logs for errors

---

## ✅ **Success Checklist**

- [ ] Created new Vercel project
- [ ] Named it differently (e.g., reflect-v5)
- [ ] Set build command to `npm run build:v5`
- [ ] Set output directory to `dist-v5`
- [ ] Deployment successful
- [ ] New URL accessible
- [ ] Shows "Reflect V5" in header
- [ ] Has 11 tabs (including Insights & Community)
- [ ] V4 still works at old URL

---

## 🎉 **You're Done!**

Once complete, you'll have:
- ✅ **V4** running at original URL
- ✅ **V5** running at new URL
- ✅ Both versions working independently
- ✅ Users can choose which version to use

---

## 📞 **Need Help?**

If you encounter issues:
1. Check Vercel deployment logs
2. Verify build settings
3. Test local build: `npm run build:v5`
4. Check browser console for errors

---

**V5: Intelligence Meets Connection** 🤖🤝

**Status:** 🟢 Ready to Deploy as Separate Project

🚀 **Follow the steps above to deploy V5!**
