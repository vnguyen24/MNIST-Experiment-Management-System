from flask import Flask, jsonify, request, make_response
from flask_socketio import SocketIO
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from server.experiment_manager.manager import Manager

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")
manager = Manager(socketio)


@app.route('/')
def home():
    return 'Welcome to the Flask server'

@app.post('/start_experiment')
def start_experiment():
    print(f"start experiment called with request: {request.json}")
    obj = {}
    def initialize_key(key):
        d = {'epochs':5, 'batch_size':64, 'learning_rate':0.003}
        try:
            obj[key] = request.json[key]
        except:
            print(f'{key} key not found in request form. Using a default value of {d[key]}')
            obj[key] = d[key]
    initialize_key('epochs')
    initialize_key('learning_rate')
    initialize_key('batch_size')
    manager.start_experiment(obj)
    response = make_response('Experiment finished')
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    return response

@app.route('/api/greet')
def greet():
  return jsonify({'message': 'Hello from Flask'})

if __name__ == '__main__':
    socketio.run(app, port=9000)