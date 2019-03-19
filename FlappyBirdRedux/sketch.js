// Width of the canvas
const CANVAS_WIDTH = 420;

// Height of the canvas
const CANVAS_HEIGHT = 600;

// Width of the ground
const GROUND_WIDTH = CANVAS_WIDTH;

// Height of the ground
const GROUND_HEIGHT = 20;

// X coordinate of the Bird
const X_OF_BIRD = 70;

// Radius of the bird
const BIRD_RADIUS = 16;

// magnitude of the gravity in the world
const GRAVITY = 0.55;

// magnitude of the upward force
const LIFT = 6.5;

// Vertical Space between two  pipes
const VERT_PIPES_SPACE = 130;

// Horizontal Space between each set of pipes
const HORZ_PIPES_SPACE = 180;

// Width of the pipes
const PIPE_WIDTH = 70;

// Maximum height of the pipes
const MAX_PIPE_HEIGHT = 350;

// Minimum height of the pipes
const MIN_PIPE_HEIGHT = 80;

// Speed at which the pipes moves
const PIPE_SPEED = 4;

// width of the pipe head
const PIPE_HEAD_WIDTH = 75;

// height of the pipe head
const PIPE_HEAD_HEIGHT = 20;

// Note: The pipe, background and ground images are from Code Bullet, credit goes to him for those images.
// Note: The bird images and font are from https://flappybird.io/, credit goes to Max McDonnell @mxmcd for those images.
function preload() {
  backgroundImg = loadImage('images/background.png');
  birdFlappingUpImg = loadImage('images/birdFlappingUp.png');
  birdMidFlapImg = loadImage('images/birdMidFlap.png');
  birdFlappingDownImg = loadImage('images/birdFlappingDown.png');
  pipeHeadImg = loadImage('images/pipeHead0000.png');
  shaftImg = loadImage('images/shaft0000.png');
  groundImg = loadImage('images/groundPiece.png');
  flappyBirdFont = loadFont('fonts/FB.woff');
}


function setup() {
  canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.position((windowWidth - CANVAS_WIDTH) / 2, (windowHeight - CANVAS_HEIGHT) / 2);
  createInstructions();
  ground = new Ground(0, CANVAS_HEIGHT - GROUND_HEIGHT, GROUND_WIDTH, GROUND_HEIGHT);
  bird = new Bird(X_OF_BIRD, CANVAS_HEIGHT / 2, BIRD_RADIUS);
  createPipes();

}

function draw() {
  image(backgroundImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  displayPipes();
  bird.draw(birdFlappingUpImg, birdMidFlapImg, birdFlappingDownImg);
  ground.draw(groundImg);
  displayScore();

  if(bird.collideWithGround(ground)) {
    collidedWithGround = true;
  } else {
    checkBirdCollidedWithPipes();
  }

  // if the bird collided with the pipes, the bird should just fall only
  // also if the bird collided with the pipes, the pipes should not be moving, only the bird should be falling
  if(collidedWithPipes && !collidedWithGround) {
    bird.fall(GRAVITY);
    bird.update();

  } else if(!collidedWithGround){
    if(keyIsPressed && key == ' ') {
      bird.flyUp(LIFT);
    } else {
      bird.fall(GRAVITY);
    }

    movePipes();
    if(CANVAS_WIDTH - (upperPipes[upperPipes.length - 1].x + PIPE_WIDTH) >= HORZ_PIPES_SPACE) {
      createPipes();
    }
    removePipes();
    computeScore();
    bird.update();

  } else {
    displayRestartInstructions();
    displayBothScores();
    noLoop();

  }

}

function keyPressed() {
  if(key == ' ' && collidedWithGround) {
    resetBirdPosition();
    resetPipes();
    resetVariables();
    loop();
  }
}

// creates the instructions for the player to play the game
function createInstructions() {
  instructions = createP("Press Spacebar to fly the bird as far as you can without hitting a pipe.");
  instructions.size(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4);
  instructions.position((canvas.x - instructions.width) / 2, (windowHeight - instructions.height) / 2);
  instructions.style('text-align:center');
  instructions.style('font-size', '17px');
  instructions.style('font-family', 'Arial');
  instructionsColour = color(200, 200, 200);
  instructions.style('color', instructionsColour);
}

// sets the y position and heights of the upper and lower pipes
function createPipes() {
  let upperPipeHeight = floor(random(MIN_PIPE_HEIGHT, MAX_PIPE_HEIGHT));
  let yOfLowerPipe = upperPipeHeight + VERT_PIPES_SPACE - GROUND_HEIGHT;
  let lowerPipeHeight = CANVAS_HEIGHT - yOfLowerPipe - GROUND_HEIGHT;
  upperPipes.push(new Pipe(CANVAS_WIDTH, 0, PIPE_WIDTH, upperPipeHeight));
  lowerPipes.push(new Pipe(CANVAS_WIDTH, yOfLowerPipe, PIPE_WIDTH, lowerPipeHeight));
}


// shows all the pipes
function displayPipes() {
  for(let i = 0; i < upperPipes.length; i++) {
    upperPipes[i].draw(pipeHeadImg, shaftImg);
    lowerPipes[i].draw(pipeHeadImg, shaftImg);
  }
}

// moves all pipes to the left
function movePipes() {
  for(let i = 0; i < upperPipes.length; i++) {
    upperPipes[i].move(PIPE_SPEED);
    lowerPipes[i].move(PIPE_SPEED);
  }
}


// checks if bird collided with the pipes
function checkBirdCollidedWithPipes() {
  for(let i = 0; i < upperPipes.length; i++) {
    if(bird.collideWithPipes(upperPipes[i], lowerPipes[i])) {
      collidedWithPipes = true;
    }
  }
}

// removes the pipes once they pass out of the canvas
function removePipes() {
  for(let i = 0; i < upperPipes.length; i++) {
    if(upperPipes[i].x + PIPE_WIDTH < 0) {
      upperPipes.splice(i, 1);
      lowerPipes.splice(i, 1);
    }
  }
}

function computeScore() {
  if(bird.x - bird.radius == upperPipes[0].x + PIPE_WIDTH) {
    score++;
  }
  if(highScore < score) {
    highScore = score;
  }
}

function displayScore() {
  textFont(flappyBirdFont);
  textSize(30);
  fill(255);
  strokeWeight(5);
  stroke(0);
  let scoreLabel = "" + score;
  scoreLabelWidth = textWidth(scoreLabel);
  text(score, (CANVAS_WIDTH - scoreLabelWidth)/ 2, 40);
}

function displayRestartInstructions() {
  textFont(flappyBirdFont);
  textSize(30);
  fill(255);
  strokeWeight(5);
  stroke(0);
  let restartInstructions = "Press Space to Restart";
  resInstWidth = textWidth(restartInstructions);
  resInstHeight = textAscent();
  text(restartInstructions, (CANVAS_WIDTH - resInstWidth) / 2, (CANVAS_HEIGHT - resInstHeight) / 2);
}


function displayBothScores() {
  textFont(flappyBirdFont);
  textSize(30);
  fill(255);
  strokeWeight(5);
  stroke(0);
  let scoreLabel = "Score : " + score;
  scoreLabelWidth = textWidth(scoreLabel);
  text(scoreLabel, (CANVAS_WIDTH - scoreLabelWidth) / 2, CANVAS_HEIGHT / 4);

  let highScoreLabel = "High Score : " + highScore;
  highScoreLabelWidth = textWidth(highScoreLabel);
  highScoreLabelHeight = textAscent();
  text(highScoreLabel, (CANVAS_WIDTH - highScoreLabelWidth) / 2, (CANVAS_HEIGHT / 4) + highScoreLabelHeight * 2);

}

function resetBirdPosition() {
  bird.x = X_OF_BIRD;
  bird.y = CANVAS_HEIGHT / 2;
}


function resetPipes() {
  for(let i = upperPipes.length; i >= 0; i--) {
    upperPipes.splice(i, 1);
    lowerPipes.splice(i, 1);
  }
  createPipes();
}


function resetVariables() {
  score = 0;
  collidedWithPipes = false;
  collidedWithGround = false;
}

// canvas object
let canvas;

// ground object
let ground;

//bird object
let bird;

// upper pipe object
let upperPipes = [];

// lower pipe object
let lowerPipes = [];

// boolean to determine if bird has collided with the pipes
let collidedWithPipes = false;

// boolean to determine if bird has collided with the ground
let collidedWithGround = false

let score = 0;

let highScore = 0;

let backgroundImg;

let groundImg;

let birdFlappingUpImg;

let birdFlappingDownImg;

let birdMidFlapImg;

let pipeHeadImg;

let shaftImg;

let flappyBirdFont;

let instructions;
