import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Pagination as MuiPagination,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { setPagination } from '../../features/characters/charactersSlice';

const ModernPaginationCard = styled(Paper)(({ theme }) => ({
  background: theme.palette.mode === 'light' 
    ? 'rgba(255, 255, 255, 0.9)' 
    : 'rgba(22, 27, 46, 0.9)',
  backdropFilter: 'blur(20px)',
  border: theme.palette.mode === 'light'
    ? '1px solid rgba(5, 150, 105, 0.2)'
    : '1px solid rgba(0, 229, 160, 0.2)',
  borderRadius: '20px',
  marginBottom: '24px',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: theme.palette.mode === 'light'
    ? '0 8px 25px rgba(0, 0, 0, 0.08)'
    : '0 8px 32px rgba(0, 0, 0, 0.25)',
}));

const Pagination = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isVerySmall = useMediaQuery('(max-width:425px)');
  
  const { 
    pagination: { currentPage, totalPages },
    characters 
  } = useSelector((state) => state.characters);

  const handlePageChange = (event, page) => {
    dispatch(setPagination({ currentPage: page }));
  };

  if (totalPages <= 1) return null;

  return (
    <Fade in={true} timeout={800}>
      <ModernPaginationCard elevation={3} sx={{ 
        p: isVerySmall ? 2 : (isMobile ? 3 : 3),
        mt: 3,
      }}>
        {isMobile ? (
          // Mobile Layout - Stack vertically with centered pagination
          <Box display="flex" flexDirection="column" alignItems="center" gap={isVerySmall ? 1.5 : 2}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#B8C5D6',
                textAlign: 'center',
                fontSize: isVerySmall ? '12px' : '14px',
                lineHeight: 1.3,
                background: 'linear-gradient(135deg, #00E5A0 0%, #00D4FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 600,
              }}
            >
              Page {currentPage} of {totalPages}
              {characters.length > 0 && (
                <br />
              )}
              {characters.length > 0 && (
                isVerySmall 
                  ? `${characters.length} chars (20/page)`
                  : `Showing ${characters.length} characters (20 per page)`
              )}
            </Typography>
            
            <MuiPagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="small"
              showFirstButton={!isVerySmall}
              showLastButton={!isVerySmall}
              siblingCount={isVerySmall ? 0 : 1}
              boundaryCount={1}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                '& .MuiPagination-ul': {
                  flexWrap: 'nowrap',
                  justifyContent: 'center',
                  gap: isVerySmall ? '2px' : '4px',
                },
                '& .MuiPaginationItem-root': {
                  color: '#B8C5D6',
                  borderColor: 'rgba(0, 229, 160, 0.3)',
                  minWidth: isVerySmall ? '28px' : '32px',
                  height: isVerySmall ? '28px' : '32px',
                  fontSize: isVerySmall ? '12px' : '14px',
                  margin: isVerySmall ? '0 1px' : '0 2px',
                  padding: isVerySmall ? '4px' : '6px',
                  borderRadius: '8px',
                  background: 'rgba(22, 27, 46, 0.6)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00E5A0 0%, #00D4FF 100%)',
                    color: '#0B0D17',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 229, 160, 0.3)',
                  },
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #00E5A0 0%, #00D4FF 100%)',
                    color: '#0B0D17',
                    fontWeight: 700,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4FFFC4 0%, #5DDDFF 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(0, 229, 160, 0.4)',
                    },
                  },
                },
                '& .MuiPaginationItem-ellipsis': {
                  color: '#A2DCDD',
                  fontSize: isVerySmall ? '10px' : '12px',
                },
                '& .MuiPaginationItem-icon': {
                  fontSize: isVerySmall ? '16px' : '18px',
                },
              }}
            />
          </Box>
        ) : (
          // Desktop Layout - Keep horizontal layout
          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
            gap={2}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#B8C5D6',
                fontSize: isTablet ? '14px' : '16px',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #00E5A0 0%, #00D4FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Page {currentPage} of {totalPages} 
              {characters.length > 0 && (
                ` - showing ${characters.length} characters (20 per page)`
              )}
            </Typography>
            
            <MuiPagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size={isTablet ? "small" : "medium"}
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#B8C5D6',
                  borderColor: 'rgba(0, 229, 160, 0.3)',
                  minWidth: isTablet ? '34px' : '36px',
                  height: isTablet ? '34px' : '36px',
                  fontSize: isTablet ? '14px' : '14px',
                  borderRadius: '12px',
                  background: 'rgba(22, 27, 46, 0.6)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00E5A0 0%, #00D4FF 100%)',
                    color: '#0B0D17',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 229, 160, 0.3)',
                  },
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #00E5A0 0%, #00D4FF 100%)',
                    color: '#0B0D17',
                    fontWeight: 700,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4FFFC4 0%, #5DDDFF 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(0, 229, 160, 0.4)',
                    },
                  },
                },
                '& .MuiPaginationItem-ellipsis': {
                  color: '#64DFDF',
                  fontSize: isTablet ? '12px' : '14px',
                },
                '& .MuiPaginationItem-icon': {
                  fontSize: isTablet ? '18px' : '20px',
                },
              }}
            />
          </Box>
        )}
      </ModernPaginationCard>
    </Fade>
  );
};

export default Pagination;
