// script.js

let trackingActive = false;  // Flag to track if gaze tracking is active
let calibrationPoints = [];   // Store calibration points
let currentCalibrationIndex = 0;  // Index to track current calibration point

// Create calibration points
const createCalibrationPoints = () => {
    const points = [
        { x: 100, y: 100 },
        { x: window.innerWidth - 100, y: 100 },
        { x: 100, y: window.innerHeight - 100 },
        { x: window.innerWidth - 100, y: window.innerHeight - 100 },
        { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    ];

    points.forEach(point => {
        const div = document.createElement('div');
        div.className = 'calibration-point';
        div.style.left = `${point.x}px`;
        div.style.top = `${point.y}px`;
        div.addEventListener('click', () => handleCalibrationClick(point));
        document.getElementById('calibrationPoints').appendChild(div);
        calibrationPoints.push(div);
    });
};

// Handle calibration point click
const handleCalibrationClick = () => {
    const index = currentCalibrationIndex++;
    calibrationPoints[index].style.display = 'none';  // Hide current point
    
    if (currentCalibrationIndex < calibrationPoints.length) {
        calibrationPoints[currentCalibrationIndex].style.display = 'block';  // Show next point
    } else {
        finishCalibration();  // Finish calibration if done
    }
};

// Start calibration
document.getElementById('startCalibration').addEventListener('click', () => {
    // Start WebGazer to access the camera
    webgazer.setRegression('ridge')
        .begin()  // Start gaze tracking
        .then(() => {
            createCalibrationPoints();  // Create calibration points
            calibrationPoints[0].style.display = 'block';  // Show the first point
            document.getElementById('status').innerText = 'Calibration started! Click on the red points.';
            document.getElementById('startTracking').disabled = true;  // Disable tracking button during calibration
        })
        .catch((error) => {
            console.error('Error starting WebGazer:', error);
            document.getElementById('status').innerText = 'Failed to access camera. Please allow camera access.';
        });
});

// Finish calibration
const finishCalibration = () => {
    calibrationPoints.forEach(point => point.style.display = 'none');  // Hide all points
    trackingActive = false;  // Reset tracking flag
    document.getElementById('status').innerText = 'Calibration finished! Press "Start Tracking" to begin.';
    document.getElementById('startTracking').disabled = false;  // Enable tracking button
};

// Start gaze tracking
document.getElementById('startTracking').addEventListener('click', () => {
    trackingActive = true;  // Set tracking flag to true
    document.getElementById('status').innerText = 'Gaze tracking started! Click around to test.';
});

// Add event listener for the Escape key to stop tracking
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        trackingActive = false;  // Stop tracking
        webgazer.pause();  // Pause WebGazer
        document.getElementById('status').innerText = 'Gaze tracking stopped. Press "Start Tracking" to resume.';
        console.log('Gaze tracking stopped.');
    }
});

// Set up gaze listener when starting tracking
webgazer.setGazeListener((data, elapsedTime) => {
    if (trackingActive && data) {
        const avgX = Math.round(data.x);
        const avgY = Math.round(data.y);

        // Send gaze data to the Flask server
        fetch('http://localhost:5000/gaze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ x: avgX, y: avgY })
        })
        .then(response => {
            if (!response.ok) {
                console.error('Error sending gaze data:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Network error:', error);
        });
    }
});
