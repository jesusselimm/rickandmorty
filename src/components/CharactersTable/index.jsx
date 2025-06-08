import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Chip,
  useMediaQuery,
  useTheme,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Services and Redux
import { getCharacters } from '../../services/api';
import {
  setCharacters,
  setSelectedCharacter,
  setLoading,
  setError,
  setPagination,
} from '../../features/characters/charactersSlice';

/**
 * Styled component for modern table card container
 * Provides a clean, borderless appearance with rounded corners
 */
const ModernTableCard = styled(Paper)(({ theme }) => ({
  background: 'transparent',
  border: 'none',
  borderRadius: '12px',
  marginBottom: '24px',
  overflow: 'hidden',
  boxShadow: 'none',
}));

/**
 * CharacterImage Component
 * Handles image loading states, error states, and lazy loading
 * Memoized for performance optimization
 * 
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {function} onClick - Click handler for image interaction
 */
const CharacterImage = React.memo(({ src, alt, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Memoized event handlers to prevent unnecessary re-renders
  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback(() => setError(true), []);

  // Validate props for security
  if (!src || typeof src !== 'string') {
    return (
      <Box
        sx={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 107, 107, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #FF6B6B',
          color: '#FF6B6B',
          fontSize: '12px',
        }}
        role="img"
        aria-label="Invalid image"
      >
        ?
      </Box>
    );
  }

  // Error state: Show placeholder when image fails to load
  if (error) {
    return (
      <Box
        sx={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 107, 107, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #FF6B6B',
          color: '#FF6B6B',
          fontSize: '12px',
        }}
        role="img"
        aria-label="Failed to load image"
      >
        ?
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: 50, height: 50 }}>
      {/* Loading state: Show spinner while image is loading */}
      {!loaded && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 50,
            height: 50,
            borderRadius: '50%',
            backgroundColor: 'rgba(113, 224, 102, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #71E066',
            zIndex: 1,
          }}
        >
          <CircularProgress size={20} sx={{ color: '#71E066' }} />
        </Box>
      )}
      
      {/* Main image with security attributes */}
      <img
        src={src}
        alt={alt || 'Character image'}
        onClick={onClick}
        onLoad={handleLoad}
        onError={handleError}
        style={{ 
          width: 50, 
          height: 50, 
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid #71E066',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.2s ease',
          cursor: onClick ? 'pointer' : 'default',
        }}
        loading="lazy"
        crossOrigin="anonymous" // Security: Prevent CORS issues
      />
    </Box>
  );
});

// Add PropTypes for type checking and documentation
CharacterImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

CharacterImage.displayName = 'CharacterImage';

/**
 * Main CharacterTable Component
 * Displays a responsive table of Rick and Morty characters
 * Features: Mobile responsive, expandable rows, error handling, loading states
 */
const CharacterTable = React.memo(() => {
  // Redux state management
  const dispatch = useDispatch();
  const {
    characters = [], // Default to empty array for safety
    loading = false,
    error = null,
    filters = {},
    pagination: { currentPage = 1 } = {}, // Safe destructuring with defaults
  } = useSelector((state) => state.characters || {});
  
  // Theme and responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  


  /**
   * Fetch characters data with comprehensive error handling
   * Includes retry logic and proper cleanup
   */
  useEffect(() => {
    let isMounted = true; // Prevent state updates on unmounted component
    
    const fetchCharacters = async () => {
      try {
        // Reset error state before fetching
        dispatch(setError(null));
        dispatch(setLoading(true));
        
        // Validate inputs
        if (typeof currentPage !== 'number' || currentPage < 1) {
          throw new Error('Invalid page number');
        }

        const response = await getCharacters(currentPage, filters);
        
        // Validate API response structure
        if (!response || !response.results || !Array.isArray(response.results)) {
          throw new Error('Invalid API response format');
        }

        // Only update state if component is still mounted
        if (isMounted) {
          dispatch(setCharacters(response.results));
          dispatch(setPagination({
            totalPages: response.info?.pages || 0,
          }));
        }
        
      } catch (error) {
        console.error('Error fetching characters:', error);
        
        if (isMounted) {
          // Provide user-friendly error messages
          const errorMessage = error.message === 'Failed to fetch' 
            ? 'Network error. Please check your connection and try again.'
            : error.message || 'An unexpected error occurred while loading characters.';
            
          dispatch(setError(errorMessage));
        }
      } finally {
        if (isMounted) {
          dispatch(setLoading(false));
        }
      }
    };

    fetchCharacters();

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [dispatch, currentPage, filters]);

  /**
   * Get appropriate status color for character status chip
   * Memoized for performance optimization
   * 
   * @param {string} status - Character status (Alive, Dead, unknown)
   * @returns {string} MUI color variant
   */
  const getStatusColor = useCallback((status) => {
    if (!status || typeof status !== 'string') {
      return 'default';
    }
    
    switch (status.toLowerCase()) {
      case 'alive': 
        return 'success';
      case 'dead': 
        return 'error';
      default: 
        return 'warning';
    }
  }, []);

  /**
   * Handle character selection with validation
   * 
   * @param {Object} character - Character object to select
   */
  const handleCharacterSelect = useCallback((character) => {
    // Validate character object
    if (!character || !character.id) {
      console.warn('Invalid character object provided');
      return;
    }
    
    dispatch(setSelectedCharacter(character));
  }, [dispatch]);

  /**
   * Memoized character rows for optimal performance
   * Only re-renders when dependencies change
   */
  const memoizedCharacters = useMemo(() => {
    // Safety check for characters array
    if (!Array.isArray(characters)) {
      return [];
    }

    return characters.map((character) => {
      // Validate character object structure
      if (!character || !character.id) {
        console.warn('Invalid character object in array:', character);
        return null;
      }

      return (
        <React.Fragment key={character.id}>
          {/* Main character row */}
          <TableRow
            hover
            onClick={() => handleCharacterSelect(character)}
            sx={{ 
              cursor: 'pointer',
              backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : '#1a1a1a',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'light' 
                  ? 'rgba(5, 150, 105, 0.1)' 
                  : 'rgba(4, 181, 189, 0.3)',
              },
            }}
          >
            {/* Character ID */}
            <TableCell sx={{ 
              color: theme.palette.text.primary, 
              textAlign: 'center',
              padding: isMobile ? '8px 4px' : '16px',
              fontSize: isMobile ? '0.8rem' : '1rem'
            }}>
              {character.id}
            </TableCell>
            
            {/* Character Image */}
            <TableCell sx={{ 
              textAlign: 'center',
              padding: isMobile ? '8px 4px' : '16px'
            }}>
              <CharacterImage
                src={character.image}
                alt={`${character.name} character image`}
              />
            </TableCell>
            
            {/* Character Name */}
            <TableCell sx={{ padding: isMobile ? '8px 4px' : '16px' }}>
              <Typography 
                variant="body1" 
                fontWeight="medium" 
                sx={{ 
                  color: theme.palette.text.primary,
                  fontSize: isMobile ? '0.85rem' : '1rem',
                  lineHeight: isMobile ? 1.2 : 1.5
                }}
              >
                {character.name || 'Unknown'}
              </Typography>
            </TableCell>
            
            {/* Character Status */}
            <TableCell sx={{ padding: isMobile ? '8px 4px' : '16px' }}>
              <Chip 
                label={character.status || 'Unknown'}
                color={getStatusColor(character.status)}
                size={isMobile ? "small" : "medium"}
                variant="filled"
                sx={{
                  fontSize: isMobile ? '0.7rem' : '0.8rem',
                  height: isMobile ? '20px' : 'auto'
                }}
              />
            </TableCell>

            {/* Desktop-only columns */}
            {!isMobile && (
              <>
                <TableCell>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 'medium', 
                    color: theme.palette.text.secondary 
                  }}>
                    {character.species || 'Unknown'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ 
                    color: theme.palette.text.secondary 
                  }}>
                    {character.gender || 'Unknown'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '200px',
                    color: theme.palette.text.secondary
                  }}>
                    {character.origin?.name || 'Unknown'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '200px',
                    color: theme.palette.text.secondary
                  }}>
                    {character.location?.name || 'Unknown'}
                  </Typography>
                </TableCell>
              </>
            )}


          </TableRow>
          

        </React.Fragment>
      );
    }).filter(Boolean); // Remove null entries from invalid characters
  }, [characters, isMobile, getStatusColor, handleCharacterSelect, theme]);

  // Loading state with accessible spinner
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        role="status"
        aria-label="Loading characters"
      >
        <CircularProgress 
          size={60} 
          sx={{ color: '#71E066' }} 
          aria-label="Loading spinner"
        />
        <Typography variant="h6" sx={{ ml: 2, color: '#A2DCDD' }}>
          Loading characters...
        </Typography>
      </Box>
    );
  }

  // Error state with retry option
  if (error) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        px={2}
      >
        <Alert 
          severity="error" 
          sx={{ mb: 2, maxWidth: '500px' }}
          action={
            <Typography
              variant="button"
              sx={{ 
                cursor: 'pointer',
                textDecoration: 'underline',
                color: 'inherit'
              }}
              onClick={() => window.location.reload()}
            >
              Retry
            </Typography>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  // Empty state
  if (!characters.length) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
      >
        <Typography variant="h6" sx={{ color: '#A2DCDD', textAlign: 'center' }}>
          No characters found matching these criteria. Try adjusting the filters.
        </Typography>
      </Box>
    );
  }

  // Main table render
  return (
    <ModernTableCard elevation={0}>
      <TableContainer sx={{ 
        borderRadius: '12px', 
        overflow: 'hidden',
        maxWidth: '100%',
        // Custom scrollbar styling
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: theme.palette.mode === 'light' ? '#F1F5F9' : '#161B2E',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #059669 0%, #0EA5E9 100%)'
            : 'linear-gradient(135deg, #00E5A0 0%, #00D4FF 100%)',
          borderRadius: '4px',
        },
      }}>
        <Table 
          sx={{ 
            minWidth: isMobile ? 'auto' : 800,
            width: '100%'
          }} 
          stickyHeader
          aria-label="Characters table"
        >
          {/* Table header */}
          <TableHead sx={{ overflow: 'hidden' }}>
            <TableRow
              sx={{
                background: theme.palette.mode === 'light'
                  ? 'linear-gradient(90deg, #059669 0%, #0EA5E9 100%)'
                  : 'linear-gradient(90deg, #00E5A0 0%, #00D4FF 100%)',
                '& th': {
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: isMobile ? '0.8rem' : '1rem',
                  letterSpacing: '0.5px',
                  borderBottom: 'none',
                  background: 'none',
                  textTransform: 'uppercase',
                  padding: isMobile ? '8px 4px' : '16px',
                },
              }}
            >
              <TableCell sx={{ width: isMobile ? '50px' : '80px', textAlign: 'center' }}>
                ID
              </TableCell>
              <TableCell sx={{ width: isMobile ? '60px' : '80px', textAlign: 'center' }}>
                IMG
              </TableCell>
              <TableCell sx={{ width: isMobile ? '120px' : '200px' }}>
                Name
              </TableCell>
              <TableCell sx={{ width: isMobile ? '80px' : '120px' }}>
                Status
              </TableCell>
              {!isMobile && (
                <>
                  <TableCell sx={{ width: '120px' }}>Species</TableCell>
                  <TableCell sx={{ width: '100px' }}>Gender</TableCell>
                  <TableCell>Origin</TableCell>
                  <TableCell>Location</TableCell>
                </>
              )}

            </TableRow>
          </TableHead>
          
          {/* Table body */}
          <TableBody>
            {memoizedCharacters}
          </TableBody>
        </Table>
      </TableContainer>
    </ModernTableCard>
  );
});

// Add PropTypes for the main component (currently no props, but good practice)
CharacterTable.propTypes = {};

CharacterTable.displayName = 'CharacterTable';

export default CharacterTable;
