import React from 'react';
import '../styling/MessageBoard.css';
import Message from './Message';

const MessageBoard = ({ messages }) => {
	if (!messages || messages.length === 0) {
		return (
			<p className='no-message text-center fs-4 fw-medium text-decoration-underline'>
				This is where the system communicates with you
			</p>
		);
	}
	return (
		<div className='message-board'>
			{messages.map((item, index) => (
				<Message key={index} time={item.time} message={item.message} />
			))}
		</div>
	);
};

export default MessageBoard;
