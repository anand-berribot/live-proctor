import sumBy from 'lodash/sumBy';
import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { isAfter, isBetween } from 'src/utils/format-time';

import { _invoices, INVOICE_SERVICE_OPTIONS } from 'src/_mock';

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

import InvoiceAnalytic from '../scheduled-interview-batch-analytic';
import InvoiceTableRow from '../scheduled-interview-batch-table-row';
import InvoiceTableToolbar from '../scheduled-interview-batch-table-toolbar';
import InvoiceTableFiltersResult from '../scheduled-interview-batch-table-filters-result';
import { TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'candidateDetails', label: 'Candidate details' },
  { id: 'scheduledDate', label: 'Scheduled Date' },
  { id: 'end_time', label: 'End Time' },
  // { id: 'pdf_report', label: 'Sent', align: 'center' },
  // { id: 'interview_status', label: 'Interview Status' },
  { id: 'action', label: 'Action' }
];

const defaultFilters = {
  name: '',
  // service: [],
  status: 'all',
  startDate: '',
  endDate: '',
};

// ----------------------------------------------------------------------

export default function InvoiceListView({ }) {
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();

  const settings = useSettingsContext();

  const router = useRouter();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const batchId = params.get('batch_id');

  const table = useTable({ defaultCurrentPage: 1, defaultRowsPerPage: 5, defaultDense: false });

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState('');


  const fetchData = async () => {
    // setLoading(true);
    // setError(null);
    try {
      // const response = await fetch(`${process.env.VITE_REACT_APP_PROCTOR_API_URL}humanless/get-scheduled-interview-filebased?page=1&page_size=20&search_value=vish&start_date=2024-06-23&end_date=2024-06-23`, {
      const response = await fetch(`${process.env.VITE_REACT_APP_PROCTOR_API_URL}humanless/get-scheduled-interview-list?page=${table.page}&page_size=${table.rowsPerPage}&search_value=${filters.name || ''}&start_date=${filters?.startDate || ''}&end_date=${filters.endDate || ''}&file_uploaded_id=${batchId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('recruiter-token')}`
        },
      }
      );
      const result = await response.json();
      if (result?.status === 'success') {
        console.log('DATA', result);
        setTableData(result?.data?.interview_data);
        setData(result)
      } else {
        enqueueSnackbar(result.message, { variant: 'error', autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
      }
    } catch (err) {
      setError(err.message);
      // enqueueSnackbar('An error occurred', {
      //   variant: 'error',
      //   anchorOrigin: { vertical: 'top', horizontal: 'right' },
      // });
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [table.page, table.rowsPerPage, filters]);

  const dataFiltered = applyFilter({
    inputData: tableData || [],
    comparator: getComparator(table.order, table.orderBy),
    filters,
    // dateError,
  });

  useEffect(() => {

    dataFiltered

  }, [tableData])

  const dateError = isAfter(filters.startDate, filters.endDate);



  // const dataInPage = dataFiltered.slice(
  //   table.page * table.rowsPerPage,
  //   table.page * table.rowsPerPage + table.rowsPerPage
  // );
  // console.log(dataFiltered, 'dataFiltered111', tableData)
  const dataInPage = dataFiltered;

  const denseHeight = table.dense ? 56 : 56 + 20;
  // const canReset = !!filters.name || !!filters.service.length || filters.status !== 'all' || (!!filters.startDate && !!filters.endDate);
  const canReset = !!filters.name || filters.status !== 'all' || (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

  // const getInvoiceLength = (status) => tableData.filter((item) => item.status === status).length;
  // const getTotalAmount = (status) => sumBy(tableData.filter((item) => item.status === status), 'totalAmount');
  // const getPercentByStatus = (status) => (getInvoiceLength(status) / tableData.length) * 100;

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: data?.total },
    {
      value: 'Un-attempted',
      label: 'Un-attempted',
      color: 'error',
      // count: getInvoiceLength('paid'),
    },
    {
      value: 'In-progress',
      label: 'In-progress',
      color: 'warning',
      // count: getInvoiceLength('pending'),
    },
    {
      value: 'Completed',
      label: 'Completed',
      color: 'success',
      // count: getInvoiceLength('overdue'),
    },
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

  // const handleDeleteRow = useCallback(
  //   (id) => {
  //     const deleteRow = tableData.filter((row) => row.id !== id);

  //     enqueueSnackbar('Delete success!');

  //     setTableData(deleteRow);

  //     table.onUpdatePageDeleteRow(dataInPage.length);
  //   },
  //   [dataInPage.length, enqueueSnackbar, table, tableData]
  // );

  // const handleDeleteRows = useCallback(() => {
  //   const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

  //   enqueueSnackbar('Delete success!');

  //   setTableData(deleteRows);

  //   table.onUpdatePageDeleteRows({
  //     totalRowsInPage: dataInPage.length,
  //     totalRowsFiltered: dataFiltered.length,
  //   });
  // }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

  // const handleEditRow = useCallback(
  //   (id) => {
  //     router.push(paths.dashboard.invoice.edit(id));
  //   },
  //   [router]
  // );

  // const handleViewRow = useCallback(
  //   (id) => {
  //     router.push(paths.dashboard.invoice.details(id));
  //   },
  //   [router]
  // );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );
  // console.log(dataInPage, 'dataInPage', tableData)
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Typography variant="h4" sx={{ my: 2 }}>List of Scheduled Interviews - Berribot_001</Typography>

        <Card
          sx={{
            mb: { xs: 3, md: 3 },
          }}
        >
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 4 }}
            >
              <InvoiceAnalytic
                title="Total"
                // total={data?.total}
                total={data?.data?.Completed + data?.data?.Ongoing + data?.data?.scheduled }
                // percent={80}
                // price={sumBy(tableData, 'totalAmount')}
                icon="solar:bill-list-bold-duotone"
                color={theme.palette.info.main}
              />

              <InvoiceAnalytic
                title="Completed"
                total={data?.data?.Completed}
                // total={getInvoiceLength('paid')}
                // percent={getPercentByStatus('paid')}
                // price={getTotalAmount('paid')}
                icon="solar:file-check-bold-duotone"
                color={theme.palette.success.main}
              />

              <InvoiceAnalytic
                // title="In-progress"
                title='On-Going'
                total={data?.data?.Ongoing}
                // total={getInvoiceLength('pending')}
                // percent={getPercentByStatus('pending')}
                // price={getTotalAmount('pending')}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.palette.warning.main}
              />

              <InvoiceAnalytic
                title='Scheduled'
                total={data?.data?.scheduled}
                // title="Un-attempted"
                // total={getInvoiceLength('pending')}
                // percent={getPercentByStatus('pending')}
                // price={getTotalAmount('overdue')}
                icon="solar:bell-bing-bold-duotone"
                color={theme.palette.error.main}
              />

              {/* <InvoiceAnalytic
                title="Draft"
                total={getInvoiceLength('draft')}
                percent={getPercentByStatus('draft')}
                price={getTotalAmount('draft')}
                icon="solar:file-corrupted-bold-duotone"
                color={theme.palette.text.secondary}
              /> */}
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <InvoiceTableToolbar
            filters={filters}
            onFilters={handleFilters}
          //
          // dateError={dateError}
          // serviceOptions={INVOICE_SERVICE_OPTIONS.map((option) => option.name)}
          />

          {canReset && (
            <InvoiceTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered?.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            {/* <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) => {
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                );
              }}
              action={
                <Stack direction="row">
                  <Tooltip title="Sent">
                    <IconButton color="primary">
                      <Iconify icon="iconamoon:send-fill" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download">
                    <IconButton color="primary">
                      <Iconify icon="eva:download-outline" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Print">
                    <IconButton color="primary">
                      <Iconify icon="solar:printer-minimalistic-bold" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            /> */}

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  // order={table.order}
                  // orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                // rowCount={dataFiltered?.length||0}
                // numSelected={table.selected.length}
                // onSort={table.onSort}
                // onSelectAllRows={(checked) =>
                //   table.onSelectAllRows(
                //     checked,
                //     dataFiltered.map((row) => row.id)
                //   )
                // }
                />
                {/* <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Candidate details</TableCell>
                    <TableCell align="right">Scheduled Date</TableCell>
                    <TableCell align="right">End Time</TableCell>
                    <TableCell align="right">Sent</TableCell>
                    <TableCell align="right">Interview Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead> */}

                <TableBody>
                  {
                    // dataFiltered
                    //   ?.slice(
                    //     table.page * table.rowsPerPage,
                    //     table.page * table.rowsPerPage + table.rowsPerPage
                    //   )?.length > 0 &&
                    dataInPage?.length > 0 &&
                    dataInPage.map((row) => (
                      <InvoiceTableRow
                        key={row.id}
                        row={row}
                        // selected={table.selected.includes(row.id)}
                        // onSelectRow={() => table.onSelectRow(row.id)}
                        // onViewRow={() => handleViewRow(row.id)}
                        // onEditRow={() => handleEditRow(row.id)}
                        // onDeleteRow={() => handleDeleteRow(row.id)}
                        emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered?.length)}
                        denseHeight={denseHeight}
                      />
                    ))
                  }

                  {notFound && <TableNoData notFound={notFound} />}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            // count={dataFiltered?.length}
            count={data?.total}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
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
            {/* Are you sure want to delete <strong> {table.selected.length} </strong> items? */}
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              // handleDeleteRows();
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

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, status, service, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (data) => data?.file_name.toLowerCase() === name.toLowerCase()
      // (invoice) =>
      //   invoice.invoiceNumber.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
      //   invoice.invoiceTo.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  // if (status !== 'all') {
  //   inputData = inputData.filter((invoice) => invoice.status === status);
  // }

  // if (service.length) {
  //   inputData = inputData.filter((invoice) =>
  //     invoice.items.some((filterItem) => service.includes(filterItem.service))
  //   );
  // }

  // if (!dateError) {

  // if (startDate && endDate) {
  //   // inputData = inputData.filter((invoice) => isBetween(invoice.createDate, startDate, endDate));
  //   inputData = inputData.filter(
  //     (data) => new Date(data.created_date) >= new Date(startDate) && new Date(data.created_date) <= new Date(endDate)

  //     // (data) => isBetween(new Date(data.created_date) >= new Date(startDate) && new Date(data.created_date) <= new Date(endDate))
  //   );
  // }
  // }

  if (startDate && endDate) {
    inputData = inputData.filter(
      (data) => new Date(data.created_date) >= new Date(startDate) && new Date(data.created_date) <= new Date(endDate)
    );
  }

  return inputData;
}
