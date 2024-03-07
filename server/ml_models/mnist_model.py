import torch
import time
from torchvision import datasets, transforms
import torch.nn as nn
import torch.nn.functional as F

def load_data(batch_size=64):
    transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))])
    trainset = datasets.MNIST(root='./data', train=True, download=True, transform=transform)
    testset = datasets.MNIST(root='./data', train=False, download=True, transform=transform)
    trainloader = torch.utils.data.DataLoader(trainset, batch_size=batch_size, shuffle=True)
    testloader = torch.utils.data.DataLoader(testset, batch_size=batch_size, shuffle=False)
    return trainloader, testloader

# Define the Model
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.fc1 = nn.Linear(28*28, 256)
        self.fc2 = nn.Linear(256, 128)
        self.fc3 = nn.Linear(128, 64)
        self.fc4 = nn.Linear(64, 10)

    def forward(self, x):
        x = x.view(-1, 28*28)  # Flatten the images
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = F.relu(self.fc3(x))
        x = F.log_softmax(self.fc4(x), dim=1)
        return x

class MNISTModel:
    def __init__(self):
        pass

    def train_model(self, model, trainloader, criterion, optimizer, epochs, progress_update):
        start_time = time.time()  # Start time
        for epoch in range(epochs):
            running_loss = 0
            for batch_id, (images, labels) in enumerate(trainloader):
                images = images.view(images.shape[0], -1)
                optimizer.zero_grad()
                output = model(images)
                loss = criterion(output, labels)
                loss.backward()
                optimizer.step()
                running_loss += loss.item()
                trainloader_len = len(trainloader)
                progress_data = {
                    'epoch_number': f"Epoch [{epoch+1}/{epochs}]",
                    'completion_of_epoch': f"{round((batch_id + 1) / trainloader_len * 100, 3)}",
                    'time': f"{round(time.time() - start_time, 2)}",
                    'total_progress': f"{round((trainloader_len * epoch + batch_id + 1) / (trainloader_len * epochs) * 100, 3)}"
                }
                progress_update(progress_data)
        return


    def evaluate_model(self, model, testloader):
        correct = 0
        total = 0
        with torch.no_grad():
            for images, labels in testloader:
                images = images.view(images.shape[0], -1)
                outputs = model(images)
                _, predicted = torch.max(outputs, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()
        return 100 * correct / total  # Return accuracy

    def save_model(self, model, path='mnist_model.pth'):
        torch.save(model.state_dict(), path)

    def load_model(self, model, path='mnist_model.pth'):
        model.load_state_dict(torch.load(path))
