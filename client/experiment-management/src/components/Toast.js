import React from 'react';
import Toast from 'react-bootstrap/Toast';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const ToastComponent = ({ showToast, setShowToast, message }) => {
	const messageLines = message.split('\n');
	return (
		<Toast
			show={showToast}
			autohide={true}
			delay={5000}
			bg='light'
			onClose={() => setShowToast(!showToast)}
		>
			<Toast.Header>
				<strong className='me-auto'>System warning</strong>
				<small>Just now</small>
			</Toast.Header>
			<Toast.Body>
				{messageLines.map((line, index) => (
					<React.Fragment key={index}>
						{line}
						<br />
					</React.Fragment>
				))}
				Job will not be sent
			</Toast.Body>
		</Toast>
	);
};

export default ToastComponent;
