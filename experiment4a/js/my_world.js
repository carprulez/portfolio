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
let fruits = {};

function p3_preload() {}

function p3_setup() {}

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
  let key = i + "-" + j;
  
  // If the tile has fruits, remove one fruit from its list
  if (fruits[key] && fruits[key].length > 0) {
    fruits[key].pop(); // Remove the last fruit
  }
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  noStroke();

  // Define three shades of brown
  let brownShades = [
    color(120, 80, 40),
    color(140, 100, 60),
    color(160, 120, 80)
  ];

  // Generate a random index to select a shade of brown
  let brownSeed = XXH.h32("brown:" + [i, j], worldSeed);
  randomSeed(brownSeed); // Ensure consistent color selection for each tile

  // Adjust the probability of selecting the darkest brown shade
  let index;
  let rand = random();
  if (rand < 0.02) {
    index = 0; // 2% chance for the darkest brown shade
  } else {
    index = floor(random(1, brownShades.length)); // 98% chance for other shades
  }

  // Translate up if the index is 0 to draw the white circle on top
  if (index === 0) {
    translate(0, -3);
  }

  // Fill tile with the randomly selected shade of brown
  fill(brownShades[index]);

  // Draw the tile shape with an isometric perspective
  push();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  // Draw plate and fruits if the index indicates a white plate
  if (index === 0) {
    drawPlate(255, 255, 0); // Draw the white plate

    // Initialize fruits list for the tile if not already initialized
    if (!fruits[i + "-" + j]) {
      fruits[i + "-" + j] = []; // Initialize an empty array for fruits
    }

    // If there are no fruits for this tile, generate some
    if (fruits[i + "-" + j].length === 0) {
      let numFruits = floor(random(1, 5)); // Generate a random number of fruits (between 1 and 4)
      let plateRadius = tw * 0.95 / 2; // Radius of the plate
      for (let k = 0; k < numFruits; k++) {
        // Randomly position each fruit within the plate area
        let fruitRadius = 4; // Radius of the fruit
        let angle = random(TWO_PI); // Random angle within a circle
        let x = cos(angle) * random(plateRadius); // Calculate x-coordinate based on angle and plate radius
        let y = sin(angle) * random(plateRadius); // Calculate y-coordinate based on angle and plate radius
        // Save the fruit's information to the array
        fruits[i + "-" + j].push({ x: x, y: y, radius: fruitRadius, color: color(random(255), random(255), random(255)) });
      }
    }

    // Draw the fruits for this tile
    let numFruits = fruits[i + "-" + j].length;
    for (let k = 0; k < numFruits; k++) {
      let fruit = fruits[i + "-" + j][k];
      fill(fruit.color);
      ellipse(fruit.x, fruit.y, fruit.radius * 2, fruit.radius * 2);
    }
  }

  pop();
}

function drawPlate(sideFill, topFill, altitude) {
  let r = 0.95;
  let plateW = tw * r;
  let plateH = th * r;
  let offset = 6;

  // draw shadow on the ground
  fill(0, 0, 0, 64);
  ellipse(0, 0, plateW, plateH);

  // draw man shifted up by altitude
  fill(sideFill);
  rect(-plateW / 2, -offset - altitude, plateW, offset);
  ellipse(0, -altitude, plateW, plateH);
  fill(topFill);
  ellipse(0, -offset - altitude, plateW, plateH);
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
