import json
from flask import Flask, jsonify, request, make_response
from flask_socketio import SocketIO
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from server.experiment_manager.manager import Manager
from flask_cors import CORS
import pika
import threading
from threading import Thread
from db.database import connect_to_db
from db.models.job import Job
from mongoengine import ValidationError
from dotenv import load_dotenv
import datetime

app = Flask(__name__)
CORS(app) # By default gives access to all origins
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")
manager = Manager(socketio)

# RabbitMQ connection
try:
    conn = pika.BlockingConnection(pika.ConnectionParameters(host="localhost", port=5672))
except pika.exceptions.AMQPConnectionError as exc:
    print("Failed to connect to RabbitMQ service. Message wont be sent.")

# Rabbit config
channel = conn.channel()
channel.queue_declare(queue='task', durable=True)
channel.basic_qos(prefetch_count=1)

def callback(ch, method, properties, body):
    body = json.loads(body) # Convert to Python dict
    print(" Received %s" % body)
    # print(" Start experiment")
    manager.start_experiment(body)
    # Job.objects(epochs=body['epochs'], learning_rate=body['learning_rate'], batch_size=body['batch_size']).update_one(set__status=True, set__time_finished=datetime.datetime.now(datetime.UTC), set__run_time=run_time, set__accuracy=accuracy)
    ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_consume(queue='task', on_message_callback=callback) # Setup behavior cua channel
thread = Thread(target=channel.start_consuming, daemon=True) # Setup behavior cua worker
thread.start() # Bao worker bat dau lam viec

load_dotenv()
connect_to_db()

@app.route('/')
def home():
    return 'Welcome to the Flask server'

@app.post('/create-job')
def create_job():
    def initialize_key(key):
        d = {'epochs':5, 'batch_size':64, 'learning_rate':0.003}
        try:
            if key == "learning_rate":
                return float(request.json[key])
            else:
                return int(request.json[key])
        except:
            print(f'{key} key not found in request form. Using a default value of {d[key]}')
            return d[key]
    data = {}
    data['epochs'] = initialize_key('epochs')
    data['batch_size'] = initialize_key('batch_size')
    data['learning_rate'] = initialize_key('learning_rate')
    try:
        message, job = Job.create_or_get_job(epochs=data["epochs"], learning_rate=data["learning_rate"], batch_size=data["batch_size"])
        if message == "Created new job.":
            print(f"create job called with request: {data}")
            channel.basic_publish(
                exchange='',
                routing_key='task',
                body=json.dumps(data), # Data sent to worker is CLEANED
                properties=pika.BasicProperties(delivery_mode=2)  # make message persistent / same as above
            )
    except ValidationError as e:
        return make_response(jsonify({'message': e.message}))
    job_json = job.to_json()
    response = make_response(jsonify({
        'message': message,
        'data': job_json
    }), 200)
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    return response

@app.get('/get-jobs')
def get_jobs():
    objs = Job.objects.order_by("-accuracy").limit(10)
    response = make_response(jsonify({
        'message': 'Here are the best job configurations',
        'data': objs.to_json()
    }))
    return response

@app.get('/find-job')
def find_job():
    # print(f"find-job called with response: {request.args}")
    epochs = int(request.args.get('epochs'))
    learning_rate = float(request.args.get('learning_rate'))
    batch_size = int(request.args.get('batch_size'))
    job = Job.objects(epochs=epochs, learning_rate=learning_rate, batch_size=batch_size).first() # Guaranteed to be a finished job
    response = make_response(jsonify({
        'data': job.to_json()
    }))
    return response

if __name__ == '__main__':
    socketio.run(app, port=9000)
    