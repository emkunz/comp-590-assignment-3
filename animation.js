window.onload = function() {
  //Variables representing the canvas and the canvas' context (the context is used for actually drawing on the canvas)
var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

    let tracking = false;
    let lives = 3;
    let newGame = false;

    let mouse = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };

    window.addEventListener("mousedown", function(event) {
    if (!tracking) {
        ball.x = bouncePad.x;
        ball.y = bouncePad.y - 100;

        // Calculate direction toward mouse click
        const dx = event.clientX - ball.x;
        const dy = event.clientY - ball.y;

        // Make ball move toward click
        ball.angle = Math.atan2(dy, dx);
        // ball.angle=0; // testing the deterministic game loop

        // Start ball
        tracking = true;
        newGame = true;
    }
    });

    window.addEventListener("mousemove", function (event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });
			
  const bouncePad = {    x: 0,
    y: 0,
    width: 150,
    height: 20,
    angle: 0,
    speed: 8,
    path: [],
    pathTimer: 0,
    nextFoot: -1

  };

  const ball = {    x: 0,
    y: 0,
    radius: 20,
    angle: 30,
    speed: 8,
    path: [],
    pathTimer: 0,
    nextFoot: -1

  };

  resetPositions();

  function resetPositions() {

    bouncePad.width = canvas.width * 0.12;
    bouncePad.height = canvas.height * 0.025;
    ball.radius = Math.min(canvas.width, canvas.height) * 0.025;
    bouncePad.x = canvas.width / 2;
    bouncePad.y = canvas.height * 0.85;

    ball.x = bouncePad.x;
    ball.y = bouncePad.y - 100;

}

  //block spawning gird
  const rows = 4;
  const cols = 10;
  const bricks = [];

  for (let row = 0; row < rows; row++) {
      bricks[row] = [];

      for (let col = 0; col < cols; col++) {
          bricks[row][col] = {
            alive: true,
          color: getRandomColor(),
      }
    }
  }
			
  // resize canvas
  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    mouse.x = canvas.width / 2;
    mouse.y = canvas.height / 2;

    resetPositions();

  });


function drawBorder() {
    context.save();
    context.strokeStyle = "#8d1919";
    context.lineWidth = 20;
    context.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
    context.restore()
}

function drawText() {
  if(!tracking && !newGame) {
    context.save();
    context.fillStyle = "#ffffff";
    context.font = "40px Arial";
    context.textAlign = "center";
    context.fillText("Click here to play", canvas.width / 2, canvas.height / 4);

    context.restore();
  }
}

function getRandomColor() {
 return "#" + Math.floor(Math.random() * 16777215)
   .toString(16)
   .padStart(6, '0');
}

function drawBlocks() 
{
  context.save();

const width = canvas.width * 0.06;
const height = canvas.height * 0.04;
const startX = (canvas.width - (cols * width)) / 2;
const startY = canvas.height * 0.15;

    //spawn multiple in frame

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (bricks[row][col].alive) {
        context.fillStyle = bricks[row][col].color;
        context.strokeStyle = "#ffffff";
        context.lineWidth = 3;

        const x = startX + col * (width);
        const y = startY + row * (height);

        context.fillRect(
            x,
            y,
            width,
            height
        );

        context.strokeRect(
            x,
            y,
            width,
            height
        );
      }
    }
  }
  context.restore();
}

function drawBall() {
  context.save();
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  context.fill();
  context.restore();
}


  //draw pad
    function drawBouncePad() {
    context.save();
    context.fillStyle = "#ffffff";
    context.fillRect(
        bouncePad.x - bouncePad.width / 2,
        bouncePad.y - bouncePad.height,
        bouncePad.width,
        bouncePad.height
    );
    context.restore();
  }

  function drawLives() {
    context.save();
    context.fillStyle = "#ffffff";
    context.font = "30px Arial";
    context.fillText("Lives: " + lives, 30, 50);
    context.restore();
}

  function brickCollision() {
    const width = canvas.width * 0.06;
    const height = canvas.height * 0.04;
    const startX = (canvas.width - (cols * width)) / 2;
    const startY = canvas.height * 0.15; 

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!bricks[row][col].alive) { continue; }
          
          const x = startX + col * (width);
          const y = startY + row * (height);

          if (ball.x + ball.radius > x && ball.x - ball.radius < x + width &&
              ball.y + ball.radius > y && ball.y - ball.radius < y + height) {
            bricks[row][col].alive = false;

            ball.angle = -ball.angle; // Reverse the ball's angle to bounce it back

            return;
          }
        }
      }
    }

function borderCollision() {
    const border = 20;
    const radius = ball.radius;

    // Left wall
    if (ball.x - radius <= border) {
        ball.x = border + radius;
        ball.angle = Math.PI - ball.angle;
    }

    // Right wall
    if (ball.x + radius >= canvas.width - border) {
        ball.x = canvas.width - border - radius;
        ball.angle = Math.PI - ball.angle;
    }

    // Top wall
    if (ball.y - radius <= border) {
        ball.y = border + radius;
        ball.angle = -ball.angle;
    }
}

function bottomCollision() {
    const radius = ball.radius;
    const border = 20;

    if (ball.y + radius >= canvas.height - border) {
        lives--;

        bouncePad.x = canvas.width / 2;
        bouncePad.y = canvas.height * 0.85;

        ball.x = bouncePad.x;
        ball.y = bouncePad.y - ball.radius - 20;

        tracking = false;

        if (lives <= 0) {
            lives = 3;
            newGame = false;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    bricks[row][col].alive = true;
                }
            }
        }
    }
}


function bouncePadCollision() {
    const radius = ball.radius;
    const padLeft = bouncePad.x - bouncePad.width / 2;
    const padRight = bouncePad.x + bouncePad.width / 2;
    const padTop = bouncePad.y - bouncePad.height;
    const padBottom = bouncePad.y;

    if (
        ball.x + radius > padLeft &&
        ball.x - radius < padRight &&
        ball.y + radius > padTop &&
        ball.y - radius < padBottom
    ) {
        const overlapLeft = ball.x + radius - padLeft;
        const overlapRight = padRight - (ball.x - radius);
        const overlapTop = ball.y + radius - padTop;
        const overlapBottom = padBottom - (ball.y - radius);

        const minOverlap = Math.min(
            overlapLeft,
            overlapRight,
            overlapTop,
            overlapBottom
        );

        if (minOverlap === overlapTop && Math.sin(ball.angle) > 0) {
            ball.y = padTop - radius;
            ball.angle = -ball.angle;
        } else if (minOverlap === overlapLeft) {
            ball.x = padLeft - radius;
            ball.angle = Math.PI - ball.angle;
        } else if (minOverlap === overlapRight) {
            ball.x = padRight + radius;
            ball.angle = Math.PI - ball.angle;
        }
    }
}
  //follow cursor
  function update() {

    if(!tracking){
      return;
    }
    
    
    const dx = mouse.x - bouncePad.x;

    //only move pad with cursor
    if (Math.abs(dx) > 0.01) {

        //move
        bouncePad.x += Math.sign(dx) * bouncePad.speed;
    }

    const border = 20;
    const halfWidth = bouncePad.width / 2;

    if (bouncePad.x < border+halfWidth){
        bouncePad.x = border+halfWidth;
    }

    if (bouncePad.x > canvas.width-border-halfWidth){
        bouncePad.x = canvas.width-border-halfWidth;
    } 

    //lose condition


    //win condition
    if (bricks .every(row => row.every(brick => !brick.alive))) {
      context.save();
      context.fillStyle = "#ffffff";
      context.font = "40px Arial";
      context.fillText("CONGRATULATIONS, YOU'RE A WINNER!", canvas.width / 2, canvas.height / 2);

    }

    console.log("ball.y = " + ball.y);

    ball.x += Math.cos(ball.angle) * ball.speed;
    ball.y += Math.sin(ball.angle) * ball.speed;

    console.log("ball.x = " + ball.x);

    brickCollision();
    borderCollision();
    bouncePadCollision();
    bottomCollision();
  }


				
  
let lastTime = performance.now();
let accumulator = 0;
const fixedStep = 1000 / 60;

function mainLoop(currentTime) {
    let deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    if (deltaTime > 250) {
        deltaTime = 250;
    }

    accumulator += deltaTime;

    while (accumulator >= fixedStep) {
        update();
        accumulator -= fixedStep;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    drawLives();
    drawBall();
    drawBorder();
    drawText();
    drawBouncePad();

    if (tracking || newGame) {
        drawBlocks();
    }

    requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);

}

