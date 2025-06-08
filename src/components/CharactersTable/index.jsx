import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  IconButton,
  Collapse,
  useMediaQuery,
  useTheme,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { getCharacters } from '../../services/api';
import {
  setCharacters,
  setSelectedCharacter,
  setLoading,
  setError,
  setPagination,
} from '../../features/characters/charactersSlice';

const ModernTableCard = styled(Paper)(({ theme }) => ({
  background: 'transparent',
  border: 'none',
  borderRadius: '12px',
  marginBottom: '24px',
  overflow: 'hidden',
  boxShadow: 'none',
}));

// Simplified image component without preloading
const CharacterImage = React.memo(({ src, alt, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback(() => setError(true), []);

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
      >
        ?
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: 50, height: 50 }}>
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
          }}
        >
          <CircularProgress size={20} sx={{ color: '#71E066' }} />
        </Box>
      )}
      <img
        src={src}
        alt={alt}
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
      />
    </Box>
  );
});

CharacterImage.displayName = 'CharacterImage';

const CharacterTable = React.memo(() => {
  const dispatch = useDispatch();
  const {
    characters,
    loading,
    error,
    filters,
    pagination: { currentPage },
  } = useSelector((state) => state.characters);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleExpanded = useCallback((characterId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(characterId)) {
        newSet.delete(characterId);
      } else {
        newSet.add(characterId);
      }
      return newSet;
    });
  }, []);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));
        const response = await getCharacters(currentPage, filters);
        dispatch(setCharacters(response.results));
        dispatch(
          setPagination({
            totalPages: response.info.pages || 0,
          })
        );
      } catch (error) {
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCharacters();
  }, [dispatch, currentPage, filters]);

  const getStatusColor = useCallback((status) => {
    switch (status.toLowerCase()) {
      case 'alive': return 'success';
      case 'dead': return 'error';
      default: return 'warning';
    }
  }, []);

  const handleCharacterSelect = useCallback((character) => {
    dispatch(setSelectedCharacter(character));
  }, [dispatch]);

  const memoizedCharacters = useMemo(() => {
    return characters.map((character, index) => (
      <React.Fragment key={character.id}>
        <TableRow
          hover
          onClick={() => !isMobile && handleCharacterSelect(character)}
          sx={{ 
            cursor: isMobile ? 'default' : 'pointer',
            backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : '#1a1a1a',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'light' 
                ? 'rgba(5, 150, 105, 0.1)' 
                : 'rgba(4, 181, 189, 0.3)',
            },
          }}
        >
          <TableCell sx={{ color: theme.palette.text.primary }}>{character.id}</TableCell>
          <TableCell>
            <CharacterImage
              src={character.image}
              alt={character.name}
              onClick={() => isMobile && handleCharacterSelect(character)}
            />
          </TableCell>
          <TableCell>
            <Typography variant="body1" fontWeight="medium" sx={{ color: theme.palette.text.primary }}>
              {character.name}
            </Typography>
          </TableCell>
          <TableCell>
            <Chip 
              label={character.status}
              color={getStatusColor(character.status)}
              size="small"
              variant="filled"
            />
          </TableCell>
          {!isMobile && (
            <>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 'medium', color: theme.palette.text.secondary }}>
                  {character.species}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  {character.gender}
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
                  {character.origin.name}
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
                  {character.location.name}
                </Typography>
              </TableCell>
            </>
          )}
          {isMobile && (
            <TableCell>
              <IconButton 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(character.id);
                }}
                sx={{ color: '#71E066' }}
                size="small"
              >
                {expandedRows.has(character.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </TableCell>
          )}
        </TableRow>
        
        {isMobile && (
          <TableRow>
            <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
              <Collapse in={expandedRows.has(character.id)} timeout="auto" unmountOnExit>
                <Box sx={{ 
                  margin: 1, 
                  padding: 3, 
                  background: theme.palette.mode === 'light' 
                    ? 'rgba(255, 255, 255, 0.95)' 
                    : 'rgba(22, 27, 46, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  border: theme.palette.mode === 'light'
                    ? '1px solid rgba(5, 150, 105, 0.2)'
                    : '1px solid rgba(0, 229, 160, 0.2)',
                  boxShadow: theme.palette.mode === 'light'
                    ? '0 8px 25px rgba(0, 0, 0, 0.08)'
                    : '0 8px 32px rgba(0, 0, 0, 0.25)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: theme.palette.mode === 'light'
                      ? 'linear-gradient(90deg, #059669 0%, #0EA5E9 100%)'
                      : 'linear-gradient(90deg, #00E5A0 0%, #00D4FF 100%)',
                  },
                }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    background: 'linear-gradient(135deg, #00E5A0 0%, #00D4FF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: 700,
                    mb: 2,
                  }}>
                    Additional Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Typography variant="body2" sx={{ 
                      color: theme.palette.text.primary,
                      fontSize: '14px',
                      lineHeight: 1.5,
                    }}>
                      <strong style={{ 
                        color: theme.palette.mode === 'light' ? '#059669' : '#A2DCDD',
                        fontWeight: 600,
                      }}>Species:</strong> {character.species}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: theme.palette.text.primary,
                      fontSize: '14px',
                      lineHeight: 1.5,
                    }}>
                      <strong style={{ 
                        color: theme.palette.mode === 'light' ? '#059669' : '#A2DCDD',
                        fontWeight: 600,
                      }}>Gender:</strong> {character.gender}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: theme.palette.text.primary,
                      fontSize: '14px',
                      lineHeight: 1.5,
                    }}>
                      <strong style={{ 
                        color: theme.palette.mode === 'light' ? '#059669' : '#A2DCDD',
                        fontWeight: 600,
                      }}>Origin:</strong> {character.origin.name}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: theme.palette.text.primary,
                      fontSize: '14px',
                      lineHeight: 1.5,
                    }}>
                      <strong style={{ 
                        color: theme.palette.mode === 'light' ? '#059669' : '#A2DCDD',
                        fontWeight: 600,
                      }}>Location:</strong> {character.location.name}
                    </Typography>
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0, 229, 160, 0.2)' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: theme.palette.mode === 'light' ? '#0EA5E9' : '#04B5BD',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          fontWeight: 600,
                          fontSize: '14px',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            color: theme.palette.mode === 'light' ? '#059669' : '#00E5A0',
                            transform: 'translateX(4px)',
                          },
                        }}
                        onClick={() => handleCharacterSelect(character)}
                      >
                        View Full Details
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    ));
  }, [characters, isMobile, expandedRows, getStatusColor, handleCharacterSelect, toggleExpanded]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} sx={{ color: '#71E066' }} />
        <Typography variant="h6" sx={{ ml: 2, color: '#A2DCDD' }}>
          Loading characters...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  if (!characters.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="h6" sx={{ color: '#A2DCDD' }}>
          No characters found matching these criteria. Try adjusting the filters.
        </Typography>
      </Box>
    );
  }

  return (
    <ModernTableCard elevation={0}>
      <TableContainer sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <Table sx={{ minWidth: isMobile ? 300 : 800 }} stickyHeader>
            <TableHead sx={{ overflow: 'hidden' }}>
              <TableRow
                sx={{
                  background: theme.palette.mode === 'light'
                    ? 'linear-gradient(90deg, #059669 0%, #0EA5E9 100%)'
                    : 'linear-gradient(90deg, #00E5A0 0%, #00D4FF 100%)',
                  '& th': {
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '1rem',
                    letterSpacing: '0.5px',
                    borderBottom: 'none',
                    background: 'none',
                    textTransform: 'uppercase',
                  },
                }}
              >
                <TableCell sx={{ width: '80px' }}>ID</TableCell>
                <TableCell sx={{ width: '80px' }}>Image</TableCell>
                <TableCell sx={{ width: '200px' }}>Name</TableCell>
                <TableCell sx={{ width: '120px' }}>Status</TableCell>
                {!isMobile && (
                  <>
                    <TableCell sx={{ width: '120px' }}>Species</TableCell>
                    <TableCell sx={{ width: '100px' }}>Gender</TableCell>
                    <TableCell>Origin</TableCell>
                    <TableCell>Location</TableCell>
                  </>
                )}
                {isMobile && (
                  <TableCell sx={{ width: '50px' }}>More</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {memoizedCharacters}
            </TableBody>
          </Table>
        </TableContainer>
      </ModernTableCard>
    );
});

CharacterTable.displayName = 'CharacterTable';

export default CharacterTable;
