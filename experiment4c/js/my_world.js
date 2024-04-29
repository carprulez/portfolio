"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

let worldSeed;
let tileSize;
let tileToShrink = null;
let shrinkStartTime = 0;
let shrunkTiles = []; // Define the shrunkTiles array
let galaxy; // Variable to store the background image

function p3_preload() {
  // Load the background image
  galaxy = loadImage('./img/galaxy.PNG'); // Replace 'background_image.jpg' with the path to your image
}

function p3_setup() {}

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);

  // Reset the shrunkTiles array
  shrunkTiles = [];

  // Reset the tileToShrink and shrinkStartTime variables
  tileToShrink = null;
  shrinkStartTime = 0;
}

function p3_tileWidth() {
  return 32;
}

function p3_tileHeight() {
  return 16;
}

function getRandomTile() {
  let i = floor(random(width / p3_tileWidth()));
  let j = floor(random(height / p3_tileHeight()));
  return [i, j];
}

function p3_tileClicked(i, j) {}

function p3_drawBefore() {
  // Set the background to the loaded image
  image(galaxy, 0, 0, width, height);
}

function p3_drawTile(i, j) {
  noStroke();

  let tw = p3_tileWidth(); // Get tile width
  let th = p3_tileHeight(); // Get tile height

  // Draw only tiles that are not marked as shrunk
  if (!shrunkTiles.some(tile => tile[0] === i && tile[1] === j)) {
    if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
      fill(173, 216, 230, 200); // Light blue with transparency
    } else {
      fill(173, 216, 230, 200);
    }

    if (!tileToShrink && random() < 0.01) { // Adjust the probability as needed
      tileToShrink = [i, j];
      shrinkStartTime = millis();
    }

    if (tileToShrink && tileToShrink[0] === i && tileToShrink[1] === j) {
      // Calculate elapsed time since the tile started shrinking
      let elapsedTime = millis() - shrinkStartTime;
      // Calculate scale factor based on elapsed time
      let scaleFactor = 1 - (elapsedTime / 5000); // 5000 ms = 5 seconds

      // If scaleFactor is positive, draw the tile with the reduced size
      if (scaleFactor > 0) {
        push();
        scale(scaleFactor);
        beginShape();
        vertex(-tw, 0);
        vertex(0, th);
        vertex(tw, 0);
        vertex(0, -th);
        endShape(CLOSE);
        pop();
      } else {
        // Remove the tile from shrunkTiles array
        shrunkTiles.push(tileToShrink);
        tileToShrink = null; // Reset tileToShrink for next shrinking animation
      }
    } else {
      // Draw tile with original size only if it's not marked as shrunk
      push();
      beginShape();
      vertex(-tw, 0);
      vertex(0, th);
      vertex(tw, 0);
      vertex(0, -th);
      endShape(CLOSE);
      pop();
    }
  }
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-p3_tileWidth(), 0);
  vertex(0, p3_tileHeight());
  vertex(p3_tileWidth(), 0);
  vertex(0, -p3_tileHeight());
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}
