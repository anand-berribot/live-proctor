import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import EmptyContent from '../empty-content';

// ----------------------------------------------------------------------

export default function TableNoData({ notFound, sx, title='No Data Try Filters' }) {
  return (
    <TableRow>
      {notFound ? (
        <TableCell colSpan={12}>
          <EmptyContent
            filled
            title={title}
            sx={{
              py: 10,
              ...sx,
            }}
          />
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}

TableNoData.propTypes = {
  notFound: PropTypes.bool,
  sx: PropTypes.object,
};
