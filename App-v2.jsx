import React, { useState, useEffect, useCallback, useRef } from 'react';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signInWithCustomToken, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, doc, setDoc, onSnapshot, query, orderBy, limit, addDoc, serverTimestamp, where, getDocs, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export default function AppV2() {
  // Core State
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('chat');
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  
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
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  
  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  
  // NEW V2 Features State
  const [journalEntries, setJournalEntries] = useState([]);
  const [currentJournalEntry, setCurrentJournalEntry] = useState('');
  const [savingJournal, setSavingJournal] = useState(false);
  const [copingStrategies, setCopingStrategies] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [moodStreak, setMoodStreak] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showExercises, setShowExercises] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [showSOS, setShowSOS] = useState(false);
  const [ambientSound, setAmbientSound] = useState(null);
  const [breathingTimer, setBreathingTimer] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  
  // Firebase refs
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);

  const moods = [
    { emoji: '😄', name: 'Joyful', value: 'joyful', color: 'yellow' },
    { emoji: '😌', name: 'Calm', value: 'calm', color: 'blue' },
    { emoji: '😐', name: 'Neutral', value: 'neutral', color: 'gray' },
    { emoji: '😟', name: 'Anxious', value: 'anxious', color: 'orange' },
    { emoji: '😭', name: 'Distressed', value: 'distressed', color: 'red' }
  ];


  // CBT Exercises Library
  const cbtExercises = [
    {
      id: 'thought-record',
      name: 'Thought Record',
      icon: '📝',
      description: 'Identify and challenge automatic thoughts',
      duration: '10-15 min',
      steps: [
        'Describe the situation',
        'What automatic thoughts came up?',
        'What emotions did you feel?',
        'What evidence supports this thought?',
        'What evidence contradicts it?',
        'What\'s a more balanced thought?'
      ]
    },
    {
      id: 'cognitive-distortions',
      name: 'Distortion Checker',
      icon: '🔍',
      description: 'Identify thinking errors',
      duration: '5-10 min',
      distortions: [
        'All-or-Nothing Thinking',
        'Overgeneralization',
        'Mental Filter',
        'Discounting Positives',
        'Jumping to Conclusions',
        'Magnification/Minimization',
        'Emotional Reasoning',
        'Should Statements',
        'Labeling',
        'Personalization'
      ]
    },
    {
      id: 'behavioral-activation',
      name: 'Activity Planner',
      icon: '📅',
      description: 'Schedule mood-boosting activities',
      duration: '15-20 min'
    },
    {
      id: 'gratitude',
      name: 'Gratitude Practice',
      icon: '🙏',
      description: 'List things you\'re grateful for',
      duration: '5 min'
    },
    {
      id: 'breathing',
      name: 'Breathing Exercise',
      icon: '🫁',
      description: '4-7-8 breathing technique',
      duration: '5 min'
    }
  ];

  // Default Coping Strategies
  const defaultStrategies = [
    { id: 1, name: '4-7-8 Breathing', category: 'breathing', effectiveness: 0, timesUsed: 0 },
    { id: 2, name: '5-4-3-2-1 Grounding', category: 'grounding', effectiveness: 0, timesUsed: 0 },
    { id: 3, name: 'Progressive Muscle Relaxation', category: 'relaxation', effectiveness: 0, timesUsed: 0 },
    { id: 4, name: 'Take a Walk', category: 'physical', effectiveness: 0, timesUsed: 0 },
    { id: 5, name: 'Listen to Music', category: 'distraction', effectiveness: 0, timesUsed: 0 },
    { id: 6, name: 'Call a Friend', category: 'social', effectiveness: 0, timesUsed: 0 },
    { id: 7, name: 'Write in Journal', category: 'expression', effectiveness: 0, timesUsed: 0 },
    { id: 8, name: 'Cold Water on Face', category: 'physical', effectiveness: 0, timesUsed: 0 }
  ];

  // Achievement Definitions
  const achievementDefs = [
    { id: 'first-mood', name: 'First Step', description: 'Log your first mood', icon: '🌟', requirement: 1 },
    { id: 'week-streak', name: 'Week Warrior', description: '7-day mood logging streak', icon: '🔥', requirement: 7 },
    { id: 'month-streak', name: 'Monthly Master', description: '30-day streak', icon: '💪', requirement: 30 },
    { id: 'fifty-moods', name: 'Half Century', description: 'Log 50 moods', icon: '🎯', requirement: 50 },
    { id: 'hundred-moods', name: 'Centurion', description: 'Log 100 moods', icon: '👑', requirement: 100 },
    { id: 'first-journal', name: 'Journaler', description: 'Write your first journal entry', icon: '📖', requirement: 1 },
    { id: 'ten-journals', name: 'Prolific Writer', description: 'Write 10 journal entries', icon: '✍️', requirement: 10 },
    { id: 'first-exercise', name: 'Exercise Starter', description: 'Complete your first CBT exercise', icon: '🏋️', requirement: 1 }
  ];

  // Initialize Voice Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (activeView === 'chat') {
          setInputMessage(prev => prev + ' ' + transcript);
        } else if (activeView === 'mood') {
          setMoodCaption(prev => prev + ' ' + transcript);
        } else if (activeView === 'journal') {
          setCurrentJournalEntry(prev => prev + ' ' + transcript);
        }
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setError('Voice recognition error: ' + event.error);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [activeView]);

  // Voice Input Functions
  const startListening = useCallback(async () => {
    if (!recognitionRef.current) {
      setError('Voice recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    
    if (isListening) return;
    
    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start recognition
      recognitionRef.current.start();
      setIsListening(true);
      setError(null);
    } catch (err) {
      console.error('Error starting recognition:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('🎤 Microphone permission denied. Please allow microphone access in your browser settings and refresh the page.');
      } else if (err.name === 'NotFoundError') {
        setError('🎤 No microphone found. Please connect a microphone and try again.');
      } else {
        setError('🎤 Voice recognition error: ' + err.message);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  // Text-to-Speech Function
  const speak = useCallback((text) => {
    if (synthRef.current && ttsEnabled) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  }, [ttsEnabled]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);


  // Initialize Firebase
  useEffect(() => {
    const initFirebase = async () => {
      try {
        // Ensure SOS modal is closed on init
        setShowSOS(false);
        
        const app = initializeApp(window.__firebase_config);
        const authInstance = getAuth(app);
        const dbInstance = getFirestore(app);
        
        setAuth(authInstance);
        setDb(dbInstance);
        
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
        setDarkMode(data.darkMode || false);
        setVoiceEnabled(data.voiceEnabled !== false);
        setTtsEnabled(data.ttsEnabled !== false);
      }
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
    });
    
    return () => unsubscribe();
  }, [db, userId, sessionId]);

  // Load Mood Logs
  useEffect(() => {
    if (!db || !userId) return;
    
    const moodRef = collection(db, 'artifacts', window.__app_id, 'users', userId, 'mood_logs');
    const q = query(moodRef, orderBy('timestamp', 'desc'), limit(100));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = [];
      snapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() });
      });
      setMoodLogs(logs);
      calculateStreak(logs);
      checkAchievements(logs.length, 'mood');
    });
    
    return () => unsubscribe();
  }, [db, userId]);

  // Load Journal Entries
  useEffect(() => {
    if (!db || !userId) return;
    
    const journalRef = collection(db, 'artifacts', window.__app_id, 'users', userId, 'journal_entries');
    const q = query(journalRef, orderBy('timestamp', 'desc'), limit(50));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries = [];
      snapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() });
      });
      setJournalEntries(entries);
      checkAchievements(entries.length, 'journal');
    });
    
    return () => unsubscribe();
  }, [db, userId]);

  // Load Coping Strategies
  useEffect(() => {
    if (!db || !userId) return;
    
    const strategiesRef = collection(db, 'artifacts', window.__app_id, 'users', userId, 'coping_strategies');
    const unsubscribe = onSnapshot(strategiesRef, (snapshot) => {
      if (snapshot.empty) {
        // Initialize with defaults
        defaultStrategies.forEach(async (strategy) => {
          await addDoc(strategiesRef, strategy);
        });
      } else {
        const strats = [];
        snapshot.forEach((doc) => {
          strats.push({ id: doc.id, ...doc.data() });
        });
        setCopingStrategies(strats);
      }
    });
    
    return () => unsubscribe();
  }, [db, userId]);

  // Load Achievements
  useEffect(() => {
    if (!db || !userId) return;
    
    const achievementsRef = doc(db, 'artifacts', window.__app_id, 'users', userId, 'user_settings', 'achievements');
    const unsubscribe = onSnapshot(achievementsRef, (snapshot) => {
      if (snapshot.exists()) {
        setAchievements(snapshot.data().unlocked || []);
      }
    });
    
    return () => unsubscribe();
  }, [db, userId]);

  // Calculate Mood Streak
  const calculateStreak = useCallback((logs) => {
    if (logs.length === 0) {
      setMoodStreak(0);
      return;
    }

    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sortedLogs = [...logs].sort((a, b) => {
      const aDate = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
      const bDate = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
      return bDate - aDate;
    });

    const lastLogDate = sortedLogs[0].timestamp?.toDate ? sortedLogs[0].timestamp.toDate() : new Date(sortedLogs[0].timestamp);
    lastLogDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today - lastLogDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 1) {
      setMoodStreak(0);
      return;
    }

    for (let i = 1; i < sortedLogs.length; i++) {
      const currentDate = sortedLogs[i].timestamp?.toDate ? sortedLogs[i].timestamp.toDate() : new Date(sortedLogs[i].timestamp);
      const prevDate = sortedLogs[i-1].timestamp?.toDate ? sortedLogs[i-1].timestamp.toDate() : new Date(sortedLogs[i-1].timestamp);
      
      currentDate.setHours(0, 0, 0, 0);
      prevDate.setHours(0, 0, 0, 0);
      
      const diff = Math.floor((prevDate - currentDate) / (1000 * 60 * 60 * 24));
      
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }

    setMoodStreak(streak);
  }, []);

  // Check and Unlock Achievements
  const checkAchievements = useCallback(async (count, type) => {
    if (!db || !userId) return;

    const achievementsRef = doc(db, 'artifacts', window.__app_id, 'users', userId, 'user_settings', 'achievements');
    const currentAchievements = achievements;

    const newAchievements = [];

    if (type === 'mood') {
      if (count >= 1 && !currentAchievements.includes('first-mood')) {
        newAchievements.push('first-mood');
      }
      if (count >= 50 && !currentAchievements.includes('fifty-moods')) {
        newAchievements.push('fifty-moods');
      }
      if (count >= 100 && !currentAchievements.includes('hundred-moods')) {
        newAchievements.push('hundred-moods');
      }
      if (moodStreak >= 7 && !currentAchievements.includes('week-streak')) {
        newAchievements.push('week-streak');
      }
      if (moodStreak >= 30 && !currentAchievements.includes('month-streak')) {
        newAchievements.push('month-streak');
      }
    }

    if (type === 'journal') {
      if (count >= 1 && !currentAchievements.includes('first-journal')) {
        newAchievements.push('first-journal');
      }
      if (count >= 10 && !currentAchievements.includes('ten-journals')) {
        newAchievements.push('ten-journals');
      }
    }

    if (newAchievements.length > 0) {
      const updatedAchievements = [...currentAchievements, ...newAchievements];
      await setDoc(achievementsRef, { unlocked: updatedAchievements }, { merge: true });
      
      // Show achievement notification
      newAchievements.forEach(achId => {
        const ach = achievementDefs.find(a => a.id === achId);
        if (ach) {
          setError(`🎉 Achievement Unlocked: ${ach.name}!`);
          setTimeout(() => setError(null), 3000);
        }
      });
    }
  }, [db, userId, achievements, moodStreak]);


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
        darkMode,
        voiceEnabled,
        ttsEnabled,
        updatedAt: serverTimestamp()
      });
      setError(null);
    } catch (err) {
      setError('Failed to save settings: ' + err.message);
    } finally {
      setSavingSettings(false);
    }
  }, [db, userId, age, groqKey, deepseekKey, geminiKey, darkMode, voiceEnabled, ttsEnabled]);

  // Call AI based on mode
  const callCbtCoach = useCallback(async (userMessage, mode) => {
    const systemPrompt = mode === 'fast' 
      ? `You are a warm, empathetic, non-judgmental CBT (Cognitive Behavioral Therapy) coach. Your role is to guide users through cognitive restructuring using Socratic dialogue. Ask thoughtful questions to help them examine their thoughts and feelings. Keep responses concise (2-3 sentences max). Be supportive and encouraging.`
      : `You are a warm, empathetic, non-judgmental CBT (Cognitive Behavioral Therapy) coach specializing in deep cognitive restructuring. Provide comprehensive, thoughtful analysis of the user's thoughts and feelings. Use Socratic dialogue to guide them through examining their beliefs, identifying cognitive distortions, and developing balanced perspectives. Be thorough but compassionate. Provide 4-6 sentences with actionable insights.`;
    
    try {
      if (!groqKey) {
        throw new Error('Groq API key not configured. Please add it in Settings.');
      }
      
      // Use Groq for both modes with different parameters
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
            ...messages.slice(mode === 'fast' ? -6 : -10).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ],
          max_tokens: mode === 'fast' ? 200 : 500,
          temperature: mode === 'fast' ? 0.7 : 0.8
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Groq API request failed');
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
      
    } catch (err) {
      throw err;
    }
  }, [groqKey, messages]);

  // Send Message
  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim() || !db || !userId || sendingMessage) return;
    
    const userMsg = inputMessage.trim();
    setInputMessage('');
    setSendingMessage(true);
    setError(null);
    
    try {
      const messagesRef = collection(db, 'artifacts', window.__app_id, 'users', userId, 'chat_sessions', sessionId, 'messages');
      await addDoc(messagesRef, {
        role: 'user',
        content: userMsg,
        timestamp: serverTimestamp()
      });
      
      const aiResponse = await callCbtCoach(userMsg, chatMode);
      
      await addDoc(messagesRef, {
        role: 'assistant',
        content: aiResponse,
        mode: chatMode,
        timestamp: serverTimestamp()
      });
      
      // Speak the response if TTS is enabled
      if (ttsEnabled) {
        speak(aiResponse);
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setSendingMessage(false);
    }
  }, [inputMessage, db, userId, sessionId, chatMode, sendingMessage, callCbtCoach, ttsEnabled, speak]);

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

  // Save Journal Entry
  const saveJournalEntry = useCallback(async () => {
    if (!currentJournalEntry.trim() || !db || !userId) return;
    
    setSavingJournal(true);
    try {
      const journalRef = collection(db, 'artifacts', window.__app_id, 'users', userId, 'journal_entries');
      
      // Get AI insights if Groq key is available
      let aiInsights = null;
      if (groqKey) {
        try {
          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${groqKey}`
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: [
                { 
                  role: 'system', 
                  content: 'You are a CBT therapist analyzing a journal entry. Identify: 1) Emotional tone, 2) Any cognitive distortions, 3) Suggested CBT techniques. Be brief and supportive.' 
                },
                { role: 'user', content: currentJournalEntry }
              ],
              max_tokens: 300,
              temperature: 0.7
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            aiInsights = data.choices[0].message.content;
          }
        } catch (err) {
          console.error('AI insights error:', err);
        }
      }
      
      await addDoc(journalRef, {
        content: currentJournalEntry.trim(),
        aiInsights,
        timestamp: serverTimestamp()
      });
      
      setCurrentJournalEntry('');
      setError(null);
    } catch (err) {
      setError('Failed to save journal: ' + err.message);
    } finally {
      setSavingJournal(false);
    }
  }, [currentJournalEntry, db, userId, groqKey]);

  // Use Coping Strategy
  const useStrategy = useCallback(async (strategyId, effectiveness) => {
    if (!db || !userId) return;
    
    try {
      const strategyRef = doc(db, 'artifacts', window.__app_id, 'users', userId, 'coping_strategies', strategyId);
      const strategy = copingStrategies.find(s => s.id === strategyId);
      
      if (strategy) {
        const newTimesUsed = (strategy.timesUsed || 0) + 1;
        const newEffectiveness = effectiveness !== undefined ? effectiveness : strategy.effectiveness;
        
        await updateDoc(strategyRef, {
          timesUsed: newTimesUsed,
          effectiveness: newEffectiveness,
          lastUsed: serverTimestamp()
        });
      }
    } catch (err) {
      console.error('Error updating strategy:', err);
    }
  }, [db, userId, copingStrategies]);

  // Export Data
  const exportData = useCallback(() => {
    const data = {
      moodLogs,
      journalEntries,
      achievements,
      copingStrategies,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reflect-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [moodLogs, journalEntries, achievements, copingStrategies]);

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

  // Get mood analytics
  const getMoodAnalytics = useCallback(() => {
    if (moodLogs.length === 0) return null;

    const last7Days = moodLogs.filter(log => {
      const logDate = log.timestamp?.toDate ? log.timestamp.toDate() : new Date(log.timestamp);
      const daysDiff = (new Date() - logDate) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });

    const last30Days = moodLogs.filter(log => {
      const logDate = log.timestamp?.toDate ? log.timestamp.toDate() : new Date(log.timestamp);
      const daysDiff = (new Date() - logDate) / (1000 * 60 * 60 * 24);
      return daysDiff <= 30;
    });

    const moodCounts = {};
    moodLogs.forEach(log => {
      moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1;
    });

    const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );

    return {
      totalLogs: moodLogs.length,
      last7Days: last7Days.length,
      last30Days: last30Days.length,
      currentStreak: moodStreak,
      moodDistribution: moodCounts,
      mostCommonMood
    };
  }, [moodLogs, moodStreak]);


  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-indigo-500/80 to-purple-400/80'} flex items-center justify-center`}>
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
          <div className="animate-pulse text-white text-xl">Loading Reflect V2...</div>
        </div>
      </div>
    );
  }

  const analytics = getMoodAnalytics();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-indigo-500/80 to-purple-400/80'} p-4`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 mb-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl font-bold text-white">R</div>
              <div>
                <h1 className="text-2xl font-bold text-white">Reflect V2</h1>
                <p className="text-xs text-white/60">Enhanced Edition</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Streak Display */}
              {moodStreak > 0 && (
                <div className="bg-orange-500/30 backdrop-blur-md rounded-2xl px-4 py-2">
                  <div className="text-white font-bold">🔥 {moodStreak} Day Streak</div>
                </div>
              )}
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-all"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              {/* SOS Button */}
              <button
                onClick={() => setShowSOS(true)}
                className="px-4 py-2 bg-red-500/40 hover:bg-red-500/50 rounded-xl text-white font-semibold transition-all"
              >
                🆘 SOS
              </button>
              <div className="text-xs text-white/80 font-mono">ID: {userId?.slice(0, 8)}</div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className={`${error.includes('🎉') ? 'bg-green-500/30' : 'bg-red-500/30'} backdrop-blur-lg rounded-2xl p-4 mb-4 text-white shadow-lg`}>
            <div className="flex justify-between items-start">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-white/80 hover:text-white">✕</button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-2 mb-4 shadow-xl grid grid-cols-3 md:grid-cols-6 gap-2">
          <button
            onClick={() => setActiveView('chat')}
            className={`py-3 px-4 rounded-2xl font-semibold transition-all ${
              activeView === 'chat'
                ? 'bg-white/40 text-white shadow-lg'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            💬 Chat
          </button>
          <button
            onClick={() => setActiveView('mood')}
            className={`py-3 px-4 rounded-2xl font-semibold transition-all ${
              activeView === 'mood'
                ? 'bg-white/40 text-white shadow-lg'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            😊 Mood
          </button>
          <button
            onClick={() => setActiveView('journal')}
            className={`py-3 px-4 rounded-2xl font-semibold transition-all ${
              activeView === 'journal'
                ? 'bg-white/40 text-white shadow-lg'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            📖 Journal
          </button>
          <button
            onClick={() => setActiveView('exercises')}
            className={`py-3 px-4 rounded-2xl font-semibold transition-all ${
              activeView === 'exercises'
                ? 'bg-white/40 text-white shadow-lg'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            🏋️ Exercises
          </button>
          <button
            onClick={() => setActiveView('coping')}
            className={`py-3 px-4 rounded-2xl font-semibold transition-all ${
              activeView === 'coping'
                ? 'bg-white/40 text-white shadow-lg'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            🎯 Coping
          </button>
          <button
            onClick={() => setActiveView('settings')}
            className={`py-3 px-4 rounded-2xl font-semibold transition-all ${
              activeView === 'settings'
                ? 'bg-white/40 text-white shadow-lg'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            ⚙️ Settings
          </button>
        </div>


        {/* Chat View */}
        {activeView === 'chat' && (
          <div className="space-y-4">
            {/* Analytics Quick View */}
            {analytics && (
              <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-4 shadow-xl">
                <div className="flex justify-between items-center">
                  <div className="text-white">
                    <span className="font-semibold">📊 Quick Stats:</span>
                    <span className="ml-4">Total Moods: {analytics.totalLogs}</span>
                    <span className="ml-4">This Week: {analytics.last7Days}</span>
                    <span className="ml-4">Streak: 🔥 {analytics.currentStreak}</span>
                  </div>
                  <button
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white text-sm transition-all"
                  >
                    {showAnalytics ? 'Hide' : 'Show'} Analytics
                  </button>
                </div>
              </div>
            )}

            {/* Detailed Analytics */}
            {showAnalytics && analytics && (
              <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4">📊 Mood Analytics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
                    <div className="text-white/60 text-sm">Total Logs</div>
                    <div className="text-white text-2xl font-bold">{analytics.totalLogs}</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
                    <div className="text-white/60 text-sm">Last 7 Days</div>
                    <div className="text-white text-2xl font-bold">{analytics.last7Days}</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
                    <div className="text-white/60 text-sm">Last 30 Days</div>
                    <div className="text-white text-2xl font-bold">{analytics.last30Days}</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
                    <div className="text-white/60 text-sm">Current Streak</div>
                    <div className="text-white text-2xl font-bold">🔥 {analytics.currentStreak}</div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
                  <div className="text-white font-semibold mb-2">Mood Distribution</div>
                  {Object.entries(analytics.moodDistribution).map(([mood, count]) => {
                    const moodData = moods.find(m => m.value === mood);
                    const percentage = (count / analytics.totalLogs * 100).toFixed(1);
                    return (
                      <div key={mood} className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{moodData?.emoji}</span>
                        <span className="text-white flex-1">{moodData?.name}</span>
                        <span className="text-white/80">{count} ({percentage}%)</span>
                        <div className="w-32 bg-white/20 rounded-full h-2">
                          <div 
                            className={`bg-${moodData?.color}-400 h-2 rounded-full`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Chat Area */}
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 shadow-xl min-h-[500px] max-h-[600px] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-white/60 py-20">
                  <div className="text-6xl mb-4">💭</div>
                  <p className="text-lg">Start a conversation with your CBT coach</p>
                  {voiceEnabled && (
                    <p className="text-sm mt-2">🎤 Voice input enabled - click the mic to speak</p>
                  )}
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
                          <div className="text-xs text-white/60 mt-2 flex items-center gap-2">
                            {msg.mode === 'fast' ? '⚡ Fast' : '🧠 Deep'}
                            {msg.role === 'assistant' && ttsEnabled && (
                              <button
                                onClick={() => speak(msg.content)}
                                className="hover:text-white"
                              >
                                🔊
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Input with Voice */}
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-4 shadow-xl">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={startNewSession}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white text-sm font-medium transition-all"
                >
                  🆕 New Session
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
                {ttsEnabled && isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="px-4 py-2 bg-red-500/40 hover:bg-red-500/50 rounded-xl text-white text-sm font-medium transition-all"
                  >
                    🔇 Stop Speaking
                  </button>
                )}
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
                {voiceEnabled && (
                  <button
                    onClick={isListening ? stopListening : startListening}
                    disabled={sendingMessage}
                    className={`px-4 py-3 rounded-2xl text-white font-semibold transition-all ${
                      isListening 
                        ? 'bg-red-500/40 hover:bg-red-500/50 animate-pulse' 
                        : 'bg-white/40 hover:bg-white/50'
                    }`}
                  >
                    {isListening ? '🎤 Listening...' : '🎤'}
                  </button>
                )}
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
              <div className="flex justify-around mb-6 flex-wrap gap-4">
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
              
              <div className="relative">
                <textarea
                  value={moodCaption}
                  onChange={(e) => setMoodCaption(e.target.value)}
                  placeholder="Why do you feel this way? (required)"
                  className="w-full bg-white/30 backdrop-blur-md rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 min-h-[100px] resize-none"
                />
                {voiceEnabled && (
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`absolute bottom-4 right-4 p-3 rounded-xl text-white transition-all ${
                      isListening 
                        ? 'bg-red-500/40 animate-pulse' 
                        : 'bg-white/40 hover:bg-white/50'
                    }`}
                  >
                    {isListening ? '🎤 Listening...' : '🎤'}
                  </button>
                )}
              </div>
              
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Recent Logs</h3>
                <button
                  onClick={exportData}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white text-sm transition-all"
                >
                  📤 Export Data
                </button>
              </div>
              {moodLogs.length === 0 ? (
                <p className="text-white/60 text-center py-8">No mood logs yet</p>
              ) : (
                <div className="space-y-3">
                  {moodLogs.slice(0, 20).map((log) => {
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


        {/* Journal View */}
        {activeView === 'journal' && (
          <div className="space-y-4">
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">📖 Journal Entry</h2>
              <div className="relative">
                <textarea
                  value={currentJournalEntry}
                  onChange={(e) => setCurrentJournalEntry(e.target.value)}
                  placeholder="Write about your thoughts, feelings, and experiences..."
                  className="w-full bg-white/30 backdrop-blur-md rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 min-h-[200px] resize-none"
                />
                {voiceEnabled && (
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`absolute bottom-4 right-4 p-3 rounded-xl text-white transition-all ${
                      isListening 
                        ? 'bg-red-500/40 animate-pulse' 
                        : 'bg-white/40 hover:bg-white/50'
                    }`}
                  >
                    {isListening ? '🎤 Listening...' : '🎤 Voice Input'}
                  </button>
                )}
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={saveJournalEntry}
                  disabled={!currentJournalEntry.trim() || savingJournal}
                  className="flex-1 py-3 bg-white/40 hover:bg-white/50 disabled:bg-white/10 disabled:cursor-not-allowed rounded-2xl text-white font-semibold transition-all"
                >
                  {savingJournal ? 'Saving & Analyzing...' : '💾 Save Entry'}
                </button>
                {groqKey && (
                  <div className="text-white/60 text-xs flex items-center px-4">
                    ✨ AI insights enabled
                  </div>
                )}
              </div>
            </div>

            {/* Journal History */}
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 shadow-xl max-h-[500px] overflow-y-auto">
              <h3 className="text-lg font-bold text-white mb-4">Past Entries</h3>
              {journalEntries.length === 0 ? (
                <p className="text-white/60 text-center py-8">No journal entries yet</p>
              ) : (
                <div className="space-y-4">
                  {journalEntries.map((entry) => (
                    <div key={entry.id} className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-white/60 text-xs">{formatTimestamp(entry.timestamp)}</span>
                      </div>
                      <p className="text-white/90 text-sm mb-3 whitespace-pre-wrap">{entry.content}</p>
                      {entry.aiInsights && (
                        <div className="bg-purple-500/20 backdrop-blur-md rounded-xl p-3 mt-3">
                          <div className="text-white/80 text-xs font-semibold mb-1">✨ AI Insights:</div>
                          <p className="text-white/70 text-xs whitespace-pre-wrap">{entry.aiInsights}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}


        {/* CBT Exercises View */}
        {activeView === 'exercises' && (
          <div className="space-y-4">
            {!currentExercise ? (
              <>
                <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
                  <h2 className="text-xl font-bold text-white mb-4">🏋️ CBT Exercise Library</h2>
                  <p className="text-white/80 mb-6">Choose an exercise to practice CBT techniques</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cbtExercises.map((exercise) => (
                      <button
                        key={exercise.id}
                        onClick={() => setCurrentExercise(exercise)}
                        className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-left hover:bg-white/30 transition-all"
                      >
                        <div className="text-4xl mb-3">{exercise.icon}</div>
                        <h3 className="text-white font-bold text-lg mb-2">{exercise.name}</h3>
                        <p className="text-white/70 text-sm mb-3">{exercise.description}</p>
                        <div className="text-white/60 text-xs">⏱️ {exercise.duration}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Breathing Exercise Quick Access */}
                <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-4">🫁 Quick Breathing Exercise</h3>
                  <p className="text-white/80 mb-4">4-7-8 Breathing Technique</p>
                  
                  {!isBreathing ? (
                    <button
                      onClick={() => {
                        setIsBreathing(true);
                        setBreathingTimer(0);
                        const interval = setInterval(() => {
                          setBreathingTimer(prev => {
                            if (prev >= 19) {
                              clearInterval(interval);
                              setIsBreathing(false);
                              return 0;
                            }
                            return prev + 1;
                          });
                        }, 1000);
                      }}
                      className="w-full py-4 bg-blue-500/40 hover:bg-blue-500/50 rounded-2xl text-white font-semibold transition-all"
                    >
                      Start Breathing Exercise
                    </button>
                  ) : (
                    <div className="text-center">
                      <div className="text-6xl text-white mb-4">
                        {breathingTimer < 4 ? '😮 Breathe In' : breathingTimer < 11 ? '😌 Hold' : '😤 Breathe Out'}
                      </div>
                      <div className="text-4xl text-white font-bold mb-4">
                        {breathingTimer < 4 ? 4 - breathingTimer : breathingTimer < 11 ? 11 - breathingTimer : 19 - breathingTimer}
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-4 mb-4">
                        <div 
                          className="bg-blue-400 h-4 rounded-full transition-all duration-1000"
                          style={{ width: `${(breathingTimer / 19) * 100}%` }}
                        />
                      </div>
                      <button
                        onClick={() => {
                          setIsBreathing(false);
                          setBreathingTimer(0);
                        }}
                        className="px-6 py-2 bg-red-500/40 hover:bg-red-500/50 rounded-xl text-white transition-all"
                      >
                        Stop
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
                <button
                  onClick={() => setCurrentExercise(null)}
                  className="mb-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-all"
                >
                  ← Back to Exercises
                </button>
                
                <div className="text-4xl mb-4">{currentExercise.icon}</div>
                <h2 className="text-2xl font-bold text-white mb-2">{currentExercise.name}</h2>
                <p className="text-white/80 mb-4">{currentExercise.description}</p>
                <div className="text-white/60 text-sm mb-6">⏱️ {currentExercise.duration}</div>
                
                {currentExercise.steps && (
                  <div className="space-y-3">
                    <h3 className="text-white font-semibold mb-3">Steps:</h3>
                    {currentExercise.steps.map((step, index) => (
                      <div key={index} className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                        <div className="flex gap-3">
                          <div className="text-white font-bold">{index + 1}.</div>
                          <div className="text-white/90">{step}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {currentExercise.distortions && (
                  <div className="space-y-2">
                    <h3 className="text-white font-semibold mb-3">Common Cognitive Distortions:</h3>
                    {currentExercise.distortions.map((distortion, index) => (
                      <div key={index} className="bg-white/20 backdrop-blur-md rounded-xl p-3">
                        <div className="text-white/90 text-sm">{distortion}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}


        {/* Coping Toolkit View */}
        {activeView === 'coping' && (
          <div className="space-y-4">
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">🎯 Your Coping Toolkit</h2>
              <p className="text-white/80 mb-6">Track what helps you feel better</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {copingStrategies.map((strategy) => (
                  <div key={strategy.id} className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-white font-semibold">{strategy.name}</h3>
                      <span className="text-white/60 text-xs">{strategy.category}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-white/70 text-sm">Effectiveness:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => useStrategy(strategy.id, star)}
                            className="text-lg hover:scale-110 transition-transform"
                          >
                            {star <= (strategy.effectiveness || 0) ? '⭐' : '☆'}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-xs">Used {strategy.timesUsed || 0} times</span>
                      <button
                        onClick={() => useStrategy(strategy.id)}
                        className="px-4 py-2 bg-white/30 hover:bg-white/40 rounded-xl text-white text-sm transition-all"
                      >
                        Use Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">🏅 Achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievementDefs.map((achievement) => {
                  const unlocked = achievements.includes(achievement.id);
                  return (
                    <div
                      key={achievement.id}
                      className={`rounded-2xl p-4 text-center transition-all ${
                        unlocked 
                          ? 'bg-yellow-500/30 backdrop-blur-md' 
                          : 'bg-white/10 backdrop-blur-md opacity-50'
                      }`}
                    >
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <div className="text-white font-semibold text-sm mb-1">{achievement.name}</div>
                      <div className="text-white/70 text-xs">{achievement.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}


        {/* Settings View */}
        {activeView === 'settings' && (
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6">⚙️ Settings</h2>
            
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
                  Deepseek API Key <span className="text-blue-300">(Optional - Not needed, using Groq for both modes)</span>
                </label>
                <input
                  type="password"
                  value={deepseekKey}
                  onChange={(e) => setDeepseekKey(e.target.value)}
                  placeholder="Optional - Groq is used for both modes"
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

              {/* Voice Settings */}
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
                <h3 className="text-white font-semibold mb-3">🎤 Voice Settings</h3>
                
                <div className="mb-3">
                  <button
                    onClick={async () => {
                      try {
                        await navigator.mediaDevices.getUserMedia({ audio: true });
                        setError('✅ Microphone permission granted! Voice features are ready.');
                        setTimeout(() => setError(null), 3000);
                      } catch (err) {
                        setError('❌ Microphone permission denied. Please allow microphone access in your browser settings.');
                      }
                    }}
                    className="w-full py-3 bg-blue-500/40 hover:bg-blue-500/50 rounded-xl text-white font-semibold transition-all"
                  >
                    🎤 Test Microphone Permission
                  </button>
                  <p className="text-white/60 text-xs mt-2">Click to request microphone access</p>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white">Voice Input</span>
                  <button
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      voiceEnabled 
                        ? 'bg-green-500/40 text-white' 
                        : 'bg-white/20 text-white/60'
                    }`}
                  >
                    {voiceEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white">Text-to-Speech</span>
                  <button
                    onClick={() => setTtsEnabled(!ttsEnabled)}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      ttsEnabled 
                        ? 'bg-green-500/40 text-white' 
                        : 'bg-white/20 text-white/60'
                    }`}
                  >
                    {ttsEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>

              {/* Theme Settings */}
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
                <h3 className="text-white font-semibold mb-3">🎨 Appearance</h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-white">Dark Mode</span>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      darkMode 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-yellow-500/40 text-white'
                    }`}
                  >
                    {darkMode ? '🌙 Dark' : '☀️ Light'}
                  </button>
                </div>
              </div>

              <button
                onClick={saveSettings}
                disabled={savingSettings}
                className="w-full py-3 bg-white/40 hover:bg-white/50 disabled:bg-white/10 disabled:cursor-not-allowed rounded-2xl text-white font-semibold transition-all"
              >
                {savingSettings ? 'Saving...' : 'Save Settings'}
              </button>

              <button
                onClick={exportData}
                className="w-full py-3 bg-blue-500/40 hover:bg-blue-500/50 rounded-2xl text-white font-semibold transition-all"
              >
                📤 Export All Data
              </button>
            </div>
          </div>
        )}

        {/* SOS Modal */}
        {showSOS && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">🆘 Crisis Resources</h2>
                <button
                  onClick={() => setShowSOS(false)}
                  className="text-white/80 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-red-500/30 backdrop-blur-md rounded-2xl p-4">
                  <h3 className="text-white font-bold mb-2">🚨 Emergency</h3>
                  <p className="text-white/90 text-sm mb-3">If you're in immediate danger, call emergency services</p>
                  <a
                    href="tel:911"
                    className="block w-full py-3 bg-red-500/60 hover:bg-red-500/70 rounded-xl text-white font-bold text-center transition-all"
                  >
                    📞 Call 911
                  </a>
                </div>

                <div className="bg-blue-500/30 backdrop-blur-md rounded-2xl p-4">
                  <h3 className="text-white font-bold mb-2">💙 Crisis Hotlines</h3>
                  <div className="space-y-2">
                    <a
                      href="tel:988"
                      className="block w-full py-3 bg-blue-500/40 hover:bg-blue-500/50 rounded-xl text-white font-semibold text-center transition-all"
                    >
                      📞 988 - Suicide & Crisis Lifeline
                    </a>
                    <a
                      href="sms:741741"
                      className="block w-full py-3 bg-blue-500/40 hover:bg-blue-500/50 rounded-xl text-white font-semibold text-center transition-all"
                    >
                      💬 Text HOME to 741741 - Crisis Text Line
                    </a>
                  </div>
                </div>

                <div className="bg-purple-500/30 backdrop-blur-md rounded-2xl p-4">
                  <h3 className="text-white font-bold mb-2">🫁 Quick Coping Strategies</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setShowSOS(false);
                        setActiveView('exercises');
                        setIsBreathing(true);
                      }}
                      className="py-3 bg-purple-500/40 hover:bg-purple-500/50 rounded-xl text-white text-sm transition-all"
                    >
                      🫁 Breathing Exercise
                    </button>
                    <button
                      onClick={() => {
                        setShowSOS(false);
                        setActiveView('coping');
                      }}
                      className="py-3 bg-purple-500/40 hover:bg-purple-500/50 rounded-xl text-white text-sm transition-all"
                    >
                      🎯 Coping Toolkit
                    </button>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
                  <p className="text-white/80 text-sm text-center">
                    You're not alone. Help is available 24/7.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
