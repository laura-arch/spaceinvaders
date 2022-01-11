function init() {

  //VARIABLES

  // DOM
  const grid = document.querySelector(".grid");
  const width =  20; // change this value to the appropriate width
  const gridCellCount = width * width;
  const cells = [];

  // changing variables
  let pikaPosition = 390;
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

  // Create Grid
  function createGrid() {
    for (let i=0; i<(gridCellCount); i++) {
      var cell = document.createElement("div");
      cells.push(cell);
      cell.innerHTML = i;
      grid.appendChild(cell);
    }
  }
  createGrid();

  // Position Pika
  cells[pikaPosition].classList.add("pika");

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

  // Moving Pika
  function movePika() {
    
    if (velocity == -1) {
      // move left
      if (pikaPosition % 20 !== 0) {
        cells[pikaPosition].classList.remove("pika");
        pikaPosition -= 1;
        cells[pikaPosition].classList.add("pika");
      }
    } else if (velocity == 1) {
      // move right
      if (pikaPosition % 20 !== 19) {
        cells[pikaPosition].classList.remove("pika");
        pikaPosition += 1;
        cells[pikaPosition].classList.add("pika");
      }
    }
  }

  // Register shoot command
  function confirmShooting(event) {
    if (event.keyCode == 38) {
      shootThisTurn = 1;
    }
  }

  // Pika shoots
  function pikaShoots(event) {
    if (shootThisTurn == 1) {
      // check bullets remaining
      if (currentBullet < 9) {
        if (bullets[(currentBullet+1)] == 400) {
          console.log("Able to shoot");

          // shoot
          bullets[currentBullet] = pikaPosition-20;
          console.log(`bullet fired to ${bullets[currentBullet]}`);
          // cells[(pikaPosition-20)].classList.add("missile");
          cells[bullets[currentBullet]].classList.add("missile");
          console.log(`number ${currentBullet} bullet fired`);

          currentBullet++;
          shootThisTurn = 0;
        }
      } else {
        if (bullets[0] == 400) {
          console.log("Able to shoot");

          // shoot
          bullets[currentBullet] = pikaPosition-20;
          console.log(`bullet fired to ${bullets[currentBullet]}`);
          // cells[(pikaPosition-20)].classList.add("missile");
          cells[bullets[currentBullet]].classList.add("missile");
          console.log(`number ${currentBullet} bullet fired`);

          currentBullet = 0;
          shootThisTurn = 0;
        }
      }
    }
  }

    // Old shooter code, check then delete:

    // // Pika shoots
    // function pikaShoots(event) {
    //   if (shootThisTurn == 1) {
    //     // shoot
    //     // check bullets remaining
    //     if (bullets[(currentBullet+1)] == 400) {
    //       console.log("Able to shoot");
    //     }
    //     bullets[currentBullet] = pikaPosition-20;
    //     console.log(`bullet fired to ${bullets[currentBullet]}`);
    //     // cells[(pikaPosition-20)].classList.add("missile");
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
    } else if (item <= 19) {
      cells[item].classList.remove("missile");
      arr[index] = 400;
    } else {
      cells[item].classList.remove("missile");
      arr[index] = item - 20;
      cells[(item-20)].classList.add("missile");
    }
    console.log(`Bullets at ${item}`);
  }
  // Itterate over bullets
  function bulletsMove() {
    bullets.forEach(updateLocation);
  }

  // Call functions
  window.addEventListener("keyup", updateVelocity);
  window.addEventListener("keyup", confirmShooting);
  bulletsMove();

  // Actions for each interval
  function nextInterval() {
    // all functions needed for each time interval
    // console.log("working");
    bulletsMove();
    pikaShoots();
    movePika();
  }

  // Calling actions for each interval
  setInterval(nextInterval, 1000);
}

document.addEventListener('DOMContentLoaded', init)


// USED ONCE:

// create grid function
// place Pika

// USED AGAIN:

// Pika moves
// Pika shoots
// bullets move


// DONE
// - itterate around the 10 bullets so we can have more than one
// - introduce velocity variable so we can implement moves only on interval
// - introduce shootCommand boolean so we can implement shooting only on interval

// TO-DO
// - change bullet and pika sprites
// - create logic to stop creating more bullets after 10

// - create notification that no more bullets are left