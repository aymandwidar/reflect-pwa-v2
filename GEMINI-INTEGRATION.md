# Gemini AI Integration Guide

## 🧠 Complete Gemini Integration for Reflect V3

---

## 🎯 Why Gemini?

- **Multimodal:** Can analyze images (future feature)
- **Long context:** 32K tokens (great for therapy sessions)
- **Free tier:** Generous limits
- **Google quality:** Reliable and fast
- **Latest models:** Gemini 2.0 Flash

---

## 🔑 Step 1: Get Gemini API Key

1. **Go to:** https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click "Create API Key"**
4. **Copy the key** (starts with `AIza...`)
5. **Save it securely**

---

## 💻 Step 2: Add Gemini to Your App

### In Settings State:

```javascript
const [geminiKey, setGeminiKey] = useState('');
```

### In Settings UI:

```javascript
<div>
  <label className="block text-white font-medium mb-2">
    Gemini API Key <span className="text-purple-300">(Multimodal AI)</span>
  </label>
  <input
    type="password"
    value={geminiKey}
    onChange={(e) => setGeminiKey(e.target.value)}
    placeholder="Enter Gemini API key"
    className="w-full bg-white/30 backdrop-blur-md rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
  />
</div>
```

---

## 🤖 Step 3: Create Gemini API Function

```javascript
const callGemini = async (userMessage, systemPrompt, conversationHistory = []) => {
  if (!geminiKey) {
    throw new Error('Gemini API key not configured. Please add it in Settings.');
  }

  try {
    // Build conversation context
    const context = systemPrompt + '\n\n' + 
      conversationHistory.map(msg => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: context + '\n\nUser: ' + userMessage
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_NONE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_NONE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_NONE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_NONE'
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Gemini API request failed');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;

  } catch (err) {
    throw err;
  }
};
```

---

## 🎯 Step 4: Integrate with Chat System

### Update callCbtCoach function:

```javascript
const callCbtCoach = useCallback(async (userMessage, mode) => {
  const systemPrompt = mode === 'fast' 
    ? `You are a warm, empathetic CBT coach. Keep responses concise (2-3 sentences).`
    : mode === 'deep'
    ? `You are a CBT coach providing comprehensive analysis. Give 4-6 sentences with actionable insights.`
    : `You are an advanced CBT therapist using Gemini AI. Provide deep, nuanced therapeutic responses with multiple perspectives.`;
  
  try {
    if (mode === 'gemini') {
      // Use Gemini
      return await callGemini(userMessage, systemPrompt, messages.slice(-10));
    } else if (mode === 'fast' || mode === 'deep') {
      // Use Groq (existing code)
      return await callGroq(userMessage, mode);
    }
  } catch (err) {
    throw err;
  }
}, [geminiKey, groqKey, messages]);
```

---

## 🎨 Step 5: Add Gemini Mode Toggle

### Update Chat UI:

```javascript
<div className="flex gap-2 mb-3">
  <button
    onClick={startNewSession}
    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white text-sm font-medium transition-all"
  >
    🆕 New Session
  </button>
  
  <button
    onClick={() => setChatMode('fast')}
    className={`px-4 py-2 rounded-xl text-white text-sm font-medium transition-all ${
      chatMode === 'fast'
        ? 'bg-yellow-500/40'
        : 'bg-white/20 hover:bg-white/30'
    }`}
  >
    ⚡ Fast
  </button>
  
  <button
    onClick={() => setChatMode('deep')}
    className={`px-4 py-2 rounded-xl text-white text-sm font-medium transition-all ${
      chatMode === 'deep'
        ? 'bg-blue-500/40'
        : 'bg-white/20 hover:bg-white/30'
    }`}
  >
    🧠 Deep
  </button>
  
  <button
    onClick={() => setChatMode('gemini')}
    className={`px-4 py-2 rounded-xl text-white text-sm font-medium transition-all ${
      chatMode === 'gemini'
        ? 'bg-purple-500/40'
        : 'bg-white/20 hover:bg-white/30'
    }`}
  >
    ✨ Gemini
  </button>
</div>
```

---

## 🌟 Step 6: Advanced Gemini Features

### 6.1 Multimodal (Image Analysis)

```javascript
const analyzeImage = async (imageBase64) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: "Analyze this image from a CBT perspective. What emotions or thoughts might it represent?"
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }]
      })
    }
  );
  
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};
```

### 6.2 Long Context Therapy Sessions

```javascript
const conductTherapySession = async (sessionType) => {
  // Get all context
  const recentMoods = await getRecentMoods(30); // Last 30 days
  const recentJournals = await getRecentJournals(10);
  const chatHistory = messages.slice(-50); // Last 50 messages
  
  // Build comprehensive context
  const context = `
    You are conducting a ${sessionType} therapy session.
    
    Recent Mood Patterns:
    ${recentMoods.map(m => `${m.mood}: ${m.caption}`).join('\n')}
    
    Recent Journal Entries:
    ${recentJournals.map(j => j.content).join('\n\n')}
    
    Previous Conversation:
    ${chatHistory.map(m => `${m.role}: ${m.content}`).join('\n')}
  `;
  
  return await callGemini(
    "Based on all this context, provide a comprehensive therapeutic assessment and action plan.",
    context
  );
};
```

### 6.3 Crisis Detection with Gemini

```javascript
const detectCrisisWithGemini = async (message) => {
  const response = await callGemini(
    message,
    `You are a crisis detection system. Analyze this message and respond with ONLY "CRISIS" or "SAFE". 
     Detect: suicidal ideation, self-harm, immediate danger.`
  );
  
  return response.trim().toUpperCase() === 'CRISIS';
};
```

---

## 📊 Step 7: Gemini for Journal Insights

```javascript
const getJournalInsights = async (journalEntry) => {
  const insights = await callGemini(
    journalEntry,
    `You are a CBT therapist analyzing a journal entry. Provide:
     1. Emotional tone (1-2 sentences)
     2. Cognitive distortions identified (if any)
     3. Suggested CBT techniques (2-3 specific techniques)
     4. Positive patterns noticed
     
     Be supportive and constructive.`
  );
  
  return insights;
};
```

---

## 🎯 Step 8: Gemini for Program Content

```javascript
const generatePersonalizedLesson = async (programDay, userContext) => {
  const lesson = await callGemini(
    `Generate a personalized CBT lesson for day ${programDay}`,
    `You are creating personalized CBT content.
     
     User Context:
     - Recent moods: ${userContext.moods}
     - Main challenges: ${userContext.challenges}
     - Progress so far: ${userContext.progress}
     
     Create a lesson that:
     1. Addresses their specific challenges
     2. Builds on previous progress
     3. Includes practical exercises
     4. Is encouraging and supportive`
  );
  
  return lesson;
};
```

---

## 💰 Gemini Pricing & Limits

### Free Tier:
- **15 requests per minute**
- **1 million tokens per day**
- **1500 requests per day**

### Paid Tier:
- **$0.00025 per 1K characters** (input)
- **$0.0005 per 1K characters** (output)
- Very affordable!

### For 1000 Users:
- Average: ~$20-50/month
- Much cheaper than other AI APIs

---

## 🔐 Security Best Practices

1. **Never expose API key** in client code
2. **Store in Firestore** (user's private space)
3. **Validate all inputs** before sending to Gemini
4. **Handle errors gracefully**
5. **Rate limit requests** to avoid abuse

---

## 🧪 Testing Gemini Integration

### Test 1: Basic Response
```javascript
const testGemini = async () => {
  try {
    const response = await callGemini(
      "Hello, I'm feeling anxious",
      "You are a CBT coach"
    );
    console.log('Gemini Response:', response);
  } catch (err) {
    console.error('Gemini Error:', err);
  }
};
```

### Test 2: Long Context
```javascript
const testLongContext = async () => {
  const longHistory = messages.slice(-30);
  const response = await callGemini(
    "Summarize my progress",
    "You are reviewing therapy progress",
    longHistory
  );
  console.log('Summary:', response);
};
```

### Test 3: Multimodal
```javascript
const testImageAnalysis = async () => {
  const imageData = await captureImage();
  const analysis = await analyzeImage(imageData);
  console.log('Image Analysis:', analysis);
};
```

---

## 🚀 Deployment Checklist

- [ ] Gemini API key obtained
- [ ] API key added to Settings
- [ ] Gemini mode toggle added
- [ ] callGemini function implemented
- [ ] Error handling added
- [ ] Tested with various inputs
- [ ] Multimodal features (optional)
- [ ] Rate limiting implemented
- [ ] Deployed to Vercel
- [ ] Tested on production

---

## 📚 Additional Resources

- **Gemini API Docs:** https://ai.google.dev/docs
- **Gemini Models:** https://ai.google.dev/models/gemini
- **Pricing:** https://ai.google.dev/pricing
- **Safety Settings:** https://ai.google.dev/docs/safety_setting_gemini

---

## 🎉 Benefits of Gemini Integration

1. **Multimodal:** Future image analysis
2. **Long Context:** Better therapy sessions
3. **Cost-Effective:** Cheaper than alternatives
4. **High Quality:** Google's best AI
5. **Fast:** Low latency responses
6. **Reliable:** 99.9% uptime
7. **Safe:** Built-in safety filters
8. **Scalable:** Handles growth easily

---

## 🔄 Gemini vs Groq vs Deepseek

| Feature | Groq | Deepseek | Gemini |
|---------|------|----------|--------|
| Speed | ⚡⚡⚡ | ⚡⚡ | ⚡⚡⚡ |
| Quality | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Context | 8K | 16K | 32K |
| Cost | Free | Paid | Free/Cheap |
| Multimodal | ❌ | ❌ | ✅ |
| Best For | Speed | Reasoning | Everything |

---

**Gemini is the perfect addition to your AI toolkit!** 🚀

Use:
- **Groq** for fast chat
- **Deepseek** for deep reasoning (if you have credits)
- **Gemini** for comprehensive therapy sessions and future multimodal features

---

**Ready to integrate Gemini? Follow the steps above!** ✨
