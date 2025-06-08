import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';

/**
 * PaginationControl Component
 * Provides pagination controls and page size selection for character table
 * Features: Page navigation, page size selection, responsive design
 */
const PaginationControl = ({
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Available page size options
  const pageSizeOptions = [10, 20, 50];

  // Calculate current showing range
  const startIndex = ((currentPage - 1) * pageSize) + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  /**
   * Handle page size change
   * @param {Object} event - Select change event
   */
  const handlePageSizeChange = (event) => {
    const newPageSize = event.target.value;
    onPageSizeChange(newPageSize);
  };

  /**
   * Handle page number change
   * @param {Object} event - Pagination change event
   * @param {number} page - New page number
   */
  const handlePageChange = (event, page) => {
    onPageChange(page);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: 2,
        p: 2,
        background: theme.palette.mode === 'light'
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)'
          : 'linear-gradient(135deg, rgba(22, 27, 46, 0.9) 0%, rgba(31, 41, 55, 0.9) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        border: theme.palette.mode === 'light'
          ? '1px solid rgba(5, 150, 105, 0.1)'
          : '1px solid rgba(0, 229, 160, 0.1)',
        mb: 2,
      }}
    >
      {/* Left side - Results info and page size selector */}
      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={2}
        alignItems={isMobile ? 'stretch' : 'center'}
        sx={{ flex: 1 }}
      >
        {/* Results count */}
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: '14px',
            fontWeight: 500,
            textAlign: isMobile ? 'center' : 'left',
          }}
        >
          Showing {startIndex}-{endIndex} of {totalCount} characters
        </Typography>

        {/* Page size selector */}
        <FormControl
          size="small"
          sx={{
            minWidth: isMobile ? '100%' : 120,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '& fieldset': {
                borderColor: theme.palette.mode === 'light'
                  ? 'rgba(5, 150, 105, 0.2)'
                  : 'rgba(0, 229, 160, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: theme.palette.mode === 'light'
                  ? 'rgba(5, 150, 105, 0.4)'
                  : 'rgba(0, 229, 160, 0.4)',
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.mode === 'light'
                  ? '#059669'
                  : '#00E5A0',
              },
            },
            '& .MuiInputLabel-root': {
              color: theme.palette.text.secondary,
              '&.Mui-focused': {
                color: theme.palette.mode === 'light'
                  ? '#059669'
                  : '#00E5A0',
              },
            },
          }}
        >
          <InputLabel id="page-size-select-label">Per Page</InputLabel>
          <Select
            labelId="page-size-select-label"
            value={pageSize}
            label="Per Page"
            onChange={handlePageSizeChange}
            MenuProps={{
              PaperProps: {
                sx: {
                  background: theme.palette.mode === 'light'
                    ? 'rgba(255, 255, 255, 0.95)'
                    : 'rgba(22, 27, 46, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: theme.palette.mode === 'light'
                    ? '1px solid rgba(5, 150, 105, 0.1)'
                    : '1px solid rgba(0, 229, 160, 0.1)',
                },
              },
            }}
          >
            {pageSizeOptions.map((option) => (
              <MenuItem 
                key={option} 
                value={option}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light'
                      ? 'rgba(5, 150, 105, 0.1)'
                      : 'rgba(0, 229, 160, 0.1)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'light'
                      ? 'rgba(5, 150, 105, 0.2)'
                      : 'rgba(0, 229, 160, 0.2)',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'light'
                        ? 'rgba(5, 150, 105, 0.3)'
                        : 'rgba(0, 229, 160, 0.3)',
                    },
                  },
                }}
              >
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Right side - Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end' }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            size={isMobile ? 'small' : 'medium'}
            sx={{
              '& .MuiPaginationItem-root': {
                color: theme.palette.text.primary,
                borderColor: theme.palette.mode === 'light'
                  ? 'rgba(5, 150, 105, 0.2)'
                  : 'rgba(0, 229, 160, 0.2)',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(5, 150, 105, 0.1)'
                    : 'rgba(0, 229, 160, 0.1)',
                  borderColor: theme.palette.mode === 'light'
                    ? 'rgba(5, 150, 105, 0.4)'
                    : 'rgba(0, 229, 160, 0.4)',
                },
                '&.Mui-selected': {
                  backgroundColor: theme.palette.mode === 'light'
                    ? '#059669'
                    : '#00E5A0',
                  color: '#FFFFFF',
                  borderColor: theme.palette.mode === 'light'
                    ? '#059669'
                    : '#00E5A0',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light'
                      ? '#047857'
                      : '#00D4AA',
                  },
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

// PropTypes for type checking
PaginationControl.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
};

export default PaginationControl; 