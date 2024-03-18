# from pymongo.mongo_client import MongoClient
# from pymongo.server_api import ServerApi

# uri = "mongodb+srv://cuong:6cn5c3PMmvS3178v@test.llemyrt.mongodb.net/?retryWrites=true&w=majority"

# # Create a new client and connect to the server
# client = MongoClient(uri, server_api=ServerApi('1'))

# # Send a ping to confirm a successful connection
# try:
#     client.admin.command('ping')
#     print("Pinged your deployment. You successfully connected to MongoDB!")
# except Exception as e:
#     print(e)

from mongoengine import connect, get_connection
import os

def connect_to_db():
    print(f"Checking if environment variable exists: {os.getenv('MONGODB_CONNSTRING')}")
    connect(host=os.getenv('MONGODB_CONNSTRING'))
    client = get_connection()
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)