window.onload = function() {
  //Variables representing the canvas and the canvas' context (the context is used for actually drawing on the canvas)
var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

    let tracking = false;

    let mouse = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };

    window.addEventListener("mousedown", function() {
      tracking = true;
    });

    window.addEventListener("keydown", function() {
        tracking = true;
    });

    window.addEventListener("mousemove", function (event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });
			
  const bouncePad = {x:canvas.width/2, //the x location of the pad
              y:canvas.width/2, //the y location of the pad
              angle: 0, //the angle of the pad
              speed: 8, //the speed of the pad when moving with curson
              path: [], //the path that the turtle has taken ??
              pathTimer: 0,
            nextFoot: -1

  };

  const ball = {x:canvas.width/2, //the x location of the pad
              y:canvas.width/2.35, //the y location of the pad
              angle: 30, //the angle of the pad
              speed: 8, //the speed of the pad when moving with curson
              path: [], //the path that the turtle has taken ??
              pathTimer: 0,
            nextFoot: -1

  };

  //block spawning gird
  const rows = 6;
  const cols = 18;
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
    
    bouncePad.x = canvas.width * 0.75;
    bouncePad.y = canvas.height / 2;

    ball.x = canvas.width / 2;
    ball.y = canvas.height / 3; 
  });


function drawBorder() {
    context.strokeStyle = "#8d1919";
    context.lineWidth = 20;
    context.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
    context.restore()
}

function drawText() {
  if(!tracking){
    context.save();
    context.fillStyle = "#ffffff";
    context.font = "40px Arial";
    context.fillText("Any key or button to start", canvas.width / 3, canvas.height / 2);

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

  const width = 76;
  const height = 30;
  const startX = (canvas.width - (cols * (width))) / 2;
  const startY = 75;

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
    context.translate(ball.x, ball.y);

    context.fillStyle = "#ffffff";
    context.beginPath();
    context.arc(0, 0, 20, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }


  //draw pad
    function drawBouncePad() {
        context.save();
        context.translate(bouncePad.x, bouncePad.y);

        context.fillStyle = "#ffffff";
        context.beginPath();
        context.rect(-75, -75, 150, 20);
        context.fill();

        context.restore();
    }

  function brickCollision() {
    const width = 76;
    const height = 30;
    const startX = (canvas.width - (cols * (width))) / 2;
    const startY = 75;  

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!bricks[row][col].alive) { continue; }
          
          const x = startX + col * (width);
          const y = startY + row * (height);

          if (ball.x + 20 > x && ball.x - 20 < x + width &&
              ball.y + 20 > y && ball.y - 20 < y + height) {
            bricks[row][col].alive = false;

            ball.angle = -ball.angle; // Reverse the ball's angle to bounce it back

            return;
          }
        }
      }
    }

    function borderCollision() {
      const border = 20;
      const radius = 20; // Ball radius

      // left
      if (ball.x - radius < border || ball.x + radius > canvas.width - border) {
        ball.angle = Math.PI - ball.angle; // Reverse the horizontal direction
      }

      //right
      if (ball.x + radius > canvas.width - border) {
        ball.angle = Math.PI - ball.angle; // Reverse the horizontal direction
      }

      //top
      if (ball.y - radius < border) {
        ball.angle = -ball.angle; // Reverse the vertical direction
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
    const halfWidth = 75; //150/2

    if (bouncePad.x < border+halfWidth){
        bouncePad.x = border+halfWidth;
    }

    if (bouncePad.x > canvas.width-border-halfWidth){
        bouncePad.x = canvas.width-border-halfWidth;
    } 

    if (bricks .every(row => row.every(brick => !brick.alive))) {
      context.save();
      context.fillStyle = "#ffffff";
      context.font = "40px Arial";
      context.fillText("CONGRATULATIONS, YOU'RE A WINNER!", canvas.width / 3, canvas.height / 2);

    }

    ball.x += Math.cos(ball.angle) * ball.speed;
    ball.y += Math.sin(ball.angle) * ball.speed;

    brickCollision();
    borderCollision();
  }

				
  
  function mainLoop() {		
    context.clearRect(0, 0, canvas.width, canvas.height);	
    update();
    drawBall();
    drawBorder();
    drawText();
    drawBouncePad();
    if(tracking){drawBlocks();}
    requestAnimationFrame(mainLoop);
  }

  mainLoop();
}

