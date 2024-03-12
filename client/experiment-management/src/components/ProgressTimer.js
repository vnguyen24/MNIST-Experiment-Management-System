import React from 'react';
import '../styling/ProgressTimer.css';

const ProgressTimer = ({ progressData }) => {
	const { time } = progressData;
	if (time === 0) {
		return <p className='timer fs-4 fw-medium'>No job is currently running</p>;
	} else {
		return <p className='timer fs-4 fw-medium'>Timer: {time} seconds</p>;
	}
};

export default ProgressTimer;
