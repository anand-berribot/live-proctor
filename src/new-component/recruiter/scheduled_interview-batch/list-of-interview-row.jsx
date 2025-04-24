import PropTypes from 'prop-types';

import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fDateTime, fTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { Tooltip } from '@mui/material';
import { TableEmptyRows } from 'src/components/table';

// ----------------------------------------------------------------------

export default function ListOfInterviewRow({
    row,
    selected,
    onSelectRow,
    onViewRow,
    onEditRow,
    onDeleteRow,
    emptyRows,
    denseHeight,
    index
}) {



    // const { sent, invoiceNumber, createDate, dueDate, status, invoiceTo, totalAmount } = row;
    // const { first_name, last_name, email, interview_data } = row;

    const confirm = useBoolean();

    const popover = usePopover();
    // console.log(emptyRows);
    return (
        <>
            {row ?
                <TableRow hover selected={selected} >
                    <TableCell padding="checkbox">
                        <Checkbox checked={selected} onClick={onSelectRow} />
                    </TableCell>

                    <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* <Avatar alt={invoiceTo.name} sx={{ mr: 2 }}>
            {invoiceTo.name.charAt(0).toUpperCase()}

          </Avatar> */}

                        <ListItemText
                            disableTypography
                            primary={`${row?.first_name} ${row?.last_name}`}
                            secondary={<Typography variant='body2' sx={{color: 'text.secondary'}}>{`${row?.email}\n${row?.mobile_number}`}</Typography>}
                            // secondaryTypographyProps={{ typography: 'body2', color: 'text.secondary' }}
                            // sx={{secondaryTypographyProps: {color: 'text.secondary'}}}
                        // secondary={
                        //   <Link
                        //     noWrap
                        //     variant="body2"
                        //     onClick={onViewRow}
                        //     sx={{ color: 'text.disabled', cursor: 'pointer' }}
                        //   >
                        //     {invoiceTo.email}
                        //   </Link>
                        // }
                        />
                    </TableCell>

                    <TableCell>
                        <ListItemText
                            // primary={fDate(createDate)}
                            // secondary={fTime(createDate)}
                            primary={fDateTime(row?.interview_data?.scheduled_date)}
                            // secondary={fTime(interview_data?.scheduled_end_at)}
                            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                            secondaryTypographyProps={{
                                mt: 0.5,
                                component: 'span',
                                typography: 'caption',
                            }}
                        />
                    </TableCell>

                    <TableCell>
                        <ListItemText
                            // primary={fDate(dueDate)}
                            // secondary={fTime(dueDate)}
                            primary={fDateTime(row?.interview_data?.scheduled_end_at)}
                            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                            secondaryTypographyProps={{
                                mt: 0.5,
                                component: 'span',
                                typography: 'caption',
                            }}
                        />
                    </TableCell>
                    <TableCell>
                        {row?.interview_data?.job_role}
                    </TableCell>
                    <TableCell>
                        <Label
                            variant="soft"
                            color={
                                (row?.interview_data?.interview_status === 'Completed' && 'success') ||
                                (row?.interview_data?.interview_status === 'Pending' && 'warning') ||
                                (row?.interview_data?.interview_status === 'Ongoing' && 'info') ||
                                'default'
                            }
                        >
                            {row?.interview_data?.interview_status}
                        </Label>

                    </TableCell>
                    {/* <TableCell>{'True'}</TableCell> */}

                    {/* <TableCell align="center">{sent}</TableCell> */}

                    {/* <TableCell>
          <Label
            variant="soft"
            // color={
            //   (status === 'paid' && 'success') ||
            //   (status === 'pending' && 'warning') ||
            //   (status === 'overdue' && 'error') ||
            //   'default'
            // }
            color={'success'}
          >
            {'Completed'}
          </Label>
        </TableCell> */}

                    <TableCell sx={{ px: 1 }}>
                        <Tooltip title="Download Report">
                            <IconButton color="primary">
                                <Iconify icon="eva:download-outline" />
                            </IconButton>
                        </Tooltip>
                    </TableCell>

                </TableRow>
                : <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows}
                />
            }
            <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="right-top"
                sx={{ width: 160 }}
            >
                <MenuItem
                    onClick={() => {
                        onViewRow();
                        popover.onClose();
                    }}
                >
                    <Iconify icon="solar:eye-bold" />
                    View
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        onEditRow();
                        popover.onClose();
                    }}
                >
                    <Iconify icon="solar:pen-bold" />
                    Edit
                </MenuItem>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuItem
                    onClick={() => {
                        confirm.onTrue();
                        popover.onClose();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Delete
                </MenuItem>
            </CustomPopover>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={onDeleteRow}>
                        Delete
                    </Button>
                }
            />
        </>
    );
}

ListOfInterviewRow.propTypes = {
    onDeleteRow: PropTypes.func,
    onEditRow: PropTypes.func,
    onSelectRow: PropTypes.func,
    onViewRow: PropTypes.func,
    row: PropTypes.object,
    selected: PropTypes.bool,
};
