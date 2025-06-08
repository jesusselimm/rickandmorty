import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RemoveScroll } from 'react-remove-scroll';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
  useMediaQuery,
  useTheme,
  Stack,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { setFilters, setPagination } from '../../features/characters/charactersSlice';

const ModernFilterCard = styled(Paper)(({ theme }) => ({
  background: theme.palette.mode === 'light' 
    ? 'rgba(255, 255, 255, 0.9)' 
    : 'rgba(22, 27, 46, 0.9)',
  backdropFilter: 'blur(20px)',
  border: theme.palette.mode === 'light'
    ? '1px solid rgba(5, 150, 105, 0.2)'
    : '1px solid rgba(0, 229, 160, 0.2)',
  borderRadius: '20px',
  padding: '24px',
  marginBottom: '24px',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: theme.palette.mode === 'light'
    ? '0 8px 25px rgba(0, 0, 0, 0.08)'
    : '0 8px 32px rgba(0, 0, 0, 0.25)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: theme.palette.mode === 'light'
      ? 'linear-gradient(90deg, #059669 0%, #0EA5E9 50%, #EC4899 100%)'
      : 'linear-gradient(90deg, #00E5A0 0%, #00D4FF 50%, #FF6B9D 100%)',
  },
}));

const FilterButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '8px 16px',
  backdropFilter: 'blur(10px)',
  border: theme.palette.mode === 'light'
    ? '1px solid rgba(5, 150, 105, 0.3)'
    : '1px solid rgba(0, 229, 160, 0.3)',
  background: theme.palette.mode === 'light'
    ? 'rgba(5, 150, 105, 0.1)'
    : 'rgba(0, 229, 160, 0.1)',
  color: theme.palette.mode === 'light' ? '#059669' : '#00E5A0',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: theme.palette.mode === 'light'
      ? 'linear-gradient(135deg, #059669 0%, #0EA5E9 100%)'
      : 'linear-gradient(135deg, #00E5A0 0%, #00D4FF 100%)',
    color: '#FFFFFF',
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'light'
      ? '0 8px 20px rgba(5, 150, 105, 0.3)'
      : '0 8px 20px rgba(0, 229, 160, 0.3)',
  },
}));

const ClearButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '8px 16px',
  border: theme.palette.mode === 'light'
    ? '1px solid rgba(220, 38, 38, 0.3)'
    : '1px solid rgba(255, 87, 87, 0.3)',
  background: theme.palette.mode === 'light'
    ? 'rgba(220, 38, 38, 0.1)'
    : 'rgba(255, 87, 87, 0.1)',
  color: theme.palette.mode === 'light' ? '#DC2626' : '#FF5757',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: theme.palette.mode === 'light'
      ? 'linear-gradient(135deg, #DC2626 0%, #EC4899 100%)'
      : 'linear-gradient(135deg, #FF5757 0%, #FF6B9D 100%)',
    color: '#FFFFFF',
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'light'
      ? '0 8px 20px rgba(220, 38, 38, 0.3)'
      : '0 8px 20px rgba(255, 87, 87, 0.3)',
  },
}));

const FilterForm = React.memo(() => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.characters);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Mobile modal state
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);



  const handleFilterChange = useCallback((field, value) => {
    if (isMobile) {
      setTempFilters(prev => ({ ...prev, [field]: value }));
    } else {
      dispatch(setFilters({ [field]: value }));
      dispatch(setPagination({ currentPage: 1 }));
    }
  }, [isMobile, dispatch]);

  const clearFilters = useCallback(() => {
    const emptyFilters = {
      name: '',
      status: '',
      species: '',
      gender: '',
    };
    
    if (isMobile) {
      setTempFilters(emptyFilters);
    } else {
      dispatch(setFilters(emptyFilters));
      dispatch(setPagination({ currentPage: 1 }));
    }
  }, [isMobile, dispatch]);

  // Mobile clear filters - directly apply and close modal
  const mobileClearFilters = useCallback(() => {
    const emptyFilters = {
      name: '',
      status: '',
      species: '',
      gender: '',
    };
    
    setTempFilters(emptyFilters);
    dispatch(setFilters(emptyFilters));
    dispatch(setPagination({ currentPage: 1 }));
    setMobileModalOpen(false);
  }, [dispatch]);

  const handleMobileApply = useCallback(() => {
    dispatch(setFilters(tempFilters));
    dispatch(setPagination({ currentPage: 1 }));
    setMobileModalOpen(false);
  }, [dispatch, tempFilters]);

  const handleMobileCancel = useCallback(() => {
    setTempFilters(filters);
    setMobileModalOpen(false);
  }, [filters]);

  const handleMobileOpen = useCallback(() => {
    setTempFilters(filters);
    setMobileModalOpen(true);
  }, [filters]);

  const currentFilters = isMobile ? tempFilters : filters;

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(value => 
    value && value.trim() !== ''
  ).length;

  // Mobile version - show header with filter button
  if (isMobile) {
    return (
      <RemoveScroll enabled={mobileModalOpen}>
        <Fade in={true} timeout={600}>
          <ModernFilterCard elevation={3} sx={{ py: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
            {/* Header Section */}
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 0,
            }}>
              {/* Title and Subtitle */}
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="h6" 
                  sx={{
                    fontWeight: 700,
                    background: theme.palette.mode === 'light'
                      ? 'linear-gradient(135deg, #059669 0%, #0EA5E9 100%)'
                      : 'linear-gradient(135deg, #FF6B9D 0%, #FFB800 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  }}
                >
                  <SearchIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} /> 
                  Search & Filter Characters
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mt: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    lineHeight: 1.4,
                  }}
                >
                  Find your favorite characters from the Rick and Morty universe
                </Typography>
              </Box>

              {/* Filter Button */}
              <Box sx={{ ml: 2, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                <FilterButton
                  onClick={handleMobileOpen}
                  sx={{
                    position: 'relative',
                    minWidth: { xs: '48px', sm: 'auto' },
                    width: { xs: '48px', sm: 'auto' },
                    height: { xs: '48px', sm: 'auto' },
                    px: { xs: 0, sm: 2 },
                    py: { xs: 0, sm: 1.25 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '& .MuiButton-startIcon': {
                      margin: { xs: 0, sm: '0 8px 0 -4px' },
                    },
                  }}
                >
                  <FilterListIcon sx={{ 
                    fontSize: { xs: '1.5rem', sm: '1.25rem' },
                    display: { xs: 'block', sm: 'none' }
                  }} />
                  <Box sx={{ 
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center',
                    gap: 1,
                  }}>
                    <FilterListIcon sx={{ fontSize: '1.25rem' }} />
                    <span>Filters</span>
                  </Box>
                  {activeFilterCount > 0 && (
                    <Chip
                      label={activeFilterCount}
                      size="small"
                      sx={{
                        position: { xs: 'absolute', sm: 'static' },
                        top: { xs: '-8px', sm: 'auto' },
                        right: { xs: '-8px', sm: 'auto' },
                        ml: { xs: 0, sm: 1 },
                        height: '20px',
                        minWidth: '20px',
                        background: 'linear-gradient(135deg, #FF6B9D 0%, #FFB800 100%)',
                        color: '#0B0D17',
                        fontWeight: 700,
                        fontSize: '11px',
                        px: { xs: 0.5, sm: 1 },
                        '& .MuiChip-label': {
                          px: { xs: 0.5, sm: 1 },
                        },
                      }}
                    />
                  )}
                </FilterButton>
              </Box>
            </Box>
          </ModernFilterCard>
        </Fade>

        {/* Mobile Filter Modal */}
        <Dialog
          open={mobileModalOpen}
          onClose={handleMobileCancel}
          maxWidth="sm"
          fullWidth
          disableScrollLock={false}
          scroll="paper"
          keepMounted={false}
          disablePortal={false}
          disableEnforceFocus={false}
          disableAutoFocus={false}
          disableRestoreFocus={false}
          hideBackdrop={false}
          PaperProps={{
            sx: {
              background: theme.palette.mode === 'light' 
                ? 'rgba(255, 255, 255, 0.95)'
                : 'rgba(22, 27, 46, 0.95)',
              backdropFilter: 'blur(20px)',
              border: theme.palette.mode === 'light'
                ? '1px solid rgba(5, 150, 105, 0.2)'
                : '1px solid rgba(0, 229, 160, 0.2)',
              borderRadius: '20px',
              maxHeight: '90vh',
              overflow: 'hidden',
            },
          }}
          BackdropProps={{
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
            },
          }}
          sx={{
            zIndex: 1300,
            '& .MuiDialog-container': {
              overscrollBehavior: 'contain',
            },
          }}
        >
          <DialogTitle 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, #059669 0%, #0EA5E9 100%)'
                : 'linear-gradient(135deg, #059669 0%, #0EA5E9 100%)',
              color: '#FFFFFF',
              fontWeight: 700,
            }}
          >
            <Typography variant="h6" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              fontWeight: 700,
              background: 'linear-gradient(135deg,rgb(248, 192, 10) 50%,rgb(254, 108, 18) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              <FilterListIcon sx={{ 
                color: '#FF4500',
              }} /> Filter Characters
            </Typography>
            <IconButton 
              onClick={handleMobileCancel}
              sx={{ 
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ 
            p: 3,
            background: theme.palette.mode === 'light' 
              ? 'rgba(255, 255, 255, 0.95)'
              : 'rgba(22, 27, 46, 0.95)',
          }}>
            <Stack spacing={3} sx={{ mt: 2 }}>
              {/* Name Filter */}
              <TextField
                fullWidth
                label="Character Name"
                value={currentFilters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                placeholder="Search by name..."
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ 
                    color: theme.palette.mode === 'light' ? '#059669' : '#00E5A0', 
                    mr: 1 
                  }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: theme.palette.mode === 'light' ? '#1F2937' : '#FFFFFF',
                    background: theme.palette.mode === 'light' 
                      ? 'rgba(248, 250, 252, 0.8)'
                      : 'rgba(22, 27, 46, 0.6)',
                    borderRadius: '12px',
                    height: '40px',
                    '& fieldset': {
                      borderColor: theme.palette.mode === 'light'
                        ? 'rgba(5, 150, 105, 0.3)'
                        : 'rgba(0, 229, 160, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.mode === 'light' ? '#059669' : '#00E5A0',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.mode === 'light' ? '#059669' : '#00E5A0',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: theme.palette.mode === 'light' ? '#6B7280' : '#B8C5D6',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.mode === 'light' ? '#059669' : '#00E5A0',
                  },
                }}
              />

              {/* Species Filter */}
              <TextField
                fullWidth
                label="Species"
                value={currentFilters.species}
                onChange={(e) => handleFilterChange('species', e.target.value)}
                placeholder="Human, Alien, etc..."
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ 
                    color: theme.palette.mode === 'light' ? '#059669' : '#00E5A0', 
                    mr: 1 
                  }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: theme.palette.mode === 'light' ? '#1F2937' : '#FFFFFF',
                    background: theme.palette.mode === 'light' 
                      ? 'rgba(248, 250, 252, 0.8)'
                      : 'rgba(22, 27, 46, 0.6)',
                    borderRadius: '12px',
                    height: '40px',
                    '& fieldset': {
                      borderColor: theme.palette.mode === 'light'
                        ? 'rgba(5, 150, 105, 0.3)'
                        : 'rgba(0, 229, 160, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.mode === 'light' ? '#059669' : '#00E5A0',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.mode === 'light' ? '#059669' : '#00E5A0',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: theme.palette.mode === 'light' ? '#6B7280' : '#B8C5D6',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.mode === 'light' ? '#059669' : '#00E5A0',
                  },
                }}
              />

              {/* Status Filter */}
              <FormControl fullWidth size="small">
                <InputLabel sx={{ 
                  color: theme.palette.mode === 'light' ? '#6B7280' : '#B8C5D6', 
                  '&.Mui-focused': { 
                    color: theme.palette.mode === 'light' ? '#059669' : '#00E5A0' 
                  } 
                }}>
                  Status
                </InputLabel>
                <Select
                  value={currentFilters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  label="Status"
                  sx={{
                    color: theme.palette.mode === 'light' ? '#1F2937' : '#FFFFFF',
                    background: theme.palette.mode === 'light' 
                      ? 'rgba(248, 250, 252, 0.8)'
                      : 'rgba(22, 27, 46, 0.6)',
                    borderRadius: '12px',
                    height: '40px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.mode === 'light'
                        ? 'rgba(5, 150, 105, 0.3)'
                        : 'rgba(0, 229, 160, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.mode === 'light' ? '#059669' : '#00E5A0',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.mode === 'light' ? '#059669' : '#00E5A0',
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        background: theme.palette.mode === 'light' 
                          ? 'rgba(255, 255, 255, 0.95)'
                          : 'rgba(22, 27, 46, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: theme.palette.mode === 'light'
                          ? '1px solid rgba(5, 150, 105, 0.2)'
                          : '1px solid rgba(0, 229, 160, 0.2)',
                        borderRadius: '12px',
                        '& .MuiMenuItem-root': {
                          color: theme.palette.mode === 'light' ? '#1F2937' : '#FFFFFF',
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'light'
                              ? 'rgba(5, 150, 105, 0.1)'
                              : 'rgba(0, 229, 160, 0.1)',
                          },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="alive">Alive</MenuItem>
                  <MenuItem value="dead">Dead</MenuItem>
                  <MenuItem value="unknown">Unknown</MenuItem>
                </Select>
              </FormControl>

              {/* Gender Filter */}
              <FormControl fullWidth size="small">
                <InputLabel sx={{ 
                  color: theme.palette.mode === 'light' ? '#6B7280' : '#B8C5D6', 
                  '&.Mui-focused': { 
                    color: theme.palette.mode === 'light' ? '#059669' : '#00E5A0' 
                  } 
                }}>
                  Gender
                </InputLabel>
                <Select
                  value={currentFilters.gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                  label="Gender"
                  sx={{
                    color: theme.palette.mode === 'light' ? '#1F2937' : '#FFFFFF',
                    background: theme.palette.mode === 'light' 
                      ? 'rgba(248, 250, 252, 0.8)'
                      : 'rgba(22, 27, 46, 0.6)',
                    borderRadius: '12px',
                    height: '48px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.mode === 'light'
                        ? 'rgba(5, 150, 105, 0.3)'
                        : 'rgba(0, 229, 160, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.mode === 'light' ? '#059669' : '#00E5A0',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.mode === 'light' ? '#059669' : '#00E5A0',
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        background: theme.palette.mode === 'light' 
                          ? 'rgba(255, 255, 255, 0.95)'
                          : 'rgba(22, 27, 46, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: theme.palette.mode === 'light'
                          ? '1px solid rgba(5, 150, 105, 0.2)'
                          : '1px solid rgba(0, 229, 160, 0.2)',
                        borderRadius: '12px',
                        '& .MuiMenuItem-root': {
                          color: theme.palette.mode === 'light' ? '#1F2937' : '#FFFFFF',
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'light'
                              ? 'rgba(5, 150, 105, 0.1)'
                              : 'rgba(0, 229, 160, 0.1)',
                          },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="">All Genders</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="genderless">Genderless</MenuItem>
                  <MenuItem value="unknown">Unknown</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          
          <DialogActions sx={{ 
            p: 3, 
            background: theme.palette.mode === 'light' 
              ? 'rgba(255, 255, 255, 0.95)'
              : 'rgba(22, 27, 46, 0.95)',
            borderTop: theme.palette.mode === 'light'
              ? '1px solid rgba(5, 150, 105, 0.2)'
              : '1px solid rgba(0, 229, 160, 0.2)',
            gap: 2,
          }}>
            <ClearButton
              onClick={mobileClearFilters}
              startIcon={<ClearIcon />}
              fullWidth
            >
              Clear All
            </ClearButton>
            <Button
              onClick={handleMobileApply}
              variant="contained"
              fullWidth
              sx={{
                background: theme.palette.mode === 'light'
                  ? 'linear-gradient(135deg, #059669 0%, #0EA5E9 100%)'
                  : 'linear-gradient(135deg, #00E5A0 0%, #00D4FF 100%)',
                color: '#FFFFFF',
                fontWeight: 600,
                borderRadius: '12px',
                py: 1.5,
                '&:hover': {
                  background: theme.palette.mode === 'light'
                    ? 'linear-gradient(135deg, #047857 0%, #0284C7 100%)'
                    : 'linear-gradient(135deg, #4FFFC4 0%, #5DDDFF 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: theme.palette.mode === 'light'
                    ? '0 8px 20px rgba(5, 150, 105, 0.3)'
                    : '0 8px 20px rgba(0, 229, 160, 0.3)',
                },
              }}
            >
              Apply Filters
            </Button>
          </DialogActions>
        </Dialog>
      </RemoveScroll>
    );
  }

  // Desktop version
  return (
    <Fade in={true} timeout={600}>
      <ModernFilterCard elevation={3}>
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h6" 
            sx={{
              fontWeight: 700,
              background: theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, #059669 0%, #0EA5E9 100%)'
                : 'linear-gradient(135deg, #FF6B9D 0%, #FFB800 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <SearchIcon /> Search & Filter Characters
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Find your favorite characters from the Rick and Morty universe
          </Typography>
        </Box>

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Character Name"
              value={currentFilters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              placeholder="Search by name..."
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: '#00E5A0', mr: 1 }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '40px',
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
          <TextField
              fullWidth
              label="Species"
              value={currentFilters.species}
              onChange={(e) => handleFilterChange('species', e.target.value)}
              placeholder="Human, Alien..."
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: '#00E5A0', mr: 1 }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '40px',
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl size="small" sx={{ minWidth: 'auto', width: 'auto' }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={currentFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                label="Status"
                autoWidth
                sx={{ 
                  height: '40px',
                  minWidth: '100px',
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: 'rgba(22, 27, 46, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(0, 229, 160, 0.2)',
                      borderRadius: '12px',
                      '& .MuiMenuItem-root': {
                        color: '#FFFFFF',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 229, 160, 0.1)',
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="alive">Alive</MenuItem>
                <MenuItem value="dead">Dead</MenuItem>
                <MenuItem value="unknown">Unknown</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4} md={2}>
            <FormControl size="small" sx={{ minWidth: 'auto', width: 'auto' }}>
              <InputLabel>Gender</InputLabel>
              <Select
                value={currentFilters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                label="Gender"
                autoWidth
                sx={{ 
                  height: '40px',
                  minWidth: '110px',
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: 'rgba(22, 27, 46, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(0, 229, 160, 0.2)',
                      borderRadius: '12px',
                      '& .MuiMenuItem-root': {
                        color: '#FFFFFF',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 229, 160, 0.1)',
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">All Genders</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="genderless">Genderless</MenuItem>
                <MenuItem value="unknown">Unknown</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={8} md={2}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <ClearButton
                onClick={clearFilters}
                startIcon={<ClearIcon />}
                disabled={activeFilterCount === 0}
                sx={{
                  opacity: activeFilterCount === 0 ? 0.5 : 1,
                  minWidth: 'auto',
                  px: 2,
                }}
              >
                Clear
              </ClearButton>
              {activeFilterCount > 0 && (
                <Chip
                  label={`${activeFilterCount} Filter`}
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, #FF6B9D 0%, #FFB800 100%)',
                    color: '#0B0D17',
                    fontWeight: 600,
                    alignSelf: 'center',
                    minWidth: 'auto',
                    height: '24px',
                    px: 1,
                  }}
                />
              )}
            </Stack>
          </Grid>
        </Grid>
      </ModernFilterCard>
    </Fade>
  );
});

FilterForm.displayName = 'FilterForm';

export default FilterForm; 