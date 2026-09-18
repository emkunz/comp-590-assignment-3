window.onload = function() {
  //Variables representing the canvas and the canvas' context (the context is used for actually drawing on the canvas)
var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

    let mouse = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };

    window.addEventListener("mousemove", function (event) {
        mouse.x = event.clientX;
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
              y:canvas.width/3, //the y location of the pad
              angle: 0, //the angle of the pad
              speed: 12, //the speed of the pad when moving with curson
              path: [], //the path that the turtle has taken ??
              pathTimer: 0,
            nextFoot: -1

  };
			
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

  //follow cursor
  function update() {
    
    const dx = mouse.x - bouncePad.x;

    //only move with cursor
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
  }

				
  
  function mainLoop() {		
    context.clearRect(0, 0, canvas.width, canvas.height);	
    update();
    drawBall();
    drawBorder();
    drawBouncePad();
    requestAnimationFrame(mainLoop);
  }

  mainLoop();
}

