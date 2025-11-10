import React, { useState, useEffect, useRef } from 'react';
import "./KeywordsDisplay.css";

export default function KeywordsDisplay({ keywords, sentiment = 0.5 }) {
  const [visibleKeywords, setVisibleKeywords] = useState([]);

  useEffect(() => {
    setVisibleKeywords([]);
    keywords.forEach((keyword, index) => {
      setTimeout(() => {
        setVisibleKeywords(prev => [...prev, keyword]);
      }, index * 200);
    });
  }, [keywords]);

  const getEmotionColor = (sentimentValue) => {
    // Map sentiment from 0-1 to hue from 220 (blue) to 20 (red/orange)
    const hue = 220 - (sentimentValue * 200);
    // Map sentiment to saturation from 60% to 100%
    const saturation = 60 + (sentimentValue * 40);
    // Map sentiment to lightness from 40% to 80%
    const lightness = 40 + (sentimentValue * 40);
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const emotionColor = getEmotionColor(sentiment);
  
  // Get glow intensity based on sentiment
  const getGlowIntensity = (sentimentValue) => {
    if (sentimentValue < 0.2) return '0 0 8px';
    if (sentimentValue < 0.4) return '0 0 6px';
    if (sentimentValue < 0.6) return '0 0 4px';
    if (sentimentValue < 0.8) return '0 0 10px';
    return '0 0 15px';
  };

  const boxShadow = `${getGlowIntensity(sentiment)} ${emotionColor}`;

  return (
    <div className="keywords-display">
      <h3>Key Topics</h3>
      <div className="keywords-content">
        {visibleKeywords.length === 0 ? (
          <p className="placeholder">Keywords will appear here...</p>
        ) : (
          visibleKeywords.map((keyword, idx) => (
            <span
              key={idx}
              style={{
                display: 'inline-block',
                padding: '6px 12px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: `1.5px solid ${emotionColor}`,
                borderRadius: '20px',
                color: emotionColor,
                fontSize: '13px',
                fontWeight: '500',
                boxShadow: `0 0 8px ${emotionColor}40`,
                animation: `fadeIn 0.5s ease ${idx * 0.1}s both`,
                transition: 'all 0.3s ease'
              }}
            >
              {keyword}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
