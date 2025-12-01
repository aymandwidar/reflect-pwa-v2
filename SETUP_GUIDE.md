# Quick Setup Guide for Reflect PWA

## Step-by-Step Setup (5 minutes)

### Step 1: Firebase Setup (2 minutes)

1. Visit https://console.firebase.google.com/
2. Click "Add project" or select existing project
3. Enter project name: `reflect-pwa` (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Firestore (1 minute)

1. In Firebase Console, click "Firestore Database" in left menu
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select your region
5. Click "Enable"

### Step 3: Enable Authentication (1 minute)

1. Click "Authentication" in left menu
2. Click "Get started"
3. Click "Anonymous" provider
4. Toggle "Enable"
5. Click "Save"

### Step 4: Get Firebase Config (1 minute)

1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>`
5. Register app with nickname: "Reflect PWA"
6. Copy the `firebaseConfig` object

### Step 5: Update index.html

Open `index.html` and replace this section:

```javascript
window.__firebase_config = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

With your actual config from Step 4.

### Step 6: Set Firestore Security Rules

1. In Firebase Console, go to "Firestore Database"
2. Click "Rules" tab
3. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. Click "Publish"

### Step 7: Get AI API Keys

#### Groq (Required for Fast Response)
1. Visit https://console.groq.com/
2. Sign up/Login
3. Go to API Keys section
4. Create new key
5. Copy and save it

#### Deepseek (Required for Deep Think)
1. Visit https://platform.deepseek.com/
2. Sign up/Login
3. Go to API Keys
4. Create new key
5. Copy and save it

#### Gemini (Optional - for future features)
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Create API key
4. Copy and save it

### Step 8: Install and Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Step 9: Configure API Keys in App

1. App opens in browser
2. Click "Settings" tab
3. Enter your API keys:
   - Groq API Key (for Fast Response)
   - Deepseek API Key (for Deep Think)
   - Gemini API Key (optional)
4. Optionally enter your age
5. Click "Save Settings"

### Step 10: Test the App

1. Go to "CBT Coach" tab
2. Make sure "⚡ Fast Response" is selected
3. Type a message like: "I'm feeling anxious about work"
4. Press Send
5. You should get a response from the AI coach

6. Try "Mood Tracker" tab:
   - Select a mood emoji
   - Write why you feel that way
   - Click "Log Mood"
   - See it appear in history

## Troubleshooting

### "Failed to initialize app"
- Double-check Firebase config in `index.html`
- Make sure you copied the entire config object
- Check browser console (F12) for specific error

### "Groq API key not configured"
- Go to Settings tab
- Make sure you entered the Groq API key
- Click "Save Settings"
- Wait a moment for it to sync
- Try sending message again

### "API request failed"
- Check that your API key is valid
- Make sure you have credits/quota on the API service
- Check browser console for specific error message

### Messages not saving
- Check Firestore security rules are published
- Make sure Authentication is enabled
- Check browser console for Firestore errors

## Production Deployment

### Build for production:
```bash
npm run build
```

### Deploy to Vercel:
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy to Firebase Hosting:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Need Help?

Check the main README.md for more detailed information about:
- Architecture
- Data structure
- API integration
- Security considerations

Enjoy using Reflect! 🎉
