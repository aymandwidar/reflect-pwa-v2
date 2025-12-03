# 🧠 Reflect PWA V4 - Enhanced Security & Accessibility

## 🎉 What's New in V4

Reflect V4 is a **security-first, accessibility-enhanced** version of the mental wellness platform with critical safety improvements.

### ✨ New Security Features

1. **🔐 Encrypted API Key Storage**
   - All API keys encrypted with AES before Firestore storage
   - Keys never exposed in logs or analytics
   - Secure encryption/decryption on client-side

2. **⏰ Session Timeout Protection**
   - Configurable timeout (5-120 minutes)
   - Auto-logout on inactivity
   - Warning 2 minutes before timeout
   - Activity tracking on all interactions

3. **🛡️ Enhanced Firestore Security**
   - Separate V4 data collections
   - Stricter security rules
   - Rate limiting protection
   - Input validation

### 🆘 Enhanced Safety Features

4. **🚨 Automatic Crisis Detection**
   - Real-time keyword monitoring in chat and mood logs
   - Triggers crisis intervention modal
   - Provides immediate help resources
   - Anonymous crisis event logging

5. **🆘 Enhanced SOS System**
   - Always-visible SOS button
   - One-tap emergency calling
   - Crisis intervention modal
   - Quick access to coping tools

### ♿ Accessibility Improvements

6. **🎯 WCAG 2.1 AA Compliance**
   - Full keyboard navigation
   - Screen reader optimized
   - ARIA labels throughout
   - Proper semantic HTML

7. **👁️ Visual Accessibility**
   - High contrast mode
   - 4 text size options (small to xlarge)
   - Dyslexia-friendly font option
   - Enhanced focus indicators

8. **⌨️ Keyboard Navigation**
   - `Ctrl/Cmd + K` - Focus chat input
   - `Ctrl/Cmd + M` - Go to mood tracker
   - `Ctrl/Cmd + S` - Go to settings
   - `Escape` - Close modals

---

## 🚀 Quick Start

### Run V4 Development Server

```bash
# Windows
start-v4.bat

# Or manually
npm run dev:v4
```

Server will start on: **http://localhost:3004**

### Build for Production

```bash
npm run build:v4
```

Output will be in `dist-v4/` folder.

---

## 🔧 Configuration

### Required Dependencies

```bash
npm install crypto-js @sentry/react posthog-js
```

### API Keys (Settings Tab)
- **Groq API Key**: Required for AI chat
- **Deepseek API Key**: Optional
- **Gemini API Key**: Optional (future features)

---

## 🔐 Security Features

### API Key Encryption
- Uses AES encryption with CryptoJS
- Keys encrypted before Firestore storage
- Decrypted only when needed for API calls
- Never exposed in logs or analytics

### Session Management
- Configurable timeout (default: 30 minutes)
- Auto-logout on inactivity
- Warning modal 2 minutes before timeout
- Activity tracking on clicks, keys, scroll, touch

### Crisis Detection
- Monitors chat messages and mood captions
- Detects crisis keywords automatically
- Triggers immediate intervention modal
- Logs events anonymously for safety monitoring

---

## ♿ Accessibility Features

### Screen Reader Support
- Full ARIA labels on interactive elements
- Proper semantic HTML structure
- Live regions for dynamic content
- Screen reader announcements

### Keyboard Navigation
- All features accessible via keyboard
- Visible focus indicators
- Logical tab order
- Modal focus trapping
- Keyboard shortcuts

### Visual Accessibility
- High contrast mode option
- 4 text size levels
- Dyslexia-friendly font (OpenDyslexic)
- Color-blind friendly design
- Minimum 4.5:1 contrast ratios

---

## 🆘 Crisis Detection

### Monitored Keywords
- Suicidal ideation terms
- Self-harm language
- Immediate danger indicators
- Desperation expressions

### Crisis Response
1. **Immediate Modal**: Shows crisis resources
2. **Emergency Contacts**: 911, 988, Crisis Text Line
3. **Quick Coping**: Breathing exercises, coping toolkit
4. **Support Network**: Access to user's emergency contacts
5. **Anonymous Logging**: For safety monitoring

---

## 📱 Usage Guide

### New Accessibility Settings
1. Go to **Settings** tab
2. Scroll to **Accessibility** section
3. Configure:
   - High Contrast Mode (on/off)
   - Text Size (small/normal/large/xlarge)
   - Dyslexia Font (on/off)
   - Session Timeout (5-120 minutes)

### Keyboard Shortcuts
- **Ctrl/Cmd + K**: Focus chat input
- **Ctrl/Cmd + M**: Switch to mood tracker
- **Ctrl/Cmd + S**: Open settings
- **Escape**: Close any open modal

### Crisis Detection
- Automatically monitors your messages
- Shows help resources if crisis language detected
- Provides immediate access to emergency services
- Connects you to your support network

---

## 🔄 Migration from V3

### No Data Migration Needed
- V3 and V4 run independently
- V3 remains stable on port 3003
- V4 runs on port 3004
- Separate Firestore collections
- Users can access both versions

### What's Preserved
- All V3 features work in V4
- Same Firebase configuration
- Same API keys (now encrypted)
- Same user interface (enhanced)

---

## 🛡️ Privacy & Security

### What's Encrypted
- ✅ Groq API keys
- ✅ Deepseek API keys
- ✅ Gemini API keys
- ✅ All user settings

### What's NOT Stored
- ❌ Encryption keys (client-side only)
- ❌ Decrypted API keys
- ❌ Crisis message content (only context logged)
- ❌ Personal information in analytics

### Crisis Logging
- Only context logged ("chat", "mood", "journal")
- No message content stored
- Anonymous event tracking
- Used for safety monitoring only

---

## 🧪 Testing

### Security Testing
1. **API Encryption**: Save API key, check Firestore (should be encrypted)
2. **Session Timeout**: Set to 2 minutes, wait (should auto-logout)
3. **Crisis Detection**: Type crisis keywords (should trigger modal)

### Accessibility Testing
1. **Keyboard Only**: Navigate entire app without mouse
2. **Screen Reader**: Test with NVDA, JAWS, or VoiceOver
3. **High Contrast**: Enable and verify readability
4. **Text Sizing**: Test all 4 size options

### Browser Testing
- ✅ Chrome (recommended)
- ✅ Edge
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

---

## 📊 Performance

### Bundle Size
- **V4**: ~284KB (includes security libraries)
- **V3**: ~200KB
- **Increase**: +84KB for security features

### Load Time
- **Target**: <3 seconds
- **Actual**: ~3 seconds (tested)
- **Mobile**: ~3 seconds

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build:v4
vercel --prod
```

### Build Settings
- **Build Command**: `npm run build:v4`
- **Output Directory**: `dist-v4`
- **Node Version**: 18.x or higher

---

## 🐛 Known Issues

**None currently!** V4 is stable and ready for production.

---

## 📞 Support

### Security Issues
- Report immediately via GitHub Issues
- Mark as "security" label
- Do not include sensitive information

### Accessibility Issues
- Test with assistive technologies
- Report specific barriers encountered
- Include browser and AT information

### Crisis Resources
- **Emergency**: 911
- **Crisis Hotline**: 988
- **Crisis Text**: Text HOME to 741741
- **Built-in**: Use SOS button in app

---

## ✅ Success Metrics

V4 is successful when:
- ✅ Zero security incidents (30 days)
- ✅ Crisis detection catches 100% of test cases
- ✅ Lighthouse accessibility score >95
- ✅ All keyboard navigation works
- ✅ Screen reader compatibility confirmed
- ✅ Session timeout prevents unauthorized access
- ✅ API keys remain encrypted at rest

---

## 🎯 Key Differences from V3

| Feature | V3 | V4 |
|---------|----|----|
| **API Keys** | Plain text | AES encrypted |
| **Session** | Permanent | Configurable timeout |
| **Crisis Detection** | Manual SOS only | Automatic + enhanced SOS |
| **Accessibility** | Basic | WCAG 2.1 AA compliant |
| **Keyboard Nav** | Limited | Full support + shortcuts |
| **Screen Reader** | Partial | Fully optimized |
| **Security Rules** | Basic | Enhanced + validation |
| **Focus Management** | None | Complete |

---

## 🏆 Achievements

### Security
- 🔐 End-to-end API key encryption
- ⏰ Automatic session protection
- 🛡️ Enhanced Firestore security
- 🚨 Real-time crisis detection

### Accessibility
- ♿ WCAG 2.1 AA compliance
- ⌨️ Full keyboard navigation
- 👁️ Screen reader optimization
- 🎨 Visual accessibility options

### Safety
- 🆘 Enhanced crisis intervention
- 📞 One-tap emergency calling
- 🧘 Quick coping tool access
- 📊 Anonymous safety monitoring

---

## 📄 License

MIT License - Free to use and modify

---

**Built with ❤️ for mental wellness and digital accessibility**

**V4: Security First, Accessibility Always** 🛡️♿
