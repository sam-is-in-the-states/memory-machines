import React, { useEffect, useRef } from 'react';

export default function AuraVisualization({ sentiment, keywords }) {
  const canvasRef = useRef(null);
  const sketchRef = useRef(null);
  const sentimentRef = useRef(sentiment);

  // Update sentiment ref when prop changes
  useEffect(() => {
    sentimentRef.current = sentiment;
    console.log("Updated sentiment:", sentimentRef.current);
  }, [sentiment]);

  useEffect(() => {
    // Load p5.js if not already loaded
    const loadP5 = () => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js';
      script.onload = () => initSketch();
      document.head.appendChild(script);
    };

    const initSketch = () => {
      const sketch = (p) => {
        let particles = [];
        let flowField = [];
        let cols, rows;
        let scale = 20;
        let zoff = 0;
        let currentSentiment = sentiment;
        let targetSentiment = sentiment;

        p.setup = () => {
          p.createCanvas(p.windowWidth, p.windowHeight);
          cols = Math.floor(p.windowWidth / scale);
          rows = Math.floor(p.windowHeight / scale);

          for (let i = 0; i < 500; i++) {
            particles.push(new Particle(p));
          }
        };

        p.draw = () => {
          targetSentiment = sentimentRef.current;
          currentSentiment = p.lerp(currentSentiment, targetSentiment, 0.05);

          const hue = p.map(currentSentiment, 0, 1, 220, 20);
          const alpha = p.map(currentSentiment, 0, 1, 15, 25);
          p.background(0, 0, 0, alpha);

          let yoff = 0;
          for (let y = 0; y < rows; y++) {
            let xoff = 0;
            for (let x = 0; x < cols; x++) {
              let index = x + y * cols;
              let angle = p.noise(xoff, yoff, zoff) * p.TWO_PI * 2;
              let v = p.createVector(Math.cos(angle), Math.sin(angle));
              v.setMag(0.5);
              flowField[index] = v;
              xoff += 0.1;
            }
            yoff += 0.1;
          }

          zoff += 0.003 * (1 + currentSentiment * 0.5);

          for (let particle of particles) {
            particle.follow(flowField, cols, scale, currentSentiment, hue, p);
            particle.update(p);
            particle.edges(p);
            particle.show(p, currentSentiment);
          }
        };

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
          cols = Math.floor(p.windowWidth / scale);
          rows = Math.floor(p.windowHeight / scale);
        };

        class Particle {
          constructor(p) {
            this.pos = p.createVector(p.random(p.width), p.random(p.height));
            this.vel = p.createVector(0, 0);
            this.acc = p.createVector(0, 0);
            this.maxSpeed = 2;
            this.prevPos = this.pos.copy();
          }

          follow(vectors, cols, scale, sentiment, hue, p) {
            let x = Math.floor(this.pos.x / scale);
            let y = Math.floor(this.pos.y / scale);
            let index = x + y * cols;
            let force = vectors[index];
            if (force) this.applyForce(force);
          }

          applyForce(force) {
            this.acc.add(force);
          }

          update(p) {
            if (sentimentRef.current < 0.2) {
              this.vel.add(p.createVector(p.random(-0.8, 0.8), p.random(-0.8, 0.8)));
              this.maxSpeed = 3.5;
              this.vel.mult(0.92);
            }
            else if (sentimentRef.current < 0.4) {
              this.vel.add(p.createVector(p.random(-0.4, 0.4), p.random(-0.4, 0.4)));
              this.maxSpeed = 2.8;
              this.vel.mult(0.94);
            }
            else if (sentimentRef.current < 0.6) {
              this.vel.add(p.createVector(p.random(-0.2, 0.2), p.random(-0.2, 0.2)));
              this.maxSpeed = 2.2;
              this.vel.mult(0.96);
            }
            else if (sentimentRef.current < 0.8) {
              this.maxSpeed = 1.8;
              this.vel.mult(0.97);
            }
            else {
              this.maxSpeed = 1.4;
              this.vel.mult(0.98);
            }
            
            this.vel.add(this.acc);
            this.vel.limit(this.maxSpeed);
            this.pos.add(this.vel);
            this.acc.mult(0);
          }

          show(p, currentSentiment) {
            const hue = 220 - (currentSentiment * 200);
            const sat = 60 + (currentSentiment * 40);
            const bright = 40 + (currentSentiment * 40);

            p.colorMode(p.HSB);
            p.stroke(hue, sat, bright, 150);
            p.strokeWeight(1.5);
            p.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
            this.updatePrev();
            p.colorMode(p.RGB);
          }

          updatePrev() {
            this.prevPos.x = this.pos.x;
            this.prevPos.y = this.pos.y;
          }

          edges(p) {
            if (this.pos.x > p.width) { this.pos.x = 0; this.updatePrev(); }
            if (this.pos.x < 0) { this.pos.x = p.width; this.updatePrev(); }
            if (this.pos.y > p.height) { this.pos.y = 0; this.updatePrev(); }
            if (this.pos.y < 0) { this.pos.y = p.height; this.updatePrev(); }
          }
        }
      };

      // Remove previous sketch if exists
      if (sketchRef.current) sketchRef.current.remove();
      sketchRef.current = new window.p5(sketch, canvasRef.current);
    };

    if (window.p5) {
      initSketch();
    } else {
      loadP5();
    }

    // Cleanup
    return () => {
      if (sketchRef.current) sketchRef.current.remove();
    };
  }, []); 

  return <div ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0 }} />;
}