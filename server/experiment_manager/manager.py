import sys
import os
# Add the server directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from server.ml_models.mnist_model import Net, load_data, train_model, evaluate_model, save_model
import torch.nn as nn
import torch.optim as optim

def start_experiment(hyperparams):
    batch_size = hyperparams.get("batch_size", 64)
    learning_rate = hyperparams.get("learning_rate", 0.003)
    epochs = hyperparams.get("epochs", 5)

    trainloader, testloader = load_data(batch_size)
    model = Net()
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)

    train_time = round(train_model(model, trainloader, criterion, optimizer, epochs), 2)
    accuracy = evaluate_model(model, testloader)
    print(f'Accuracy and run time of the network on the 10000 test images: {accuracy, train_time}%')
    save_model(model)

    # Return or store experiment results (e.g., accuracy)
start_experiment({})