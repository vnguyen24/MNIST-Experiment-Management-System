import sys
import os
# Add the server directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from server.ml_models.mnist_model import Net, load_data, MNISTModel
import torch.nn as nn
import torch.optim as optim
import time
from db.models.job import Job
import datetime

class Manager:
    def __init__(self, socketio):
        self.socketio = socketio

    def start_experiment(self, hyperparams):
        batch_size = hyperparams['batch_size']
        learning_rate = hyperparams['learning_rate']
        epochs = hyperparams['epochs']

        trainloader, testloader = load_data(batch_size)
        model = Net()
        criterion = nn.CrossEntropyLoss()
        optimizer = optim.Adam(model.parameters(), lr=learning_rate)
        mnistmodel = MNISTModel()
        start = time.time()
        mnistmodel.train_model(model, trainloader, criterion, optimizer, epochs, self.progress_update)
        end = time.time()
        run_time = round(end-start, 3)
        # print(f"Finished training the model")
        accuracy = mnistmodel.evaluate_model(model, testloader)
        mnistmodel.save_model(model)
        # print(f"Done with accuracy: {accuracy}%")
        # print("Updating finished job in DB")
        Job.objects(epochs=epochs, learning_rate=learning_rate, batch_size=batch_size).update_one(set__status=True, set__time_finished=datetime.datetime.now(datetime.UTC), set__run_time=run_time, set__accuracy=accuracy)
        # print(f"Closing websocket to avoid memory leaks")
        self.close_connection(hyperparams)
        return (accuracy, run_time)


    def progress_update(self, progress_data):
        self.socketio.emit('response', progress_data)

    def close_connection(self, hyperparams):
        self.socketio.emit('experiment_done', hyperparams)