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
import { Switch } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import { JobDetails } from 'src/pages/recruiter/jd/jd-table/jd-detail-modal';
import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from 'src/context/useAuthContext';

// ----------------------------------------------------------------------

const tableHead = [
  // { id: 'id', label: 'S.No', align: 'left' },
  { id: 'client_det_id', label: 'JD ID', align: 'left' },
  // { id: 'client_det_id', label: 'JD Id', align: 'left' },
  { id: 'job_title', label: 'Job Title', align: 'left' },
  { id: 'skill_type', label: 'Skill Type', align: 'center' },
  // { id: 'experience', label: 'Experience', align: 'center' },
  // { id: 'evaluation_topics', label: 'Skills', align: 'center' },
  { id: 'evaluation_topics', label: 'Mandate Skill', align: 'center' },
  // { id: 'company_id', label: 'Company ID', align: 'center' },
  { id: 'is_active', label: 'Status', align: 'center' }
];

// ----------------------------------------------------------------------

export default function JdList({ heading }) {
  const { logout } = useAuthContext();

  const router = useRouter();
  const table = useTable({
    defaultOrderBy: 'client_det_id', defaultCurrentPage: 0, defaultRowsPerPage: 5, defaultDense: false
  });
  const detailView = useBoolean(false)
  const [data, setData] = useState('');
  const [tableData, setTableData] = useState([]);
  const [detailPageData, setDetailPageData] = useState('');
  const [detailPageLoading, setDetailPageLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState('');

  const fetchData = async () => { 
    const company_id = JSON.parse(localStorage.getItem('recruiter-user'))?.company_id;
    const user_id = JSON.parse(localStorage.getItem('recruiter-user'))?.user_id;
    try {
      // const response = await fetch(`${process.env.VITE_REACT_APP_PROCTOR_API_URL}humanless/get-scheduled-interview-filebased?page=1&page_size=20&search_value=vish&start_date=2024-06-23&end_date=2024-06-23`, {

      const response = await fetch(`${process.env.VITE_REACT_APP_API_URL}get_all_job_description?company_id=${company_id}&user_id=${user_id}&page=${table.page + 1}&page_size=${table.rowsPerPage}`, {

        // const response = await fetch(`${process.env.VITE_REACT_APP_API_URL}get_all_job_description?company_id=${id}&skip=${0}&limit=${table.rowsPerPage}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('recruiter-token')}`
        },
      }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      if (result?.msg == "Token has expired") {
        router.push('/login')
        logout();
        enqueueSnackbar('Session Expired Login', { variant: 'warning', autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
      } else {
        // if (result.status === 'success') {
        // console.log(result, ' jd list')
        setData(result)
        setTableData(result?.job_descriptions);
        // }
      }
    } catch (err) {
      setError(err.message);
      enqueueSnackbar('An error occurred', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    } finally {
    }
  };

  useEffect(() => {
    fetchData();
  }, [table.page, table.rowsPerPage, filters]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  const denseHeight = table.dense ? 34 : 34 + 20;

  const statusUpdate = async (id) => {
    try {
      const response = await fetch(`${process.env.VITE_REACT_APP_API_URL}update_is_active?job_description_id=${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('recruiter-token')}`
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      if (result?.msg == "Token has expired") {
        router.push('/login')
        logout();
        enqueueSnackbar('Session Expired Login', { variant: 'warning', autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
      } else {
        fetchData();
      }
    } catch (err) {
      enqueueSnackbar('An error occurred', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    } finally {
      setLoading(false);
    }
  }

  const detailPage = async (id) => {
    setDetailPageLoading(true)
    try {
      const response = await fetch(`${process.env.VITE_REACT_APP_API_URL}get_job_description_by_id/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('recruiter-token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      if (result.status == 'success') {
        setDetailPageData(result?.data)
        detailView.onTrue();
        setDetailPageLoading(false)
      } else if (result?.msg == "Token has expired") {
        router.push('/login')
        logout();
        enqueueSnackbar('Session Expired Login', { variant: 'warning', autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
      }
    } catch (err) {
      enqueueSnackbar('An error occurred', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      setDetailPageLoading(false)
    }
  }
  const detailViewClose = () => {
    detailView.onFalse();
    setDetailPageData('')
  }
  // console.log(detailView.value, 'detailView')
  return (
    <div>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 0.5, m: 2 }}>
        <Typography variant="h6">{heading}</Typography>

        {/* <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip> */}
      </Stack>

      <TableContainer sx={{
        position: 'relative', overflow: 'unset',
        m: 2, width: 'auto'
      }}>
        {/* <TableSelectedAction
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
        /> */}

        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={tableHead}
              rowCount={tableData.length}
            // numSelected={table.selected.length}
            // onSort={table.onSort}
            // onSelectAllRows={(checked) =>
            //   table.onSelectAllRows(
            //     checked,
            //     tableData.map((row) => row.name)
            //   )
            // }
            />

            <TableBody>
              {
                // tableData.length ? tableData.map((row) => (
                dataFiltered.length ? dataFiltered.map((row) => (
                  // .slice(
                  //   table.page * table.rowsPerPage,
                  //   table.page * table.rowsPerPage + table.rowsPerPage
                  // ).map((row) => (
                  <TableRow
                    hover
                    key={row?.id}
                  // onClick={() => table.onSelectRow(row.name)}
                  // selected={table.selected.includes(row.name)}
                  >
                    {/* <TableCell padding="checkbox">
                      <Checkbox checked={table.selected.includes(row.name)} />
                    </TableCell> */}
                    <TableCell />
                    <TableCell>{row?.client_det_id}</TableCell>
                    <TableCell align="left" ><Typography color={'primary'} sx={{ cursor: 'pointer' }} onClick={() => detailPage(row?.id)}> {row?.job_title}</Typography> </TableCell>
                    <TableCell align="center">{row?.skill_type}</TableCell>
                    <TableCell align="center">{row?.evaluation_topics}</TableCell>
                    {/* <TableCell align="center">{row?.company_id}</TableCell> */}
                    {/* <TableCell align="center">{row.mandate__skill}</TableCell> */}
                    <TableCell align="center"><Switch checked={row?.is_active} onChange={() => statusUpdate(row?.id)} /></TableCell>
                  </TableRow>
                ))
                  : <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />
              }


            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={data?.total_count || 0}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        //
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />

      <JobDetails
        open={detailView.value}
        onClose={detailViewClose}
        jobDetails={detailPageData}
        loading={detailPageLoading}
      />
    </div>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator }) {
  if (!Array.isArray(inputData)) return [];
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}