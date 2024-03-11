import React from 'react';
import Table from 'react-bootstrap/Table';
import '../styling/DataTable.css';

const DataTable = ({ table, columns }) => {
	if (!table || table.length === 0) {
		return <div>No data available!</div>;
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
		}
	};

	return (
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
					<tr key={row.id} className={getRowClass(index)}>
						<td>{row.epochs}</td>
						<td>{row.learning_rate}</td>
						<td>{row.batch_size}</td>
						<td>{row.accuracy}</td>
						<td>{row.run_time}</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
};

export default DataTable;
