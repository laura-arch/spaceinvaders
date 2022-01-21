function init() {

  //VARIABLES

  // constant variables
  const grid = document.querySelector(".grid");
  // sounds
  const backgroundMusic = new Audio("../Sounds/background.mp3");
  const goombaHitSound = new Audio("../Sounds/goomba-hit-sound.mp3");
  const winningMusic = new Audio("../Sounds/win.mp3");
  const losingMusic = new Audio("../Sounds/gameover.mp3");
  const shootSound = new Audio("../Sounds/bullet-fired.mp3");

  // changing variables
  let width =  20;        // change this value to the appropriate width: 20, 30 or 40
  let gridCellCount = width * width;
  let cells = [];
  let speed = 200;
  let tubePosition = gridCellCount - (width/2); // tracks location of the tube, initialised to center
  const bullets = [
    gridCellCount,
    gridCellCount,
    gridCellCount,
    gridCellCount,
    gridCellCount,
    gridCellCount,
    gridCellCount,
    gridCellCount,
    gridCellCount,
    gridCellCount,
  ]                       // array of all ten available bullets
  let enemies = [];       // array of all the enemies currently on screen

  let currentBullet = 0;  // tracks which of the ten bullets is being fired
  let velocity = 0;       // tracks direction the tube is travelling in
  let shootThisTurn = 0;  // tracks whether the user has pressed to shoot
  
  let moveLeft = true;
  let won = false;
  let lost = false;
  let pauseClicked = false;
  let musicOn = false;

  // FUNCTIONS

  // SETUP

  // Create Grid
  function createGrid() {
    for (let i=0; i<gridCellCount; i++) {
      const cell = document.createElement("div");
      cell.setAttribute("cellNumber", i);
      // cell.style.width = "2%";
      if (width == 40) {
        cell.style.width = "2.5%";
        cell.style.height = "2.5%";
        // cell.classList.add("forty");
      } else if (width == 30) {
        cell.style.width = `${10/3}%`;
        cell.style.height = `${10/3}%`;
        // cell.classList.add("thirty")
      }
      cells.push(cell);
      // cell.innerHTML = i;
      grid.appendChild(cell);
    }
  }
  createGrid();

  // Position tube
  cells[tubePosition].classList.add("tube");

  // Position Aliens
  function createEnemies() {
    for (let i=5; i<(width-5); i++) {
      // enemies.push([i, 1]);
      enemies.push({index: i, isAlive: true});
      // console.log(enemies);
      cells[i].classList.add("goomba");
    }
  }
  createEnemies();

  // Adding background music
  backgroundMusic.addEventListener('ended', function() {
    if (musicOn) {
      this.currentTime = 0;
      this.play();
    }
  }, false);


  // EVENT LISTENER FUNCTIONS - BUTTONS

  // Checking if refresh has been hit
  function refreshGame() {
    //cancel interval
    clearInterval(runGame);
    //reset variables
    won = false;
    lost = false;
    document.querySelector("body").lastChild.remove();
    document.querySelector(".grid-wrapper").style.display = "flex";
    document.querySelector(".grid-wrapper").style.justifyContent = "center";
    if (musicOn) {
      winningMusic.pause();
      backgroundMusic.play();
    }
    tubePosition = gridCellCount - (width/2);
    for (i=0; i<10; i++) {
      bullets[i] = gridCellCount;
    }
    enemies = [];
    currentBullet = 0;
    velocity = 0;
    shootThisTurn = 0;
    moveLeft = true;
    pauseClicked = false;
    cells = [];
    document.querySelectorAll(".grid > div").forEach(
      (element) => {
        element.remove();
      }
    );
    //re-run functions
    createGrid();
    cells[tubePosition].classList.add("tube");
    createEnemies();
    //restart interval
    runGame = setInterval(nextInterval, speed);
  }
  document.querySelector("#reset").addEventListener("click", refreshGame);

  // Checking if pause button has been hit
  document.querySelector("#pause").addEventListener("click", () => pauseClicked = !pauseClicked);

  // Checking if mute button has been hit
  document.querySelector("#mute").addEventListener("click", function() {
    musicOn = !musicOn;
    console.log(`Music on is ${musicOn}`);
    if (musicOn) {
      backgroundMusic.play();
    } else {
      backgroundMusic.pause();
    }
  });

  document.querySelector("#difficulty").addEventListener("click", function() {
    if (width == 20) {
      width = 30;
      speed = 150;
      gridCellCount = width * width;
      this.src="assets/medium.png";
      refreshGame();
    } else if (width == 30) {
      width = 40;
      speed = 100;
      gridCellCount = width * width;
      this.src="assets/hard.png"
      refreshGame();
    } else {
      width = 20;
      speed = 200;
      gridCellCount = width * width;
      this.src="assets/easy.png"
      refreshGame();
    }
    console.log(width);
  });


  // EVENT LISTENER FUNCTIONS - OTHER

  // Logging velocity
  function updateVelocity(event) {
    
    if (event.keyCode == 37) {
      // move left
      velocity = -1;
    } else if (event.keyCode == 39) {
      velocity = 1;
    } else if (event.keyCode == 40) {
      velocity = 0;
    }
    // console.log(velocity);
  }
  window.addEventListener("keyup", updateVelocity);

  // Register shoot command
  function confirmShooting(event) {
    if (event.keyCode == 38) {
      shootThisTurn = 1;
    }
  }
  window.addEventListener("keyup", confirmShooting);


  // RECURRING FUNCTIONS
  // These happen on each interval

  // Checking if the game has been won
  function checkWon() {
    let enemiesRemaining = 0;
    for (i=0; i<enemies.length; i++)  {
      if (enemies[i].isAlive) {
        enemiesRemaining++;
      }
    }
    if (enemiesRemaining == 0) {
      console.log("Player won!");
      won=true;
    }
  }

  // Clear explosions
  function clearExplosions() {
    for (i=0; i<gridCellCount-width; i++) {
      if (cells[i].classList.contains("explosion")) {
        cells[i].classList.remove("explosion");
      }
    }
  }

  // Moving Enemies by set direction
  function enemiesMove(moveBy) {
    for (i=0; i<enemies.length; i++) {
      const index = parseInt(enemies[i].index);
      cells[index].classList.remove("goomba");
    }
    for (i=0; i<enemies.length; i++) {
      const index = parseInt(enemies[i].index);
      enemies[i].index += moveBy;
    }
    for (i=0; i<enemies.length; i++) {
      const index = parseInt(enemies[i].index);
      cells[index].classList.add("goomba");
    }
  }

  // Determine the direction the enemies should move
  function moveEnemies() {
    if (moveLeft) {
      if (enemies[0].index%width > 0) {
        enemiesMove(-1);
      }
      else {
        moveLeft = false;
        enemiesMove(width);
      }
    }
    else {
      if ((enemies[enemies.length-1].index+1)%width !== 0) {
        enemiesMove(1);
        // console.log(enemies[enemies.length-1].index);
        // console.log(width);
      }
      else {
        moveLeft = true;
        enemiesMove(width);
        // console.log('switch direction')
      }
    }
  }

  // Move bullet
  function updateLocation(item, index, arr) {
    if (item === gridCellCount) {
      // nothing happens
    } else if (item < (width)) {
      cells[item].classList.remove("missile");
      arr[index] = gridCellCount;
    } else {
      cells[item].classList.remove("missile");
      arr[index] = item - width;
      if (cells[(item-width)].classList.contains("goomba")) {
        cells[(item-width)].classList.remove("goomba");
        cells[(item-width)].classList.add("explosion");
        console.log("Goomba defeated");
        // remove the enemy from the enemies array:
        for (i=0; i<enemies.length; i++) {
          if (enemies[i].index == item-width) {
            if (musicOn) {
              goombaHitSound.currentTime=0;
              goombaHitSound.play();
            }
            enemies[i].isAlive = false;
            enemies.splice(i, 1);
            console.log(`There are ${enemies.length} enemies remaining`);
          }
        }
        arr[index] = gridCellCount;
      } else {
        cells[(item-width)].classList.add("missile");
      }
    }
    // console.log(`Bullets at ${item}`);
  }
  // Itterate over bullets
  function bulletsMove() {
    bullets.forEach(updateLocation);
  }

  // Tube shoots a Mario
  function tubeShoots(event) {
    if (shootThisTurn == 1) {
      // check bullets remaining
      if (currentBullet < 9) {
        if (bullets[currentBullet] == gridCellCount) {
          // console.log("Able to shoot");

          // shoot
          if (musicOn) {
            shootSound.currentTime = 0;
            shootSound.play();
          }
          bullets[currentBullet] = tubePosition-width;
          // console.log(`bullet fired to ${bullets[currentBullet]}`);
          // cells[(tubePosition-20)].classList.add("missile");
          cells[bullets[currentBullet]].classList.add("missile");
          console.log(`number ${currentBullet} bullet fired to ${bullets[currentBullet]}`);

          currentBullet++;
        }
      } else {
        if (bullets[currentBullet] == gridCellCount) {
          // console.log("Able to shoot");

          // shoot
          if (musicOn) {
            shootSound.currentTime = 0;
            shootSound.play();
          }
          bullets[currentBullet] = tubePosition-width;
          console.log(`bullet fired to ${bullets[currentBullet]}`);
          // cells[(tubePosition-20)].classList.add("missile");
          cells[bullets[currentBullet]].classList.add("missile");
          console.log(`number ${currentBullet} bullet fired to ${bullets[currentBullet]}`);

          currentBullet = 0;
        }
      }
      shootThisTurn = 0;
    }
  }

  // Moving Tube
  function moveTube() {
    
    if (velocity == -1) {
      // move left
      if (tubePosition % width !== 0) {
        cells[tubePosition].classList.remove("tube");
        tubePosition -= 1;
        cells[tubePosition].classList.add("tube");
      }
    } else if (velocity == 1) {
      // move right
      if (tubePosition % width !== width-1) {
        cells[tubePosition].classList.remove("tube");
        tubePosition += 1;
        cells[tubePosition].classList.add("tube");
      }
    }
  }

  // Checking if the game has been lost
  function checkLost() {
    if (Math.floor(enemies[0].index/width) >= width-3) {
      console.log("Player loses");
      lost=true;
    }
  }

  // FINAL FUNCTIONS

  // Showing a win or a loss
  function displayWin() {
    document.querySelector(".grid-wrapper").style.display = "none";
    const message = document.createElement("img");
    message.src = "../assets/mario-wins-image.jpeg";
    document.querySelector("body").appendChild(message);
    backgroundMusic.pause();
    if (musicOn) {
      winningMusic.play();
    }
  }
  function displayLoss() {
    document.querySelector(".grid-wrapper").style.display = "none";
    const message = document.createElement("img");
    message.src = "../assets/game-over-image.jpeg";
    document.querySelector("body").appendChild(message);
    backgroundMusic.pause();
    if (musicOn) {
      losingMusic.play();
    }
  }


  // RUNNING FUNCTIONS

  // Actions for each interval
  function nextInterval() {
    // all functions needed for each time interval
    if (!won && !lost && !pauseClicked) {
      checkWon();
      clearExplosions();
      moveEnemies();
      bulletsMove();
      tubeShoots();
      moveTube();
      checkLost();
    }
    else if (won) {
      // console.log("winning image");
      displayWin();
      clearInterval(runGame);
    }
    else if (lost) {
      // console.log("losing image");
      displayLoss();
      clearInterval(runGame);
    }
  }
  // Starting the intervals
    let runGame = setInterval(nextInterval, 200);
}

document.addEventListener('DOMContentLoaded', init)

// TASK LIST

// DONE
// - itterate around the 10 bullets so we can have more than one
// - introduce velocity variable so we can implement moves only on interval
// - introduce shootCommand boolean so we can implement shooting only on interval
// - change bullet and pika sprites
// - create logic to stop creating more bullets after 10
// - add aliens
// - detect collisions with the aliens
// - detect when the game is won
// - add different sizes of board
// - change enemies to be stored in an array
// - make the enemies move
// - update detect collisions to be based on enemies array
// - add winning and losing visuals
// - add a restart button
// - add a pause game button
// - add a title
// - stop the page from moving/scrolling
// - add music to the game
// - add a mute button
// - add sound effects
// - change the reset function not to refresh the whole page
// - add settings for board size
// - added changing the game speed when difficulty changes
// - change the mute button to affect all sounds, not just background music
// - fix reset to work when game has been won or lost

// TO-DO
// - create notification that no more bullets are left
// - add scoring
// - DRY the code

// QUESTIONS

// LATEST UPDATE
// - fixed reset to work when game has been won or lost