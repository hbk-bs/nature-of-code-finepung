document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video-background');
    video.play().catch(function(error) {
        console.log("Video autoplay failed:", error);
    });
});

// Settings for particle behavior
const settings = {
  particleCount: 80,    // Reduced from 200
  maxSize: 4,          // Smaller particles
  baseSpeed: 0.4,     
  elasticity: 0.012,
  lineWeight: 1,       // Thinner lines
  lineAlpha: 0.4       // More subtle lines
};

// Array to store all particles
let particles = [];

class Particle {
  constructor() {
    this.reset();
    this.noiseOffset = random(1000); // New: unique noise offset per particle
  }

  reset() {
    this.x = random(width * 0.1, width * 0.9); // Avoid edges
    this.y = random(height * 0.4, height * 0.6); // More concentrated height range
    this.size = random(2, settings.maxSize);
    this.originalX = this.x;
    this.originalY = this.y;
    this.baseY = height; // New: base point always at bottom
    this.speed = this.size * settings.baseSpeed;
    this.heightFactor = map(this.y, height, height * 0.5, 0.2, 1);
  }

  update(time) {
    const noise1 = noise(this.noiseOffset + time * 0.001);
    const noise2 = noise(this.noiseOffset + 1000 + time * 0.001);
    
    this.x += (noise1 * 2 - 1) * this.speed * this.heightFactor;
    this.y += (noise2 * 2 - 1) * this.speed * 0.05;

    this.x += (this.originalX - this.x) * settings.elasticity;
    this.y += (this.originalY - this.y) * settings.elasticity;
  }

  draw() {
    // Draw grass stem
    stroke(50, 50, 50, this.heightFactor * settings.lineAlpha * 255);
    strokeWeight(settings.lineWeight);
    
    // Adjusted control points for more dramatic bending
    let ctrl1X = lerp(this.originalX, this.x, 0.3);  // Changed from 0.2
    let ctrl1Y = lerp(this.baseY, this.y, 0.2);      // Changed from 0.3
    let ctrl2X = lerp(this.originalX, this.x, 0.9);   // Changed from 0.8
    let ctrl2Y = lerp(this.baseY, this.y, 0.8);      // Changed from 0.7
    
    // Draw curved line from bottom
    noFill();
    beginShape();
    vertex(this.originalX, this.baseY);  // Start from bottom
    bezierVertex(
      ctrl1X, ctrl1Y,
      ctrl2X, ctrl2Y,
      this.x, this.y
    );
    endShape();
    
    // Draw particle
    const alpha = map(this.y, height * 0.5, height, 0.1, 0.6);
    fill(50, 50, 50, alpha * 255);
    noStroke();
    circle(this.x, this.y, this.size * 2);
  }
}

function setup() {
  // Create canvas and position it at the bottom half
  let canvas = createCanvas(windowWidth, windowHeight * 0.6); // Increased height for more prominence
  canvas.parent('particle-container');
  // Initialize particles
  particles = Array(settings.particleCount).fill().map(() => new Particle());
}

function draw() {
  // Lighter background for better visibility
  background(255, 255, 255, 45);
  
  // Update and draw all particles
  particles.forEach(p => {
    p.update(millis());
    p.draw();
  });
}

// Handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight * 0.6);
  particles.forEach(p => p.reset());
}

// Add after your existing p5.js setup code

function setupSideCanvases() {
    const leftCanvas = document.getElementById('left-canvas');
    const rightCanvas = document.getElementById('right-canvas');
    
    // Set canvas dimensions
    leftCanvas.width = leftCanvas.offsetWidth;
    leftCanvas.height = leftCanvas.offsetHeight;
    rightCanvas.width = rightCanvas.offsetWidth;
    rightCanvas.height = rightCanvas.offsetHeight;
    
    // Get canvas contexts for drawing
    const leftCtx = leftCanvas.getContext('2d');
    const rightCtx = rightCanvas.getContext('2d');
    
    // Initialize with background color
    leftCtx.fillStyle = '#f5f5f5';
    leftCtx.fillRect(0, 0, leftCanvas.width, leftCanvas.height);
    rightCtx.fillStyle = '#f5f5f5';
    rightCtx.fillRect(0, 0, rightCanvas.width, rightCanvas.height);
}

// Call the setup function when the document is loaded
document.addEventListener('DOMContentLoaded', setupSideCanvases);