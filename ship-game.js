//Global Variables
//Starting speed of the moving ship.. It would be updated when the score reaches a specific limit.. refer the checkAndUpdateScore()
var shipSpeed = 10; // millisecond
var vColors = ['red', 'blue', 'green'];


//functions
// Starts moving the ship by 1 pixel for the given time intervals.. Binds the function for adding pixel with a setInterval Timer..
var moveShips = function () {
    var movingShips = document.getElementsByClassName('moving-ship');
    if (movingShips.length < 1) {
        //self destruct the timer so that it doesn't look for a ship which is not there :-P
        stopMovingShips();
        return;
    }
    for (var i = 0; i < movingShips.length; i++) {
        var currentVal = parseInt(movingShips[i].style.marginLeft.replace('px', ''));
        currentVal++;
        movingShips[i].style.marginLeft = currentVal + 'px';
        checkAndUpdateScore(movingShips[i].parentElement);
    }
}

function checkAndUpdateScore(shippingArea) {
    var lastShip = shippingArea.lastChild;
    var capture = shippingArea.nextElementSibling;
    if (lastShip.offsetLeft + 46 >= capture.offsetLeft) {
        if (lastShip.childNodes[0].style.backgroundColor == capture.style.backgroundColor)
            updateScore();
        else
            updateLife();
        capture.style.background = ''; //('background', '');
        shippingArea.removeChild(shippingArea.lastChild);
    }
}

//to start moving the ships
function startMovingShips() {
    //Set repeated event
    if (typeof timer == 'undefined')
        timer = setInterval(moveShips, shipSpeed);
}

//Stop the timer
function stopMovingShips() {
    if (typeof timer !== 'undefined')
        clearInterval(timer);
    timer = undefined;
}


//Degrade life
function updateLife() {
    var life = document.getElementById('life');
    var curLife = parseInt(life.innerText.trim().replace('Life:', ''));
    curLife--;
    if (curLife == 0) {
        document.body.innerHTML = '<div class="center panel"><b>GAME OVER</b><div class="retry"><button class="button" onClick="window.location.reload()">RETRY</button></div></div>';
        stopMovingShips();
        stopShipGenerator();
    }
    life.innerText = 'Life:' + curLife;
}

//update Score
function updateScore() {
    var score = document.getElementById('score');
    var curScore = parseInt(score.innerText.trim().replace('Score:', ''));
    curScore++;
    if (curScore > 5) {
        stopMovingShips();
        shipSpeed = 5;
        startMovingShips();
    }
    score.innerText = 'Score:' + curScore;
}

//While dragging of the element starts
function drag(ev) {
    // sets data in the event's dataTransfer while drag starts; this would be fetched in the drop event
    ev.dataTransfer.setData("color", ev.target.style.backgroundColor);
}

//PreventDefault blocking in order to grab the dropped element..
function allowDrop(ev) {
    ev.preventDefault();
}

//While dropping
function drop(ev) {
    ev.preventDefault();
    var color = ev.dataTransfer.getData("color");
    ev.target.style.backgroundColor = color;
}

function stopShipGenerator() {
    clearTimeout(shipGenerator);
}


//Toggle between pause and play..
function togglePause() {
    var pause = document.getElementById('pause');
    var colorElems = document.getElementById('colors').childNodes;
    if (pause.innerText.trim() == 'PAUSE') {
        stopMovingShips();
        stopShipGenerator();
        for (var i = 0; i < colorElems.length; i++) {
            colorElems[i].setAttribute('draggable', 'false');
            colorElems[i].setAttribute('ondragstart', 'return false');
        }
        pause.innerText = 'PLAY';
    } else {
        startMovingShips();
        randomShipGenerator();
        for (var i = 0; i < colorElems.length; i++) {
            colorElems[i].setAttribute('draggable', 'true');
            colorElems[i].setAttribute('ondragstart', 'drag(event)');
        }
        pause.innerText = 'PAUSE';
    }
}

//Initialize color blocks..
function InitializeColorBlocks() {
    //placeholder block
    var phblock =
        '<div class="color-block" style="background:[color];" draggable="true" ondragstart="drag(event)">' +
        '</div>';
    var colors = document.getElementById('colors');

    for (var i = 0; i < vColors.length; i++) {
        var phblock = newphblock();
        phblock.style.backgroundColor = vColors[i];
        colors.appendChild(phblock);
    }

}

function newphblock() {
    var phblock = document.createElement('div');
    phblock.className = 'color-block';
    phblock.setAttribute('draggable', 'true');
    phblock.setAttribute('ondragstart', 'drag(event)');
    return phblock;
}

function createHTMLElement(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

// Generate and send ships to the tracks
function generateShip(row) {
    var shipArea = document.getElementsByClassName('shiparea');
    if (row == undefined || row >= shipArea.length) {
        return;
    }
    var shipcolor = vColors[Math.floor(vColors.length * Math.random())];
    var ship = '<div class="moving-ship" style="margin-left:0px;display:inline-block;">' +
        '<div class="vessel-top" style="background: ' + shipcolor + ';"> </div>' +
        '<div class="vessel-body" style="border-top: 20px solid ' + shipcolor + ';">' +
        '</div>' +
        '</div>';
    var shipElem = createHTMLElement(ship);
    var movingShips = shipArea[row].childNodes;
    for (var i = 0; i < movingShips.length; i++) {
        movingShips[i].style.marginLeft = (parseInt(movingShips[0].style.marginLeft) - 46) + 'px';
    }
    shipArea[row].insertBefore(shipElem, shipArea[row].firstChild);
    randomShipGenerator();
    startMovingShips();
    checkAndUpdateScore(shipArea[row]);
}

//Generate ship at random intervals..
function randomShipGenerator() {
    var invokeAt = randomIntFromInterval(2000, 4000)
    var TrackNo = randomIntFromInterval(0, 1);

    shipGenerator = setTimeout(generateShip, invokeAt, TrackNo);
}

//Util for generating random numbers
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function setCaptureDDEvents() {
    var capture = document.getElementsByClassName('capture');
    for (var i = 0; i < capture.length; i++) {
        capture[i].setAttribute('ondrop', 'drop(event)');
        capture[i].setAttribute('ondragover', 'allowDrop(event)');
    }
}

function disposeTimer() {
    clearTimeout(shipGenerator);
}

function runGame() {
    //set attribute for dropping
    InitializeColorBlocks();

    //drag drop events set as attributes
    setCaptureDDEvents();
    //Start Generating the ships..
    randomShipGenerator();
}


(function () {
    runGame();
    window.onresize = function () {
        if (window.outerWidth < 700) { // overall browser width
            document.body.innerHTML = '<div style="text-align:center"><b>Screen size not enough. Please expand the width and refresh the page.</b></div>';
            disposeTimer();
        } else {
            location.reload();
        }
    };
})();