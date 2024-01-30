from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from server.experiment_manager.manager import Manager

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")
manager = Manager(socketio)


@app.route('/')
def home():
    return 'Welcome to the Flask server'

@app.route('/start_experiment')
def start_experiment():
    manager.start_experiment({})
    return 'Experiment finished'

@app.route('/api/greet')
def greet():
  return jsonify({'message': 'Hello from Flask'})

if __name__ == '__main__':
    socketio.run(app)