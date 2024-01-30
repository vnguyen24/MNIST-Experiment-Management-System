import sys
import os
# Add the server directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from server.ml_models.mnist_model import Net, load_data, MNISTModel
import torch.nn as nn
import torch.optim as optim
from flask_socketio import disconnect

class Manager:
    def __init__(self, socketio):
        self.socketio = socketio
    
    def start_experiment(self, hyperparams):
        batch_size = hyperparams.get("batch_size", 64)
        learning_rate = hyperparams.get("learning_rate", 0.003)
        epochs = hyperparams.get("epochs", 5)

        trainloader, testloader = load_data(batch_size)
        model = Net()
        criterion = nn.CrossEntropyLoss()
        optimizer = optim.Adam(model.parameters(), lr=learning_rate)
        mnistmodel = MNISTModel()

        mnistmodel.train_model(model, trainloader, criterion, optimizer, epochs, self.progress_update)
        print(f"Finished training the model")
        accuracy = mnistmodel.evaluate_model(model, testloader)
        mnistmodel.save_model(model)
        print(f"Done with accuracy: {accuracy}%")
        print(f"Closing websocket to avoid memory leaks")
        self.close_connection()


    def progress_update(self, progress_data):
        self.socketio.emit('response', progress_data)

    def close_connection(self):
        self.socketio.emit('experiment_done', {'message': 'Experiment completed.'})