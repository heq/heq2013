var boxSize = 8;
var emptyBoxRate = 0;
var paddingSize = 2;
var margin = 0;
var alphaMin = 0.2;
var alphaMax = 0.8;
var sizeX = 350;
var sizeY = 350;
var colorRGB = "";
var colorR = 0;
var colorG = 0;
var colorB = 0;

var bgAlpha = 0;
var plinkTimeMin = 2000;
var plinkTimeMax = 10000;
var eyesClosed = false;

var yesBox = 0;
var noBox = 0;
var colorPattern = /^([a-fA-F\d]){3}|([a-fA-F\d]){6}$/;
var validKeys = /^([4][8-9]|[5][0-7]|[6][5-9]|[7][0]|[9][6-9]|[1][0][0-5])$/;

window.onload = function () {
    canvas = document.getElementById("canvasArea");
    genie = document.getElementById("a_a");
    ctx = canvas.getContext("2d");
    //canvas.addEventListener("mousedown", draw, false);

    getSettings();
    draw();
    plinkTimer();
}

function plinkTimer() {
    plinkTime = randomPlinkTime();
    setTimeout(function(){ plinkAction() }, randomPlinkTime());
}
function plinkAction(){
    console.log("*plink*");
    setTimeout(function(){ doPlink() }, 0);
    setTimeout(function(){ doPlink() }, 200);
    plinkTimer();
}
function doPlink() {
    if (eyesClosed) {
        genie.style.backgroundPosition = (0)+"px "+(0)+"px";
        eyesClosed = false;
    } else {
        genie.style.backgroundPosition = (0)+"px "+(-300)+"px";
        eyesClosed = true;
    }
} 

$(document).ready(function() {
        $("#btnGenerate").on('click', function() {
            console.log("GENERATE");
            getSettings();
            draw();
        });
        $("#btnSave").on('click', function() {
            console.log("SAVE");
            openInWindow();
        });
        $("input").click(function() { $(this).select(); } );
        $(".container").keypress(function(e) {
          if (e.keyCode == 13) {
            getSettings();
            draw();
            }
        });
        $("#colorValue").keyup( function(e) {
            var theKey = e.keyCode;
            console.log("DERP " +theKey );
            if ( validateKey(theKey) ) {
                if ( validateHex( String($('#colorValue').val()) ) ) {
                    getSettings();
                    draw();
                }
            }
        });
});

function draw() {
    yesBox = 0;
    noBox = 0;

    init();
    drawPlank();
    drawDots();

    console.log("BOX STATUS: "+yesBox+"/"+noBox+" (yes/no)");
}

function getSettings() {
//boxSize
    help = parseInt($('#boxSize').val());
    console.log("boxSize "+help);
    if(help > 0) {
        console.log("  OK");
        boxSize = help;
    }
//alphaMin
    help = parseInt($('#alphaMin').val());
    console.log("alphaMin "+help);
    if(help >= 0 && help <= 100) {
        console.log("  OK");
        alphaMin = help/100;
    }
//alphaMax
    help = parseInt($('#alphaMax').val());
    console.log("alphaMax "+help);
    if(help >= 0 && help <= 100) {
        console.log("  OK");
        alphaMax = help/100;
    }
//emptyBoxRate
    help = parseFloat($('#emptyBoxRate').val());
    console.log("emptyBoxRate "+help);
    if(help >= 0 && help <= 100) {
        console.log("  OK");
        emptyBoxRate = help/100;
    }
//padding
    help = parseInt($('#padding').val());
    console.log("padding "+help);
    if(help > -(boxSize)) {
        console.log("  OK");
        paddingSize = help;
    }
//margin
    help = parseInt($('#margin').val());
    console.log("margin "+help);
    if(help > -(boxSize)) {
        console.log("  OK");
        margin = help;
    }
//sizeX
    help = parseInt($('#sizeX').val());
    console.log("sizeX "+help);
   if(help >= 1 && help <= 400) {
        console.log("  OK");
        sizeX = help;
        canvas.width = sizeX;
    }
//sizeY
    help = parseInt($('#sizeY').val());
    console.log("sizeY "+help);
    if(help >= 1 && help <= 400) {
        console.log("  OK");
        sizeY = help;
        canvas.height = sizeY;
        $('canvas').css({top: ((sizeY-30)/2) + "px"});
        $('canvas').css({marginTop: (-sizeY) + "px" });
    }
//color
    help = String($('#colorValue').val());
    console.log("colorValue["+help.length+"] "+help+" "+colorPattern.test(help));

    //pelkkä colorPattern.test(help) ei riitä?
    if( validateHex(help) ) {
        colorRGB = help;
        $('#colorBlock').css({backgroundColor: "#" + colorRGB});
        hexTo10(colorRGB);
    }
}

function openInWindow() {
    //document.getElementById("saveButton").onClick = function() {
    window.open(canvas.toDataURL());
}
/*
window.onresize = function () {
    canvas.width = document.getElementById("canvasArea").offsetWidth;
    canvas.height = document.getElementById("canvasArea").offsetHeight;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
}
*/
function drawPlank() {
    console.log("PLANK");
    //ctx.fillStyle = "#FFFFFF";
    //ctx.fillRect (0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function init() {
    canvas.width = document.getElementById("canvasArea").offsetWidth;
    canvas.height = document.getElementById("canvasArea").offsetHeight;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
}

function drawDots() {
    console.log("DRAWDOTS start");

    var stopW = document.getElementById("canvasArea").offsetWidth;
    var stopH = document.getElementById("canvasArea").offsetHeight;
    var x = parseInt(margin);
    var y = parseInt(margin);

    for (i = x; i < (stopW); i += paddingSize + boxSize) {
        for (j = y; j < (stopH); j += paddingSize + boxSize) {
            //if(i%10 == 0 || j%10 == 0) { console.log("["+i+","+j+"] "+paddingSize); }
            drawBox(i, j);
        }
    }
}
function hexTo10(s) {
    if (s.length == 3) {
        colorR = String( colorRGB.charAt(0).concat(colorRGB.charAt(0)));
        colorG = String( colorRGB.charAt(1).concat(colorRGB.charAt(1)));
        colorB = String( colorRGB.charAt(2).concat(colorRGB.charAt(2)));
        colorRGB = colorR.concat(colorG.concat(colorB));
    }
    colorR = parseInt( parseInt(colorRGB.charAt(0), 16)*16 + parseInt(colorRGB.charAt(1), 16));
    colorG = parseInt( parseInt(colorRGB.charAt(2), 16)*16 + parseInt(colorRGB.charAt(3), 16));
    colorB = parseInt( parseInt(colorRGB.charAt(4), 16)*16 + parseInt(colorRGB.charAt(5), 16));
    console.log("hexTo10 : "+colorRGB);
}
function validateHex(h) {
    if (colorPattern.test(h) && (h.length == 3 || h.length == 6)) {
        return true;
    }
    return false;
}
function validateKey(k) {
    if (validKeys.test(k)) {
        return true;
    }
    return false;
}

function drawBox(X, Y){
    if(randomEmpty()) {return;}
    ctx.fillStyle = "rgba(" +colorR+ "," +colorG+ "," +colorB+ "," +randomAlpha()+ ")";
    ctx.fillRect(X, Y, boxSize, boxSize);
}

function drawLines() {
    console.log("DRAWLINES start");

    var stopW = document.width;
    var stopH = document.height;

    ctx.strokeStyle = "rgba(172,172,172,1)";

    for (i = 1; i < (stopW); i++) {
        ctx.beginPath();
        ctx.moveTo(0, (i * paddingSize));
        ctx.lineTo(stopW, (i * paddingSize));
        ctx.stroke();
        ctx.closePath();
    }
    for (i = 1; i < (stopH); i++) {
        ctx.beginPath();
        ctx.moveTo((i * paddingSize), 0);
        ctx.lineTo((i * paddingSize), stopH);
        ctx.stroke();
        ctx.closePath();
    }
    console.log("DRAWLINES done");
}

function randomEmpty() {
    if( 0 >= ((Math.random()) - emptyBoxRate) ) {
        noBox++;
        return true;
    }
    yesBox++;
    return false;
}
function randomPlinkTime() {
    return plinkTimeMin + ( Math.random() * plinkTimeMax );
}
function randomAlpha() {
    if (alphaMin >= alphaMax) {
        return alphaMin;
    }
    return alphaMin + ( Math.random() * (alphaMax - alphaMin));
}
function roundToNearest(toNearest,valueToRound) {
    return (toNearest * Math.round(valueToRound / toNearest));
}