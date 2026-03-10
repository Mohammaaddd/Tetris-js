const width = 10;
let nextRandom = 0;
const grid = document.querySelector(".grid");
let cells = Array.from(document.querySelectorAll(".grid .cell"));
const scoreDisplay = document.querySelector("#score");
const startButton = document.querySelector("#startButton");
let timerId;
let score = 0;
const colors = ["orange", "red", "purple", "green", "blue"];

//The Tetrominoes
const lTetremino = [
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2],
];

// const jTetromino = [
//   [1, width + 1, width * 2 + 1, width * 2 + 2],
//   [width, width + 1, width + 2, width * 2],
//   [0, 1, width + 1, width * 2 + 1],
//   [width + 2, width * 2, width * 2 + 1, width * 2 + 2],
// ];

// const sTetromino = [
//   [1, width + 1, width + 2, width * 2 + 2],
//   [width + 1, width * 2 + 1, width * 2, width * 3],
//   [1, width + 1, width + 2, width * 2 + 2],
//   [width + 1, width * 2 + 1, width * 2, width * 3],
// ];

const zTetromino = [
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
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
  lTetremino,
  //   jTetromino,
  zTetromino,
  //   sTetromino,
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
  if (e.keyCode === 37) {
    moveLeft();
  } else if (e.keyCode === 39) {
    moveRight();
  } else if (e.keyCode === 40) {
    moveDown();
  }
}

function controlRotate(e) {
  if (e.keyCode === 38) {
    rotate();
  }
}

document.addEventListener("keydown", control);
document.addEventListener("keyup", controlRotate);

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

//rotate the tetromino
function rotate() {
  undraw();
  currentRotation++;
  //checking for index out of bounds
  if (currentRotation === current.length) currentRotation = 0;
  current = theTetrominoes[random][currentRotation];
  draw();
}

//show up-next tetromino in mini-grid display
const displayCells = document.querySelectorAll(".mini-grid div");
const displayWidth = 4;
let displayIndex = 0;

//the tetromino without rotation
const upNextTetrominoes = [
  [1, displayWidth + 1, displayWidth * 2 + 1, 2], //ltetromino
  [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //ztetromino
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

//start/pause button
startButton.addEventListener("click", () => {
  if (timerId) {
    document.querySelector(".song").pause();
    clearInterval(timerId);
    timerId = null;
  } else {
    draw();
    document.querySelector(".song").play();
    document.querySelector(".song").volume = 0.5;
    timerId = setInterval(moveDown, 1000);
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    displayShape();
  }
});

//add score and remove the row
function addScore() {
  for (let i = 0; i < 199; i += width) {
    const row = [
      i,
      i + 1,
      i + 2,
      i + 3,
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
  }
}
