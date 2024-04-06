import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Header from './components/Header';
import Form from './components/Form';
import DataTable from './components/DataTable';
import ProgressBar from './components/ProgressBar';
import MessageBoard from './components/MessageBoard';
import ProgressTimer from './components/ProgressTimer';
import Gear from './components/Gear';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

const socket = io(`${process.env.REACT_APP_SERVER_URL}`);

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
	const d = new Date();

	const getJobs = () => {
		console.log('getJobs called');
		const url = `https://mnist-tuner-server.onrender.com/get-jobs`;
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				const jsonData = JSON.parse(data.data);
				const formattedData = jsonData.map((item) => {
					const id = item._id.$oid;
					return { id, ...item };
				});
				setTable(formattedData);
			})
			.catch((error) => console.error('Fetch error:', error));
	};

	useEffect(() => {
		console.log('useEffect triggered');
		const handleResponse = (data) => {
			const { time, total_progress } = data;
			setProgressData({
				time: parseFloat(time),
				total_progress: parseFloat(total_progress),
			});
		};

		const handleExperimentDone = (data) => {
			findJob(data);
			getJobs();
		};

		console.log('starting response socket');
		socket.on('response', handleResponse);
		console.log('response socket established');
		console.log('starting experiment_done socket');
		socket.on('experiment_done', handleExperimentDone);
		console.log('experiment_done socket established');
		console.log('getting data table');
		getJobs();
		console.log('data table loaded');

		return () => {
			// Not sure if needed
			socket.off('response', handleResponse);
			socket.off('experiment_done', handleExperimentDone);
		};
		// eslint-disable-next-line
	}, []);

	const submitJob = () => {
		const url = `${process.env.REACT_APP_SERVER_URL}/create-job`;
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
				// console.log(data.message);
				let messageContent = data.message;
				const job = JSON.parse(data.data);
				// console.log(job);
				if (job !== null) {
					if (job.status === true) {
						// status only true if job is done + updated to table
						messageContent += ` Calculated accuracy: ${job.accuracy}%`;
					} else {
						messageContent += ` Job currently in queue waiting to be processed`;
					}
					const doneMessage = {
						time: d.toLocaleTimeString(),
						message: messageContent,
					};

					// Using setState's callback to ensure doneMessage is added after submitMessage
					setMessages((prevMessages) => {
						const newMessages = [doneMessage, ...prevMessages];
						return newMessages.slice(0, 10);
					});
				}
			});
	};

	const findJob = (params) => {
		const queryParams = new URLSearchParams(params).toString();
		const url = `${process.env.REACT_APP_SERVER_URL}/find-job?${queryParams}`;

		const options = {
			method: 'GET',
		};

		fetch(url, options)
			.then((response) => response.json())
			.then((data) => {
				// console.log(data);
				const job = JSON.parse(data.data);
				// console.log(job);
				const messageContent = `Job configuration {epochs: ${job.epochs}, learning_rate: ${job.learning_rate}, batch_size: ${job.batch_size}} finished in ${job.run_time} seconds. Calculated accuracy: ${job.accuracy}%`;
				const doneMessage = {
					time: d.toLocaleTimeString(),
					message: messageContent,
				};
				// Using setState's callback to ensure doneMessage is added after submitMessage
				setMessages((prevMessages) => {
					const newMessages = [doneMessage, ...prevMessages];
					return newMessages.slice(0, 10);
				});
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
							<Gear />
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
						{/* <div className='message-board-title'>
							<p className='fs-3 text-center w-100'>MESSAGE BOARD</p>
						</div> */}
						<div className='message-board-table mt-5'>
							<MessageBoard messages={messages}></MessageBoard>
						</div>
					</div>
					<div className='progress-bar-container'>
						<div className='progress-bar-timer-comp'>
							<ProgressTimer progressData={progressData} />
						</div>
						<div className='progress-bar-comp'>
							<ProgressBar progressData={progressData} />
						</div>
					</div>
				</div>
			</div>
			<div className='bot-container'>
				<div className='job-board-comp'>
					<DataTable table={table} />
				</div>
			</div>
		</div>
	);
}

export default App;
