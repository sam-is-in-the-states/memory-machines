import React, { useState, useEffect, useRef } from 'react';

export default function Controls ({ isRecording, onToggle }) {
  return (
    <div className="controls">
      <button 
        className={`control-button ${isRecording ? 'recording' : ''}`}
        onClick={onToggle}
      >
        <span className="button-icon">
          {isRecording ? '⏹' : '🎤'}
        </span>
        <span className="button-text">
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </span>
        {isRecording && <span className="recording-indicator"></span>}
      </button>
    </div>
  );
};
