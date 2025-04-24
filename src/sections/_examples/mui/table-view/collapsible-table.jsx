import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import createData from './utils';
import { Grid, LinearProgress, Stack, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Link } from 'react-router-dom';
import DonutChart from 'src/pages/recruiter/charts/donut-chart';
import { fPercent } from 'src/utils/format-number';
import { TableEmptyRows, TableNoData } from 'src/components/table';

// ----------------------------------------------------------------------


export default function CollapsibleTable({ tableData, emptyRows, notFound, size }) {
  const navigate = useNavigate();


  // console.log(tableData, 'collapsible table',size)
  return (
    <TableContainer sx={{ mt: 2, overflow: 'auto' }}>
      <Scrollbar>
        <Table size={size} sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Batch Name</TableCell>
              {/* <TableCell align="right">Created Date</TableCell> */}
              <TableCell align="center">Total initiated</TableCell>
              {/* <TableCell align="right">Un-attempted</TableCell> */}
              {/* <TableCell align="right">In-progress</TableCell> */}
              <TableCell align="center">Completed</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tableData?.length ? tableData.map((row) => (
              <CollapsibleTableRow key={row?.uploaded_id} row={row} />
            )) :
              <TableEmptyRows
                // height={denseHeight}
                emptyRows={emptyRows}
              />}
          </TableBody>
          {notFound && <TableNoData notFound={notFound} />}
        </Table>
      </Scrollbar>
    </TableContainer>
  );
}

// ----------------------------------------------------------------------

export function CollapsibleTableRow({ row }) {
  const navigate = useNavigate();
  const collapsible = useBoolean();
  const statusCounts = row?.interview_status.reduce((acc, status) => {
    acc[status.status] = (acc[status.status] || 0) + status.count;
    return acc;
  }, {});
  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            size="small"
            color={collapsible.value ? 'inherit' : 'default'}
            onClick={collapsible.onToggle}
          >
            <Iconify
              icon={collapsible.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            />
          </IconButton>
        </TableCell>

        <TableCell component="th" scope="row">
          {row?.file_name}
        </TableCell>

        {/* <TableCell align="right" >{row?.created_date}</TableCell>  */}
        <TableCell align="center">{row?.total_entries}</TableCell>
        {/* <TableCell align="right">{row?.ignored_entries}</TableCell> */}
        {/* <TableCell align="right">{row.in_progress}</TableCell> */}
        <TableCell align="center">{row?.processed_entries}</TableCell>
        <TableCell align="right">
          <Tooltip title="Detailed report" placement="top" arrow>
            <IconButton color={false ? 'inherit' : 'default'}
              //  href='/dashboard/scheduled-interview-batch-list?batch_id=HJSX123HJSX'
              onClick={() => navigate(`/dashboard/history/scheduled-interview-batch-list?batch_id=${row?.uploaded_id}`, { state: row?.file_name })}
            // href={`/dashboard/history/scheduled-interview-batch-list?batch_id=${row?.uploaded_id}`}
            >
              <Iconify icon="material-symbols-light:view-list-sharp" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell sx={{ py: 0 }} colSpan={8}>
          <Collapse in={collapsible.value} unmountOnExit>
            <Paper
              variant="outlined"
              sx={{
                py: 2,
                borderRadius: 1.5,
                ...(collapsible.value && {
                  boxShadow: (theme) => theme.customShadows.z20,
                }),
                height: '12rem',
                display: 'flex',
                direction: 'row',
                // overflowY: 'auto'
                // alignItems:'center',
              }}
            >
              {/* <Typography variant="h6" sx={{ m: 2, mt: 0 }}>
                History
              </Typography> */}
              {/* <Grid xs={12} md={6} lg={4}> */}
              {row?.interview_status?.length ?
                <DonutChart
                  //  title="Current Download"
                  chart={{
                    series: [
                      { label: 'Completed', value: statusCounts['Completed'] || 0 },
                      { label: 'Ongoing', value: statusCounts['Ongoing'] || 0 },
                      { label: 'Scheduled', value: statusCounts['scheduled'] || 0 },
                      // { label: 'Deleted', value: statusCounts['Deleted'] || 0 },
                    ],
                  }}
                //  sx={{ maxHeight: 100,maxWidth:100}}
                /> : null}

              {/* <Stack spacing={1}>
      <Stack direction="row" alignItems="center">
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          {progress.label}
        </Typography>

        <Typography variant="subtitle2">{fCurrency(progress.totalAmount)}</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          &nbsp;({fPercent(progress.value)})
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progress.value}
        color={
          (progress.label === 'Total Income' && 'info') ||
          (progress.label === 'Total Expenses' && 'warning') ||
          'primary'
        }
      />
    </Stack> */}
              {/* </Grid> */}
              {/* <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Candidate Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Skill</TableCell>
                    <TableCell>Proctoring</TableCell>
                    <TableCell>Hiring Status</TableCell> 
                  </TableRow>
                </TableHead>

                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.candidate_id}>
                      <TableCell component="th" scope="row"> {historyRow.candidate_name} </TableCell>
                      <TableCell>{historyRow.date}</TableCell>
                      <TableCell >{historyRow.skill}</TableCell>
                      <TableCell >{historyRow.proctoring}</TableCell>
                      <TableCell >{historyRow.hiring_status}</TableCell> 
                    </TableRow>
                  ))}
                </TableBody>
              </Table> */}
            </Paper>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

CollapsibleTableRow.propTypes = {
  row: PropTypes.object,
};
