# Reflect PWA - Troubleshooting Guide

## 🔧 Common Issues and Solutions

### Installation & Setup Issues

#### ❌ "npm: command not found"
**Problem**: Node.js is not installed  
**Solution**:
1. Download Node.js from https://nodejs.org/
2. Install LTS version (v18 or higher)
3. Restart terminal/command prompt
4. Verify: `node --version`

#### ❌ "npm install" fails
**Problem**: Network issues or permission errors  
**Solutions**:
- Clear npm cache: `npm cache clean --force`
- Delete node_modules: `rmdir /s /q node_modules` (Windows)
- Try again: `npm install`
- If permission error, run as administrator

#### ❌ Port 3000 already in use
**Problem**: Another app is using port 3000  
**Solutions**:
- Kill the process using port 3000
- Or change port in vite.config.js:
```javascript
server: {
  port: 3001, // Change to any available port
  open: true
}
```

---

### Firebase Configuration Issues

#### ❌ "Failed to initialize app"
**Problem**: Firebase config is incorrect or missing  
**Solutions**:
1. Check `index.html` has correct Firebase config
2. Verify all fields are filled:
   - apiKey
   - authDomain
   - projectId
   - storageBucket
   - messagingSenderId
   - appId
3. Check for typos or extra spaces
4. Ensure quotes are correct (no smart quotes)

**How to verify**:
```javascript
// Open browser console (F12)
console.log(window.__firebase_config);
// Should show your config object
```

#### ❌ "Firebase: Error (auth/invalid-api-key)"
**Problem**: Firebase API key is wrong  
**Solutions**:
1. Go to Firebase Console
2. Project Settings → General
3. Copy the EXACT apiKey value
4. Update in index.html
5. Refresh browser (Ctrl+F5)

#### ❌ "Missing or insufficient permissions"
**Problem**: Firestore security rules not set  
**Solutions**:
1. Go to Firebase Console
2. Firestore Database → Rules
3. Copy rules from SETUP_GUIDE.md
4. Click "Publish"
5. Wait 1 minute for rules to propagate

**Correct rules**:
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

#### ❌ "Authentication failed"
**Problem**: Anonymous auth not enabled  
**Solutions**:
1. Firebase Console → Authentication
2. Click "Get started" if not set up
3. Click "Sign-in method" tab
4. Enable "Anonymous" provider
5. Save changes

---

### API Key Issues

#### ❌ "Groq API key not configured"
**Problem**: API key not saved in settings  
**Solutions**:
1. Go to Settings tab in app
2. Enter your Groq API key
3. Click "Save Settings"
4. Wait for "Saving..." to complete
5. Refresh page to verify it persisted
6. Try sending message again

#### ❌ "API request failed" (Groq)
**Problem**: Invalid key or rate limit  
**Solutions**:
1. Verify key at https://console.groq.com/
2. Check you have API credits
3. Try generating a new key
4. Check browser console for specific error
5. Common errors:
   - 401: Invalid API key
   - 429: Rate limit exceeded
   - 500: Groq service issue

#### ❌ "API request failed" (Deepseek)
**Problem**: Invalid key or quota exceeded  
**Solutions**:
1. Verify key at https://platform.deepseek.com/
2. Check account balance/credits
3. Ensure API access is enabled
4. Try generating new key
5. Check browser console for details

#### ❌ API response is empty or gibberish
**Problem**: Wrong model or API endpoint  
**Solutions**:
1. Check App.jsx uses correct models:
   - Groq: `llama-3.1-70b-versatile`
   - Deepseek: `deepseek-chat`
2. Verify API endpoints are correct
3. Check API documentation for changes

---

### Data Persistence Issues

#### ❌ Messages disappear after refresh
**Problem**: Firestore not saving or loading  
**Solutions**:
1. Check browser console for Firestore errors
2. Verify security rules are correct
3. Check user is authenticated (userId shows in header)
4. Open Firebase Console → Firestore
5. Look for your data under:
   `/artifacts/reflect-pwa/users/{userId}/`
6. If no data, check write permissions

#### ❌ "User ID not showing in header"
**Problem**: Authentication failed  
**Solutions**:
1. Check Firebase config is correct
2. Verify Anonymous auth is enabled
3. Check browser console for auth errors
4. Try clearing browser cache
5. Try incognito/private window

#### ❌ Settings not saving
**Problem**: Firestore write permission issue  
**Solutions**:
1. Check Firestore security rules
2. Verify user is authenticated
3. Check browser console for errors
4. Try manually checking Firestore:
   - Firebase Console → Firestore
   - Navigate to: `/artifacts/reflect-pwa/users/{userId}/user_settings/keys`
   - Should see your saved settings

#### ❌ Real-time sync not working
**Problem**: Firestore listeners not active  
**Solutions**:
1. Check browser console for listener errors
2. Verify internet connection
3. Check Firebase project is active
4. Try refreshing the page
5. Check Firestore usage limits not exceeded

---

### UI/Display Issues

#### ❌ Styles not loading (no glassmorphism)
**Problem**: Tailwind CSS not loading  
**Solutions**:
1. Check internet connection (Tailwind loads from CDN)
2. Check browser console for 404 errors
3. Verify this line in index.html:
   ```html
   <script src="https://cdn.tailwindcss.com"></script>
   ```
4. Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

#### ❌ App looks broken on mobile
**Problem**: Viewport meta tag missing  
**Solutions**:
1. Check index.html has:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```
2. Clear browser cache
3. Test in mobile browser or DevTools device mode

#### ❌ Buttons not clickable
**Problem**: Z-index or pointer-events issue  
**Solutions**:
1. Check browser console for JavaScript errors
2. Try disabling browser extensions
3. Test in incognito mode
4. Check if buttons are disabled (should have visual indication)

#### ❌ Text is unreadable
**Problem**: Color contrast issue  
**Solutions**:
1. Check if gradient background is loading
2. Verify text has `text-white` class
3. Check browser zoom level (should be 100%)
4. Try different browser

---

### Chat/AI Issues

#### ❌ AI responses are slow (> 10 seconds)
**Problem**: API latency or network issues  
**Solutions**:
1. Check internet connection speed
2. Try Fast Response mode (Groq) instead of Deep Think
3. Check API service status:
   - Groq: https://status.groq.com/
   - Deepseek: Check their website
4. Try shorter messages
5. Check browser console for timeout errors

#### ❌ AI responses are off-topic
**Problem**: Model not following CBT coach persona  
**Solutions**:
1. This is expected occasionally with AI
2. Try rephrasing your message
3. Start a new session (clears context)
4. Use Deep Think mode for better reasoning
5. Check system prompt in App.jsx is correct

#### ❌ "Send" button stays disabled
**Problem**: Input validation or state issue  
**Solutions**:
1. Make sure message input is not empty
2. Check if previous message is still sending
3. Refresh the page
4. Check browser console for errors

#### ❌ Messages appear out of order
**Problem**: Timestamp or sorting issue  
**Solutions**:
1. Check Firestore timestamps are server timestamps
2. Verify query uses `orderBy('timestamp', 'asc')`
3. Refresh page to reload messages
4. Check browser console for Firestore errors

---

### Mood Tracker Issues

#### ❌ Can't log mood (button disabled)
**Problem**: Missing required fields  
**Solutions**:
1. Make sure you selected a mood emoji
2. Make sure caption is not empty
3. Check both fields are filled
4. Try clicking mood emoji again

#### ❌ Mood history not showing
**Problem**: No moods logged or loading issue  
**Solutions**:
1. Log at least one mood first
2. Check Firestore for mood_logs collection
3. Check browser console for errors
4. Verify security rules allow reading mood_logs

#### ❌ Timestamps are wrong
**Problem**: Timezone or server time issue  
**Solutions**:
1. Check computer's date/time settings
2. Verify using `serverTimestamp()` in code
3. Timestamps are in your local timezone
4. This is expected behavior

---

### PWA/Installation Issues

#### ❌ "Add to Home Screen" not showing
**Problem**: PWA requirements not met  
**Solutions**:
1. Must use HTTPS (or localhost)
2. manifest.json must be valid
3. Service Worker must register successfully
4. Check browser console for PWA errors
5. Try Chrome/Edge (best PWA support)

#### ❌ Service Worker not registering
**Problem**: SW registration failed  
**Solutions**:
1. Check browser console for SW errors
2. Verify sw.js file exists
3. Check file paths in sw.js are correct
4. Try unregistering old SW:
   - DevTools → Application → Service Workers
   - Click "Unregister"
   - Refresh page

#### ❌ App doesn't work offline
**Problem**: Service Worker not caching correctly  
**Solutions**:
1. Check SW is registered and active
2. Verify cache names in sw.js
3. Load app online first (to cache files)
4. Then test offline mode
5. Check DevTools → Application → Cache Storage

---

### Performance Issues

#### ❌ App is slow/laggy
**Problem**: Performance bottleneck  
**Solutions**:
1. Check browser console for errors
2. Close other browser tabs
3. Clear browser cache
4. Check computer resources (CPU/RAM)
5. Try different browser
6. Check for infinite loops in console

#### ❌ High memory usage
**Problem**: Memory leak  
**Solutions**:
1. Refresh page periodically
2. Close and reopen app
3. Check for unsubscribed Firestore listeners
4. Clear browser cache
5. Update to latest browser version

---

### Development Issues

#### ❌ Hot reload not working
**Problem**: Vite HMR issue  
**Solutions**:
1. Save file again
2. Check terminal for Vite errors
3. Restart dev server: Ctrl+C, then `npm run dev`
4. Check file is in src/ or root directory
5. Try hard refresh in browser

#### ❌ Build fails
**Problem**: Build error  
**Solutions**:
1. Check terminal for specific error
2. Run `npm install` again
3. Delete node_modules and reinstall
4. Check for syntax errors in App.jsx
5. Verify all imports are correct

#### ❌ Production build doesn't work
**Problem**: Environment difference  
**Solutions**:
1. Test with `npm run preview` first
2. Check browser console for errors
3. Verify Firebase config is correct
4. Check all CDN resources load
5. Ensure HTTPS in production

---

## 🔍 Debugging Tools

### Browser DevTools (F12)

**Console Tab**:
- See JavaScript errors
- Check Firebase initialization
- View API responses
- Debug state changes

**Network Tab**:
- Check API calls to Groq/Deepseek
- Verify Firebase requests
- Check response status codes
- See request/response bodies

**Application Tab**:
- Check Service Worker status
- View Firestore data (IndexedDB)
- Check Local Storage
- View Cache Storage
- Test offline mode

**Elements Tab**:
- Inspect HTML structure
- Check applied CSS classes
- Verify Tailwind styles
- Debug layout issues

### Firebase Console

**Firestore Database**:
- View all stored data
- Check document structure
- Verify timestamps
- Test queries manually

**Authentication**:
- See active users
- Check auth methods
- View user IDs
- Test sign-in

**Usage Tab**:
- Check API quotas
- Monitor request counts
- See bandwidth usage
- Check for limits

### API Dashboards

**Groq Console** (console.groq.com):
- Check API key status
- View usage/credits
- See request logs
- Monitor rate limits

**Deepseek Platform** (platform.deepseek.com):
- Check account balance
- View API usage
- Generate new keys
- See request history

---

## 🆘 Still Having Issues?

### Diagnostic Checklist

Run through this checklist:

1. ✅ Node.js installed and working
2. ✅ Dependencies installed (node_modules exists)
3. ✅ Firebase project created
4. ✅ Firestore enabled
5. ✅ Anonymous auth enabled
6. ✅ Security rules published
7. ✅ Firebase config in index.html is correct
8. ✅ Dev server running without errors
9. ✅ App loads in browser
10. ✅ User ID shows in header
11. ✅ API keys entered in Settings
12. ✅ Settings saved successfully
13. ✅ No errors in browser console
14. ✅ Internet connection working

### Get More Help

**Check Browser Console**:
```javascript
// Open DevTools (F12)
// Look for red errors
// Copy error message for searching
```

**Check Terminal Output**:
```bash
# Look for error messages
# Check for warnings
# Note any failed requests
```

**Test in Isolation**:
1. Try incognito/private window
2. Try different browser
3. Try different network
4. Try on different device

**Common Error Messages**:

| Error | Likely Cause | Solution |
|-------|--------------|----------|
| "Firebase: Error (auth/...)" | Auth config issue | Check Firebase setup |
| "Missing or insufficient permissions" | Security rules | Update Firestore rules |
| "API key not configured" | Settings not saved | Re-enter and save keys |
| "Failed to fetch" | Network/CORS issue | Check internet, API status |
| "Cannot read property of undefined" | State issue | Refresh page, check console |

### Reset Everything

If all else fails, try a complete reset:

```bash
# 1. Stop dev server (Ctrl+C)

# 2. Delete node_modules
rmdir /s /q node_modules

# 3. Delete package-lock.json
del package-lock.json

# 4. Clear npm cache
npm cache clean --force

# 5. Reinstall
npm install

# 6. Clear browser data
# - Open DevTools (F12)
# - Application → Clear storage
# - Click "Clear site data"

# 7. Restart dev server
npm run dev

# 8. Hard refresh browser
# Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

---

## 📞 Additional Resources

- **React Docs**: https://react.dev/learn
- **Firebase Docs**: https://firebase.google.com/docs
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Vite Docs**: https://vitejs.dev/guide/
- **Groq Docs**: https://console.groq.com/docs
- **Deepseek Docs**: https://platform.deepseek.com/docs

---

**Remember**: Most issues are configuration-related. Double-check your Firebase config and API keys first!
