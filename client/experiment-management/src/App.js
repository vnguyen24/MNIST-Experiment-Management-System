import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { FormControl, InputLabel, Button, Input } from '@mui/material';

const socket = io('http://localhost:9000');

function App() {
	const [progress, setProgress] = useState();
	const [epoch, setEpoch] = useState('');
	const [lr, setLr] = useState('');
	const [size, setSize] = useState('');

	useEffect(() => {
		const handleResponse = (data) => {
			setProgress(data);
		};

		const handleExperimentDone = () => {
			console.log('Experiment completed. Closing WebSocket.');
			// socket.close(); // Close the WebSocket connection
			socket.off('response', handleResponse);
			socket.off('experiment_done', handleExperimentDone);
		};

		socket.on('response', handleResponse);
		socket.once('experiment_done', handleExperimentDone);

		// return () => {
		// 	socket.off('response', handleResponse);
		// 	socket.off('experiment_done', handleExperimentDone);
		// };
	}, []);

	const run = () => {
		const url = 'http://localhost:9000/start_experiment';
		const options = {
			method: 'POST',
			//Q: Do we need headers?
			body: JSON.stringify({
				epochs: epoch,
				learning_rate: lr,
				batch_size: size,
			}),
		};
		fetch(url, options)
			.then((response) => {
				return response.text();
			})
			.then((text) => console.log(text));
	};

	const resetFields = () => {
		setEpoch('');
		setLr('');
		setSize('');
	};

	return (
		<div>
			<h1>React WebSocket Example</h1>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<FormControl sx={{ m: 2, minWidth: 180 }}>
					<InputLabel id='epoch'>Epoch</InputLabel>
					<Input
						id='epoch'
						value={epoch}
						type='number'
						inputProps={{ min: 1 }}
						onChange={(e) => {
							// Handle user invalid input later
							setEpoch(e.target.value);
							console.log(e.target.value);
						}}
					></Input>
				</FormControl>
				<FormControl sx={{ m: 2, minWidth: 180 }}>
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
							console.log(e.target.value);
						}}
					></Input>
				</FormControl>
				<FormControl sx={{ m: 2, minWidth: 180 }}>
					<InputLabel id='size'>Batch Size</InputLabel>
					<Input
						id='size'
						value={size}
						type='number'
						inputProps={{ min: 1 }}
						onChange={(e) => {
							// Handle user invalid input later
							setSize(e.target.value);
							console.log(e.target.value);
						}}
					></Input>
				</FormControl>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Button
						variant='contained'
						color='secondary'
						onClick={run}
						sx={{ m: 3.2, minWidth: 150 }}
					>
						Add job
					</Button>
					<Button variant='contained' onClick={resetFields} sx={{ m: 2 }}>
						Reset Fields
					</Button>
				</div>
			</div>
			<div>{progress && JSON.stringify(progress)}</div>
		</div>
	);
}

export default App;
