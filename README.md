# MNIST Tuner
A Fullstack web application that serves as an experiment tracking tool, which allows users to tune a Deep Learning model that solves the MNIST challenge as a black box.

# Link to full video: (https://drive.google.com/file/d/1GV5KCh9rq1uqbC3p_c2_enKNXFKX9xhK/view?usp=drive_link)
![github gif](https://github.com/vnguyen24/MNIST-Experiment-Management-System/assets/75783251/6ef0fd4e-5f91-434f-ad58-b8fd51708dbb)
![Experiment Management System](https://github.com/vnguyen24/MNIST-Experiment-Management-System/assets/75783251/4c365b3d-f35c-483b-93d9-e020895683ff)
![MNIST UI Design-1](https://github.com/vnguyen24/MNIST-Experiment-Management-System/assets/75783251/8d1c1107-34cd-43b6-9630-156fe69284d7)
![MNIST UI Design-2](https://github.com/vnguyen24/MNIST-Experiment-Management-System/assets/75783251/86525381-4fb2-4c65-9cd4-7d502bd427fd)

# Dev journal
A record of my developement journey, everything from progress, bugs, to struggles and breakthroughs. It's mostly for me to reflect on everyday and treasure how far I have come. If you are remotely interested, definitely check out me talking to myself :)
[JOURNAL](https://github.com/vnguyen24/MNIST-Experiment-Management-System/blob/main/JOURNAL.md)

# Contributors
- Cuong Nguyen
- Anh Phan [Github link](https://github.com/duyanh131212)

# Features
- Simple form: A form to submit job configurations, implemented with input validity checks.
- Message board: A notification interface to help users understand the current process. Message content includes confirmation of job submission and report of submitted jobs (both in queue and finished).
- Progress bar: A progress bar that shows users training progress in real time!
- Job board: A table of 10 best job configurations that gets updated everytime a training + evaluation cycle finishes.

# Technologies
- Frontend: React.js, Bootstrap, React Bootstrap
- Backend: Python, Flask, Flask-SocketIO, pika, CORS, MongoEngine, PyTorch, Threading
- Database: MongoDB
- JobQueue: RabbitMQ
- Hosing service: Netlify, Render, CloudAMQP
- Misc (Things I used but unsure how to classify): Docker, Postman, Werkzeug, gunicorn, waitress, eventlet, gevent, kombu
