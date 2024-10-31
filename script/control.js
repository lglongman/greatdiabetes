/*CONTROLLER*/
const CROSS = 0;
const CIRCLE = 1;
const SQUARE = 2;
const TRIANGLE = 3;

const UP = 12;
const DOWN = 13;
const LEFT = 14;
const RIGHT = 15;

const SHARE = 8;
const OPTION = 9;
const PS = 16

const L1 = 4;
const R1 = 5;
const L2 = 6;
const R2 = 7;
const L3 = 10;
const R3 = 11;

var conIO = [];
var last_conIO = [];
var conIOToggle = [];

function controllerLoop() {
    const gamepad = navigator.getGamepads()[0];
    const controllerEnable = document.getElementById("controllerEnable");
    if (gamepad) {
        // buttons
        for (var i = 0; i < gamepad.buttons.length; i++) {
            conIO[i] = gamepad.buttons[i].pressed;
            // output.textContent += "Button " + i + ": " + conIO[i] + "\n";
        }
        // console.log(conIOToggle[UP]);
        getToggle(conIO.length);

        if (controllerEnable.checked) {
            readControllerInput();
        }
    }

    requestAnimationFrame(controllerLoop);
}

function getToggle(num) {
    for (var i = 0; i < num; i++) {
        if (conIO[i] && conIO[i] != last_conIO[i]) {
            conIOToggle[i] = true;
        }
        else {
            conIOToggle[i] = false;
        }
        last_conIO[i] = conIO[i];
    }
}

window.addEventListener("gamepadconnected", (event)=>{
    alert("DS5 Connected");
    console.log("DS5 Connected");
    const controllerLbl = document.getElementById("controllerLbl");
    controllerLbl.textContent = "Controller (Connected)";
    controllerLoop();
});
window.addEventListener("gamepaddisconnected", (event)=>{
    alert("DS5 Disonnected");
    console.log("DS5 Disonnected");
    controllerLbl.textContent = "Controller (Disconnected)";
    cancelAnimationFrame(controllerLoop);
});

/*CONTROLLER EVENTS*/
function readControllerInput() {
    if (conIOToggle[PS] && !startBtn.disabled) {
        handleTimer();
    }
    else if (conIOToggle[R1] && !switchBtn.disabled) {
        switchTimerMode();
    }
    else if (conIOToggle[SHARE] && !resetBtn.disabled) {
        resetButton();
    }
    else if (conIOToggle[OPTION]) {
        showOverlay(false, 0, false);
    }

    var type = [];
    type[RED_TEAM] = conIO[L2] ? MINUS : ADD;
    type[BLUE_TEAM] = conIO[R2] ? MINUS : ADD;
    
    //red team
    if (conIOToggle[UP] && !getButton(RED_TEAM, 1, type[RED_TEAM]).disabled) {
        updateScore(1, RED_TEAM, type[RED_TEAM] == ADD);
    }
    else if (conIOToggle[LEFT] && !getButton(RED_TEAM, 2, type[RED_TEAM]).disabled) {
        updateScore(2, RED_TEAM, type[RED_TEAM] == ADD);
    }
    else if (conIOToggle[DOWN] && !getButton(RED_TEAM, 3, type[RED_TEAM]).disabled) {
        updateScore(3, RED_TEAM, type[RED_TEAM] == ADD);
    }
    else if (conIOToggle[RIGHT] && !getButton(RED_TEAM, 3, CANDY).disabled) {
        handleCandy(RED_TEAM);
    }

    //blue team
    if (conIOToggle[TRIANGLE] && !getButton(BLUE_TEAM, 1, type[BLUE_TEAM]).disabled) {
        updateScore(1, BLUE_TEAM, type[BLUE_TEAM] == ADD);
    }
    else if (conIOToggle[CIRCLE] && !getButton(BLUE_TEAM, 2, type[BLUE_TEAM]).disabled) {
        updateScore(2, BLUE_TEAM, type[BLUE_TEAM] == ADD);
    }
    else if (conIOToggle[CROSS] && !getButton(BLUE_TEAM, 3, type[BLUE_TEAM]).disabled) {
        updateScore(3, BLUE_TEAM, type[BLUE_TEAM] == ADD);
    }
    else if (conIOToggle[SQUARE] && !getButton(BLUE_TEAM, 3, CANDY).disabled) {
        handleCandy(BLUE_TEAM);
    }
}


/*KEYBOARD EVENT LISTENER*/
window.addEventListener('keydown', function(event) {
    const keyboardEnable = document.getElementById("keyboardEnable");
    if (keyboardEnable.checked) {
        if (event.key === ' ' && !startBtn.disabled) {
            event.preventDefault();
            handleTimer();
        }
        else if (event.key === 'Delete' && !resetBtn.disabled) {
            event.preventDefault();
            resetButton();
        }
        else if (event.key === 'Tab' && !switchBtn.disabled) {
            event.preventDefault();
            switchTimerMode();
        }
        else if (event.key === 'Escape') {
            event.preventDefault();
            showOverlay(false, 0, false);
        }
    
        var type = event.shiftKey ? MINUS : ADD;
        
        // RED TEAM
        if ((event.key === 'q' || event.key === 'Q') && !getButton(RED_TEAM, 1, type).disabled) {
            event.preventDefault();
            updateScore(1, RED_TEAM, type == ADD);
        }
        else if ((event.key === 'a' || event.key === 'A') && !getButton(RED_TEAM, 2, type).disabled) {
            event.preventDefault();
            updateScore(2, RED_TEAM, type == ADD);
        }
        else if ((event.key === 'z' || event.key === 'Z') && !getButton(RED_TEAM, 3, type).disabled) {
            event.preventDefault();
            updateScore(3, RED_TEAM, type == ADD);
        }
        else if ((event.key === 'x' || event.key === 'X') && !getButton(RED_TEAM, 3, CANDY).disabled) {
            event.preventDefault();
            handleCandy(RED_TEAM);
        }
    
        // BLUE TEAM
        if ((event.key === 'p' || event.key === 'P') && !getButton(BLUE_TEAM, 1, type).disabled) {
            event.preventDefault();
            updateScore(1, BLUE_TEAM, !event.shiftKey);
        }
        else if ((event.key === 'l' || event.key === 'L') && !getButton(BLUE_TEAM, 2, type).disabled) {
            event.preventDefault();
            updateScore(2, BLUE_TEAM, !event.shiftKey);
        }
        else if ((event.key === ',' || event.key === '<') && !getButton(BLUE_TEAM, 3, type).disabled) {
            event.preventDefault();
            updateScore(3, BLUE_TEAM, !event.shiftKey);
        }
        else if ((event.key === 'm' || event.key === 'M') && !getButton(BLUE_TEAM, 3, CANDY).disabled) {
            event.preventDefault();
            handleCandy(BLUE_TEAM);
        }
    }
});