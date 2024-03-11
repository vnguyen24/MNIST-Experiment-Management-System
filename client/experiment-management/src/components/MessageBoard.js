import React, { useState } from 'react';

const MessageBoard = ({ messages }) => {
	return (
		<div>
			{messages.map((message, index) => (
				<div key={index}>{message}</div>
			))}
		</div>
	);
};

export default MessageBoard;
