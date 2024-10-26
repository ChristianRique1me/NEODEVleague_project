// script.js

// Initialize WebGazer
webgazer.setRegression('ridge') // Use ridge regression for better accuracy
    .setGazeListener((data, elapsedTime) => {
        // Optional: Track gaze data here if needed
    })
    .begin();

// Show the video feed (optional)
webgazer.showVideoPreview(true);

// Define calibration points
const calibrationPoints = [
    { x: 100, y: 100 }, // Top left
    { x: window.innerWidth - 100, y: 100 }, // Top right
    { x: 100, y: window.innerHeight - 100 }, // Bottom left
    { x: window.innerWidth - 100, y: window.innerHeight - 100 }, // Bottom right
    { x: window.innerWidth / 2, y: window.innerHeight / 2 }, // Center
];

let currentPoint = 0;
const calibrationDiv = document.getElementById('calibration');

document.getElementById('startCalibration').onclick = startCalibration;

function startCalibration() {
    currentPoint = 0;
    showCalibrationPoint(currentPoint);
}

function showCalibrationPoint(index) {
    if (index < calibrationPoints.length) {
        const point = calibrationPoints[index];
        calibrationDiv.style.left = `${point.x}px`;
        calibrationDiv.style.top = `${point.y}px`;
        calibrationDiv.style.visibility = 'visible'; // Make the point visible
    } else {
        calibrationDiv.style.visibility = 'hidden';
        alert('Calibration complete!'); // Notify the user
    }
}

// Handle click events on the calibration point
calibrationDiv.onclick = function() {
    // Hide the current point after clicking
    calibrationDiv.style.visibility = 'hidden';
    currentPoint++;
    showCalibrationPoint(currentPoint); // Show the next point
};
