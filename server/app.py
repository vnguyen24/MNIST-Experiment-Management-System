from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
  return "Welcome to the Flask server"

@app.route('/api/greet')
def greet():
  return jsonify({'message': 'Hello from Flask'})

if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0')