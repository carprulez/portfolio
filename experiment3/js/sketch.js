// sketch.js - This is a fantasy map generator.
// Author: Carter Gruebel
// Date: 4/23/24

// Globals
let canvasContainer;
var centerHorz, centerVert;


function generateGrid(numCols, numRows) {
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }

  // Define parameters for the rectangular rooms
  const numRooms = 5; // Number of rooms
  const minRoomWidth = 3; // Set minimum room width to 3
  const maxRoomWidth = Math.floor(numCols / 4); // Adjust the maximum width as needed
  const minRoomHeight = 3; // Set minimum room height to 3
  const maxRoomHeight = Math.floor(numRows / 4); // Adjust the maximum height as needed

  // Create rooms
  const rooms = [];
  for (let r = 0; r < numRooms; r++) {
    let roomWidth = Math.floor(random(minRoomWidth, maxRoomWidth + 1));
    let roomHeight = Math.floor(random(minRoomHeight, maxRoomHeight + 1));

    let roomX = Math.floor(random(1, numCols - roomWidth - 1)); // Avoiding edges
    let roomY = Math.floor(random(1, numRows - roomHeight - 1)); // Avoiding edges

    // Fill the room with a different code
    for (let i = roomY; i < roomY + roomHeight; i++) {
      for (let j = roomX; j < roomX + roomWidth; j++) {
        grid[i][j] = ".";
      }
    }

    // Place a different coded tile randomly within the room
    let randomX, randomY;
    do {
      randomX = Math.floor(random(roomX + 1, roomX + roomWidth - 1)); // Avoiding edges
      randomY = Math.floor(random(roomY + 1, roomY + roomHeight - 1)); // Avoiding edges
    } while (grid[randomY][randomX] !== ".");
    
    grid[randomY][randomX] = "X"; // Replace the '.' with 'X' for the new code

    rooms.push({ x: roomX, y: roomY, width: roomWidth, height: roomHeight });
  }

  // Connect rooms with hallways
  for (let i = 0; i < numRooms - 1; i++) {
    let startX = Math.floor(rooms[i].x + rooms[i].width / 2);
    let startY = Math.floor(rooms[i].y + rooms[i].height / 2);
    let endX = Math.floor(rooms[i + 1].x + rooms[i + 1].width / 2);
    let endY = Math.floor(rooms[i + 1].y + rooms[i + 1].height / 2);

    while (startX !== endX || startY !== endY) {
      grid[startY][startX] = ".";
      if (startX < endX) startX++;
      else if (startX > endX) startX--;
      if (startY < endY) startY++;
      else if (startY > endY) startY--;
    }
  }

  return grid;
}

function drawGrid(grid) {
  background(128);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == '_') {
        placeTile(i, j, floor(random(4)), floor(random(3, 4)));
      }
      if (grid[i][j] == '.') {
        placeTile(i, j, floor(random(1, 5)), floor(random(21, 25)));
        drawContext(grid, i, j, '.', 4, 22, wallLookup);
      }
      if (grid[i][j] == 'X') {
        placeTile(i, j, floor(random(0, 5)), floor(random(28, 30)));
      }
    }
  }
}

function gridCheck(grid, i, j, target) {
  if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
    return grid[i][j] === target;
  }
  return false;
}

function gridCode(grid, i, j, target) {
  let code = 0;
  if (!gridCheck(grid, i + 1, j, target)) code += 1; // South bit
  if (!gridCheck(grid, i - 1, j, target)) code += 2; // North bit
  if (!gridCheck(grid, i, j - 1, target)) code += 4; // West bit
  if (!gridCheck(grid, i, j + 1, target)) code += 8; // East bit
  return code;
}

function drawContext(grid, i, j, target, dti, dtj, lookup) {
  const code = gridCode(grid, i, j, target);
  const offset = lookup[code];
  if (offset && code != 0) {
    placeTile(i, j, dti + offset[0], dtj + offset[1]);
  }
}

// South, North, West, East
const wallLookup = [
  [0, 0],  // 0000: if all adjacent are the same
  [2, 1],  // 0001: if south tile is different
  [2, -1], // 0010: if north tile is different
  [2, -1], // 0011: if north and south are different
  [1, 0],  // 0100: if west tile is different
  [1, 1],  // 0101: if west and south are different
  [1, -1], // 0110: if west and north are different
  [2, -1], // 0111: if west and south and north are different
  [3, 0],  // 1000: if east is different
  [3, 1],  // 1001: if east and south are different
  [3, -1], // 1010: if east and north are different
  [2, -1], // 1011: if east and north and south are different
  [2, -1], // 1100: if east and west are different
  [2, -1], // 1101: if east and west and south are different
  [2, -1], // 1110: if east and west and north are different
  [2, -1]  // 1111: if all adjacent are different
]