# 🚀 Deploy V5 Manually (Workaround)

## Problem
Vercel is reading `vercel.json` which locks settings to V4.

## Solution
Deploy V5 using Vercel CLI with explicit settings.

---

## 📋 Step-by-Step

### **Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

### **Step 2: Login to Vercel**

```bash
vercel login
```

### **Step 3: Deploy V5 with Explicit Settings**

```bash
vercel --prod --name reflect-pwa-v5 --build-env VERCEL_BUILD_COMMAND="npm run build:v5" --build-env VERCEL_OUTPUT_DIRECTORY="dist-v5"
```

When prompted:
- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No
- **Project name?** reflect-pwa-v5
- **Directory?** ./
- **Override settings?** Yes
  - **Build Command:** `npm run build:v5`
  - **Output Directory:** `dist-v5`
  - **Development Command:** `npm run dev:v5`

---

## Alternative: Create vercel-v5-deploy.json

Or we can create a separate config file and use it:

```bash
vercel --prod --name reflect-pwa-v5 --local-config vercel-v5.json
```

---

## ✅ Expected Result

You'll get a URL like:
- `https://reflect-pwa-v5.vercel.app`
- `https://reflect-pwa-v5-[username].vercel.app`

---

## 🔄 After First Deployment

Once deployed via CLI, you can manage it in the Vercel dashboard and the settings will be saved to that project.
