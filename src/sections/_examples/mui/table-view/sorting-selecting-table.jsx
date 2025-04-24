import { useState, useEffect } from 'react';

import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

// ----------------------------------------------------------------------

function createData(id, job_description_id, title, skill_set_type, experience, mandate__skill, detailed_jd) {
  return { id, job_description_id, title, skill_set_type, experience, mandate__skill, detailed_jd };
}

const TABLE_DATA = [
  createData('1', 'JD001', 'Junior Software Engineer', 'Technical', '2-5 years', 'Python', 'Junior Software Engineer'),
  createData('2', 'JD002', 'Senior Software Engineer', 'Technical', '5-10 years', 'Python', 'Senior Software Engineer'),
  createData('3', 'JD003', 'Python Freshers', 'Technical', '0-1 years', 'Python', 'Python Freshers',),
];

const TABLE_HEAD = [
  { id: 'id', label: 'S.No', align: 'left' },
  { id: 'job_description_id', label: 'Job description Id', align: 'left' },
  { id: 'title', label: 'Title', align: 'left' },
  { id: 'skill_set_type', label: 'Skill set type', align: 'center' },
  { id: 'experience', label: 'Experience', align: 'center' },
  { id: 'mandate__skill', label: 'Mandate Skill', align: 'center' },
  // { id: 'detailed_jd', label: 'Detailed Job description', align: 'center' }
  { id: 'status', label: 'Status', align: 'center' }
];

// ----------------------------------------------------------------------

export default function SortingSelectingTable({ heading }) {
  const table = useTable({
    defaultOrderBy: 'calories',
  });

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(TABLE_DATA);
  }, []);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  const denseHeight = table.dense ? 34 : 34 + 20;

  return (
    <div>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{
        p: 0.5,
        m: 1
      }}>
        <Typography variant="h6">{heading}</Typography>

        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      </Stack>

      <TableContainer sx={{
        position: 'relative', overflow: 'unset',
        m: 2, width: 'auto'
      }}>
        <TableSelectedAction
          dense={table.dense}
          numSelected={table.selected.length}
          rowCount={tableData.length}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              tableData.map((row) => row.name)
            )
          }
          action={
            <Tooltip title="Delete">
              <IconButton color="primary">
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          }
        />

        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
            // onSelectAllRows={(checked) =>
            //   table.onSelectAllRows(
            //     checked,
            //     tableData.map((row) => row.name)
            //   )
            // }
            />

            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <TableRow
                    hover
                    key={row.name}
                  // onClick={() => table.onSelectRow(row.name)}
                  // selected={table.selected.includes(row.name)}
                  >
                    {/* <TableCell padding="checkbox">
                      <Checkbox checked={table.selected.includes(row.name)} />
                    </TableCell> */}
                    <TableCell> {row.id} </TableCell>
                    <TableCell> {row.job_description_id} </TableCell>
                    <TableCell >{row.title}</TableCell>
                    <TableCell align="center">{row.skill_set_type}</TableCell>
                    <TableCell align="center">{row.experience}</TableCell>
                    <TableCell align="center">{row.mandate__skill}</TableCell>
                    <TableCell align="center">{row.detailed_jd}</TableCell>
                  </TableRow>
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
              />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={dataFiltered.length}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        //
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </div>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
