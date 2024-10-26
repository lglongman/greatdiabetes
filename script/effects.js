let bubbleGenerator = null;

function showWave (team, show) {
    let background = document.getElementById("background-container")
    let water = document.getElementById("water");
    
    //open
    if (show) {
        //color
        if (team == RED_TEAM) {
            document.body.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
            if (water.classList.contains("bluewave")) {
                water.classList.replace("bluewave", "redwave");
            }
            else {
                water.classList.toggle("redwave", true);
            }
            for (var i = 0; i < 3; i++) {
                background.children[i].classList.toggle("bluewave", false);
            }
        }
        else {
            document.body.style.backgroundColor = "rgba(0, 0, 255, 0.2)";
            if (water.classList.contains("redwave")) {
                water.classList.replace("redwave", "bluewave");
            }
            else {
                water.classList.toggle("bluewave", true);
            }
            for (var i = 0; i < 3; i++) {
                background.children[i].classList.toggle("bluewave", true);
            }
        }
        background.style.top = "0%";
        bubbleGenerator = setInterval(() => createBubbles(team), 15);
    }
    
    //close
    else {
        document.body.style.backgroundColor = "#EEEEEE";
        background.style.top = "100%";
        clearInterval(bubbleGenerator);
    }
}

function createBubbles(color) {
    const container = document.getElementById("bubble-container");
    const bubble = document.createElement('span');
    bubble.classList.add(color == RED_TEAM? "redbubble" : "bluebubble");
    
    var bubbleSize = Math.random() * 2 + 1;
    bubble.style.width = bubbleSize + "rem";
    bubble.style.height = bubbleSize + "rem";
    bubble.style.left = Math.random() * 100 + "vw";
    // bubble.style.zIndex = 0;
    container.appendChild(bubble);

    // destroy
    setTimeout(() => {
        bubble.remove();
    }, 1100)
}