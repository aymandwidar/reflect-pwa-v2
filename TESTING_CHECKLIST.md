# Reflect PWA - Testing Checklist

## Pre-Testing Setup ✅

### Firebase Configuration
- [ ] Firebase project created
- [ ] Firestore Database enabled (test mode initially)
- [ ] Anonymous Authentication enabled
- [ ] Firebase config copied to `index.html`
- [ ] Security rules published

### API Keys Obtained
- [ ] Groq API key obtained from https://console.groq.com/
- [ ] Deepseek API key obtained from https://platform.deepseek.com/
- [ ] (Optional) Gemini API key obtained

### Local Setup
- [ ] Node.js installed (v16 or higher)
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] App opens in browser at localhost:3000

## Feature Testing

### 1. Initial Load & Authentication ✅
- [ ] App loads without errors
- [ ] User ID displays in header (8-character hash)
- [ ] No console errors in browser DevTools
- [ ] Glassmorphism UI renders correctly
- [ ] Gradient background visible
- [ ] All three tabs visible (CBT Coach, Mood Tracker, Settings)

### 2. Settings Tab ✅
- [ ] Navigate to Settings tab
- [ ] Age input field visible and functional
- [ ] Three API key input fields visible (Groq, Deepseek, Gemini)
- [ ] Input fields show password masking
- [ ] Enter test age (e.g., "25")
- [ ] Enter Groq API key
- [ ] Enter Deepseek API key
- [ ] Click "Save Settings" button
- [ ] Button shows "Saving..." state
- [ ] No errors displayed
- [ ] Settings persist after page refresh

### 3. CBT Coach - Fast Response Mode ✅
- [ ] Navigate to CBT Coach tab
- [ ] Chat interface displays with empty state message
- [ ] Mode toggle shows "⚡ Fast Response" (yellow/gold color)
- [ ] Input field is functional
- [ ] Type test message: "I'm feeling anxious about work"
- [ ] Click Send button
- [ ] Button shows "..." loading state
- [ ] User message appears in chat (right-aligned, white bubble)
- [ ] AI response appears (left-aligned, purple bubble)
- [ ] Response is concise (2-3 sentences)
- [ ] Response shows "⚡ Fast" badge
- [ ] Message persists after page refresh

### 4. CBT Coach - Deep Think Mode ✅
- [ ] Click mode toggle to switch to "🧠 Deep Think" (blue color)
- [ ] Type test message: "I keep thinking I'm going to fail"
- [ ] Send message
- [ ] AI response appears with "🧠 Deep" badge
- [ ] Response is more detailed than Fast mode
- [ ] Conversation history maintained
- [ ] Messages scroll properly

### 5. CBT Coach - New Session ✅
- [ ] Click "New Session" button
- [ ] Chat clears to empty state
- [ ] Previous messages archived (not visible)
- [ ] Can start new conversation
- [ ] New session ID generated
- [ ] Old session still accessible in Firestore

### 6. CBT Coach - Error Handling ✅
- [ ] Go to Settings, clear Groq API key, save
- [ ] Return to CBT Coach, ensure Fast Response mode
- [ ] Try to send message
- [ ] Error message displays: "Groq API key not configured..."
- [ ] Message not sent
- [ ] Clear Deepseek key, try Deep Think mode
- [ ] Similar error for Deepseek
- [ ] Re-add keys and verify functionality restored

### 7. Mood Tracker - Logging ✅
- [ ] Navigate to Mood Tracker tab
- [ ] Five mood emojis visible and properly labeled
- [ ] Click "😄 Joyful" emoji
- [ ] Emoji scales up/highlights
- [ ] Caption textarea visible
- [ ] Try clicking "Log Mood" without caption
- [ ] Button should be disabled
- [ ] Enter caption: "Had a great day at work!"
- [ ] Click "Log Mood"
- [ ] Button shows "Saving..." state
- [ ] Mood clears after save
- [ ] Caption clears after save

### 8. Mood Tracker - History ✅
- [ ] Logged mood appears in "Recent Logs" section
- [ ] Entry shows correct emoji
- [ ] Entry shows mood name
- [ ] Entry shows caption text
- [ ] Entry shows timestamp (date and time)
- [ ] Log multiple moods (try all 5 types)
- [ ] Entries appear in descending order (newest first)
- [ ] History persists after page refresh
- [ ] Scroll works if more than screen height

### 9. Real-time Sync Testing ✅
- [ ] Open app in two browser tabs/windows
- [ ] In Tab 1: Send a chat message
- [ ] In Tab 2: Message appears automatically
- [ ] In Tab 1: Log a mood
- [ ] In Tab 2: Mood appears in history
- [ ] In Tab 1: Change settings
- [ ] In Tab 2: Settings update automatically

### 10. Mobile Responsiveness ✅
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (mobile view)
- [ ] Test on iPhone SE (375px)
- [ ] Test on iPhone 12 Pro (390px)
- [ ] Test on iPad (768px)
- [ ] All elements visible and usable
- [ ] No horizontal scrolling
- [ ] Touch targets adequate size
- [ ] Text readable without zooming
- [ ] Glassmorphism effects work on mobile

### 11. PWA Features ✅
- [ ] Service Worker registers (check console)
- [ ] App works offline (after initial load)
- [ ] Manifest.json loads correctly
- [ ] Can "Add to Home Screen" on mobile
- [ ] App opens in standalone mode
- [ ] Theme color applies to browser chrome

### 12. Performance Testing ✅
- [ ] Fast Response mode responds in < 2 seconds
- [ ] Deep Think mode responds in < 5 seconds
- [ ] UI remains responsive during API calls
- [ ] No lag when typing in inputs
- [ ] Smooth scrolling in chat and mood history
- [ ] No memory leaks (check DevTools Performance)

### 13. Edge Cases & Error Scenarios ✅
- [ ] Send empty message (should be prevented)
- [ ] Send very long message (500+ characters)
- [ ] Log mood without selection (should be prevented)
- [ ] Rapid clicking Send button (should debounce)
- [ ] Network offline during message send
- [ ] Invalid API key (should show error)
- [ ] API rate limit exceeded (should show error)
- [ ] Firestore connection lost (should handle gracefully)

### 14. Data Persistence Verification ✅
- [ ] Send 5+ chat messages
- [ ] Log 5+ moods
- [ ] Save settings
- [ ] Close browser completely
- [ ] Reopen app
- [ ] All data still present
- [ ] User ID unchanged
- [ ] Settings preserved

### 15. Browser Compatibility ✅
Test in multiple browsers:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Firestore Data Verification

### Check Firebase Console
- [ ] Navigate to Firestore Database
- [ ] Verify collection structure:
  ```
  /artifacts/reflect-pwa/users/{userId}/
    ├── chat_sessions/
    ├── mood_logs/
    └── user_settings/
  ```
- [ ] Check chat messages have correct fields
- [ ] Check mood logs have correct fields
- [ ] Check user_settings/keys document exists
- [ ] Verify timestamps are server timestamps

## Security Testing

- [ ] Try accessing another user's data (should fail)
- [ ] Check API keys not visible in Network tab
- [ ] Verify Firestore rules enforce user isolation
- [ ] Check no sensitive data in console logs
- [ ] Verify HTTPS in production

## Production Build Testing

- [ ] Run `npm run build`
- [ ] Build completes without errors
- [ ] Dist folder created
- [ ] Run `npm run preview`
- [ ] Production build works correctly
- [ ] All features functional in production mode
- [ ] Service Worker caches correctly

## Final Checks ✅

- [ ] No console errors
- [ ] No console warnings (except expected)
- [ ] All features working as specified
- [ ] UI matches glassmorphism design requirements
- [ ] Mobile-first design verified
- [ ] Real-time sync working
- [ ] Multi-model AI routing correct
- [ ] Data persistence confirmed
- [ ] Ready for user testing

## Known Limitations (Document These)

- [ ] API keys stored in Firestore (consider encryption for production)
- [ ] No message editing/deletion
- [ ] No conversation search
- [ ] No mood analytics/charts
- [ ] No export functionality
- [ ] Limited to 20 mood logs in history

## Post-Testing Notes

Document any issues found:
- Issue 1: _____________________
- Issue 2: _____________________
- Issue 3: _____________________

Performance metrics:
- Fast Response avg time: _____ ms
- Deep Think avg time: _____ ms
- Initial load time: _____ ms

## Ready for User Testing? ✅

If all critical items checked, the app is ready for user testing!

Date tested: _____________
Tested by: _____________
Version: 2.0.0
