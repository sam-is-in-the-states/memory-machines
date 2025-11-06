import React, { useState, useEffect, useRef } from 'react';

export default function TranscriptDisplay ({ transcript }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className="transcript-display">
      <h3>Live Transcript</h3>
      <div className="transcript-content" ref={scrollRef}>
        {transcript.length === 0 ? (
          <p className="placeholder">Start speaking to see transcript...</p>
        ) : (
          transcript.map((line, idx) => (
            <p key={idx} className="transcript-line">{line}</p>
          ))
        )}
      </div>
    </div>
  );
};