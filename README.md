# Reflect PWA - AI CBT Coach & Mood Tracker

A beautiful, mobile-first Progressive Web Application featuring multi-model AI integration (Groq, Deepseek, Gemini) for cognitive behavioral therapy coaching and mood tracking.

## Features

### 🧠 AI CBT Coach
- **Fast Response Mode** (Groq): Ultra-low latency conversational responses using Llama 3.1
- **Deep Think Mode** (Deepseek): High-quality reasoning for complex cognitive restructuring
- Real-time chat with persistent conversation history
- Socratic dialogue approach for guided self-reflection
- Session management with archive capability

### 😊 Mood Tracker
- Quick emotional state logging with 5 mood options
- Required context captions for each entry
- Visual history of last 20 mood logs
- Timestamp tracking for pattern analysis

### ⚙️ Settings & API Management
- Secure user-managed API keys for all three AI models
- Age tracking for personalized responses
- Real-time sync across devices via Firebase

### 🎨 Design
- Stunning glassmorphism UI with translucent elements
- Gradient backgrounds with frosted glass effects
- Fully responsive, mobile-first design
- Smooth animations and transitions

## Setup Instructions

### 1. Firebase Configuration

Before running the app, you need to set up Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Firestore Database**
4. Enable **Authentication** (Anonymous or Custom Token)
5. Get your Firebase config from Project Settings

### 2. Update Configuration

Edit `index.html` and replace the Firebase config:

```javascript
window.__app_id = 'reflect-pwa';
window.__firebase_config = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 3. Firestore Security Rules

Set up these security rules in Firebase Console:

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

### 4. Get API Keys

You'll need API keys from:

1. **Groq** (Fast Response): https://console.groq.com/
2. **Deepseek** (Deep Think): https://platform.deepseek.com/
3. **Gemini** (Optional/Future): https://makersuite.google.com/app/apikey

### 5. Install Dependencies

```bash
npm install
```

### 6. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 7. Add API Keys in App

1. Open the app
2. Navigate to **Settings** tab
3. Enter your API keys for Groq and Deepseek
4. Click **Save Settings**

## Usage

### CBT Coach
1. Go to **CBT Coach** tab
2. Toggle between **Fast Response** (⚡) and **Deep Think** (🧠) modes
3. Type your thoughts and press Send
4. The AI will guide you through cognitive restructuring
5. Use **New Session** to archive and start fresh

### Mood Tracker
1. Go to **Mood Tracker** tab
2. Select your current mood emoji
3. Write why you feel this way (required)
4. Click **Log Mood**
5. View your history below

## Architecture

- **Single-file React component** (`App.jsx`)
- **Firebase Firestore** for real-time data persistence
- **Three AI models** with dynamic routing:
  - Groq API for speed
  - Deepseek API for depth
  - Gemini API for future multimodal features
- **Tailwind CSS** for styling
- **Service Worker** for PWA capabilities

## Data Structure

### Firestore Collections

```
/artifacts/{app_id}/users/{userId}/
  ├── chat_sessions/{sessionId}/messages/
  │   └── {messageId}: { role, content, timestamp, mode }
  ├── mood_logs/
  │   └── {logId}: { mood, caption, timestamp }
  └── user_settings/
      └── keys: { age, groqKey, deepseekKey, geminiKey }
```

## Building for Production

```bash
npm run build
```

Deploy the `dist` folder to any static hosting service (Vercel, Netlify, Firebase Hosting, etc.)

## Browser Support

- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Notes

- API keys are stored in user's private Firestore space
- Keys are never exposed to other users
- Use Firestore security rules to enforce access control
- Consider implementing key encryption for production

## Troubleshooting

### "Failed to initialize app"
- Check Firebase config in `index.html`
- Verify Firebase project is active
- Check browser console for specific errors

### "API key not configured"
- Go to Settings tab
- Enter your API keys
- Click Save Settings
- Try sending a message again

### Messages not persisting
- Check Firestore security rules
- Verify authentication is working
- Check browser console for Firestore errors

## License

MIT License - Feel free to use and modify for your projects.

## Credits

Built with React, Firebase, Tailwind CSS, and powered by Groq, Deepseek, and Gemini AI models.
