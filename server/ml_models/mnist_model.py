
# import torch
# from torchvision import datasets, transforms
# import torch.nn as nn
# import torch.nn.functional as F
# from torch import optim


# # Transform to convert images to PyTorch tensors and normalize the data
# transform = transforms.Compose([
#     transforms.ToTensor(),
#     transforms.Normalize((0.5,), (0.5,))
# ])

# # Load MNIST dataset
# trainset = datasets.MNIST(root='./data', train=True, download=True, transform=transform)
# testset = datasets.MNIST(root='./data', train=False, download=True, transform=transform)

# # DataLoader
# trainloader = torch.utils.data.DataLoader(trainset, batch_size=64, shuffle=True)
# testloader = torch.utils.data.DataLoader(testset, batch_size=64, shuffle=False)

# # Define the Model
# class Net(nn.Module):
#     def __init__(self):
#         super(Net, self).__init__()
#         self.fc1 = nn.Linear(28*28, 256)
#         self.fc2 = nn.Linear(256, 128)
#         self.fc3 = nn.Linear(128, 64)
#         self.fc4 = nn.Linear(64, 10)

#     def forward(self, x):
#         x = x.view(-1, 28*28)  # Flatten the images
#         x = F.relu(self.fc1(x))
#         x = F.relu(self.fc2(x))
#         x = F.relu(self.fc3(x))
#         x = F.log_softmax(self.fc4(x), dim=1)
#         return x

# # Initialize the model
# model = Net()

# # Loss function
# criterion = nn.CrossEntropyLoss()

# # Optimizer
# optimizer = optim.Adam(model.parameters(), lr=0.003)

# # Train the Model
# epochs = 5
# for e in range(epochs):
#     running_loss = 0
#     for images, labels in trainloader:
#         images = images.view(images.shape[0], -1)  # Flatten MNIST images into a 784 long vector
#         optimizer.zero_grad()  # Zero the gradients
#         output = model(images)  # Pass batch
#         loss = criterion(output, labels)  # Calculate loss
#         loss.backward()  # Backpropagation
#         optimizer.step()  # Update weights
#         running_loss += loss.item()  # Add up the loss
#     print(f"Training loss: {running_loss/len(trainloader)}")

# # Test the Model
# correct = 0
# total = 0
# with torch.no_grad():
#     for images, labels in testloader:
#         images = images.view(images.shape[0], -1)
#         outputs = model(images)
#         _, predicted = torch.max(outputs, 1)
#         total += labels.size(0)
#         correct += (predicted == labels).sum().item()

# print(f'Accuracy of the network on the 10000 test images: {100 * correct / total}%')

# # Save the Trained Model
# torch.save(model.state_dict(), 'mnist_model.pth')

# # The saved model can be loaded later with model.load_state_dict(torch.load('mnist_model.pth'))


###################################################################################################
import torch
from torchvision import datasets, transforms
import torch.nn as nn
import torch.nn.functional as F
from torch import optim

def load_data():
    transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))])
    trainset = datasets.MNIST(root='./data', train=True, download=True, transform=transform)
    testset = datasets.MNIST(root='./data', train=False, download=True, transform=transform)
    trainloader = torch.utils.data.DataLoader(trainset, batch_size=64, shuffle=True)
    testloader = torch.utils.data.DataLoader(testset, batch_size=64, shuffle=False)
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

def train_model(model, trainloader, criterion, optimizer, epochs):
    for epoch in range(epochs):
        running_loss = 0
        for images, labels in trainloader:
            images = images.view(images.shape[0], -1)
            optimizer.zero_grad()
            output = model(images)
            loss = criterion(output, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()
        # Return or log the loss per epoch

def evaluate_model(model, testloader):
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

def save_model(model, path='mnist_model.pth'):
    torch.save(model.state_dict(), path)

def load_model(model, path='mnist_model.pth'):
    model.load_state_dict(torch.load(path))
