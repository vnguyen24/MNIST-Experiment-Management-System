# Use an official Python runtime as a parent image
FROM python:3.12.2-slim

# Set the working directory in the container
WORKDIR /server

# Copy the current directory contents into the container at /server
COPY . .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 9000 to the outside world
EXPOSE 9000

# Define environment variables
ENV MONGO_URI="mongodb+srv://cuong:6cn5c3PMmvS3178v@test.llemyrt.mongodb.net/?retryWrites=true&w=majority"
ENV CLOUDAMQP_URL="amqps://ohrnlvhq:bGoTZhoe1oQdDWQYg-rn2b8flHsmnH6i@chimpanzee.rmq.cloudamqp.com/ohrnlvhq"

# Run gunicorn when the container launches
CMD ["gunicorn", "--worker-class", "eventlet", "-w", "1", "--bind", "0.0.0.0:9000", "app:app"]
