import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Header from './components/Header';
import Form from './components/Form';
import DataTable from './components/DataTable';
import ProgressBar from './components/ProgressBar';
import MessageBoard from './components/MessageBoard';
import Message from './components/Message';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

const socket = io('http://localhost:9000');

function App() {
	const [progressData, setProgressData] = useState({
		time: 0,
		total_progress: 0,
	});
	const [epochs, setEpochs] = useState('');
	const [lr, setLr] = useState('');
	const [size, setSize] = useState('');
	const [table, setTable] = useState([]);
	const [messages, setMessages] = useState([]);

	const columns = [
		{ field: 'batch_size', headerName: 'Batch_size', width: 150 },
		{ field: 'epochs', headerName: 'Epochs', width: 150 },
		{ field: 'learning_rate', headerName: 'Learning_rate', width: 150 },
		{ field: 'accuracy', headerName: 'Accuracy (%)', width: 150 },
		{ field: 'run_time', headerName: 'Run_time (seconds)', width: 150 },
	];

	const getJobs = () => {
		const url = 'http://localhost:9000/get-jobs';
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				const jsonData = JSON.parse(data.data);
				const formattedData = jsonData.map((item) => {
					const id = item._id.$oid;
					return { id, ...item };
				});
				setTable(formattedData);
				// console.log(formattedData);
			})
			.catch((error) => console.error('Fetch error:', error));
	};

	useEffect(() => {
		const handleResponse = (data) => {
			const { time, total_progress } = data;
			setProgressData({
				time: parseFloat(time),
				total_progress: parseFloat(total_progress),
			});
		};

		const handleExperimentDone = () => {
			console.log('Experiment completed. Closing WebSocket.');
			console.log('Updating table');
			getJobs();
		};

		socket.on('response', handleResponse);
		socket.once('experiment_done', handleExperimentDone);
		getJobs();

		return () => {
			// Not sure if needed
			socket.off('response', handleResponse);
			socket.off('experiment_done', handleExperimentDone);
		};
	}, []);

	const submitJob = () => {
		const submitMessage = <Message message={`Job sumitted!`}></Message>;

		// Using setState's callback to ensure submitMessage is added before doneMessage
		setMessages((prevMessages) => [submitMessage, ...prevMessages]);

		const url = 'http://localhost:9000/create-job';
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				epochs: epochs,
				learning_rate: lr,
				batch_size: size,
			}),
		};

		fetch(url, options)
			.then((response) => response.json())
			.then((data) => {
				console.log(data.message);
				let messageContent = data.message;
				const job = JSON.parse(data.data);
				console.log(job);
				if (job !== null) {
					if (job.status === true) {
						messageContent += `\nCalculated accuracy: ${job.accuracy}%`;
					} else {
						messageContent += `\nJob currently in queue waiting to be processed`;
					}
					const doneMessage = <Message message={messageContent} />;

					// Using setState's callback to ensure doneMessage is added after submitMessage
					setMessages((prevMessages) => [doneMessage, ...prevMessages]);
				}
			});
	};

	const resetFields = () => {
		setEpochs('');
		setLr('');
		setSize('');
	};

	return (
		<div className='main-container'>
			<div className='top-container'>
				<div className='left-container'>
					<div className='header-container'>
						<div className='gear-comp'>
							<h1>GEAR</h1>
						</div>
						<div className='header-comp'>
							<Header id='header' />
						</div>
					</div>
					<div className='form-container'>
						<div className='form-comp'>
							<Form
								epochs={epochs}
								lr={lr}
								size={size}
								setEpochs={setEpochs}
								setLr={setLr}
								setSize={setSize}
								submitJob={submitJob}
								resetFields={resetFields}
							/>
						</div>
					</div>
				</div>
				<div className='right-container'>
					<div className='message-board-container'>
						<div className='message-board-comp'>
							<h1>MESSAGE BOARD</h1>
						</div>
					</div>
					<div className='progress-bar-container'>
						<div className='progress-bar-comp'>
							<ProgressBar progressData={progressData} />
						</div>
					</div>
				</div>
			</div>
			<div className='bot-container'>
				<div className='job-board-comp'>
					<DataTable table={table} columns={columns} />
				</div>
			</div>
			{/* {progressData && JSON.stringify(progressData)} */}
			{/* <MessageBoard messages={messages}></MessageBoard> */}
			{/* <DataTable table={table} columns={columns} /> */}
		</div>
	);
}

export default App;
