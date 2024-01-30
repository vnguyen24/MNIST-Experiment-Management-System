import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
	const [progress, setProgress] = useState();

	useEffect(() => {
		const handleResponse = (data) => {
			setProgress(data);
		};

		const handleExperimentDone = () => {
			console.log('Experiment completed. Closing WebSocket.');
			socket.close(); // Close the WebSocket connection
		};

		socket.on('response', handleResponse);
		socket.once('experiment_done', handleExperimentDone);

		return () => {
			socket.off('response', handleResponse);
			socket.off('experiment_done', handleExperimentDone);
		};
	}, []);

	return (
		<div>
			<h1>React WebSocket Example</h1>
			<div>{progress && JSON.stringify(progress)}</div>
		</div>
	);
}

export default App;
