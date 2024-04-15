// sketch.js - This is the sketch for a procedurally generated coral reef.
// Author: Carter Gruebel
// Date: 4/14/2024

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// Globals
let canvasContainer;
let centerHorz, centerVert;

let noiseValues = []; // Array to store precomputed noise values
let noiseScale = 0.03; // Scale for the noise function

let horizontalNoiseValues = [];
let seed = 239;
let lastSpawnTime = 0;
let spawnInterval = 3000; // Initial spawn interval in milliseconds (3 seconds)
let timeSinceLastSpawn = 0;
let fish = [];

const rocks = '#144353';
const coral = '#790024';

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized
  generateNoiseValues();

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  createCanvas(800, 600);
  createButton("reimagine").mousePressed(() => seed++);
  
  // Generate noise values for horizontal edge
  for (let x = 0; x <= width; x++) {
    horizontalNoiseValues.push(noise(x * 0.05));
  }
}


function draw() {
  randomSeed(seed);
  
  // Update time since last spawn
  let currentTime = millis();
  timeSinceLastSpawn = currentTime - lastSpawnTime;

  // Draw gradient background
  drawGradientBackground(width / 2, 0);

  // Draw the existing horizontal rectangle with textured edge
  fill(rocks); // Set fill color for the textured edge
  noStroke(); // No outline
  beginShape();
  for (let x = 0; x < horizontalNoiseValues.length; x++) {
    let y = height * (2 / 3) - horizontalNoiseValues[x] * 50; // Adjust height based on pre-generated noise values
    vertex(x, y);
  }
  vertex(width, height * (2 / 3));
  vertex(0, height * (2 / 3));
  endShape(CLOSE);

  // Fill the space beneath the horizontal rectangle
  fill(rocks); // Set fill color
  rect(0, height * (2 / 3), width, height / 3); // Draw a rectangle to fill the space beneath the textured rectangle

  // Draw the vertical rectangle with severe textures resembling tubes of coral
  let verticalRectWidth = width / 3; // Width of the vertical rectangle
  let verticalRectX = (width - verticalRectWidth) / 2; // Adjusted X-coordinate to center the rectangle horizontally
  let verticalRectY = height - (height / 3); // Adjusted Y-coordinate to align with the bottom of the canvas
  
  // Add noise to the top edge of the vertical rectangle resembling tubes of coral
  fill(coral); // Set fill color for the vertical rectangle
  beginShape();
  for (let x = 0; x < verticalRectWidth; x++) {
    let noiseValue = noise((verticalRectX + x) * 0.1); // Generate noise for each point on the top edge with increased noise scale
    let y = height - map(noiseValue, 0, 1, 200, 500); // Adjust height based on noise to create more rounded and thicker peaks resembling tubes
    vertex(verticalRectX + x, y);
  }
  vertex(verticalRectX + verticalRectWidth, height); // Top right corner
  vertex(verticalRectX, height); // Top left corner
  endShape(CLOSE);

  // Add noise to the sides of the vertical rectangle to make its shape more organic
  for (let y = verticalRectY; y >= height * (2 / 3); y--) {
    let noiseValueLeft = noise(verticalRectX * 0.1, y * 0.1); // Noise for the left side
    let noiseValueRight = noise((verticalRectX + verticalRectWidth) * 0.1, y * 0.1); // Noise for the right side
    let xLeft = verticalRectX - map(noiseValueLeft, 0, 1, 10, 30); // Adjust x-coordinate for the left side
    let xRight = verticalRectX + verticalRectWidth + map(noiseValueRight, 0, 1, 10, 30); // Adjust x-coordinate for the right side
    line(xLeft, y, verticalRectX, y); // Draw line for the left side
    line(xRight, y, verticalRectX + verticalRectWidth, y); // Draw line for the right side
  }

  // Draw the new horizontal rectangle with more pronounced peaks and increased space on the left and right
  fill(coral); // Set fill color for the new horizontal rectangle to match the color of the vertical rectangle
  noStroke(); // No outline
  let startX = width * 0.1; // Adjust the starting x-coordinate to increase space on the left
  let endX = width * 0.9; // Adjust the ending x-coordinate to increase space on the right
  beginShape();
  for (let x = startX; x < endX; x++) {
    let y = height - horizontalNoiseValues[x] * 200 * (1 - (x - startX) / (endX - startX)); // Adjust height and noise scale for more pronounced peaks to start from the bottom line of the canvas
    vertex(x, y);
  }
  vertex(endX, height); // Peak at the bottom line of the canvas
  vertex(startX, height); // Bottom left corner
  endShape(CLOSE);
  
  // Spawn fish randomly
  if (timeSinceLastSpawn >= spawnInterval) {
    let numFish = 3; // Number of fish to spawn
    for (let i = 0; i < numFish; i++) {
      let yPos = random(height * (2 / 3), height); // Randomize y position within the bottom two-thirds of the screen
      let fishSpeed = random(1, 3); // Random speed
      let xPos = -50; // Initial x-position off-screen at the left side
      displayFish(xPos, yPos); // Display fish
      fish.push({ x: xPos, y: yPos, speed: fishSpeed }); // Add fish object to the array
    }
    lastSpawnTime = currentTime;
  }
  
  // Display and move fish
  for (let i = fish.length - 1; i >= 0; i--) {
    let currentFish = fish[i];
    moveFish(currentFish); // Move fish
    displayFish(currentFish.x, currentFish.y); // Display fish
    if (currentFish.x > width) {
      fish.splice(i, 1); // Remove fish from array if it goes off-screen
    }
  }
}

// Function to display fish
function displayFish(x, y) {
  fill(255, 255, 0); // Yellow color
  triangle(x + 20, y, x, y - 10, x, y + 10); // Draw fish body
  triangle(x - 10, y - 10, x - 20, y, x - 10, y + 10); // Draw fish tail
}

// Function to move fish
function moveFish(fish) {
  fish.x += fish.speed; // Move fish towards the right
}

// Function to draw gradient background
function drawGradientBackground(centerX, centerY) {
  // Define colors
  let topColor = color(255); // White
  let bottomColor = color(50, 150, 200); // Darker blue

  // Draw gradient background
  for (let y = 0; y < height; y++) {
    // Calculate distance from the specified center point
    let distance = dist(centerX, centerY, width / 2, y);
    
    // Calculate interpolation factor for the gradient
    let interp = map(distance, 0, height / 2, 0, 1);
    
    // Interpolate colors for the gradient
    let c = lerpColor(topColor, bottomColor, interp);
    
    stroke(c);
    line(0, y, width, y);
  }
}
