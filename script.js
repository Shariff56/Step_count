let totalSteps = 0;
let lastWalkTime = Date.now();
let lastY = null;
let stepThreshold = 1.2;
let motionEventAdded = false;

function startCounting() {
    totalSteps = parseInt(document.getElementById("stepInput").value);
    if (isNaN(totalSteps) || totalSteps < 1000) {
        alert("Enter a valid step count (minimum 1000)");
        return;
    }
    updateSteps();
    startStepTracking();
    setInterval(checkInactivity, 5000);
}

function updateSteps() {
    let stepsDisplay = document.getElementById("stepsLeft");
    stepsDisplay.innerText = `Steps Left: ${totalSteps}`;
    stepsDisplay.style.transform = "scale(1.2)";
    setTimeout(() => stepsDisplay.style.transform = "scale(1)", 200);
}

function checkInactivity() {
    if (Date.now() - lastWalkTime > 10000 && totalSteps > 0) {
        speakOnce("Keep going! Don't stop now!");
    }
}

function speakOnce(message) {
    if (!window.speechSynthesis.speaking) {
        let speech = new SpeechSynthesisUtterance(message);
        speech.lang = "en-US";
        window.speechSynthesis.speak(speech);
    }
}

function startStepTracking() {
    if (window.DeviceMotionEvent && !motionEventAdded) {
        motionEventAdded = true;
        window.addEventListener("devicemotion", function (event) {
            let yAcceleration = event.accelerationIncludingGravity?.y || 0;
            if (lastY !== null && Math.abs(yAcceleration - lastY) > stepThreshold) {
                stepDetected();
            }
            lastY = yAcceleration;
        }, { passive: true });
    } else if (!window.DeviceMotionEvent) {
        alert("Your device does not support motion tracking.");
    }
}

function stepDetected() {
    if (totalSteps > 0) {
        totalSteps--;
        lastWalkTime = Date.now();
        updateSteps();
        if (totalSteps % 1000 === 0 && totalSteps !== 0) {
            speakOnce(`Great job! Only ${totalSteps} steps left!`);
        }
        if (totalSteps === 0) {
            speakOnce("Congratulations! You've reached your goal!");
        }
    }
}

function resetTracker() {
    totalSteps = 0;
    lastY = null;
    motionEventAdded = false;
    document.getElementById("stepsLeft").innerText = "Steps Left: 0";
    document.getElementById("stepInput").value = "";
    window.removeEventListener("devicemotion", stepDetected);
}
