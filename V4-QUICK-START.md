# 🚀 Reflect V4 - Quick Start Guide

## ⚡ Get Started in 3 Minutes

### 1️⃣ Run V4 Development Server

**Windows:**
```bash
start-v4.bat
```

**Or manually:**
```bash
npm run dev:v4
```

**Server URL:** http://localhost:3004

---

### 2️⃣ Configure API Keys

1. Open the app in your browser
2. Click **⚙️ Settings** tab
3. Enter your **Groq API Key** (required for AI chat)
4. Optional: Add Deepseek or Gemini keys
5. Click **Save Settings**

**🔐 Security Note:** All API keys are automatically encrypted before storage!

---

### 3️⃣ Start Using V4

**Chat with AI Therapist:**
- Type in the chat input or use voice 🎤
- AI provides CBT-based mental health support
- Crisis detection monitors for safety

**Track Your Mood:**
- Select emoji mood + add caption
- View mood history and trends
- Build your mood streak 🔥

**Access Wellness Tools:**
- Breathing exercises
- Meditation sessions
- Coping strategies
- CBT programs

---

## 🆕 What's New in V4?

### 🔐 Security Features
- ✅ **Encrypted API Keys** - AES encryption for all keys
- ✅ **Session Timeout** - Auto-logout after inactivity
- ✅ **Crisis Detection** - Automatic safety monitoring
- ✅ **Enhanced Security Rules** - Stricter Firestore protection

### ♿ Accessibility Features
- ✅ **WCAG 2.1 AA Compliant** - Full accessibility support
- ✅ **Keyboard Navigation** - Complete keyboard control
- ✅ **Screen Reader Optimized** - ARIA labels throughout
- ✅ **High Contrast Mode** - Better visibility option
- ✅ **Text Size Options** - 4 size levels
- ✅ **Dyslexia Font** - OpenDyslexic font option

### 🆘 Safety Features
- ✅ **Crisis Detection** - Monitors chat and mood logs
- ✅ **Enhanced SOS** - One-tap emergency calling
- ✅ **Crisis Resources** - Immediate help access
- ✅ **Anonymous Logging** - Safety event tracking

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Focus chat input |
| `Ctrl/Cmd + M` | Go to mood tracker |
| `Ctrl/Cmd + S` | Open settings |
| `Escape` | Close modals |

---

## ♿ Accessibility Settings

**Location:** Settings tab → Accessibility section

### High Contrast Mode
- Increases color contrast for better visibility
- Enhanced focus indicators
- Toggle on/off

### Text Size
- **Small** - 14px
- **Normal** - 16px (default)
- **Large** - 18px
- **X-Large** - 20px

### Dyslexia-Friendly Font
- Uses OpenDyslexic font
- Easier reading for dyslexic users
- Toggle on/off

### Session Timeout
- Set inactivity timeout (5-120 minutes)
- Default: 30 minutes
- Warning 2 minutes before logout

---

## 🆘 Crisis Detection

V4 automatically monitors for crisis language in:
- Chat messages
- Mood log captions
- Journal entries

**When detected:**
1. Crisis intervention modal appears
2. Emergency resources displayed
3. One-tap calling to 911, 988
4. Quick access to coping tools
5. Anonymous event logged for safety

**Crisis Keywords Monitored:**
- Suicidal ideation
- Self-harm language
- Immediate danger indicators
- Desperation expressions

---

## 🔧 Configuration Options

### API Keys (Settings Tab)
- **Groq API Key** - Required for AI chat (fast response)
- **Deepseek API Key** - Optional (not currently used)
- **Gemini API Key** - Optional (future multimodal features)

### Voice Settings
- **Voice Input** - Enable/disable microphone
- **Text-to-Speech** - Enable/disable AI voice responses
- **Microphone Permission** - Test button available

### Appearance
- **Dark Mode** - Toggle light/dark theme
- **Language** - EN, ES, FR, AR, DE

### Accessibility
- **High Contrast** - Enhanced visibility
- **Text Size** - 4 size options
- **Dyslexia Font** - Easier reading
- **Session Timeout** - Auto-logout timer

---

## 📊 Features Overview

### 💬 AI Chat
- CBT-based mental health support
- Fast response with Groq API
- Voice input/output support
- Crisis detection enabled
- Session history saved

### 😊 Mood Tracker
- 8 mood options with emojis
- Add captions to mood logs
- View mood history
- Track mood streaks
- Crisis detection in captions

### 📖 Journal
- Private journaling space
- Timestamp and save entries
- View journal history
- Secure storage

### 🏋️ CBT Exercises
- Thought challenging
- Cognitive restructuring
- Behavioral activation
- Guided exercises

### 🎯 Coping Toolkit
- Breathing exercises (4-7-8, Box)
- Grounding techniques (5-4-3-2-1)
- Progressive muscle relaxation
- Quick calming strategies

### 🎯 Guided Programs
- Anxiety management
- Depression support
- Stress reduction
- Sleep improvement
- Multi-week programs

### 🎵 Wellness Tools
- Meditation sessions (5-20 min)
- Ambient soundscapes
- Guided relaxation
- Timer with countdown

### 🤝 Support Network
- Add emergency contacts
- Quick call/text access
- Support person management
- Crisis resource links

---

## 🔐 Security & Privacy

### What's Encrypted
- ✅ All API keys (AES encryption)
- ✅ User settings
- ✅ Stored securely in Firestore

### What's NOT Stored
- ❌ Encryption keys (client-side only)
- ❌ Decrypted API keys
- ❌ Crisis message content
- ❌ Personal info in analytics

### Session Security
- Configurable timeout (5-120 min)
- Activity tracking (clicks, keys, scroll, touch)
- Warning 2 minutes before logout
- Auto-logout on inactivity

### Crisis Logging
- Only context logged ("chat", "mood", "journal")
- No message content stored
- Anonymous event tracking
- Used for safety monitoring only

---

## 🧪 Testing V4

### Security Testing
1. **API Encryption**
   - Save API key in Settings
   - Check Firestore (should be encrypted string)
   - No plain text keys visible

2. **Session Timeout**
   - Set timeout to 2 minutes
   - Wait without interaction
   - Verify warning appears
   - Verify auto-logout works

3. **Crisis Detection**
   - Type crisis keywords in chat
   - Verify modal appears
   - Test emergency contact links

### Accessibility Testing
1. **Keyboard Only**
   - Navigate entire app without mouse
   - Test all keyboard shortcuts
   - Verify no keyboard traps

2. **Screen Reader**
   - Test with NVDA, JAWS, or VoiceOver
   - Verify all content announced
   - Check ARIA labels

3. **Visual Accessibility**
   - Enable high contrast mode
   - Test all 4 text sizes
   - Enable dyslexia font
   - Verify readability

---

## 🚀 Build for Production

```bash
npm run build:v4
```

**Output:** `dist-v4/` folder

**Deploy to Vercel:**
```bash
vercel --prod
```

**Build Settings:**
- Build Command: `npm run build:v4`
- Output Directory: `dist-v4`
- Node Version: 18.x or higher

---

## 🆘 Emergency Resources

**Built into V4:**
- 🚨 **911** - Emergency services
- 📞 **988** - Suicide & Crisis Lifeline
- 💬 **741741** - Crisis Text Line (text HOME)
- 🆘 **SOS Button** - Always visible in header

**Access via:**
- Click SOS button in header
- Crisis detection modal (automatic)
- Support Network tab

---

## 📱 Browser Support

**Desktop:**
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari

**Mobile:**
- ✅ Chrome Mobile
- ✅ Safari Mobile
- ✅ Firefox Mobile
- ✅ Samsung Internet

**Assistive Technologies:**
- ✅ NVDA (Windows)
- ✅ JAWS (Windows)
- ✅ VoiceOver (Mac/iOS)
- ✅ TalkBack (Android)

---

## 🎯 Success Checklist

### First Time Setup
- [ ] Run development server
- [ ] Add Groq API key
- [ ] Test AI chat
- [ ] Log first mood
- [ ] Explore all tabs
- [ ] Configure accessibility settings

### Security Verification
- [ ] API keys encrypted in Firestore
- [ ] Session timeout working
- [ ] Crisis detection triggers
- [ ] No sensitive data in logs

### Accessibility Verification
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] High contrast functional
- [ ] Text sizing works
- [ ] Focus indicators visible

---

## 🐛 Troubleshooting

### AI Chat Not Working
- ✅ Check Groq API key is entered
- ✅ Verify API key is valid
- ✅ Check browser console for errors
- ✅ Ensure internet connection

### Voice Not Working
- ✅ Click "Test Microphone Permission"
- ✅ Allow microphone access in browser
- ✅ Check voice settings enabled
- ✅ Test with different browser

### Session Timeout Issues
- ✅ Check timeout setting (5-120 min)
- ✅ Verify activity tracking working
- ✅ Test with shorter timeout (2 min)

### Accessibility Issues
- ✅ Clear browser cache
- ✅ Reload page
- ✅ Check browser compatibility
- ✅ Test with different assistive technology

---

## 📚 Additional Documentation

- **README-V4.md** - Complete V4 documentation
- **V4-DEPLOYMENT-CHECKLIST.md** - Production deployment guide
- **V4-FINAL-SUMMARY.md** - Build summary and achievements

---

## 🎉 You're Ready!

V4 is now running with:
- 🔐 Enhanced security (encrypted keys, session timeout)
- ♿ Full accessibility (WCAG 2.1 AA compliant)
- 🆘 Crisis detection (automatic safety monitoring)
- ⌨️ Keyboard navigation (complete keyboard support)
- 👁️ Screen reader optimization (ARIA labels)

**Start exploring and stay well!** 🧠💙

---

**V4: Security First, Accessibility Always** 🛡️♿
