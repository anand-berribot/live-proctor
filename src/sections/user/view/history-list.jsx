import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
import { m } from 'framer-motion';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { _roles, _userList, USER_STATUS_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import UserTableRow from '../user-table-row';
import UserTableFiltersResult from '../user-table-filters-result';
import UserTableToolbar from '../toolbar';
import { Typography } from '@mui/material';
import CollapsibleTable from 'src/sections/_examples/mui/table-view/collapsible-table';
import { format } from 'date-fns';
import getVariant from 'src/sections/_examples/extra/animate-view/get-variant';
import { useAuthContext } from 'src/context/useAuthContext';
import { useRecruiterAuthContext } from 'src/context/recruiter-context/recruiter-context';

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'phoneNumber', label: 'Phone Number', width: 180 },
  { id: 'company', label: 'Company', width: 220 },
  { id: 'role', label: 'Role', width: 180 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  startDate: '',
  endDate: '',
};

export default function HistoryList() {
  const { recruiterLogout } = useRecruiterAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({ defaultCurrentPage: 0, defaultRowsPerPage: 5, defaultDense: false });

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.VITE_REACT_APP_PROCTOR_API_URL}mastermind/recruiter-view/get-scheduled-interview-filebased?page=${table.page + 1}&page_size=${table.rowsPerPage}&search_value=${filters.name}&start_date=${filters?.startDate || ''}&end_date=${filters.endDate || ''}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('recruiter-token')}`
        },
      });
      const result = await response.json();
      if (result.status === 'success') {
        setTableData(result);
      } else if (result?.msg == "Token has expired") {
        router.push('/login')
        recruiterLogout();
        enqueueSnackbar('Session Expired Login', { variant: 'warning', autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
      }
    } catch (err) {
      setError(err.message);
      enqueueSnackbar('An error occurred', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [table.page, table.rowsPerPage, filters]);

  // useEffect(() => {
  //   if(tableData?.data){
  //     console.log(tableData?.data, 'tableData111');
  //   dataFiltered
  // }
  // }, [tableData?.data]);

  const dataFiltered = applyFilter({
    inputData: tableData?.data || [],
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // console.log(dataFiltered, 'dataFiltered');
  return (
    <>
      <Container sx={{ mt: '1rem', mr: 2, mb: 2, width: '100%', minWidth: '100%' }}>
        <CustomBreadcrumbs
          // heading="History"
          links={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'History' }]}
        />
        <Card
          component={m.div} {...getVariant('fadeInRight')}
          sx={{ mt: 2 }}>
          <Typography variant="h4" sx={{ ml: 3, mt: 2 }}>List of Scheduled Interviews</Typography>

          <UserTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <CollapsibleTable
            tableData={dataFiltered || []}
            emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
            notFound={notFound}
            size={table.dense ? 'small' : 'medium'}
          />

          <TablePaginationCustom
            // count={tableData?.total || 0}
            count={tableData?.total}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  // console.log(inputData, 'inputData');
  const { name, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    return order !== 0 ? order : a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  // if (name) {
  //   inputData = inputData.filter((data) =>
  //     data?.file_name.toLowerCase().includes(name.toLowerCase())
  //   );
  // }

  // if (startDate && endDate) {
  //   const start = new Date(startDate);
  //   const end = new Date(endDate);
  //   inputData = inputData.filter((data) => {
  //     const date = new Date(data.created_date);
  //     return date >= start && date <= end;
  //   });
  // }
  // console.log(inputData, 'inputData2');
  return inputData;
}
// function applyFilter({ inputData, comparator, filters }) {
//   const { name, status, role } = filters;

//   const stabilizedThis = inputData.map((el, index) => [el, index]);

//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });

//   inputData = stabilizedThis.map((el) => el[0]);

//   if (name) {
//     inputData = inputData.filter(
//       (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
//     );
//   }

//   if (status !== 'all') {
//     inputData = inputData.filter((user) => user.status === status);
//   }

//   if (role.length) {
//     inputData = inputData.filter((user) => role.includes(user.role));
//   }

//   return inputData;
// }