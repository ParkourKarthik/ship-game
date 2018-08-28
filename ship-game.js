    $(document).ready(function() {
        //set attribute for dropping
        InitializeColorBlocks();
        $('.capture').attr('ondragover', 'allowDrop(event)')
            .attr('ondrop', 'drop(event)');

        //Start Generating the ships..
        randomShipGenerator();
        $(window).resize(function() {
            if ($(window).width() < 700) {
                $('body').html(
                    '<div style="text-align:center"><b>Screen size not enough. Please expand the width and refresh the page.</b></div>'
                );
            }
        });
    });

    //Global Variables
    //Starting speed of the moving ship.. It would be updated when the score reaches a specific limit.. refer the checkAndUpdateScore()
    var shipSpeed = 10; // millisecond
    var vColors = ['red', 'blue', 'green'];


    //functions
    // Starts moving the ship by 1 pixel for the given time intervals.. Binds the function for adding pixel with a setInterval Timer..
    var moveShips = function() {
        if ($('.shiparea').find('.moving-ship:first').length < 1) {
            //self destruct the timer so that it doesn't look for a ship which is not there :-P
            stopMovingShips();
            return;
        }
        $('.shiparea').find('.moving-ship:first').each(function(index) {
            var currentVal = parseInt($(this).css('margin-left').replace('px', ''));
            currentVal++;
            $(this).css('margin-left', currentVal + 'px');
            checkAndUpdateScore(this);
        });
    }

    function checkAndUpdateScore(frontship) {
        //togglePause();
        //console.log($(frontship).parent());
        var lastShip = $(frontship).parent().find('.moving-ship:last');
        var capture = $(frontship).parent().siblings('.capture:last');
        if (lastShip.offset().left + 46 >= capture.offset().left) {
            if (lastShip.find('.vessel-top').css('background-color') == capture.css('background-color'))
                updateScore();
            else
                updateLife();
            capture.css('background', '');
            $(frontship).parent().find('.moving-ship:last').remove();
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
        var curLife = parseInt($('#life').text().trim().replace('Life:', ''));
        curLife--;
        if (curLife == 0) {
            $('body').html('<div style="text-align:center"><b>GAME OVER</b></div>')
            stopMovingShips();
            stopShipGenerator();
        }
        $('#life').text('Life:' + curLife);
    }

    //update Score
    function updateScore() {
        var curScore = parseInt($('#score').text().trim().replace('Score:', ''));
        curScore++;
        if (curScore > 5) {
            stopMovingShips();
            shipSpeed = 5;
            startMovingShips();
        }
        $('#score').text('Score:' + curScore);
    }

    //While dragging of the element starts
    function drag(ev) {
        ev.dataTransfer.setData("color", ev.target.style.background);
    }

    //PreventDefault blocking in order to grab the dropped element..
    function allowDrop(ev) {
        ev.preventDefault();
    }

    //While dropping
    function drop(ev) {
        ev.preventDefault();
        var color = ev.dataTransfer.getData("color");
        ev.target.style.background = color;
    }

    function stopShipGenerator() {
        clearTimeout(shipGenerator);
    }


    //Toggle between pause and play..
    function togglePause() {
        if ($('#pause').text().trim() == 'PAUSE') {
            stopMovingShips();
            stopShipGenerator();
            $('#colors div').attr('draggable', 'false');
            $('#colors div').attr('ondragstart', 'return false');
            $('#pause').text('PLAY');
        } else {
            startMovingShips();
            randomShipGenerator();
            $('#colors div').attr('draggable', 'true');
            $('#colors div').attr('ondragstart', 'drag(event)');
            $('#pause').text('PAUSE');
        }
    }

    //Initialize color blocks..
    function InitializeColorBlocks() {
        //placeholder block
        var phblock =
            '<div class="color-block" style="background:[color];" draggable="true" ondragstart="drag(event)">' +
            '</div>';

        for (var i = 0; i < vColors.length; i++) {
            var block = phblock.replace('[color]', vColors[i]);
            $('#colors').append(block);
        }

    }


    // Generate and send ships to the tracks
    function generateShip(row) {
        if (!row) {
            return;
        }
        var shipcolor = vColors[Math.floor(vColors.length * Math.random())];
        var ship = '<div class="moving-ship" style="margin-left:0px;display:inline-block;">' +
            '<div class="vessel-top" style="background: ' + shipcolor + ';"> </div>' +
            '<div class="vessel-body" style="border-top: 20px solid ' + shipcolor + ';">' +
            '</div>' +
            '</div>';
        $('.shiparea:eq(' + (row - 1) + ')').find('.moving-ship:first').each(function() {
            $(this).css('margin-left', parseInt($(this).css('margin-left')) - 46);
        });;
        $('.shiparea:eq(' + (row - 1) + ')').prepend(ship);
        randomShipGenerator();
        startMovingShips();
        var firstship = $('.shiparea').find('.moving-ship:first');
        checkAndUpdateScore(firstship);
    }

    //Generate ship at random intervals..
    function randomShipGenerator() {
        var invokeAt = randomIntFromInterval(2000, 4000)
        var TrackNo = randomIntFromInterval(1, 2);

        shipGenerator = setTimeout(generateShip, invokeAt, TrackNo);
    }

    //Util for generating random numbers
    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }