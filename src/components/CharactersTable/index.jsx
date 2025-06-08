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
          <TableCell sx={{ 
            color: theme.palette.text.primary, 
            textAlign: 'center',
            padding: isMobile ? '8px 4px' : '16px',
            fontSize: isMobile ? '0.8rem' : '1rem'
          }}>
            {character.id}
          </TableCell>
          <TableCell sx={{ 
            textAlign: 'center',
            padding: isMobile ? '8px 4px' : '16px'
          }}>
            <CharacterImage
              src={character.image}
              alt={character.name}
              onClick={() => isMobile && handleCharacterSelect(character)}
            />
          </TableCell>
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
              {character.name}
            </Typography>
          </TableCell>
          <TableCell sx={{ padding: isMobile ? '8px 4px' : '16px' }}>
            <Chip 
              label={character.status}
              color={getStatusColor(character.status)}
              size={isMobile ? "small" : "medium"}
              variant="filled"
              sx={{
                fontSize: isMobile ? '0.7rem' : '0.8rem',
                height: isMobile ? '20px' : 'auto'
              }}
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
            <TableCell sx={{ 
              textAlign: 'center',
              padding: '8px 4px'
            }}>
              <IconButton 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(character.id);
                }}
                sx={{ 
                  color: theme.palette.mode === 'light' ? '#059669' : '#00E5A0',
                  backgroundColor: theme.palette.mode === 'light' 
                    ? 'rgba(5, 150, 105, 0.1)' 
                    : 'rgba(0, 229, 160, 0.1)',
                  border: theme.palette.mode === 'light'
                    ? '1px solid rgba(5, 150, 105, 0.2)'
                    : '1px solid rgba(0, 229, 160, 0.2)',
                  width: '32px',
                  height: '32px',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light' 
                      ? 'rgba(5, 150, 105, 0.2)' 
                      : 'rgba(0, 229, 160, 0.2)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease'
                }}
                size="small"
              >
                {expandedRows.has(character.id) ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              </IconButton>
            </TableCell>
          )}
        </TableRow>
        
        {isMobile && (
          <TableRow sx={{ 
            backgroundColor: 'transparent',
            '&:hover': { backgroundColor: 'transparent' }
          }}>
            <TableCell 
              sx={{ 
                paddingBottom: 0, 
                paddingTop: 0,
                paddingLeft: '8px',
                paddingRight: '8px',
                border: 'none'
              }} 
              colSpan={5}
            >
              <Collapse in={expandedRows.has(character.id)} timeout="auto" unmountOnExit>
                <Box sx={{ 
                  margin: '8px 0 16px 0', 
                  padding: '16px', 
                  background: theme.palette.mode === 'light' 
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)' 
                    : 'linear-gradient(135deg, rgba(22, 27, 46, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                  border: theme.palette.mode === 'light'
                    ? '2px solid rgba(5, 150, 105, 0.15)'
                    : '2px solid rgba(0, 229, 160, 0.15)',
                  boxShadow: theme.palette.mode === 'light'
                    ? '0 4px 20px rgba(5, 150, 105, 0.1)'
                    : '0 4px 20px rgba(0, 229, 160, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: theme.palette.mode === 'light'
                      ? 'linear-gradient(90deg, #059669 0%, #0EA5E9 100%)'
                      : 'linear-gradient(90deg, #00E5A0 0%, #00D4FF 100%)',
                  },
                }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    background: theme.palette.mode === 'light'
                      ? 'linear-gradient(135deg, #059669 0%, #0EA5E9 100%)'
                      : 'linear-gradient(135deg, #00E5A0 0%, #00D4FF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: 700,
                    fontSize: '1rem',
                    mb: 1.5,
                  }}>
                    Character Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.text.secondary,
                        fontSize: '13px',
                        fontWeight: 600,
                      }}>
                        Species:
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.text.primary,
                        fontSize: '13px',
                        fontWeight: 500,
                      }}>
                        {character.species}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.text.secondary,
                        fontSize: '13px',
                        fontWeight: 600,
                      }}>
                        Gender:
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.text.primary,
                        fontSize: '13px',
                        fontWeight: 500,
                      }}>
                        {character.gender}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.text.secondary,
                        fontSize: '13px',
                        fontWeight: 600,
                        flex: '0 0 auto',
                        mr: 1
                      }}>
                        Origin:
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.text.primary,
                        fontSize: '13px',
                        fontWeight: 500,
                        textAlign: 'right',
                        flex: 1
                      }}>
                        {character.origin.name}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.text.secondary,
                        fontSize: '13px',
                        fontWeight: 600,
                        flex: '0 0 auto',
                        mr: 1
                      }}>
                        Location:
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.text.primary,
                        fontSize: '13px',
                        fontWeight: 500,
                        textAlign: 'right',
                        flex: 1
                      }}>
                        {character.location.name}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      mt: 1, 
                      pt: 1.5, 
                      borderTop: theme.palette.mode === 'light'
                        ? '1px solid rgba(5, 150, 105, 0.2)'
                        : '1px solid rgba(0, 229, 160, 0.2)'
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: theme.palette.mode === 'light' ? '#059669' : '#00E5A0',
                          cursor: 'pointer',
                          textAlign: 'center',
                          fontWeight: 700,
                          fontSize: '13px',
                          padding: '8px 16px',
                          borderRadius: '20px',
                          backgroundColor: theme.palette.mode === 'light' 
                            ? 'rgba(5, 150, 105, 0.1)' 
                            : 'rgba(0, 229, 160, 0.1)',
                          border: theme.palette.mode === 'light'
                            ? '1px solid rgba(5, 150, 105, 0.2)'
                            : '1px solid rgba(0, 229, 160, 0.2)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'light' 
                              ? 'rgba(5, 150, 105, 0.2)' 
                              : 'rgba(0, 229, 160, 0.2)',
                            transform: 'translateY(-1px)',
                          },
                        }}
                        onClick={() => handleCharacterSelect(character)}
                      >
                        🔍 View Full Details
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
      <TableContainer sx={{ 
        borderRadius: '12px', 
        overflow: 'hidden',
        maxWidth: '100%',
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
        <Table sx={{ 
          minWidth: isMobile ? 'auto' : 800,
          width: '100%'
        }} stickyHeader>
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
                <TableCell sx={{ width: isMobile ? '50px' : '80px', textAlign: 'center' }}>ID</TableCell>
                <TableCell sx={{ width: isMobile ? '60px' : '80px', textAlign: 'center' }}>IMG</TableCell>
                <TableCell sx={{ width: isMobile ? '120px' : '200px' }}>Name</TableCell>
                <TableCell sx={{ width: isMobile ? '80px' : '120px' }}>Status</TableCell>
                {!isMobile && (
                  <>
                    <TableCell sx={{ width: '120px' }}>Species</TableCell>
                    <TableCell sx={{ width: '100px' }}>Gender</TableCell>
                    <TableCell>Origin</TableCell>
                    <TableCell>Location</TableCell>
                  </>
                )}
                {isMobile && (
                  <TableCell sx={{ width: '60px', textAlign: 'center', fontSize: '0.7rem' }}>
                    More
                  </TableCell>
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
