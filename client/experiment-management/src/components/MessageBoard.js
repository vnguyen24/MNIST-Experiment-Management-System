import React from 'react';
import '../styling/MessageBoard.css';
import Message from './Message';

const MessageBoard = ({ messages }) => {
	if (!messages || messages.length === 0) {
		return <h1>Nothing to show here!</h1>;
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
