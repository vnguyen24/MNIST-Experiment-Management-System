import React from 'react';
import { FormControl, InputLabel, Button, Input } from '@mui/material';
import Stack from '@mui/material/Stack';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import '../styling/Form.css';

const Form = ({
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
		<div className='form'>
			<div>
				<Stack direction='column'>
					<FormControl className='form-entry'>
						<InputLabel id='epochs'>Epoch</InputLabel>
						<Input
							id='epochs'
							value={epochs}
							type='number'
							inputProps={{ min: 1 }}
							onChange={(e) => {
								setEpochs(e.target.value);
							}}
						/>
					</FormControl>
					<FormControl className='form-entry'>
						<InputLabel id='lr'>Learning rate</InputLabel>
						<Input
							id='lr'
							value={lr}
							type='number'
							inputProps={{ min: 0, max: 1 }}
							step='0.001'
							onChange={(e) => {
								setLr(e.target.value);
							}}
						/>
					</FormControl>
					<FormControl className='form-entry'>
						<InputLabel id='size'>Batch Size</InputLabel>
						<Input
							id='size'
							value={size}
							type='number'
							inputProps={{ min: 1 }}
							onChange={(e) => {
								setSize(e.target.value);
							}}
						/>
					</FormControl>
				</Stack>
			</div>
			<div className='button-div'>
				<Button
					className='submit-button'
					onClick={submitJob}
					endIcon={<SendIcon />}
				>
					Add job
				</Button>
				<Button
					className='reset-button'
					onClick={resetFields}
					endIcon={<DeleteIcon />}
				>
					Discard
				</Button>
			</div>
		</div>
	);
};

export default Form;
