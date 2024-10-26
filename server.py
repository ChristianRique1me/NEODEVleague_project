# server.py

from flask import Flask, request
import pyautogui
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/gaze', methods=['POST'])
def gaze():
    data = request.json
    x = data['x']
    y = data['y']
    
    # Move the cursor to the received gaze coordinates
    screen_width, screen_height = pyautogui.size()
    x = max(0, min(screen_width - 1, x))  # Clamp x between 0 and screen width
    y = max(0, min(screen_height - 1, y))  # Clamp y between 0 and screen height
    pyautogui.moveTo(x, y)  # Move the cursor
    
    return '', 204  # No content response

if __name__ == '__main__':
    app.run(port=5000)  # Ensure this port matches your fetch request
