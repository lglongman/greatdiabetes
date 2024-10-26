const SETUP = 0, GAME = 1;
const RED_TEAM = 0, BLUE_TEAM = 1, TIE = -1;
const MINUS = 0, ADD = 1, CANDY = 2;
const SHORT_BEEP = 0, LONG_BEEP = 1, ENDGAME = 2;

let timerTitle = null;
let timerTime = null;
let switchBtn = null;
let startBtn = null;
let resetBtn = null;
let stageLabel = [];
let audio = [];
let overlay = null;
let colaImg = [];
let overlayTitle = null;
let overlayLbl = null;
let overlayTime = null;

var gameMode = SETUP;
let timer = null;
var totalTime = 60;
var startTime = 0;
var elapsedTime = 0;
var lastTimerTime = 0;
var isRunning = false;
var currentStage = [1, 1];
const maxSodaCanNumInStage = [6, 4, 10];
var sodaCanNumInStage = [];
var scoreCandyBall = [false, false];

function init() {
    timerTitle = document.getElementById("timerTitle");
    timerTime = document.getElementById("timerTime");
    switchBtn = document.getElementById("switchBtn");
    startBtn = document.getElementById("startBtn");
    resetBtn = document.getElementById("resetBtn");
    
    stageLabel[RED_TEAM] = [];
    stageLabel[BLUE_TEAM] = [];
    for (var i = 0; i < 3; i++) {
        num = i + 1
        stageLabel[RED_TEAM][i] = document.getElementById("redStage" + num + "Lbl");
        stageLabel[BLUE_TEAM][i] = document.getElementById("blueStage" + num + "Lbl");
    }   

    for (var i = 0; i < 3; i++) {
        audio[i] = document.getElementById("audio" + i);
        audio[i].load();
    }

    overlay = document.getElementById("overlay");
    colaImg[0] = document.getElementById("cola0");
    colaImg[1] = document.getElementById("cola1");
    overlayTitle = document.getElementById("overlayTitle");
    overlayLbl = document.getElementById("overlayLbl");
    overlayTime = document.getElementById("overlayTime");
    
    sodaCanNumInStage[RED_TEAM] = [0, 0, 0];
    sodaCanNumInStage[BLUE_TEAM] = [0, 0, 0];
    
    unlockStage(RED_TEAM, 1);
    unlockStage(BLUE_TEAM, 1);
    displayScore();
}

function getButton(team, stage, type) {
    if (type == CANDY && stage != 3) {
        return null;
    }
    else {
        return document.getElementById("button" + team + stage + type);
    }
}

function enableButton(button, enable) {
    button.disabled = !enable;
}

/*------AUDIO------*/
function loadAudio (num) {
    audio[num].load();
}

/*------TIMER------*/
function switchTimerMode() {
    gameMode = gameMode == SETUP? GAME : SETUP;
    totalTime = gameMode == SETUP? 60 : 180;
    switchBtn.textContent = gameMode == SETUP? "Game" : "Set-up";
    resetTimer();
}

function handleTimer() {
    if (!isRunning) {
        if (elapsedTime >= totalTime * 1000) {
            startTime = 0;
            elapsedTime = 0;
        }
        runTimer();
        startBtn.textContent = "Pause";
        switchBtn.disabled = true;
    }
    else {
        stopTimer();
        startBtn.textContent = "Continue";
        switchBtn.disabled = false;
    }
}

function runTimer() {
    isRunning = true;
    startTime = Date.now() - elapsedTime;
    timer = setInterval(updateTimer, 5);
    timerTime.classList.toggle("blink", false);
}

function stopTimer() {
    isRunning = false;
    clearInterval(timer);
    elapsedTime = Date.now() - startTime;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    startTime = 0;
    elapsedTime = 0;
    switchBtn.disabled = false;
    timerTime.style.color = "black";
    timerTime.classList.toggle("blink", false);
    
    startBtn.textContent = "Start";
    timerTitle.textContent = gameMode == SETUP? "SET-UP TIME" : "GAME TIMER";
    timerTime.textContent = totalTime;

    sodaCanNumInStage[RED_TEAM] = [0, 0, 0];
    sodaCanNumInStage[BLUE_TEAM] = [0, 0, 0];
    scoreCandyBall = [false, false];
    checkProgress();
    displayScore();
}

function updateTimer() {
    currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    console.log("elapsedTime: ", elapsedTime / 1000);

    timerTimeDisplay = totalTime - Math.floor(elapsedTime / 1000);
    if (timerTimeDisplay < 0) timerTimeDisplay = 0;
    timerTime.textContent = timerTimeDisplay;

    
    if (timerTimeDisplay == 12 && timerTimeDisplay != lastTimerTime) {
        loadAudio(SHORT_BEEP);
    }

    if (timerTimeDisplay <= 10 && timerTimeDisplay > 0) {
        timerTime.style.color = "red";
        if (timerTimeDisplay != lastTimerTime) {
            audio[SHORT_BEEP].play();
        }
    }
    else {
        timerTime.style.color = "black";
    }

    if ((elapsedTime / 1000) >= totalTime) {
        stopTimer();
        switchBtn.disabled = false;
        startBtn.textContent = "Restart";
        timerTime.classList.toggle("blink", true);
        
        audio[LONG_BEEP].play();

        if (gameMode == GAME) {
            displayScore();
            checkProgress();
        }
    }

    lastTimerTime = timerTimeDisplay;
}


/*------SCORE------*/
function updateScore(stage, team, add) {
    if (add && sodaCanNumInStage[team][stage - 1] < maxSodaCanNumInStage[stage - 1]) {
        sodaCanNumInStage[team][stage - 1] += 1;
        getButton(team, stage, MINUS).disabled = false;
    }
    else if (!add && sodaCanNumInStage[team][stage - 1] > 0) {
        sodaCanNumInStage[team][stage - 1] -= 1;
        getButton(team, stage, ADD).disabled = false;
    }

    //check button
    if (sodaCanNumInStage[team][stage - 1] == 0) {
        getButton(team, stage, MINUS).disabled = true;
    }
    else if (sodaCanNumInStage[team][stage - 1] == maxSodaCanNumInStage[stage - 1]) {
        getButton(team, stage, ADD).disabled = true;
    }

    //audio
    if (stage == 3 && add) {
        loadAudio(ENDGAME);
    }
    
    displayScore();
    checkProgress();
}

function handleCandy(team) {
    scoreCandyBall[team] = !scoreCandyBall[team];
    loadAudio(ENDGAME);
    displayScore();
    checkProgress();    //check endgame
}

function unlockStage(team, stage) {
    //enable
    for (i = 0; i < 3; i++) {
        if (i < stage) {
            stageLabel[team][i].style.opacity = 1.0;
            getButton(team, i + 1, ADD).disabled = sodaCanNumInStage[team][i] >= maxSodaCanNumInStage[i];
            getButton(team, i + 1, MINUS).disabled = sodaCanNumInStage[team][i] <= 0;
            if (i + 1 == 3) getButton(team, i + 1, CANDY).disabled = false;
        }
        else {
            stageLabel[team][i].style.opacity = 0.3;
            getButton(team, i + 1, ADD).disabled = true;
            getButton(team, i + 1, MINUS).disabled = true;
            if (i + 1 == 3) getButton(team, i + 1, CANDY).disabled = true;
        }
    }
}

function checkProgress() {
    winningTeam = TIE;
    for (var team = RED_TEAM; team <= BLUE_TEAM; team++) {
        //check stage
        if (sodaCanNumInStage[team][1] >= 4 && sodaCanNumInStage[team][0] == 6) {
            currentStage[team] = 3;
        }
        else if (sodaCanNumInStage[team][0] >= 6) {
            currentStage[team] = 2;
        }
        else {
            currentStage[team] = 1;
        }
        unlockStage(team, currentStage[team]);
        
        //check endgame
        if ((scoreCandyBall[team] || sodaCanNumInStage[team][2] == 10) && sodaCanNumInStage[team][1] == 4 && sodaCanNumInStage[team][0] == 6) {
            winningTeam = team;
            showOverlay(true, team, true);
            break;
        }
    }

    //check winner
    if (gameMode == GAME && elapsedTime > totalTime * 1000 && winningTeam == TIE) {
        for (var i = 2; i >= 0; i--) {
            if (sodaCanNumInStage[RED_TEAM][i] != sodaCanNumInStage[BLUE_TEAM][i]) {
                if (sodaCanNumInStage[RED_TEAM][i] > sodaCanNumInStage[BLUE_TEAM][i]) {
                    winningTeam = RED_TEAM;
                    break;
                }
                else {
                    winningTeam = BLUE_TEAM;
                    break;
                }
            }
        }
        showOverlay(true, winningTeam, false);
    }

}

function displayScore() {
    for (var team = RED_TEAM; team <= BLUE_TEAM; team++) {
        for (var stage = 0; stage < 3; stage++) {
            stageLabel[team][stage].textContent = sodaCanNumInStage[team][stage];
        }
        getButton(team, 3, CANDY).classList.toggle("haveCandy", scoreCandyBall[team]);
    }
}

/*------ENDGAME------*/
function showOverlay(show, overlayTeam, endgame) {
    if (show) {
        if (isRunning){
            stopTimer();
            startBtn.textContent = "Continue";
        }
        
        if (endgame) {
            audio[ENDGAME].play();
            overlay.style.height = "30rem";
            // colaImg.src = "assets/img/team" + overlayTeam + "_cola.png";
            // colaImg.style.display = "block";
            
            for (var team = RED_TEAM; team <= BLUE_TEAM; team++) {
                colaImg[team].style.display = overlayTeam == team? "block" : "none";
            }
            
            overlayTitle.style.display = "block";
            
            showWave(overlayTeam, true);

            for (var i = 0; i < document.getElementById("footer").children.length; i++) {
                document.getElementById("footer").children[i].classList.toggle("white", true);
            }
        }
        else {
            overlay.style.height = "10rem";
            for (var team = RED_TEAM; team <= BLUE_TEAM; team++) {
                colaImg[team].style.display = "none";
            }
            overlayTitle.style.display = "none";
        }

        if (overlayTeam == RED_TEAM) {
            overlayLbl.textContent = "Red Team Wins";
        }
        else if (overlayTeam == BLUE_TEAM) {
            overlayLbl.textContent = "Blue Team Wins";
        }
        else {
            overlayLbl.textContent = "Tie! Super!";
        }
        overlayTime.textContent = (elapsedTime / 1000) + "s";
        
        switchBtn.disabled = true;
        startBtn.disabled = true;
        resetBtn.disabled = true;

        for (var team = RED_TEAM; team <= BLUE_TEAM; team++) {
            for (var stage = 1; stage <= 3; stage++) {
                for (var type = MINUS; type <= ADD; type++) {
                    getButton(team, stage, type).disabled = true;
                }
            }
            getButton(team, 3, CANDY).disabled = true;
        }
    }
    else {
        switchBtn.disabled = false;
        startBtn.disabled = false;
        resetBtn.disabled = false;

        showWave(overlayTeam, false);

        for (var i = 0; i < document.getElementById("footer").children.length; i++) {
            document.getElementById("footer").children[i].classList.toggle("white", false);
        }

        unlockStage(RED_TEAM, currentStage[RED_TEAM]);
        unlockStage(BLUE_TEAM, currentStage[BLUE_TEAM]);
    }
    
    overlay.classList.toggle("hidden", !show);
}

/*EVENT LISTENER*/
window.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        if (!startBtn.disabled) {
            handleTimer();
        }
    }
    else if (event.code === 'Escape') {
        event.preventDefault();
        showOverlay(false, 0, false);
    }
});