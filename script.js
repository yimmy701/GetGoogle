// Be sure to name any p5.js functions we use in the global so Glitch can recognize them.
// Add to this list as you consult the p5.js documentation for other functions.
/* global createCanvas, colorMode, HSB, width, height, random, background, fill, color, random,
          rect, ellipse, stroke, image, loadImage, collideCircleCircle, collideRectCircle, text, 
          mouseX, mouseY, strokeWeight, line, mouseIsPressed, windowWidth, windowHeight, noStroke, 
          flipGrid,rotateGrid,rotate,flip, createButton, updateCanvas, math, ml5, createCapture, VIDEO,imageMode, translate, texture,keyCode, imageArr, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, key, textSize, noFill, text, noStoke, textAlign, CENTER, horizontal, center*/

let grid;
let score = 0;
let best = 0;
let googleDrive,
  android,
  skype,
  googleMeet,
  waze,
  waymo,
  youtube,
  googleChrome,
  google,
  gmail,
  googlePlay;

let imageArr;
let video;
let flipVideo;
let label = 'waiting...';
let classifier;

function preload() {
  googleDrive = loadImage(
    "https://cdn.glitch.com/5d653d11-f577-49e9-b4ec-fd68e99ee0cf%2Ftest.PNG?v=1596148021169"
  );
  gmail = loadImage(
    "https://cdn.glitch.com/5d653d11-f577-49e9-b4ec-fd68e99ee0cf%2Fgmail.png?v=1596147309979"
  );
  android = loadImage(
    "https://cdn.glitch.com/5d653d11-f577-49e9-b4ec-fd68e99ee0cf%2FIMG_4079.PNG?v=1596148618877"
  );
  skype = loadImage(
    "https://cdn.glitch.com/5d653d11-f577-49e9-b4ec-fd68e99ee0cf%2FIMG_4089.PNG?v=1596149086982"
  );
  googleMeet = loadImage(
    "https://cdn.glitch.com/5d653d11-f577-49e9-b4ec-fd68e99ee0cf%2FIMG_4083.PNG?v=1596148620529"
  );
  waze = loadImage(
    "https://cdn.glitch.com/5d653d11-f577-49e9-b4ec-fd68e99ee0cf%2FIMG_4086.PNG?v=1596148620804"
  );
  waymo = loadImage(
    "https://cdn.glitch.com/5d653d11-f577-49e9-b4ec-fd68e99ee0cf%2FIMG_4069.PNG?v=1596147312009"
  );
  googleChrome = loadImage(
    "https://cdn.glitch.com/5d653d11-f577-49e9-b4ec-fd68e99ee0cf%2FIMG_4078.PNG?v=1596148621380"
  );
  youtube = loadImage(
    "https://cdn.glitch.com/5d653d11-f577-49e9-b4ec-fd68e99ee0cf%2FIMG_4081.PNG?v=1596148619717"
  );
  google = loadImage(
    "https://cdn.glitch.com/5d653d11-f577-49e9-b4ec-fd68e99ee0cf%2FIMG_4087.PNG?v=1596148620776"
  );
  googlePlay = loadImage(
    "https://cdn.glitch.com/5d653d11-f577-49e9-b4ec-fd68e99ee0cf%2FIMG_4080.PNG?v=1596148620857"
  );

  imageArr = [
    googleDrive,
    gmail,
    android,
    googleChrome,
    skype,
    googlePlay,
    waze,
    waymo,
    googleMeet,
    youtube,
    google
  ];

    classifier = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/L1EEchmd9/model.json');

}

function isGameOver() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] == 0) {
        return false;
      }
      if (i !== 3 && grid[i][j] == grid[i + 1][j]) {
        return false;
      }

      if (j !== 3 && grid[i][j] == grid[i][j + 1]) {
        return false;
      }
    }
  }
  return true;
}
function blankGrid() {
  return [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  video = createCapture(VIDEO);
  video.hide();
  //flipVideo = ml5.flipImage(video);
  //start classifying
  classifyVideo();
  
  colorMode(HSB, 360, 100, 100);
  grid = blankGrid();
  console.table(grid);
  addNumber();
  addNumber();
  console.table(grid);
}


function classifyVideo(){
  //flipVideo = ml5.flipImage(video);
  classifier.classify(video, gotResults);
}


function gotResults(error, results){
  
  if (error){
    console.error(error);
    return;
  }
  label = results[0].label;
  action();
  setTimeout(classifyVideo,2000);
  //classifyVideo();
  
}

function addNumber() {
  let options = []; //an array to store the "empty" spots, so that we can use this array to know where to add new numbers
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        options.push({ x: i, y: j });
      }
    }
  }
  if (options.length > 0);
  let spot = random(options);
  let r = random(1); //r is a random number between 0 and 1
  grid[spot.x][spot.y] = r > 0.9 ? 2 : 4; // if r > 0.5, new rect with value "2" will show up, if r <= 0.5, 4 will show up
}

function compare(a, b) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (a[i][j] !== b[i][j]) {
        return true;
      }
    }
  }
  return false;
}

function copyGrid(grid) {
  let extra = blankGrid();

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      extra[i][j] = grid[i][j];
    }
    return extra;
  }
}

function flipGrid(grid) {
  for (let i = 0; i < 4; i++) {
    grid[i].reverse();
  }
  return grid;
}

function rotateGrid(grid) {
  let newGrid = blankGrid();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newGrid[i][j] = grid[j][i];
    }
  }
  return newGrid;
}


//move by keycode
function action() {
  console.log(label);
  let flipped = false;
  let rotated = false;
  let played = true;
  
  if (label === 'down') {
    //Do nothing
  } else if (label === 'up') {
    grid = flipGrid(grid);
    flipped = true;
  } else if (label === 'right') {
    grid = rotateGrid(grid);
    rotated = true;
  } else if (label === 'left') {
    grid = rotateGrid(grid);
    grid = flipGrid(grid);
    rotated = true;
    flipped = true;
  } else if (label === 'nothing'){
    played = false;
  }

  if (played) {
    let past = copyGrid(grid);
    for (let i = 0; i < 4; i++) {
      grid[i] = operate(grid[i]);
    }
    let changed = compare(past, grid);

    if (flipped) {
      grid = flipGrid(grid);
    }
    if (rotated) {
      grid = rotateGrid(grid);
      grid = rotateGrid(grid);
      grid = rotateGrid(grid);
    }
    if (changed) {
      addNumber(); //if the board changes, add a new number
    }
    //updateCanvas();
  }
}

function operate(row) {
  row = slide(row);
  row = combine(row);
  row = slide(row);

  return row;
}

function draw() {
  background(181, 25, 90); //light grey
  
  image(video,800,600);
  video.size(300,300);
  textSize(32);
  fill(255);
  text(label, 250, 450);
  
  noStroke();
  drawGrid();
  // //Best score
  // fill(45);
  // rect(860, 70, 65, 45, 5);
  // textSize(12);
  // fill(72, 12, 81);
  // text(`BEST`, 875, 86);
  // fill(240);
  // text(`${score}`, 882, 103);
  //score
  fill(45);
  rect(880, 80, 65, 45, 5);
  textSize(12);
  fill(72, 12, 81);
  text(`SCORE `, 890, 96);
  fill(240);
  text(`${score}`, 900,113);
  //Get Google
  textSize(20);
  //·
  fill(217,73,95);
  text(`·`, 615,170);
  fill(352,69,86);
  text(`·`, 625,170);
  //GET
  fill(100);
  text(`GET`, 647,170);
  //G
  fill(217,73,95);
  text(`G`, 700, 170);
  //o
  fill(352,69,86);
  text(`O`, 715, 170);
  //o
  fill(40,77,96);
  text(`O`, 730, 170);
  //g
  fill(217,73,95);
  text(`G`, 745, 170);
  //l
  fill(114,100,62);
  text(`L`, 760, 170);
  //l
  fill(352,69,86);
  text(`E`, 773, 170);
  //·
  fill(217,73,95);
  text(`·`, 800,170);
  fill(352,69,86);
  text(`·`, 810,170);
  
  drawGameOver();
}

function drawGameOver() {
  let gameover = isGameOver();
  if (gameover) {
    console.log("GAME OVER");
    textSize(20);
    text(`GAME OVER`, 500, 100);
    textSize(15);
    text(`Refresh the page to start over`, 500, 135);
  }
}

function drawGameWin(){
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] == 2048){
        console.log("YOU WIN!");
        fill(114,100,62);
        textSize(30);
        text(`YOU WIN! \n Proud googler!`, 500, 100);
      }
    }
  }
}

function slide(row) {
  let arr = row.filter(val => val); //* what is filter? what does => do?
  let missing = 4 - arr.length;
  let zeros = Array(missing).fill(0);
  arr = zeros.concat(arr); //* concat?
  return arr;
}

function combine(row) {
  for (let i = 3; i >= 1; i--) {
    let a = row[i];
    let b = row[i - 1];
    if (a == b) {
      row[i] = a + b;
      score += row[i];
      //best = score;
      row[i - 1] = 0;
    }
  }
  return row;
}

//Best score
// function resetBest(){
//   if (best > score){
//     //do nothing
//   }
//   else{
//     best 
//   }
  

function drawGrid() {
  let w = 100;
  fill(60);
  noStroke();
  rect(width / 2.8 - 5, height * 0.3 - 5, 4 * w + 50, 4 * w + 50, 10);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      fill(80);
      noStroke(); //dark grey
      rect(
        i * w + width / 2.8 + 10 * i + 5,
        j * w + height * 0.3 + 10 * j + 3,
        w,
        w,
        20
      ); //draw the grid with round edges

      let val = grid[i][j];
      if (grid[i][j] !== 0) {
        imageMode(CENTER);
        noStroke();
        let m = Math.log2(val) - 1;
        image(
          imageArr[m],
          i * w + width / 2.8 + 10 * i + 5 + w / 2,
          j * w + height * 0.3 + 10 * j + 3 + w / 2,
          100,
          100
        ); // so that the text is randomly displayed on the board
        // noFill();
        // stroke(5);
        // rect(i * w + width / 2.8 + 10 * i + 5 ,
        //   j * w + height * 0.3 + 10 * j + 3 , 100, 100, 10);
      }
    }
  }
}
