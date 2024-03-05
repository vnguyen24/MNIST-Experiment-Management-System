import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import '../styling/DataTable.css';

const DataTable = ({ table, columns }) => {
	return (
		<div className='table-div'>
			<div className='table-headline'>Job History</div>
			{table.length !== 0 && (
				<DataGrid
					className='table'
					rows={table}
					columns={columns}
					getRowClassName={(params) => {
						if (params.indexRelativeToCurrentPage === 0) {
							return 'goldRow';
						} else if (params.indexRelativeToCurrentPage === 1) {
							return 'silverRow';
						} else if (params.indexRelativeToCurrentPage === 2) {
							return 'bronzeRow';
						}
						return '';
					}}
					pageSize={10}
					rowsPerPageOptions={[5, 10, 25]}
					initialState={{
						pagination: {
							pageSize: 10,
						},
					}}
				/>
			)}
		</div>
	);
};

export default DataTable;
