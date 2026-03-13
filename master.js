const width = 10;
let nextRandom = 0;
const grid = document.querySelector(".grid");
let cells = Array.from(document.querySelectorAll(".grid .cell"));
const scoreDisplay = document.querySelector("#score");
const startButton = document.querySelector("#startButton");
let timerId;
let score = 0;
const colors = ["orange", "blue", "red", "green", "purple", "yellow", "cyan"];
let level = 1;
let speed = 1000; // starting speed (1 second)

//The Tetrominoes
const lTetromino = [
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2],
];

const jTetromino = [
  [1, width + 1, width * 2 + 1, width * 2 + 2],
  [width, width + 1, width + 2, width * 2],
  [0, 1, width + 1, width * 2 + 1],
  [width + 2, width * 2, width * 2 + 1, width * 2 + 2],
];

const sTetromino = [
  [1, 2, width, width + 1],
  [0, width, width + 1, width * 2 + 1],
  [1, 2, width, width + 1],
  [0, width, width + 1, width * 2 + 1],
];

const zTetromino = [
  [1, width, width + 1, width * 2],
  [width, width + 1, width * 2 + 1, width * 2 + 2],
  [1, width, width + 1, width * 2],
  // [width + 1, width + 2, width * 2, width * 2 + 1],
  [width, width + 1, width * 2 + 1, width * 2 + 2],
];

const tTetromino = [
  [1, width, width + 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1],
];

const oTetromino = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
];

const iTetromino = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
];

const theTetrominoes = [
  lTetromino,
  jTetromino,
  sTetromino,
  zTetromino,
  tTetromino,
  oTetromino,
  iTetromino,
];

let currentPosition = 4;
let currentRotation = 0;

//select random tetromoino
let random = Math.floor(Math.random() * theTetrominoes.length);
let current = theTetrominoes[random][currentRotation];

//draw the tetromino
function draw() {
  current.forEach((index) => {
    cells[currentPosition + index].classList.add("tetromino");
    cells[currentPosition + index].style.backgroundColor = colors[random];
  });
}

//undraw the tetromino
function undraw() {
  current.forEach((index) => {
    cells[currentPosition + index].classList.remove("tetromino");
    cells[currentPosition + index].style.backgroundColor = "";
  });
}

//make the tetromino move down every second
//let timerId = setInterval(moveDown, 1000);

//assign function to keycodes
function control(e) {
  if (e.key === "ArrowLeft") {
    moveLeft();
  } else if (e.key === "ArrowRight") {
    moveRight();
  } else if (e.key === "ArrowDown") {
    moveDown();
  }
}

function controlRotate(e) {
  if (e.key === "ArrowUp") {
    rotate();
  }
}

// document.addEventListener("keydown", control);
// document.addEventListener("keyup", controlRotate);

//move down function
function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

function freeze() {
  if (
    current.some((index) =>
      cells[currentPosition + index + width].classList.contains("taken"),
    )
  ) {
    current.forEach((index) =>
      cells[currentPosition + index].classList.add("taken"),
    );
    //start a new tetromino falling
    random = nextRandom;
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);

    currentRotation = 0;
    current = theTetrominoes[random][currentRotation];
    currentPosition = 4;
    draw();
    displayShape();
    addScore();
    gameOver();
  }
}

function moveLeft() {
  undraw();

  const isAtLeftEdge = current.some(
    (index) => (currentPosition + index) % width === 0,
  );

  if (!isAtLeftEdge) currentPosition--;

  if (
    current.some((index) =>
      cells[currentPosition + index].classList.contains("taken"),
    )
  ) {
    currentPosition++;
  }
  draw();
}

function moveRight() {
  undraw();

  const isAtRightEdge = current.some(
    (index) => (currentPosition + index) % width === width - 1,
  );

  if (!isAtRightEdge) currentPosition++;

  if (
    current.some((index) =>
      cells[currentPosition + index].classList.contains("taken"),
    )
  ) {
    currentPosition--;
  }
  draw();
}

function checkRotatedPosition() {
  if (
    current.some((index) => (currentPosition + index) % width === width - 1)
  ) {
    currentPosition -= theTetrominoes[random] === iTetromino ? 2 : 1;
  }
  if (current.some((index) => (currentPosition + index) % width === 0)) {
    if (theTetrominoes[random] === iTetromino) currentPosition += 3;
    else if (
      theTetrominoes[random] === tTetromino ||
      theTetrominoes[random] === lTetromino ||
      theTetrominoes[random] === jTetromino
    )
      currentPosition += 2;
  }
}

//rotate the tetromino
function rotate() {
  undraw();

  const previousRotation = currentRotation;

  currentRotation++;
  if (currentRotation === current.length) currentRotation = 0;

  current = theTetrominoes[random][currentRotation];

  checkRotatedPosition();

  if (
    current.some((index) =>
      cells[currentPosition + index].classList.contains("taken"),
    )
  ) {
    currentRotation = previousRotation;
    current = theTetrominoes[random][currentRotation];
  }

  draw();
}

//show up-next tetromino in mini-grid display
const displayCells = document.querySelectorAll(".mini-grid div");
const displayWidth = 4;
let displayIndex = 0;

//the tetromino without rotation
const upNextTetrominoes = [
  [1, displayWidth + 1, displayWidth * 2 + 1, 2], //ltetromino
  [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 2], //jtetromino
  [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //ztetromino
  [1, displayWidth + 1, displayWidth + 2, displayWidth * 2 + 2], //stetromino
  [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
  [0, 1, displayWidth, displayWidth + 1], //otetromino
  [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //itetromino
];

//display the shape in the mini-grid display
function displayShape() {
  //remove any tetromino class
  displayCells.forEach((cell) => {
    cell.classList.remove("tetromino");
    cell.style.backgroundColor = "";
  });
  upNextTetrominoes[nextRandom].forEach((index) => {
    displayCells[displayIndex + index].classList.add("tetromino");
    displayCells[displayIndex + index].style.backgroundColor =
      colors[nextRandom];
  });
}

let songs = document.querySelectorAll(".song");
let randomSong = Math.floor(Math.random() * songs.length);
let song = songs[randomSong];

//start/pause button
startButton.addEventListener("click", () => {
  if (timerId) {
    // document.querySelector(".song").pause();
    song.pause();
    clearInterval(timerId);
    timerId = null;
    document.removeEventListener("keydown", control);
    document.removeEventListener("keyup", controlRotate);
    document.getElementById("leftBtn").removeEventListener("click", moveLeft);
    document.getElementById("rightBtn").removeEventListener("click", moveRight);
    document.getElementById("downBtn").removeEventListener("click", moveDown);
    document.getElementById("rotateBtn").removeEventListener("click", rotate);
  } else {
    draw();
    // document.querySelector(".song").play();
    // document.querySelector(".song").volume = 0.5;
    song.play();
    song.volume = 0.5;
    timerId = setInterval(moveDown, speed);
    // nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    document.addEventListener("keydown", control);
    // mobile controls
    document.addEventListener("keyup", controlRotate);
    document.getElementById("leftBtn").addEventListener("click", moveLeft);
    document.getElementById("rightBtn").addEventListener("click", moveRight);
    document.getElementById("downBtn").addEventListener("click", moveDown);
    document.getElementById("rotateBtn").addEventListener("click", rotate);
    displayShape();
  }
});

//diffculty
function updateLevel() {
  const newLevel = Math.floor(score / 50) + 1;

  if (newLevel > level) {
    level = newLevel;
    speed = Math.max(100, 1000 - (level - 1) * 100);

    clearInterval(timerId);
    timerId = setInterval(moveDown, speed);
  }
}

//add score and remove the row
function addScore() {
  for (let i = 0; i < 199; i += width) {
    const row = [
      i,
      i + 1,
      i + 2,
      i + 3,
      i + 4,
      i + 5,
      i + 6,
      i + 7,
      i + 8,
      i + 9,
    ];

    if (row.every((index) => cells[index].classList.contains("taken"))) {
      score += 10;
      scoreDisplay.innerHTML = score;
      updateLevel();

      row.forEach((index) => {
        cells[index].classList.remove("taken");
        cells[index].classList.remove("tetromino");
        cells[index].style.backgroundColor = "";
      });
      const removedCells = cells.splice(i, width);
      cells = removedCells.concat(cells);
      cells.forEach((cell) => grid.appendChild(cell));
    }
  }
}

//gameover
function gameOver() {
  if (
    current.some((index) =>
      cells[currentPosition + index].classList.contains("taken"),
    )
  ) {
    scoreDisplay.innerHTML = "end";
    clearInterval(timerId);
    removeEventListener("keydown", control);
  }
}
