import React, { useState, useRef, useEffect } from 'react';
import AuraVisualization from './components/AuraVisualization/AuraVisualization.jsx';
import TranscriptDisplay from './components/TranscriptDisplay/TranscriptDisplay.jsx';
import KeywordsDisplay from './components/KeywordsDisplay/KeywordsDisplay.jsx';
import Controls from './components/Controls/Controls.jsx';
import './App.css';

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [sentiment, setSentiment] = useState(0.5);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState(null);

  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);
  const deepgramSocketRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const DEEPGRAM_URL = process.env.REACT_APP_DEEPGRAM_BASE_URL;

  useEffect(() => {
    const fetchKey = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/get-deepgram-key`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const data = await res.json();

        if (!data.api_key) throw new Error("No API key returned from server");
        setApiKey(data.api_key);
      } catch (err) {
        console.error("Failed to fetch Deepgram key:", err);
        setError("Failed to fetch API key. Please try again later.");
      }
    };

    fetchKey();
  }, []);

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Process text through backend
  const processText = async (text) => {
    try {
      setKeywords(["Processing emotion..."]);
      const response = await fetch(`${BACKEND_URL}/process_text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process text');
      }
      
      const data = await response.json();
      
      // Update state with processed data
      setSentiment(data.sentiment);
      setKeywords(data.keywords);
      
      console.log('Processed data:', data);
    } catch (err) {
      console.error('Error processing text:', err);
      setKeywords(["Processing Failed"]);
    }
  };

  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });
      
      mediaStreamRef.current = stream;
      
      // Create AudioContext with default sample rate
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      
      // Get the actual sample rate
      const sampleRate = audioContext.sampleRate;
      console.log('AudioContext sample rate:', sampleRate);
      
      // Create WebSocket with sample_rate and encoding parameters
      const wsUrl = `${DEEPGRAM_URL}?encoding=linear16&sample_rate=${sampleRate}&model=nova-2`;
      const socket = new WebSocket(wsUrl, ['token', apiKey]);
      
      deepgramSocketRef.current = socket;
      
      socket.onopen = () => {
        console.log('Deepgram WebSocket connected');
        
        const source = audioContext.createMediaStreamSource(stream);
        sourceRef.current = source;
        
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;
        
        processor.onaudioprocess = (e) => {
          if (socket.readyState === WebSocket.OPEN) {
            const inputData = e.inputBuffer.getChannelData(0);
            
            // Convert to PCM16 without resampling
            const pcm16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              pcm16[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7fff;
            }
            
            socket.send(pcm16.buffer);
          }
        };
        
        source.connect(processor);
        processor.connect(audioContext.destination);
        setIsRecording(true);
      };
      
      socket.onmessage = (message) => {
        const received = JSON.parse(message.data);
        const transcriptText = received.channel?.alternatives[0]?.transcript;
        const isFinal = received.is_final;
        
        if (transcriptText && transcriptText.trim() !== '') {
          setTranscript((prev) => {
            if (isFinal) return [...prev, transcriptText];
            const newTranscript = [...prev];
            if (newTranscript.length > 0 && !newTranscript[newTranscript.length - 1].endsWith('.')) {
              newTranscript[newTranscript.length - 1] = transcriptText;
            } else newTranscript.push(transcriptText);
            return newTranscript;
          });
          if (isFinal) processText(transcriptText);
        }
      };
      
      socket.onerror = (error) => {
        console.error('Deepgram WebSocket error:', error);
        setKeywords(["Connection Failed"]);
        setError('Connection error. Please check your API key and internet connection.');
        stopRecording();
      };
      
      socket.onclose = () => {
        console.log('Deepgram WebSocket closed');
      };
    } catch (err) {
      console.error('Error starting recording:', err);
      setKeywords(["Connection Failed"]);
      setError(`Failed to start recording: ${err.message}`);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (processorRef.current) processorRef.current.disconnect();
    if (sourceRef.current) sourceRef.current.disconnect();
    if (audioContextRef.current) audioContextRef.current.close();
    if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach((t) => t.stop());

    if (deepgramSocketRef.current) deepgramSocketRef.current.close();
    deepgramSocketRef.current = null;

    setIsRecording(false);
  };

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);
  
  return (
    <div className="app">
      <AuraVisualization sentiment={sentiment} keywords={keywords} />

      <div className="content-wrapper">
        <div className="display-container">
          <TranscriptDisplay transcript={transcript} />
          <KeywordsDisplay sentiment={sentiment} keywords={keywords} />
        </div>
        <Controls isRecording={isRecording} onToggle={handleToggleRecording} />
      </div>
    </div>
  );
};

export default App;
