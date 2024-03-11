import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
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
	return (
		<div class='h-100 d-inline-block w-100 p-3 border border-black border-5'>
			<Form class='h-100 w-100'>
				<Form.Group class='my-3'>
					<Form.Label>Epochs</Form.Label>
					<Form.Control
						type='number'
						// placeholder='Epochs'
						value={epochs}
						min={1}
						onChange={(e) => {
							setEpochs(e.target.value);
						}}
					/>
				</Form.Group>
				<Form.Group class='my-3'>
					<Form.Label>Learning rate</Form.Label>
					<Form.Control
						type='number'
						// placeholder='Learning Rate'
						value={lr}
						min={0}
						max={1}
						onChange={(e) => {
							setLr(e.target.value);
						}}
					/>
				</Form.Group>
				<Form.Group class='my-3'>
					<Form.Label>Batch Size</Form.Label>
					<Form.Control
						type='number'
						// placeholder='Batch Size'
						value={size}
						min={1}
						onChange={(e) => {
							setSize(e.target.value);
						}}
					/>
				</Form.Group>
				<div className='button-container'>
					<Button className='submit-button' variant='light' onClick={submitJob}>
						<i class='bi bi-send-fill pe-2' />
						Add Job
					</Button>
					<Button
						className='reset-button'
						variant='light'
						onClick={resetFields}
					>
						<i class='bi bi-trash-fill pe-2'></i>
						Discard
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default SimpleForm;
