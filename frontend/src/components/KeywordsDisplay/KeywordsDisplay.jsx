import React, { useState, useEffect, useRef } from 'react';
import "./KeywordsDisplay.css";

export default function KeywordsDisplay({ keywords }) {
  const [visibleKeywords, setVisibleKeywords] = useState([]);

  useEffect(() => {
    setVisibleKeywords([]);
    keywords.forEach((keyword, index) => {
      setTimeout(() => {
        setVisibleKeywords(prev => [...prev, keyword]);
      }, index * 200);
    });
  }, [keywords]);

  return (
    <div className="keywords-display">
      <h3>Key Topics</h3>
      <div className="keywords-content">
        {visibleKeywords.length === 0 ? (
          <p className="placeholder">Keywords will appear here...</p>
        ) : (
          visibleKeywords.map((keyword, idx) => (
            <span key={idx} className="keyword-tag" style={{ animationDelay: `${idx * 0.1}s` }}>
              {keyword}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
