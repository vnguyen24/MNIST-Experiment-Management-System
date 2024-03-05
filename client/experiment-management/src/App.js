import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { FormControl, InputLabel, Button, Input } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import './App.css';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';

const socket = io('http://localhost:9000');

function App() {
	const [progress, setProgress] = useState();
	const [epochs, setEpochs] = useState('');
	const [lr, setLr] = useState('');
	const [size, setSize] = useState('');
	const [table, setTable] = useState([]);

	const columns = [
		// { field: 'id', headerName: 'ID', width: 90 },
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
			})
			.catch((error) => console.error('Fetch error:', error));
	};

	useEffect(() => {
		if (table.length !== 0) {
			console.log('setTable done. Table is: ', table);
		}
	}, [table]);

	useEffect(() => {
		const handleResponse = (data) => {
			setProgress(data);
		};

		const handleExperimentDone = () => {
			console.log('Experiment completed. Closing WebSocket.');
			console.log('Updating table');
			getJobs();
			// socket.close(); // Close the WebSocket connection
			// socket.off('response', handleResponse);
			// socket.off('experiment_done', handleExperimentDone);
		};

		socket.on('response', handleResponse);
		socket.once('experiment_done', handleExperimentDone);
		getJobs();
		// return () => {
		// 	socket.off('response', handleResponse);
		// 	socket.off('experiment_done', handleExperimentDone);
		// };
	}, []);

	const submitJob = () => {
		const url = 'http://localhost:9000/create-job';
		const options = {
			method: 'POST',
			//Q: Do we need headers?
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
				const job = JSON.parse(data.data);
				console.log(job);
				if (job !== null) {
					if (job.status === true) {
						// Only true if job is done
						console.log(`Calculated accuracy: ${job.accuracy}%`);
					} else {
						console.log('Job currently in queue waiting to be processed');
					}
				}
			});
	};

	const resetFields = () => {
		setEpochs('');
		setLr('');
		setSize('');
	};

	return (
		<div>
			<h1>React WebSocket Example</h1>
			<div className='form'>
				<div>
					<Stack direction='column'>
						<FormControl className='form-entry'>
							<InputLabel id='epochs'>Epoch</InputLabel>
							<Input
								id='epochs'
								value={epochs}
								type='number'
								inputProps={{ min: 1 }}
								onChange={(e) => {
									// Handle user invalid input later
									setEpochs(e.target.value);
								}}
							></Input>
						</FormControl>
						<FormControl className='form-entry'>
							<InputLabel id='lr'>Learning rate</InputLabel>
							<Input
								id='lr'
								value={lr}
								type='number'
								inputProps={{ min: 0, max: 1 }}
								step='0.00001'
								onChange={(e) => {
									// Handle user invalid input later
									setLr(e.target.value);
								}}
							></Input>
						</FormControl>
						<FormControl className='form-entry'>
							<InputLabel id='size'>Batch Size</InputLabel>
							<Input
								id='size'
								value={size}
								type='number'
								inputProps={{ min: 1 }}
								onChange={(e) => {
									// Handle user invalid input later
									setSize(e.target.value);
								}}
							></Input>
						</FormControl>
					</Stack>
				</div>
				<div className='button-div'>
					<Button
						className='submit-button'
						onClick={submitJob}
						endIcon={<SendIcon />}
					>
						Add job
					</Button>
					<Button
						className='reset-button'
						onClick={resetFields}
						endIcon={<DeleteIcon />}
					>
						Discard
					</Button>
				</div>
			</div>
			<div>{progress && JSON.stringify(progress)}</div>
			<div className='table-div'>
				<div className='table-headline'>Job History</div>
				{table.length !== 0 && (
					<DataGrid
						className='table'
						rows={table}
						columns={columns}
						getRowClassName={(params) => {
							if (params.indexRelativeToCurrentPage === 0) {
								return 'goldRow';
							} else if (params.indexRelativeToCurrentPage === 1) {
								return 'silverRow';
							} else if (params.indexRelativeToCurrentPage === 2) {
								return 'bronzeRow';
							}
							return '';
						}}
						pageSize={10}
						rowsPerPageOptions={[5, 10, 25]}
						initialState={{
							pagination: {
								pageSize: 10,
							},
						}}
					/>
				)}
			</div>
		</div>
	);
}

export default App;
