counter = 0;
counterViive = 0;
addViive = 0;
fadeViive = 0;
drawViive = 0;

pixelAddDelay = 0.2;
pixelCursor = 0;
arraySize = 100;
pixelCoordinatesX = new Array();
pixelCoordinatesY = new Array();
pixelAlphas = new Array();
pixelFadeInOut = new Array();
pixelSizes = new Array();

pixelSize = 5;
alphaIncrease = 0.05;
alphaReduction = 0.01;
coordinateRounding = 20;

planeAlphaReduction = 0.05;
planeAddViive = 0;
planeFadeViive = 0;
planeCursor = 0;
planeArrayCount = 100;
planeCoordinatesX = new Array();
planeCoordinatesY = new Array();
planeAlphas = new Array();
planeSpeeds = new Array();
planeSpeedViiveet = new Array();
planePixelAmount = new Array();
planeSizes = new Array();
fastestPlane = 0.2;
slowestPlane = 0.8;

moonSize = 100;
moonCoordinateX = 150;
moonCoordinateY = 150;

window.onload = function () {
    canvas = document.getElementById("canvasArea");
    ctx = canvas.getContext("2d");

    init();

    moonGrad = ctx.createRadialGradient(
            moonCoordinateX, moonCoordinateY, 0,
            moonCoordinateX + (moonSize/2), moonCoordinateY + (moonSize / 2), moonCoordinateY);
    moonGrad.addColorStop(0.0, 'rgba(255,255,215, 1)');
    moonGrad.addColorStop(0.9, 'rgba(220,220,180, 1)');
    moonGrad.addColorStop(1.0, 'rgba(150,150,110, 1)');

    moonGlare = ctx.createRadialGradient(moonCoordinateX,moonCoordinateY,0,
            moonCoordinateX,moonCoordinateY,(moonSize * 1.75));
        moonGlare.addColorStop(0.7, 'rgba(255,255,240, 0.05)');
        moonGlare.addColorStop(1, 'rgba(255,255,240, 0)');
        ctx.fillStyle = moonGlare;
        ctx.fillRect(0,0,canvasWidth, canvasHeight);
    
    theFunction();
}
function init() {
    canvas.width = document.getElementById("canvasArea").offsetWidth;
    canvas.height = document.getElementById("canvasArea").offsetHeight;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    radGrad = ctx.createRadialGradient(0,0,0,0,0,0);        //tuikkujen hohto

    bgGrad = ctx.createLinearGradient(0,0,0 ,canvasHeight,canvasWidth,0);   //taustan gradient
    bgGrad.addColorStop(0.0, 'rgba(4,0,16, 1)');
    bgGrad.addColorStop(0.08, "rgba(12,0,32, 1)");
    bgGrad.addColorStop(0.75, "rgba(20,32,64, 1)");
    bgGrad.addColorStop(1.0, "rgba(32,64,88, 1)");
}
window.onresize = function () {
    canvas.width = document.getElementById("canvasArea").offsetWidth;
    canvas.height = document.getElementById("canvasArea").offsetHeight;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    init();

    APP.core.render();
}

function theFunction(){
    window.APP = window.APP || {};
     
    APP.pause = function() {
        window.cancelAnimationFrame(APP.core.animationFrame);
    };
     
    APP.play = function() {
        APP.core.then = Date.now();
        APP.core.frame();
    };
     
     
    APP.core = {
     
        frame: function() {
            APP.core.setDelta();
            APP.core.update();
            APP.core.render();
            APP.core.animationFrame = window.requestAnimationFrame(APP.core.frame);
        },
     
        setDelta: function() {
            APP.core.now = Date.now();
            APP.core.delta = (APP.core.now - APP.core.then) / 1000; // seconds since last frame
            APP.core.then = APP.core.now;
//             console.log(viive);
        },
     
        update: function() {
            // Render updates to browser (draw to canvas, update css, etc.)
        },
     
        render: function() {
            ctx.fillStyle = bgGrad;
            ctx.fillRect (0, 0, canvasWidth, canvasHeight);

            for (var i = 0; i < pixelCoordinatesX.length; i++) {
                drawGradient( pixelCoordinatesX[i],
                              pixelCoordinatesY[i],
                              pixelAlphas[i],
                              pixelSizes[i]);
                drawTuikku( pixelCoordinatesX[i],
                            pixelCoordinatesY[i],
                            pixelAlphas[i],
                            pixelSizes[i]);
            };
            drawMoon();

            if( fadeViive > 0.01 ) {
                for (var i = 0; i < pixelCoordinatesX.length; i++) {
                    if (pixelFadeInOut[i] == 1){
                        if (pixelAlphas[i] <= 1.00 || (pixelAlphas[i] + alphaIncrease) <= 1.00 )  {
                            pixelAlphas[i] += alphaIncrease;
                        } else {
                            pixelAlphas[i] = 1.00;
                            pixelFadeInOut[i] = 0;
                        }
                    } else {
                        if (pixelAlphas[i] >= 0 || (pixelAlphas[i] - alphaReduction) >= 0 ) {
                            pixelAlphas[i] -= alphaReduction;
                        } else {
                            pixelAlphas[i] = 0;
                        }
                    } 
                }
                fadeViive = 0;
            } else {
                fadeViive += APP.core.delta;
            }

            if( addViive > pixelAddDelay ) {
                addTuikku();
                addViive = 0;
            } else {
                addViive += APP.core.delta;
            }

            if( planeAddViive > 5 ) {
                addPlane();
                planeAddViive = 0;
            } else {
                planeAddViive += APP.core.delta;
            }

            for (var i = 0; i < planeCoordinatesX.length; i++) {
                if (planeSpeeds[i] < planeSpeedViiveet[i]) {
                    planeSpeedViiveet[i] = 0;
                    planeCoordinatesX[i] -= planePixelAmount[i];
                } else {
                    planeSpeedViiveet[i] += APP.core.delta;
                }
                drawPlane( planeCoordinatesX[i],
                           planeCoordinatesY[i],
                           planeAlphas[i],
                           planeSizes[i]);
            }
            
            if ( planeFadeViive > 0.01 ) {
                for (var i = 0; i < planeCoordinatesX.length; i++) {
                    if (planeAlphas[i] > 0) {
                        planeAlphas[i] -= planeAlphaReduction;
                    } else {
                        planeAlphas[i] = 1;
                    }
                }
                planeFadeViive = 0;
            } else {
                planeFadeViive += APP.core.delta;
            }
        }
    };
     
    APP.play();

    function drawMoon() {
        ctx.fillStyle = moonGlare;
        ctx.fillRect(0,0,canvasWidth, canvasHeight);

        ctx.fillStyle = moonGrad;
        ctx.arc(moonCoordinateX,moonCoordinateY,moonSize,0,Math.PI*2,true);
        ctx.fill();
    }

    function drawTuikku(X, Y, A, S) {      
        ctx.fillStyle = "rgba(255,255,255," + A + ")";
        ctx.fillRect(X, Y, S, S);
        
        ctx.fillRect(X+S, Y, S, S);
        ctx.fillRect(X-S, Y, S, S);
        ctx.fillRect(X, Y+S, S, S);
        ctx.fillRect(X, Y-S, S, S);
    }
    function drawGradient(X, Y, A, S) {
        // createRadialGradient(x0, y0, r0, x1, y1, r1)
        S = S / 2;
        radGrad = ctx.createRadialGradient(X+S,Y+S,0,X+S,Y+S,(S*50));

        try{
            radGrad.addColorStop(A/45, 'rgba(255,255,255,' + (A/4) + ')');
            radGrad.addColorStop(A/20, 'rgba(255,255,255,' + (A/25) + ')');
        } catch (err) {
//            console.log("GRADIENT alpha "+A);
        }

        radGrad.addColorStop(1, 'rgba(255,255,255, 0)');
        ctx.fillStyle = radGrad;
        ctx.fillRect(0,0,canvasWidth, canvasHeight);
    }

    function addTuikku(){
        if (pixelCursor >= arraySize) pixelCursor = 0;  //aloitetaan alusta
        pixelCoordinatesX[pixelCursor] = roundToNearest(
                                         coordinateRounding,
                                         1+(Math.random()*(canvasWidth-pixelSize))
                                         );
        pixelCoordinatesY[pixelCursor] = roundToNearest(
                                         coordinateRounding,
                                         1+(Math.random()*(canvasHeight-pixelSize))
                                         );
        pixelSizes[pixelCursor] = roundToNearest( 1,
                                         1+(Math.random())
                                         );
        pixelAlphas[pixelCursor] = 0;
        // fadein = 1 , fadeout = 0
        pixelFadeInOut[pixelCursor] = 1;
        pixelCursor++;
    }

    function roundToNearest(toNearest,valueToRound){
        return (toNearest * Math.round(valueToRound / toNearest));
    }

    function drawPlane(X, Y, A, S){
        ctx.fillStyle = "rgba(255,0,0," + A + ")";
        ctx.fillRect(X, Y, S, S);
    }
    function addPlane(){
        if (planeCursor >= planeArrayCount) planeCursor = 0;  //aloitetaan alusta
        planeCoordinatesX[planeCursor] = canvasWidth-10;
        planeCoordinatesY[planeCursor] = roundToNearest( 1,
                                         1+(Math.random()*(canvasHeight-pixelSize))
                                         );
        planeSpeedViiveet[planeCursor] = 0;
        planeAlphas[planeCursor] = 1;
        planeSpeeds[planeCursor] = roundToNearest( 0.001,
                                         (0+(Math.random()*0.05))
                                         );
        if (planeSpeeds[planeCursor] < 0.01) {
            planePixelAmount[planeCursor] = 5;
            planeSizes[planeCursor] = 10;
        } else if (planeSpeeds[planeCursor] < 0.02) {
            planePixelAmount[planeCursor] = 4;
            planeSizes[planeCursor] = 8;
        } else if (planeSpeeds[planeCursor] < 0.03) {
            planePixelAmount[planeCursor] = 3;
            planeSizes[planeCursor] = 6;
        } else if (planeSpeeds[planeCursor] < 0.04) {
            planePixelAmount[planeCursor] = 2;
            planeSizes[planeCursor] = 4;
        } else {
            planePixelAmount[planeCursor] = 1;
            planeSizes[planeCursor] = 2;
        }
/*
        console.log("speed: "+planeSpeeds[planeCursor]+"\nviive: "+
                        planeSpeedViiveet[planeCursor]+"\namount: "+
                        planePixelAmount[planeCursor]+"\narray: "+
                        planeCoordinatesX.length);
*/
        planeCursor++;
    }
}