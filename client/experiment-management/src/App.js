import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
	const [message, setMessage] = useState('');

	useEffect(() => {
		fetch('http://localhost:5000/api/greet')
			.then((response) => response.json())
			.then((data) => setMessage(data.message));
	}, []);

	return <p>{message}</p>;
}

export default App;
