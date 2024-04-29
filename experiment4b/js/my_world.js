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

function p3_preload() {}

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}

function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  let letterIndex = clicks[key] || 0;
  letterIndex = (letterIndex + 1) % 26; // Increment the letter index modulo 26 to wrap around
  clicks[key] = letterIndex;

  // Redraw the tile
  redraw();
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  noStroke();

  let isBlack = XXH.h32("tile:" + [i, j], worldSeed) % 8 == 0;

  if (isBlack) {
    fill(0); // Black tile
  } else {
    fill(255); // White tile
  }

  push();

  // Draw the tile shape
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  pop();

  if (!isBlack) {
    // If the tile is white
    let letterIndex = clicks[[i, j]];
    if (letterIndex === undefined) { // If the letter index is not already assigned
      // Assign a random letter index for this tile
      let tileSeed = XXH.h32("tileSeed:" + [i, j], worldSeed);
      randomSeed(tileSeed);
      clicks[[i, j]] = floor(random(26)); // Assign a random letter index
      letterIndex = clicks[[i, j]]; // Retrieve the assigned letter index
    }
    fill(0); // Set the text color to black
    // Generate the letter based on the index and the world seed to ensure consistency
    let letter = String.fromCharCode(65 + (letterIndex + XXH.h32("letterSeed:" + [i, j], worldSeed)) % 26);
    textSize(12);
    textAlign(CENTER, CENTER); // Center the text horizontally and vertically
    text(letter, 0, 0); // Center the text on the tile
  }
}


function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}
