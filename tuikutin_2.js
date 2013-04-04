window.onload = function () {
    canvas = document.getElementById("canvasArea");
    ctx = canvas.getContext("2d");

    init();
    setParameters();
    
    theFunction();
}
function init() {
    canvas.width = document.getElementById("canvasArea").offsetWidth;
    canvas.height = document.getElementById("canvasArea").offsetHeight;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    bgGrad = ctx.createLinearGradient(0,0,0 ,canvasHeight,canvasWidth,0);   //taustan gradient
    bgGrad.addColorStop(0.0, 'rgba(8,0,16, 1)');
    bgGrad.addColorStop(0.08, "rgba(16,0,32, 1)");
    bgGrad.addColorStop(0.75, "rgba(26,32,64, 1)");
    bgGrad.addColorStop(1.0, "rgba(32,48,80, 1)");
}
window.onresize = function () {
    init();
    APP.core.render();
}
function setParameters() {
   
    timeFromLastUpdate = 0;
    timeFromLastStar = 0;
    timeFromLastPlane = 0;

    timeFromLastStarAlpha = 0;

    pixelSize = 5;
    arraySize = 100;
    refreshTime = 0.01;
    coordinateRounding = 20;
    
    starAlphaDelay = 0.01;
    starAddDelay = 0.3;
    starCursor = 0;
    starAlphaIncrease = 0.01;
    starAlphaReduction = 0.01;
    starCoordinatesX = new Array();
    starCoordinatesY = new Array();
    starStatus = new Array();
    starAlphas = new Array();
    starSizes = new Array();

    planeAddDelay = 5;
    planeCursor = 0;
    planeArrayCount = 100;
    fastestPlane = 0.2;
    slowestPlane = 0.8;
    planeAlphaReduction = 0.02;
    planeStatus = new Array();
    planeAlphas = new Array();
    planeCoordinatesX = new Array();
    planeCoordinatesY = new Array();
    planeSpeeds = new Array();
    planePixelAmount = new Array();
    planeSizes = new Array();

    moonSize = 100;
    moonCoordinateX = 150;
    moonCoordinateY = 150;

    radGrad = ctx.createRadialGradient(0,0,0,0,0,0);        //tuikkujen hohto

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
            APP.core.render();
            APP.core.animationFrame = window.requestAnimationFrame(APP.core.frame);
        },
        setDelta: function() {
            APP.core.now = Date.now();
            APP.core.delta = (APP.core.now - APP.core.then) / 1000; // seconds since last frame
            APP.core.then = APP.core.now;
        },
        render: function() {
            canvas.width = document.getElementById("canvasArea").offsetWidth;
            canvas.height = document.getElementById("canvasArea").offsetHeight;
//UPDATE
            if (timeFromLastUpdate > refreshTime) {
//------------------------------------------------------------------------------
        //background
                ctx.fillStyle = bgGrad;
                ctx.fillRect (0, 0, canvasWidth, canvasHeight);
        //STARS
            //ADD STAR
                if( timeFromLastStar > starAddDelay ) {
                    addStar();
                    timeFromLastStar = 0;
                } else {
                    timeFromLastStar += APP.core.delta;
                }
        
            //UPDATE STARS
                //starStatus : 0 = dead     1 = in      2 = out
                if (timeFromLastStarAlpha >= starAlphaDelay) {
                    for (var i = 0; i < starCoordinatesX.length; i++) {
                        if (starStatus[i] != 0) {
                            if (starStatus[i] == 1) {

                                if (parseFloat(starAlphas[i] + starAlphaIncrease) <= 1 )  {
                                    starAlphas[i] += starAlphaIncrease;
                                } else {
                                    starAlphas[i] = 1;
                                    starStatus[i] = 2;      //out
                                }
                            } else {
                                if (parseFloat(starAlphas[i] - starAlphaReduction) >= 0 ) {
                                    starAlphas[i] -= starAlphaReduction;
                                } else {
                                    starAlphas[i] = 0;
                                    starStatus[i] = 0;      //dead
                                }
                            }
                        }
                    }
                    timeFromLastStarAlpha = 0;
                } else {
                    timeFromLastStarAlpha += APP.core.delta;
                }

        //PLANES
            //ADD PLANE
                if( timeFromLastPlane > planeAddDelay ) {
                    addPlane();
                    timeFromLastPlane = 0;
                } else {
                    timeFromLastPlane += APP.core.delta;
                }

            //moon
                drawMoon();

            //UPDATE PLANES
                //planeStatus : 0 = dead    1 = flying
                for (var i = 0; i < planeCoordinatesX.length; i++) {
                    if (planeStatus[i] != 0) {
                        drawPlane( planeCoordinatesX[i],
                                   planeCoordinatesY[i],
                                   planeAlphas[i],
                                   planeSizes[i]);
                        planeCoordinatesX[i] -= planePixelAmount[i];

                        if (planeCoordinatesX[i] > -10 ) {
                            if (parseFloat(planeAlphas[i] - planeAlphaReduction) >= 0) {
                                planeAlphas[i] -= planeAlphaReduction;
                            } else {
                                planeAlphas[i] = 1;     //plink
                            }
                        } else {
                            planeStatus = 0;            //dead
                        }
                    }
                }
        //stars
                for (var i = 0; i < starCoordinatesX.length; i++) {
                    if (starStatus[i] != 0) {           // if alive...
                        drawStar( starCoordinatesX[i],
                                  starCoordinatesY[i],
                                  starAlphas[i],
                                  starSizes[i]);
                    }
                };
//------------------------------------------------------------------------------
            } else {
                timeFromLastUpdate += APP.core.delta;
            }
        }
    }
    APP.play();
}

function drawMoon() {
    ctx.fillStyle = moonGlare;
    ctx.fillRect(0,0,canvasWidth, canvasHeight);

    ctx.fillStyle = moonGrad;
    ctx.arc(moonCoordinateX,moonCoordinateY,moonSize,0,Math.PI*2,true);
    ctx.fill();
}

function drawStar(X, Y, A, S) {
    // createRadialGradient(x0, y0, r0, x1, y1, r1)
    SS = S / 2;
    radGrad = ctx.createRadialGradient(X+SS,Y+SS,0,X+SS,Y+SS,(SS*50));

    try{
        radGrad.addColorStop(A/45, 'rgba(255,255,255,' + (A/4) + ')');
        radGrad.addColorStop(A/20, 'rgba(255,255,255,' + (A/25) + ')');
    } catch (err) {
//        console.log("GRADIENT alpha "+A);
    }

    radGrad.addColorStop(1, 'rgba(255,255,255, 0)');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0,0,canvasWidth, canvasHeight);

    ctx.fillStyle = "rgba(255,255,255," + A + ")";
    ctx.fillRect(X, Y, S, S);
    
    ctx.fillRect(X+S, Y, S, S);
    ctx.fillRect(X-S, Y, S, S);
    ctx.fillRect(X, Y+S, S, S);
    ctx.fillRect(X, Y-S, S, S);
    // if (starCursor%5 == 0) {
    //     console.log("["+starCoordinatesX[starCursor]+","+starCoordinatesY[starCursor]+"]\n"+
    //     starStatus[starCursor]+"\n"+
    //     starAlphas[starCursor]+"\n");
    // }
}

function addStar(){
    if (starCursor >= arraySize) starCursor = 0;  //aloitetaan alusta

    starCoordinatesX[starCursor] = roundToNearest(
            coordinateRounding,
            1+(Math.random()*(canvasWidth-pixelSize)) );

    starCoordinatesY[starCursor] = roundToNearest(
            coordinateRounding,
            1+(Math.random()*(canvasHeight-pixelSize)) );

    starSizes[starCursor] = roundToNearest( 1, 1+( Math.random() ) );

    starAlphas[starCursor] = 0;
    starStatus[starCursor] = 1;
    starCursor++;
}

function drawPlane(X, Y, A, S){
    ctx.fillStyle = "rgba(255,0,0," + A + ")";
    ctx.fillRect(X, Y, S, S);
}

function addPlane(){
    if (planeCursor >= planeArrayCount) planeCursor = 0;  //aloitetaan alusta
    planeCoordinatesX[planeCursor] = canvasWidth-10;

    planeCoordinatesY[planeCursor] = roundToNearest(
            1,
            1+(Math.random()*(canvasHeight-pixelSize)) );

    planeAlphas[planeCursor] = 1;
    planeStatus[planeCursor] = 1;

    planeSpeeds[planeCursor] = roundToNearest(
            0.001,
            (0+(Math.random()*0.05)) );

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

function roundToNearest(toNearest,valueToRound){
    return (toNearest * Math.round(valueToRound / toNearest));
}