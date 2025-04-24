import React, { useState, useCallback, useEffect } from 'react';
import {
  Tab, Tabs, Card, Table, Stack, Button, Divider, Tooltip, Container,
  TableBody, IconButton, TableCell, TableHead, TableRow, Typography, TableContainer
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useRouter } from 'src/routes/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable, emptyRows, TableNoData, getComparator, TablePaginationCustom
} from 'src/components/table';
import Scrollbar from 'src/components/scrollbar';
import InvoiceAnalytic from '../scheduled-interview-batch-analytic';
import InvoiceTableRow from '../scheduled-interview-batch-table-row';
import InvoiceTableToolbar from '../scheduled-interview-batch-table-toolbar';
import InvoiceTableFiltersResult from '../scheduled-interview-batch-table-filters-result';
import { isAfter } from 'date-fns';

const TABLE_HEAD = [
  { id: 'candidateDetails', label: 'Candidate details' },
  { id: 'scheduledDate', label: 'Scheduled Date' },
  { id: 'end_time', label: 'End Time' },
  { id: 'pdf_report', label: 'Sent', align: 'center' },
  { id: 'interview_status', label: 'Interview Status' },
  { id: 'action', label: 'Action' }
];

const defaultFilters = {
  name: '',
  status: 'all',
  startDate: '',
  endDate: '',
};

export default function InvoiceListView() {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const settings = useSettingsContext();
  const router = useRouter();

  const table = useTable({ defaultCurrentPage: 1, defaultRowsPerPage: 10, defaultDense: false });
  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.VITE_REACT_APP_PROCTOR_API_URL}humanless/get-scheduled-interview-list?page=${table.page}&page_size=${table.rowsPerPage}&search_value=${filters.name || ''}&start_date=${filters.startDate || ''}&end_date=${filters.endDate || ''}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('recruiter-token')}`
        },
      });
      const result = await response.json();
      if (result?.status === 'success') {
        console.log('DATA', result);
        setTableData(result?.data?.interview_data || []);
      } else {
        enqueueSnackbar(result.message, { variant: 'error', autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [table.page, table.rowsPerPage, filters]);

  const dateError = isAfter(filters.startDate, filters.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  // const dataInPage = dataFiltered.slice(
  //   table.page * table.rowsPerPage,
  //   table.page * table.rowsPerPage + table.rowsPerPage
  // );
const dataInPage = dataFiltered;

  const denseHeight = table.dense ? 56 : 56 + 20;
  const canReset = !!filters.name || filters.status !== 'all' || (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: tableData.length },
    { value: 'Un-attempted', label: 'Un-attempted', color: 'error' },
    { value: 'In-progress', label: 'In-progress', color: 'warning' },
    { value: 'Completed', label: 'Completed', color: 'success' },
  ];

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

  console.log('tableData', tableData);
  console.log('dataFiltered', dataFiltered);
  console.log('dataInPage', dataInPage);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Typography variant="h4" sx={{ my: 2 }}>List of Scheduled Interviews - Berribot_001</Typography>

        <Card sx={{ mb: { xs: 3, md: 3 } }}>
          <Scrollbar>
            <Stack direction="row" divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />} sx={{ py: 4 }}>
              <InvoiceAnalytic title="Total" percent={80} icon="solar:bill-list-bold-duotone" color={theme.palette.info.main} />
              <InvoiceAnalytic title="Completed" icon="solar:file-check-bold-duotone" color={theme.palette.success.main} />
              <InvoiceAnalytic title="In-progress" icon="solar:sort-by-time-bold-duotone" color={theme.palette.warning.main} />
              <InvoiceAnalytic title="Un-attempted" icon="solar:bell-bing-bold-duotone" color={theme.palette.error.main} />
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
          <Tabs
            value={filters.status}
            onChange={(event, newValue) => handleFilters('status', newValue)}
            sx={{ px: 2.5, boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}` }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={<Label variant={(tab.value === 'all' || tab.value === filters.status) ? 'filled' : 'soft'} color={tab.color}>{tab.count}</Label>}
              />
            ))}
          </Tabs>

          <InvoiceTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <InvoiceTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Candidate details</TableCell>
                    <TableCell align="right">Scheduled Date</TableCell>
                    <TableCell align="right">End Time</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {dataInPage.map((row) => (
                    <InvoiceTableRow
                      key={row.id}
                      row={row}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                      denseHeight={denseHeight}
                    />
                  ))}
                  {notFound && <TableNoData notFound={notFound} />}
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
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        action={
          <Button variant="contained" color="error" onClick={() => confirm.onFalse()}>
            Delete
          </Button>
        }
      >
        Are you sure you want to delete?
      </ConfirmDialog>
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  let data = inputData;

  if (filters.name) {
    data = data.filter(
      (item) => item.candidate_name.toLowerCase().includes(filters.name.toLowerCase())
    );
  }

  if (filters.status !== 'all') {
    data = data.filter((item) => item.status === filters.status);
  }

  if (filters.startDate && filters.endDate) {
    data = data.filter(
      (item) =>
        new Date(item.scheduled_date) >= new Date(filters.startDate) &&
        new Date(item.scheduled_date) <= new Date(filters.endDate)
    );
  }

  if (comparator) {
    data = data.sort(comparator);
  }

  return data;
}
