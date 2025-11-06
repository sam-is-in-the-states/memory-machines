import React, { useState } from 'react';
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

  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Placeholder: simulate some data
      setTimeout(() => {
        setTranscript(prev => [...prev, "This is a sample transcript line..."]);
        setKeywords(['innovation', 'technology', 'future']);
        setSentiment(0.7);
      }, 2000);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="app">
      <AuraVisualization sentiment={sentiment} keywords={keywords} />

      <div className="content-wrapper">
        <div className="display-container">
          <TranscriptDisplay transcript={transcript} />
          <KeywordsDisplay keywords={keywords} />
        </div>
        <Controls isRecording={isRecording} onToggle={handleToggleRecording} />
      </div>
    </div>
  );
};

export default App;
