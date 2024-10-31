/*EVENT LISTENER*/
window.addEventListener('keydown', function(event) {
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
});