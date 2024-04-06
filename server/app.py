import json
from flask import Flask, jsonify, request, make_response
import os
from flask_cors import CORS
import pika
from threading import Thread
from db.database import connect_to_db
from db.models.job import Job
from mongoengine import ValidationError
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)
load_dotenv()
connect_to_db()

# RabbitMQ connection
try:
    print("Trying connection")
    url = os.getenv('CLOUDAMQP_URL')
    params = pika.URLParameters(url)
    conn = pika.BlockingConnection(params)
except pika.exceptions.AMQPConnectionError as exc:
    print("Failed to connect to RabbitMQ service. Message wont be sent.")

# Rabbit config
print("Connection successful")

@app.route('/')
def home():
    return 'Welcome to the Flask server'


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
    return response

@app.get('/get-jobs')
def get_jobs():
    objs = Job.objects.order_by("-accuracy").limit(10)
    response = make_response(jsonify({
        'message': 'Here are the best job configurations',
        'data': objs.to_json()
    }))
    return response


    epochs = int(request.args.get('epochs'))
    learning_rate = float(request.args.get('learning_rate'))
    batch_size = int(request.args.get('batch_size'))
    job = Job.objects(epochs=epochs, learning_rate=learning_rate, batch_size=batch_size).first() # Guaranteed to be a finished job
    response = make_response(jsonify({
        'data': job.to_json()
    }))
    return response

if __name__ == '__main__':
    Flask.run(app, port=9000)
    