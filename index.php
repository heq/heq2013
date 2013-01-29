<!DOCTYPE HTML>
<html>
    <head>
        <meta charset="utf-8">
        <title>RandomPixels</title>
        <link href="style.css" rel="stylesheet" type="text/css">
        <link rel="stylesheet" type="text/css" href="style.css" media="all">
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
        <script>
            globalAlpha = 1;
            pixelSize = 5;
            pixelCount = 1;
            coordinateRounding = 10;
            randomX = 0;
            randomY = 0;

            var marked = new Array();
            canvasWidth = document.width;
            canvasHeight = document.height;
            apina = 0;
            start = 0;
            end = 0;

            window.onresize = function () {
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
                canvasWidth = document.width;
                canvasHeight = document.height;
                drawPixels();
            }

            function init() {
                canvas = document.getElementById("gameArea");
                canvas.width = document.width;
                canvas.height = document.height;
            }

            window.onload = function () {
                init();
                c = document.getElementById("gameArea");
                ctx = c.getContext("2d");

                c.addEventListener("mousedown", globalDim, false);

                var then = Date.now();
                setInterval(main, 1); // Execute as fast as possible
            }

            var main = function () {         
                globalDim();
                drawPixels();
            };

            function drawPixels(){
                apina = 0;
                start = new Date().getTime();
                while(apina<pixelCount){
                    randomDot();
                    apina++;
                }
                end = new Date().getTime();
                console.log("loading time = " + (end - start));
            }

            function randomDot(){
                randomX = 1+(Math.random()*(canvasWidth-pixelSize));
                randomY = 1+(Math.random()*(canvasHeight-pixelSize));
//                console.log("X=" + randomX + " Y=" + randomY);
                //red = Math.round(1+(Math.random()*255));
                //green = Math.round(1+(Math.random()*255));
                //blue = Math.round(100+(Math.random()*255));

                randomX = roundToNearest(coordinateRounding,randomX);
                randomY = roundToNearest(coordinateRounding,randomY);
//                console.log("rX=" + randomX + " rY=" + randomY);

                //ctx.fillStyle = "rgba("+red+", "+green+", "+blue+", 1)";
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(randomX,randomY,pixelSize,pixelSize);
            }

            function roundToNearest(toNearest,valueToRound){
                var canvas = document.getElementById("gameArea");
                return (toNearest * Math.round(valueToRound / toNearest));
            }

            function globalDim(){      
                ctx.fillStyle = "rgba(24, 40, 56, 0.05)";
                ctx.fillRect (0, 0, canvasWidth, canvasHeight);
            }
        </script>
    </head>
    <body>
        <canvas id="gameArea"></canvas>
    </body>
</html>