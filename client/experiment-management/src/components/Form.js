import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ToastComponent from './Toast';
import '../styling/Form.css';

const SimpleForm = ({
	epochs,
	lr,
	size,
	setEpochs,
	setLr,
	setSize,
	submitJob,
	resetFields,
}) => {
	const [showToast, setShowToast] = useState(false);
	const [message, setMessage] = useState('');
	const isInteger = (str) => {
		return /^\d+$/.test(str);
	};

	const healthCheck = () => {
		let warning = '';
		let flag = true;
		if (epochs === '' || lr === '' || size === '') {
			warning += '- Form cannot be empty\n';
			return { warning: warning, flag: false };
		}
		if (!isInteger(epochs)) {
			warning += '- Epochs must be a positive integer\n';
			return { warning: warning, flag: false };
		}
		if (!isInteger(size)) {
			warning += 'Batch size must be a positive integer\n';
			return { warning: warning, flag: false };
		}
		const intEpoch = parseInt(epochs);
		const floatLr = parseFloat(lr);
		const intSize = parseInt(size);

		if (intEpoch < 1) {
			warning += '- Epochs must be at least 1\n';
			flag = false;
		} else if (intEpoch > 20) {
			warning +=
				'- To avoid jamming the system, we limit the epochs at 20 :)\n';
			flag = false;
		}

		if (floatLr <= 0 || floatLr > 1) {
			warning +=
				'- Learning rate must be between 0 and 1 (strictly greater than 0)\n';
			flag = false;
		}

		if (intSize < 1) {
			warning += '- Batch size must be at least 1\n';
			flag = false;
		} else if (intSize > 512) {
			warning +=
				'- To avoid jamming the system, we limit the batch size at 512 :)\n';
			flag = false;
		}

		return { warning: warning, flag: flag };
	};

	const handleFormSubmit = (event) => {
		event.preventDefault();
		const { warning, flag } = healthCheck();
		if (flag) {
			submitJob();
		} else {
			setMessage(warning);
			setShowToast(true);
			console.log('health check failed!');
		}
	};

	return (
		<div className='h-100 d-inline-block w-100 p-3 border border-black border-5'>
			<div>
				<Form className='h-100 w-100'>
					<Form.Group className='my-3'>
						<Form.Label>Epochs</Form.Label>
						<Form.Control
							type='number'
							value={epochs}
							min={1}
							onChange={(e) => {
								setEpochs(e.target.value);
							}}
						/>
					</Form.Group>
					<Form.Group className='my-3'>
						<Form.Label>Learning rate</Form.Label>
						<Form.Control
							type='number'
							value={lr}
							min={0}
							max={1}
							onChange={(e) => {
								setLr(e.target.value);
							}}
						/>
					</Form.Group>
					<Form.Group className='my-3'>
						<Form.Label>Batch Size</Form.Label>
						<Form.Control
							type='number'
							value={size}
							min={1}
							onChange={(e) => {
								setSize(e.target.value);
							}}
						/>
					</Form.Group>
					<div className='button-container'>
						<Button
							className='submit-button'
							variant='light'
							onClick={handleFormSubmit}
						>
							<i className='bi bi-send-fill pe-2' />
							Add Job
						</Button>
						<Button
							className='reset-button'
							variant='light'
							onClick={resetFields}
						>
							<i className='bi bi-trash-fill pe-2'></i>
							Discard
						</Button>
					</div>
				</Form>
			</div>
			<div className='mt-2'>
				<ToastComponent
					showToast={showToast}
					setShowToast={setShowToast}
					message={message}
				/>
			</div>
		</div>
	);
};

export default SimpleForm;
