# Reflect PWA - Project Structure

## 📁 File Organization

```
reflect-pwa/
│
├── 🎯 Core Application Files
│   ├── App.jsx                    # Main React component (single-file app)
│   ├── index.html                 # Entry point with Firebase config
│   ├── manifest.json              # PWA manifest
│   └── sw.js                      # Service Worker for offline support
│
├── ⚙️ Configuration Files
│   ├── package.json               # Dependencies and scripts
│   ├── vite.config.js             # Vite build configuration
│   └── .gitignore                 # Git ignore rules
│
├── 📚 Documentation
│   ├── README.md                  # Main documentation
│   ├── SETUP_GUIDE.md             # Step-by-step setup
│   ├── TESTING_CHECKLIST.md       # Complete testing guide
│   ├── PROJECT_SUMMARY.md         # Project overview
│   └── PROJECT_STRUCTURE.md       # This file
│
├── 🛠️ Utility Files
│   ├── test.html                  # Configuration test page
│   └── start.bat                  # Windows quick-start script
│
└── 📦 Generated (after npm install/build)
    ├── node_modules/              # Dependencies (gitignored)
    └── dist/                      # Production build (gitignored)
```

## 📄 File Descriptions

### Core Application Files

#### `App.jsx` (Main Application)
**Size**: ~500 lines  
**Purpose**: Complete single-file React PWA  
**Contains**:
- All React components (CBT Coach, Mood Tracker, Settings)
- Firebase initialization and authentication
- Firestore real-time listeners
- Multi-model AI integration (Groq, Deepseek, Gemini)
- State management with React hooks
- Glassmorphism UI with Tailwind CSS

**Key Sections**:
```javascript
// State Management (lines 1-50)
- Core state (userId, loading, activeView)
- Chat state (messages, inputMessage, chatMode)
- Mood state (selectedMood, moodCaption, moodLogs)
- Settings state (age, API keys)

// Firebase Setup (lines 51-100)
- Initialize Firebase
- Authenticate user
- Set up Firestore

// Data Loaders (lines 101-200)
- Load settings from Firestore
- Load chat history
- Load mood logs
- Real-time listeners

// Business Logic (lines 201-350)
- saveSettings()
- callCbtCoach() - Multi-model AI routing
- sendMessage()
- startNewSession()
- saveMoodLog()

// UI Components (lines 351-500)
- Header with logo and user ID
- Navigation tabs
- Chat interface
- Mood tracker interface
- Settings interface
```

#### `index.html` (Entry Point)
**Purpose**: HTML shell and Firebase configuration  
**Key Elements**:
- Meta tags for PWA
- Tailwind CSS CDN
- Firebase configuration script
- React imports via ESM
- Service Worker registration

**Configuration Section**:
```javascript
window.__app_id = 'reflect-pwa';
window.__firebase_config = { /* Your config */ };
window.__initial_auth_token = null;
```

#### `manifest.json` (PWA Manifest)
**Purpose**: Makes app installable  
**Defines**:
- App name and description
- Display mode (standalone)
- Theme colors
- App icons (192x192, 512x512)
- Orientation preference

#### `sw.js` (Service Worker)
**Purpose**: Offline functionality  
**Features**:
- Caches core files on install
- Serves from cache when offline
- Network fallback for dynamic content
- Cache versioning and cleanup

### Configuration Files

#### `package.json`
**Dependencies**:
- react: ^18.2.0
- react-dom: ^18.2.0

**Dev Dependencies**:
- vite: ^5.0.0
- @vitejs/plugin-react: ^4.2.1

**Scripts**:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run serve` - Serve with simple HTTP server

#### `vite.config.js`
**Configuration**:
- React plugin enabled
- Dev server on port 3000
- Auto-open browser
- Source maps in production

#### `.gitignore`
**Ignores**:
- node_modules/
- dist/
- .env files
- IDE configs
- OS files

### Documentation Files

#### `README.md` (Main Documentation)
**Sections**:
1. Features overview
2. Setup instructions
3. Firebase configuration
4. API key setup
5. Usage guide
6. Architecture details
7. Data structure
8. Deployment guide
9. Troubleshooting

#### `SETUP_GUIDE.md` (Quick Setup)
**10-Step Process**:
1. Firebase project setup
2. Enable Firestore
3. Enable Authentication
4. Get Firebase config
5. Update index.html
6. Set security rules
7. Get AI API keys
8. Install dependencies
9. Configure keys in app
10. Test the app

#### `TESTING_CHECKLIST.md` (Testing Protocol)
**15 Test Categories**:
1. Initial load & auth
2. Settings tab
3. CBT Coach - Fast mode
4. CBT Coach - Deep mode
5. New session
6. Error handling
7. Mood logging
8. Mood history
9. Real-time sync
10. Mobile responsiveness
11. PWA features
12. Performance
13. Edge cases
14. Data persistence
15. Browser compatibility

#### `PROJECT_SUMMARY.md` (Overview)
**Contents**:
- Project overview
- Deliverables list
- Architecture details
- Feature checklist
- Data structure
- Security notes
- Getting started
- Performance targets
- Known limitations
- Future enhancements

#### `PROJECT_STRUCTURE.md` (This File)
**Contents**:
- File organization
- File descriptions
- Code structure
- Dependencies
- Workflow guide

### Utility Files

#### `test.html` (Configuration Tester)
**Purpose**: Test Firebase config before updating index.html  
**Features**:
- Interactive form for Firebase config
- Validation and preview
- Launch button to test app
- Setup checklist

#### `start.bat` (Windows Quick Start)
**Purpose**: One-click startup for Windows users  
**Actions**:
1. Checks if node_modules exists
2. Runs npm install if needed
3. Starts dev server
4. Opens browser automatically

## 🔄 Development Workflow

### First Time Setup
```bash
1. Clone/download project
2. Update Firebase config in index.html
3. Run: npm install
4. Run: npm run dev
5. Configure API keys in Settings tab
6. Start testing
```

### Daily Development
```bash
1. Run: npm run dev (or start.bat on Windows)
2. Make changes to App.jsx
3. Browser auto-reloads
4. Test in browser
5. Check console for errors
```

### Production Deployment
```bash
1. Run: npm run build
2. Test: npm run preview
3. Deploy dist/ folder to hosting
4. Verify production build works
```

## 📦 Dependencies Explained

### Runtime Dependencies

**react (18.2.0)**
- Core React library
- Used for: Component rendering, hooks, state management
- Why: Industry standard, excellent performance

**react-dom (18.2.0)**
- React DOM renderer
- Used for: Rendering React to browser DOM
- Why: Required for React web apps

### External CDN Dependencies (in index.html)

**Tailwind CSS**
- Source: cdn.tailwindcss.com
- Used for: All styling (glassmorphism, responsive design)
- Why: Rapid development, no build step needed

**React ESM**
- Source: esm.sh
- Used for: ES module imports in browser
- Why: No build step for development

**Firebase SDK**
- Source: gstatic.com/firebasejs
- Used for: Firestore, Authentication
- Why: Real-time database, user management

### Dev Dependencies

**vite (5.0.0)**
- Modern build tool
- Used for: Dev server, production builds
- Why: Fast HMR, optimized builds

**@vitejs/plugin-react (4.2.1)**
- Vite plugin for React
- Used for: JSX transformation, Fast Refresh
- Why: Required for React in Vite

## 🎯 Code Organization in App.jsx

### Import Section (Lines 1-5)
```javascript
- React and hooks
- Firebase modules
```

### Component Definition (Lines 7-500)
```javascript
export default function App() {
  // 1. State declarations (lines 8-30)
  // 2. Firebase initialization (lines 32-60)
  // 3. Data loading effects (lines 62-150)
  // 4. Business logic functions (lines 152-300)
  // 5. Render logic (lines 302-500)
}
```

### State Organization
```javascript
Core State:
- userId, loading, activeView, error

Chat State:
- messages, inputMessage, chatMode
- sendingMessage, sessionId

Mood State:
- selectedMood, moodCaption, moodLogs
- savingMood

Settings State:
- age, groqKey, deepseekKey, geminiKey
- savingSettings

Firebase State:
- db, auth
```

### Function Organization
```javascript
Data Functions:
- saveSettings()
- saveMoodLog()

AI Functions:
- callCbtCoach() - Routes to Groq/Deepseek
- sendMessage() - Handles chat flow

UI Functions:
- startNewSession()
- formatTimestamp()
```

## 🔌 API Integration Points

### Groq API (Fast Response)
**Endpoint**: `https://api.groq.com/openai/v1/chat/completions`  
**Model**: `llama-3.1-70b-versatile`  
**Used for**: Quick conversational responses  
**Location**: App.jsx, callCbtCoach() function

### Deepseek API (Deep Think)
**Endpoint**: `https://api.deepseek.com/v1/chat/completions`  
**Model**: `deepseek-chat`  
**Used for**: Complex reasoning tasks  
**Location**: App.jsx, callCbtCoach() function

### Gemini API (Future/Placeholder)
**Status**: Not yet implemented  
**Planned for**: Multimodal features (image analysis)  
**Location**: Settings storage only

### Firebase Firestore
**Used for**: All data persistence  
**Collections**:
- chat_sessions/{sessionId}/messages
- mood_logs
- user_settings/keys

## 🎨 Styling Architecture

### Tailwind Utility Classes Used

**Layout**:
- `min-h-screen` - Full viewport height
- `max-w-4xl mx-auto` - Centered container
- `flex`, `grid` - Flexbox/Grid layouts

**Glassmorphism**:
- `bg-white/20` - Transparent white background
- `backdrop-blur-lg` - Frosted glass effect
- `rounded-3xl` - Large rounded corners
- `shadow-xl` - Depth and elevation

**Colors**:
- `bg-gradient-to-br from-indigo-500/80 to-purple-400/80` - Main gradient
- `text-white` - Primary text color
- `text-white/60` - Secondary text (60% opacity)

**Interactive**:
- `hover:bg-white/30` - Hover states
- `disabled:bg-white/10` - Disabled states
- `transition-all` - Smooth transitions
- `transform hover:scale-110` - Scale animations

## 📊 Data Flow

### Chat Message Flow
```
User types message
  ↓
sendMessage() called
  ↓
Save to Firestore (user message)
  ↓
callCbtCoach() - Route to Groq/Deepseek
  ↓
Get AI response
  ↓
Save to Firestore (AI message)
  ↓
onSnapshot listener updates UI
```

### Mood Log Flow
```
User selects mood + caption
  ↓
saveMoodLog() called
  ↓
Save to Firestore
  ↓
onSnapshot listener updates history
  ↓
Clear form
```

### Settings Flow
```
User enters API keys
  ↓
saveSettings() called
  ↓
Save to Firestore
  ↓
onSnapshot listener updates state
  ↓
Keys available for AI calls
```

## 🚀 Performance Optimizations

### Implemented
- `useCallback` for memoized functions
- Real-time listeners (no polling)
- Optimistic UI updates
- Lazy loading with React.lazy (potential)
- Service Worker caching
- Vite's optimized builds

### Potential Improvements
- Code splitting by route
- Image lazy loading
- Virtual scrolling for long lists
- Debounced inputs
- Request deduplication

## 🔐 Security Layers

### Firebase Security Rules
```javascript
// Only authenticated users
// Only access own data
match /artifacts/{appId}/users/{userId}/{document=**} {
  allow read, write: if request.auth.uid == userId;
}
```

### Application Security
- Password-masked API key inputs
- No API keys in client code
- User-isolated Firestore paths
- Anonymous auth (no PII required)

## 📱 PWA Capabilities

### Installability
- manifest.json defines app metadata
- Service Worker enables offline mode
- "Add to Home Screen" prompt

### Offline Support
- Service Worker caches core files
- App shell loads offline
- Firestore has offline persistence
- Graceful degradation

### App-like Experience
- Standalone display mode
- Custom theme color
- No browser chrome
- Full-screen on mobile

## 🎓 Learning Resources

### To Understand This Project
1. **React Hooks**: useState, useEffect, useCallback
2. **Firebase Firestore**: Real-time listeners, security rules
3. **Tailwind CSS**: Utility-first styling
4. **PWA Concepts**: Service Workers, manifests
5. **API Integration**: REST APIs, async/await

### Recommended Reading
- React Docs: https://react.dev
- Firebase Docs: https://firebase.google.com/docs
- Tailwind Docs: https://tailwindcss.com/docs
- PWA Guide: https://web.dev/progressive-web-apps/

---

**This structure is designed for**:
- ✅ Easy understanding
- ✅ Quick modifications
- ✅ Minimal complexity
- ✅ Maximum maintainability
