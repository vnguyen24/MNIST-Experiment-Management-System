import json
from flask import Flask, jsonify, request, make_response
from flask_socketio import SocketIO
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from server.experiment_manager.manager import Manager
from flask_cors import CORS
import pika
from threading import Thread

app = Flask(__name__)
CORS(app) # By default gives access to all origins
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")
manager = Manager(socketio)

# RabbitMQ connection
try:
    conn = pika.BlockingConnection(pika.ConnectionParameters(host="localhost", port=5672))
except pika.exceptions.AMQPConnectionError as exc:
    print("Failed to connect to RabbitMQ service. Message wont be sent.")

channel = conn.channel()
channel.queue_declare(queue='task', durable=True)
#channel.basic_qos(prefetch_count=1)
def callback(ch, method, properties, body):
    print(" Received %s" % json.loads(body))
    print(" Start experiment")
    start_experiment(json.loads(body))
    ch.basic_ack(delivery_tag=method.delivery_tag)
channel.basic_consume(queue='task', on_message_callback=callback)
thread = Thread(target=channel.start_consuming)
thread.start()

@app.route('/')
def home():
    return 'Welcome to the Flask server'

def start_experiment(data):
    print(f"start experiment called with request: {data}")
    obj = {}
    def initialize_key(key):
        d = {'epochs':5, 'batch_size':64, 'learning_rate':0.003}
        try:
            if key == "learning_rate":
                obj[key] = float(data[key])
            else:
                obj[key] = int(data[key])
        except:
            print(f'{key} key not found in request form. Using a default value of {d[key]}')
            obj[key] = d[key]
    initialize_key('epochs')
    initialize_key('learning_rate')
    initialize_key('batch_size')
    manager.start_experiment(obj)

# @app.post('/start_experiment')
# def start_experiment():
#     print(f"start experiment called with request: {request.json}")
#     obj = {}
#     def initialize_key(key):
#         d = {'epochs':5, 'batch_size':64, 'learning_rate':0.003}
#         try:
#             if key == "learning_rate":
#                 obj[key] = float(request.json[key])
#             else:
#                 obj[key] = int(request.json[key])
#         except:
#             print(f'{key} key not found in request form. Using a default value of {d[key]}')
#             obj[key] = d[key]
#     initialize_key('epochs')
#     initialize_key('learning_rate')
#     initialize_key('batch_size')
#     manager.start_experiment(obj)
#     response = make_response('Experiment finished')
#     response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
#     return response

@app.route('/create_job', methods=['POST'])
def create_job():
    data = request.json
    print(f"create job called with request: {data}")
    channel.basic_publish(
        exchange='',
        routing_key='task',
        body=json.dumps(data),
        properties=pika.BasicProperties(delivery_mode=2)  # make message persistent / same as above
    )
    return jsonify({'message': 'Job created successfully'})


@app.route('/get_jobs', methods=['GET'])
def get_jobs():
    return 0

if __name__ == '__main__':
    socketio.run(app, port=9000)
    