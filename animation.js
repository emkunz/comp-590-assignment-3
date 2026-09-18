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
        mouse.y = event.clientY;
    });
			
  const turtle = {x:canvas.width/2, //the x location of the ball
              y:canvas.height/2, //the y location of the ball
              angle: 0, //the angle of the turtle
              speed: 2.5, //the speed of the turtle
              legAnimation: 0, //the leg animation state of the turtle
              path: [], //the path that the turtle has taken
              pathTimer: 0,
            nextFoot: -1

  };
			
  // resize canvas
  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    mouse.x = canvas.width / 2;
    mouse.y = canvas.height / 2;    
  });

  //draw sand path
  function drawPath() {
    for (let i = 0; i < turtle.path.length; i++) {

        let point = turtle.path[i];

        //old footprints become more transparent
        let age = i / turtle.path.length;
        let opacity = Math.pow(age, 2);

        context.save();

        context.translate(point.x, point.y);
        context.rotate(point.angle);
        context.scale(0.35, 0.35);

        context.fillStyle = `rgba(132, 121, 101, ${opacity})`;
        let side = point.side;

        context.translate(-20, side * 40);

        //angle print
        context.rotate(side * 0.95);

        //footprint
        context.beginPath();
        context.ellipse(0, 20, 9, 18, 0, 0, Math.PI * 2);
        context.fill();

        context.restore();
    }
  }

  //draw leg
  function drawLeg(x, y, side, swing) {
    context.save();
    context.translate(x, y);
    context.rotate(side*0.35+swing); //leg swing

    //front
    context.fillStyle = "#3cc268";

    //foot
    context.beginPath();
    context.ellipse(0, 20, 24, 10, 0, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  //draw turtle
    function drawTurtle() {
        context.save();
        context.translate(turtle.x, turtle.y);
        context.rotate(turtle.angle);
        context.scale(0.35, 0.35);

        //front legs
        drawLeg(15, 28, -2, Math.sin(turtle.legAnimation) * 0.35); //right
        drawLeg(42, -58, 2, Math.sin(turtle.legAnimation + Math.PI) * 0.35); //left

        //back legs

        drawLeg(-35, 25, -1, Math.sin(turtle.legAnimation + Math.PI) * 0.35); //left
        drawLeg(-25, -60, 1, Math.sin(turtle.legAnimation) * 0.35); //right

        //shell

        context.fillStyle = "#2a7744";
        context.beginPath();
        context.ellipse(0, 0, 55, 38, 0, 0, Math.PI * 2);
        context.fill();

        //outline
        context.strokeStyle = "#1e4f2f";
        context.lineWidth = 8;
        context.stroke();

        //pattern
                context.strokeStyle = "#1e4f2f";
        context.lineWidth = 2;

        context.beginPath();

        context.moveTo(-35, -20);
        context.lineTo(0, 0);
        context.lineTo(35, -20);

        context.moveTo(-35, 20);
        context.lineTo(0, 0);
        context.lineTo(35, 20);

        context.moveTo(0, -40);
        context.lineTo(0, 40);

        context.stroke();

        //head
        context.fillStyle = "#3cc268";

        context.beginPath();
        context.arc(
            60,
            0,
            25,
            0,
            Math.PI * 2
        );
        context.fill();

        //eyes
        context.fillStyle = "#000000";
        context.beginPath();
        context.arc(83, -10, 7, 0, Math.PI * 2);
        context.arc(83, 10, 7, 0, Math.PI * 2);
        context.fill();

        //tail
        context.fillStyle = "#3cc268";

        context.beginPath();
        context.moveTo(-80, 0);
        context.lineTo(-60, -10);
        context.lineTo(-60, 10);
        context.closePath();
        context.fill();


        context.restore();
    }

  //follow cursor
  function update() {
    
    const dx = mouse.x - turtle.x;
    const dy = mouse.y - turtle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);  

    //only move with cursor
    if (distance > 3) {

        const targetAngle = Math.atan2(dy, dx);

        let angleDifference = targetAngle - turtle.angle;

        while (angleDifference > Math.PI) angleDifference -= 2 * Math.PI;
        while (angleDifference < -Math.PI) angleDifference += 2 * Math.PI;

        turtle.angle += angleDifference * 0.15;

        //move
        turtle.x += Math.cos(turtle.angle) * turtle.speed;
        turtle.y += Math.sin(turtle.angle) * turtle.speed;

        //legs move
        turtle.legAnimation += 0.25;

        //add to path
        turtle.pathTimer++;
        
        if (turtle.pathTimer >= 10) {
            turtle.path.push({ x: turtle.x, y: turtle.y, angle: turtle.angle, side: turtle.nextFoot });
            turtle.nextFoot *= -1;
            turtle.pathTimer = 0;
        }

        //stop path growing too much
        if (turtle.path.length > 60) {
            turtle.path.shift();
        }

    }
}
				
  
  function mainLoop() {		
    context.clearRect(0, 0, canvas.width, canvas.height);	
    update();
    drawPath();
    drawTurtle();
    requestAnimationFrame(mainLoop);
  }

  mainLoop();
}
