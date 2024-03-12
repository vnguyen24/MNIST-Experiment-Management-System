import React from 'react';
import Table from 'react-bootstrap/Table';
import '../styling/DataTable.css';

const DataTable = ({ table }) => {
	if (!table || table.length === 0) {
		return (
			<p className='text-center fs-1 fw-medium text-decoration-underline'>
				No data available!
			</p>
		);
	}

	const cleanData = table.map((item) => ({
		id: item._id.$oid,
		epochs: item.epochs,
		learning_rate: item.learning_rate,
		batch_size: item.batch_size,
		accuracy: item.accuracy,
		run_time: item.run_time,
	}));

	const getRowClass = (index) => {
		switch (index) {
			case 0:
				return 'gold';
			case 1:
				return 'silver';
			case 2:
				return 'bronze';
			default:
				return '';
		}
	};

	return (
		<div>
			<p className='title'>Top job configurations</p>
			<Table bordered hover>
				<thead>
					<tr>
						<th>Epochs</th>
						<th>Learning Rate</th>
						<th>Batch Size</th>
						<th>Accuracy (%)</th>
						<th>Run Time (seconds)</th>
					</tr>
				</thead>
				<tbody>
					{cleanData.map((row, index) => (
						<tr key={row.id}>
							<td className={getRowClass(index)}>{row.epochs}</td>
							<td className={getRowClass(index)}>{row.learning_rate}</td>
							<td className={getRowClass(index)}>{row.batch_size}</td>
							<td className={getRowClass(index)}>{row.accuracy}</td>
							<td className={getRowClass(index)}>{row.run_time}</td>
						</tr>
					))}
				</tbody>
			</Table>
		</div>
	);
};

export default DataTable;
