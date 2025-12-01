import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signInWithCustomToken, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, doc, setDoc, onSnapshot, query, orderBy, limit, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export default function App() {
  // Core State
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('chat');
  const [error, setError] = useState(null);
  
  // Chat State
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatMode, setChatMode] = useState('fast');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sessionId, setSessionId] = useState(Date.now().toString());
  
  // Mood State
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodCaption, setMoodCaption] = useState('');
  const [moodLogs, setMoodLogs] = useState([]);
  const [savingMood, setSavingMood] = useState(false);
  
  // Settings State
  const [age, setAge] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  
  // Firebase refs
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);

  const moods = [
    { emoji: '😄', name: 'Joyful', value: 'joyful' },
    { emoji: '😌', name: 'Calm', value: 'calm' },
    { emoji: '😐', name: 'Neutral', value: 'neutral' },
    { emoji: '😟', name: 'Anxious', value: 'anxious' },
    { emoji: '😭', name: 'Distressed', value: 'distressed' }
  ];

  // Initialize Firebase
  useEffect(() => {
    const initFirebase = async () => {
      try {
        const app = initializeApp(window.__firebase_config);
        const authInstance = getAuth(app);
        const dbInstance = getFirestore(app);
        
        setAuth(authInstance);
        setDb(dbInstance);
        
        // Authenticate
        let userCred;
        if (window.__initial_auth_token) {
          userCred = await signInWithCustomToken(authInstance, window.__initial_auth_token);
        } else {
          userCred = await signInAnonymously(authInstance);
        }
        
        setUserId(userCred.user.uid);
        setLoading(false);
      } catch (err) {
        setError('Failed to initialize app: ' + err.message);
        setLoading(false);
      }
    };
    
    initFirebase();
  }, []);

  // Load Settings
  useEffect(() => {
    if (!db || !userId) return;
    
    const settingsRef = doc(db, 'artifacts', window.__app_id, 'users', userId, 'user_settings', 'keys');
    const unsubscribe = onSnapshot(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setAge(data.age || '');
        setGroqKey(data.groqKey || '');
        setDeepseekKey(data.deepseekKey || '');
        setGeminiKey(data.geminiKey || '');
      }
    }, (err) => {
      console.error('Settings load error:', err);
    });
    
    return () => unsubscribe();
  }, [db, userId]);

  // Load Chat History
  useEffect(() => {
    if (!db || !userId) return;
    
    const messagesRef = collection(db, 'artifacts', window.__app_id, 'users', userId, 'chat_sessions', sessionId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    }, (err) => {
      console.error('Chat load error:', err);
    });
    
    return () => unsubscribe();
  }, [db, userId, sessionId]);

  // Load Mood Logs
  useEffect(() => {
    if (!db || !userId) return;
    
    const moodRef = collection(db, 'artifacts', window.__app_id, 'users', userId, 'mood_logs');
    const q = query(moodRef, orderBy('timestamp', 'desc'), limit(20));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = [];
      snapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() });
      });
      setMoodLogs(logs);
    }, (err) => {
      console.error('Mood load error:', err);
    });
    
    return () => unsubscribe();
  }, [db, userId]);

  // Save Settings
  const saveSettings = useCallback(async () => {
    if (!db || !userId) return;
    
    setSavingSettings(true);
    try {
      const settingsRef = doc(db, 'artifacts', window.__app_id, 'users', userId, 'user_settings', 'keys');
      await setDoc(settingsRef, {
        age,
        groqKey,
        deepseekKey,
        geminiKey,
        updatedAt: serverTimestamp()
      });
      setError(null);
    } catch (err) {
      setError('Failed to save settings: ' + err.message);
    } finally {
      setSavingSettings(false);
    }
  }, [db, userId, age, groqKey, deepseekKey, geminiKey]);

  // Call AI based on mode
  const callCbtCoach = useCallback(async (userMessage, mode) => {
    const systemPrompt = `You are a warm, empathetic, non-judgmental CBT (Cognitive Behavioral Therapy) coach. Your role is to guide users through cognitive restructuring using Socratic dialogue. Ask thoughtful questions to help them examine their thoughts and feelings. Keep responses concise (2-3 sentences max). Be supportive and encouraging.`;
    
    try {
      if (mode === 'fast') {
        // Use Groq for fast responses
        if (!groqKey) {
          throw new Error('Groq API key not configured. Please add it in Settings.');
        }
        
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqKey}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              ...messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: userMessage }
            ],
            max_tokens: 200,
            temperature: 0.7
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Groq API request failed');
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
        
      } else {
        // Use Deepseek for deep thinking
        if (!deepseekKey) {
          throw new Error('Deepseek API key not configured. Please add it in Settings.');
        }
        
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${deepseekKey}`
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: systemPrompt },
              ...messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: userMessage }
            ],
            max_tokens: 400,
            temperature: 0.8
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Deepseek API request failed');
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
      }
    } catch (err) {
      throw err;
    }
  }, [groqKey, deepseekKey, messages]);

  // Send Message
  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim() || !db || !userId || sendingMessage) return;
    
    const userMsg = inputMessage.trim();
    setInputMessage('');
    setSendingMessage(true);
    setError(null);
    
    try {
      // Save user message
      const messagesRef = collection(db, 'artifacts', window.__app_id, 'users', userId, 'chat_sessions', sessionId, 'messages');
      await addDoc(messagesRef, {
        role: 'user',
        content: userMsg,
        timestamp: serverTimestamp()
      });
      
      // Get AI response
      const aiResponse = await callCbtCoach(userMsg, chatMode);
      
      // Save AI message
      await addDoc(messagesRef, {
        role: 'assistant',
        content: aiResponse,
        mode: chatMode,
        timestamp: serverTimestamp()
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setSendingMessage(false);
    }
  }, [inputMessage, db, userId, sessionId, chatMode, sendingMessage, callCbtCoach]);

  // New Session
  const startNewSession = useCallback(() => {
    setSessionId(Date.now().toString());
    setMessages([]);
  }, []);

  // Save Mood Log
  const saveMoodLog = useCallback(async () => {
    if (!selectedMood || !moodCaption.trim() || !db || !userId) return;
    
    setSavingMood(true);
    try {
      const moodRef = collection(db, 'artifacts', window.__app_id, 'users', userId, 'mood_logs');
      await addDoc(moodRef, {
        mood: selectedMood,
        caption: moodCaption.trim(),
        timestamp: serverTimestamp()
      });
      
      setSelectedMood(null);
      setMoodCaption('');
      setError(null);
    } catch (err) {
      setError('Failed to save mood: ' + err.message);
    } finally {
      setSavingMood(false);
    }
  }, [selectedMood, moodCaption, db, userId]);

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500/80 to-purple-400/80 flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
          <div className="animate-pulse text-white text-xl">Loading Reflect...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500/80 to-purple-400/80 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 mb-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl font-bold text-white">R</div>
              <h1 className="text-2xl font-bold text-white">Reflect</h1>
            </div>
            <div className="text-xs text-white/80 font-mono">ID: {userId?.slice(0, 8)}</div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/30 backdrop-blur-lg rounded-2xl p-4 mb-4 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-white/80 hover:text-white">✕</button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-2 mb-4 shadow-xl flex gap-2">
          <button
            onClick={() => setActiveView('chat')}
            className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-all ${
              activeView === 'chat'
                ? 'bg-white/40 text-white shadow-lg'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            CBT Coach
          </button>
          <button
            onClick={() => setActiveView('mood')}
            className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-all ${
              activeView === 'mood'
                ? 'bg-white/40 text-white shadow-lg'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            Mood Tracker
          </button>
          <button
            onClick={() => setActiveView('settings')}
            className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-all ${
              activeView === 'settings'
                ? 'bg-white/40 text-white shadow-lg'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Chat View */}
        {activeView === 'chat' && (
          <div className="space-y-4">
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 shadow-xl min-h-[500px] max-h-[600px] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-white/60 py-20">
                  <div className="text-6xl mb-4">💭</div>
                  <p className="text-lg">Start a conversation with your CBT coach</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-white/30 backdrop-blur-md text-white'
                            : 'bg-purple-500/30 backdrop-blur-md text-white'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        {msg.mode && (
                          <div className="text-xs text-white/60 mt-2">
                            {msg.mode === 'fast' ? '⚡ Fast' : '🧠 Deep'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-4 shadow-xl">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={startNewSession}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white text-sm font-medium transition-all"
                >
                  New Session
                </button>
                <button
                  onClick={() => setChatMode(chatMode === 'fast' ? 'deep' : 'fast')}
                  className={`px-4 py-2 rounded-xl text-white text-sm font-medium transition-all ${
                    chatMode === 'fast'
                      ? 'bg-yellow-500/40 hover:bg-yellow-500/50'
                      : 'bg-blue-500/40 hover:bg-blue-500/50'
                  }`}
                >
                  {chatMode === 'fast' ? '⚡ Fast Response' : '🧠 Deep Think'}
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Share what's on your mind..."
                  disabled={sendingMessage}
                  className="flex-1 bg-white/30 backdrop-blur-md rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button
                  onClick={sendMessage}
                  disabled={sendingMessage || !inputMessage.trim()}
                  className="px-6 py-3 bg-white/40 hover:bg-white/50 disabled:bg-white/10 disabled:cursor-not-allowed rounded-2xl text-white font-semibold transition-all"
                >
                  {sendingMessage ? '...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mood Tracker View */}
        {activeView === 'mood' && (
          <div className="space-y-4">
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">How are you feeling?</h2>
              <div className="flex justify-around mb-6">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all transform hover:scale-110 ${
                      selectedMood === mood.value
                        ? 'bg-white/40 scale-110'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <span className="text-4xl">{mood.emoji}</span>
                    <span className="text-white text-sm font-medium">{mood.name}</span>
                  </button>
                ))}
              </div>
              
              <textarea
                value={moodCaption}
                onChange={(e) => setMoodCaption(e.target.value)}
                placeholder="Why do you feel this way? (required)"
                className="w-full bg-white/30 backdrop-blur-md rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 min-h-[100px] resize-none"
              />
              
              <button
                onClick={saveMoodLog}
                disabled={!selectedMood || !moodCaption.trim() || savingMood}
                className="w-full mt-4 py-3 bg-white/40 hover:bg-white/50 disabled:bg-white/10 disabled:cursor-not-allowed rounded-2xl text-white font-semibold transition-all"
              >
                {savingMood ? 'Saving...' : 'Log Mood'}
              </button>
            </div>

            {/* Mood History */}
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 shadow-xl max-h-[400px] overflow-y-auto">
              <h3 className="text-lg font-bold text-white mb-4">Recent Logs</h3>
              {moodLogs.length === 0 ? (
                <p className="text-white/60 text-center py-8">No mood logs yet</p>
              ) : (
                <div className="space-y-3">
                  {moodLogs.map((log) => {
                    const mood = moods.find(m => m.value === log.mood);
                    return (
                      <div key={log.id} className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
                        <div className="flex items-start gap-3">
                          <span className="text-3xl">{mood?.emoji}</span>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-white font-semibold">{mood?.name}</span>
                              <span className="text-white/60 text-xs">{formatTimestamp(log.timestamp)}</span>
                            </div>
                            <p className="text-white/90 text-sm">{log.caption}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings View */}
        {activeView === 'settings' && (
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6">Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Age</label>
                <input
                  type="text"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  className="w-full bg-white/30 backdrop-blur-md rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Groq API Key <span className="text-yellow-300">(Fast Response)</span>
                </label>
                <input
                  type="password"
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  placeholder="Enter Groq API key"
                  className="w-full bg-white/30 backdrop-blur-md rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Deepseek API Key <span className="text-blue-300">(Deep Think)</span>
                </label>
                <input
                  type="password"
                  value={deepseekKey}
                  onChange={(e) => setDeepseekKey(e.target.value)}
                  placeholder="Enter Deepseek API key"
                  className="w-full bg-white/30 backdrop-blur-md rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Gemini API Key <span className="text-purple-300">(Multimodal/Future)</span>
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="Enter Gemini API key"
                  className="w-full bg-white/30 backdrop-blur-md rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              <button
                onClick={saveSettings}
                disabled={savingSettings}
                className="w-full py-3 bg-white/40 hover:bg-white/50 disabled:bg-white/10 disabled:cursor-not-allowed rounded-2xl text-white font-semibold transition-all"
              >
                {savingSettings ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
