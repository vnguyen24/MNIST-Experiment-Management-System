import React from 'react';
import '../styling/Message.css';

const Message = ({ time, message }) => {
	return (
		<div className='message-container'>
			<p className='time-comp fs-6 m-0 lh-base border-top border-bottom border-secondary border-1 ps-2'>
				{time}
			</p>
			<p className='message-comp fs-6 m-0 lh-base border-top border-bottom border-secondary border-1'>
				{message}
			</p>
		</div>
	);
};

export default Message;
