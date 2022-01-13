function init() {

  // Sound

  // var audio = document.querySelector(audio);
  // audio.play();

  //VARIABLES

  // DOM
  const grid = document.querySelector(".grid");
  const width =  40; // change this value to the appropriate width
  const gridCellCount = width * width;
  const cells = [];

  // changing variables
  let tubePosition = gridCellCount - (width/2);
  const bullets = [
    400,
    400,
    400,
    400,
    400,
    400,
    400,
    400,
    400,
    400,
  ]
  let currentBullet = 0;
  let velocity = 0;
  let shootThisTurn = 0;

  // FUNCTIONS

  // SETUP

  // document.querySelectorAll("div").style.width = 2%;

  // Create Grid
  function createGrid() {
    for (let i=0; i<(gridCellCount); i++) {
      var cell = document.createElement("div");
      if (width == 40) {
        cell.classList.add("forty");
      } else if (width == 30) {
        cell.classList.add("thirty")
      }
      cells.push(cell);
      // cell.innerHTML = i;
      grid.appendChild(cell);
    }
  }
  createGrid();

  // document.querySelectorAll("div").style.width = 2%;

  // Position tube
  cells[tubePosition].classList.add("tube");

  // Position Aliens
  function createEnemies() {
    for (let i=0; i<(width); i++) {
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
        if (bullets[currentBullet] == 400) {
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
        if (bullets[currentBullet] == 400) {
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

    // Old shooter code, check then delete:

    // // Tube shoots
    // function tubeShoots(event) {
    //   if (shootThisTurn == 1) {
    //     // shoot
    //     // check bullets remaining
    //     if (bullets[(currentBullet+1)] == 400) {
    //       console.log("Able to shoot");
    //     }
    //     bullets[currentBullet] = tubePosition-20;
    //     console.log(`bullet fired to ${bullets[currentBullet]}`);
    //     // cells[(tubePosition-20)].classList.add("missile");
    //     cells[bullets[currentBullet]].classList.add("missile");
    //     if (currentBullet < 9) {
    //       currentBullet++;
    //     } else {
    //       currentBullet = 0;
    //     }
    //     console.log(`number ${currentBullet} bullet fired`);
    //   }
    //   shootThisTurn = 0;
    // }

  // Move bullet
  function updateLocation(item, index, arr) {
    if (item === 400) {
      // nothing happens
    } else if (item < (width)) {
      cells[item].classList.remove("missile");
      arr[index] = 400;
    } else {
      cells[item].classList.remove("missile");
      arr[index] = item - width;
      if (cells[(item-width)].classList.contains("goomba")) {
        cells[(item-width)].classList.remove("goomba");
        cells[(item-width)].classList.add("explosion");
        console.log("Goomba defeated");
        arr[index] = 400;
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
    for (i=0; i<width; i++) {
      if (cells[i].classList.contains("explosion")) {
        cells[i].classList.remove("explosion");
      }
    }
  }

  // Checking if the game has been won
  function checkWon() {
    for (i=0; i<(4*width+1); i++) {
      if (i == 4*width) {
        console.log("Player Won!");
      }
      else if (cells[i].classList.contains("goomba")) {
        break;
      }
    }
  }

  // Call functions
  window.addEventListener("keyup", updateVelocity);
  window.addEventListener("keyup", confirmShooting);
  bulletsMove();

  // Actions for each interval
  function nextInterval() {
    // all functions needed for each time interval
    // console.log("working");
    checkWon();
    clearExplosions();
    bulletsMove();
    tubeShoots();
    moveTube();
  }

  // Calling actions for each interval
  setInterval(nextInterval, 500);
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

// TO-DO

// - make the aliens move
// - add music to the game
// - create notification that no more bullets are left

// - stop the page from moving/scrolling