function init() {

  // Sound

  // var audio = document.querySelector(audio);
  // audio.play();

  //VARIABLES

  // DOM
  const grid = document.querySelector(".grid");
  const width =  20; // change this value to the appropriate width
  const gridCellCount = width * width;
  const cells = [];

  // changing variables
  let tubePosition = gridCellCount - (width/2);
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
  ]
  let currentBullet = 0;
  let velocity = 0;
  let shootThisTurn = 0;
  let enemies = [];
  let moveLeft = true;
  let won = false;
  let lost = false;

  // FUNCTIONS

  // SETUP

  // document.querySelectorAll("div").style.width = 2%;

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

  // document.querySelectorAll("div").style.width = "2%";

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

  // RECURRING FUNCTIONS

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

  // Register shoot command
  function confirmShooting(event) {
    if (event.keyCode == 38) {
      shootThisTurn = 1;
    }
  }

  // Tube shoots a Mario
  function tubeShoots(event) {
    if (shootThisTurn == 1) {
      // check bullets remaining
      if (currentBullet < 9) {
        if (bullets[currentBullet] == gridCellCount) {
          // console.log("Able to shoot");

          // shoot
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

  // Clear explosions
  function clearExplosions() {
    for (i=0; i<gridCellCount-width; i++) {
      if (cells[i].classList.contains("explosion")) {
        cells[i].classList.remove("explosion");
      }
    }
  }

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

  // Moving Enemies

  function enemiesMove(moveBy) {
    
      for (i=0; i<enemies.length; i++) {
        const index = parseInt(enemies[i].index);
        cells[index].classList.remove("goomba");
      }
      for (i=0; i<enemies.length; i++) {
        // if (enemies[i].isAlive) {
          const index = parseInt(enemies[i].index);
          enemies[i].index += moveBy;
        // }
      }
      for (i=0; i<enemies.length; i++) {
        // if (enemies[i].isAlive) {
          const index = parseInt(enemies[i].index);
          cells[index].classList.add("goomba");
        // }
      }
  }

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

  function checkLost() {
    if (Math.floor(enemies[0].index/width) >= width-3) {
      console.log("Player loses");
      lost=true;
    }
  }

  // how can I remove this from the screen?
  function displayWin() {
    // document.querySelectorAll("div").style.display = "none";
    // document.getElementsByClassName("grid-wrapper").style.display = "none";
    const message = document.createElement("img");
    message.src = "../assets/mario-wins-image.jpeg";
    document.querySelector("body").appendChild(message);
  }
  function displayLoss() {
    const message = document.createElement("img");
    message.src = "../assets/game-over-image.jpeg";
    document.querySelector("body").appendChild(message);
  }

  // Call functions
  window.addEventListener("keyup", updateVelocity);
  window.addEventListener("keyup", confirmShooting);
  bulletsMove();

  // Actions for each interval
  function nextInterval() {
    // all functions needed for each time interval
    // console.log("working");
    if (!won && !lost) {
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
    }
    else {
      // console.log("losing image");
      displayLoss();
    }
  }

  // Calling actions for each interval
    setInterval(nextInterval, 100);
}

document.addEventListener('DOMContentLoaded', init)


// USED ONCE:

// create grid function
// place Tube

// USED AGAIN:

// Tube moves
// Tube shoots
// bullets move


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

// TO-DO
// - add winning and losing visuals
// - add music to the game
// - create notification that no more bullets are left

// - stop the page from moving/scrolling

// Completed this version: added winning/losing images