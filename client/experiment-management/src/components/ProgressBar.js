import React from 'react';
import '../styling/ProgressBar.css';

const ProgressBar = ({ progressData }) => {
	const { time, total_progress } = progressData;

	if (!progressData) {
		return <h1>Nothing here!</h1>;
	}

	return (
		<div className='progress-bar'>
			{Array.from({ length: 20 }, (_, index) => (
				<div
					key={index}
					className={`progress-block ${
						total_progress / 5 >= index + 1 ? 'active' : ''
					}`}
				/>
			))}
		</div>
	);
};

export default ProgressBar;
