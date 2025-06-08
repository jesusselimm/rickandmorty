import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  Typography,
  Card,
  CardMedia,
  IconButton,
  Box,
  Avatar,
  Chip,
  Button,
  useMediaQuery,
  useTheme,
  Stack,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PublicIcon from '@mui/icons-material/Public';
import TvIcon from '@mui/icons-material/Tv';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { setSelectedCharacter } from '../../features/characters/charactersSlice';

const CharacterDetail = () => {
  const dispatch = useDispatch();
  const { selectedCharacter } = useSelector((state) => state.characters);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!selectedCharacter) return null;

  const handleClose = () => {
    dispatch(setSelectedCharacter(null));
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return '#00E5A0';
      case 'dead':
        return '#FF5757';
      default:
        return '#FFB800';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return 'rgba(0, 229, 160, 0.1)';
      case 'dead':
        return 'rgba(255, 87, 87, 0.1)';
      default:
        return 'rgba(255, 184, 0, 0.1)';
    }
  };

  return (
    <Dialog
      open={!!selectedCharacter}
      onClose={handleClose}
      fullScreen={isSmallMobile}
      maxWidth="xs"
      disableBackdropClick={false}
      disableEscapeKeyDown={false}
      PaperProps={{
        sx: {
          background: 'transparent',
          boxShadow: 'none',
          borderRadius: isSmallMobile ? 0 : '24px',
          margin: isSmallMobile ? 0 : 2,
          maxHeight: isSmallMobile ? '100vh' : '90vh',
          width: isSmallMobile ? '100%' : '400px',
          maxWidth: isSmallMobile ? '100%' : '400px',
        },
      }}
    >
      {/* Modern Profile Card */}
      <Box
        sx={{
          background: theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)'
            : 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
          borderRadius: isSmallMobile ? 0 : '24px',
          padding: '24px',
          position: 'relative',
          textAlign: 'center',
          border: theme.palette.mode === 'light'
            ? '1px solid rgba(0, 0, 0, 0.1)'
            : '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: theme.palette.mode === 'light'
            ? '0 20px 40px rgba(0, 0, 0, 0.1)'
            : '0 20px 40px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(20px)',
          minHeight: isSmallMobile ? '100vh' : 'auto',
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            backgroundColor: theme.palette.mode === 'light' 
              ? 'rgba(0, 0, 0, 0.05)'
              : 'rgba(255, 255, 255, 0.1)',
            color: theme.palette.text.secondary,
            width: 32,
            height: 32,
            zIndex: 1000,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'light' 
                ? 'rgba(0, 0, 0, 0.1)'
                : 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        {/* Profile Image */}
        <Box sx={{ mb: 3, position: 'relative' }}>
          <Avatar
            src={selectedCharacter.image}
            alt={selectedCharacter.name}
            sx={{
              width: 120,
              height: 120,
              margin: '0 auto',
              border: '4px solid',
              borderColor: getStatusColor(selectedCharacter.status),
              boxShadow: `0 8px 32px ${getStatusColor(selectedCharacter.status)}40`,
            }}
          />
          

        </Box>

        {/* Character Name */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 1,
            fontSize: '1.4rem',
          }}
        >
          {selectedCharacter.name}
        </Typography>

        {/* Character Description */}
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            mb: 3,
            fontSize: '0.95rem',
            fontWeight: 500,
          }}
        >
          {selectedCharacter.species} • {selectedCharacter.gender}
        </Typography>

        {/* Stats Row */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            mb: 3,
            py: 2,
            borderRadius: '12px',
            backgroundColor: theme.palette.mode === 'light' 
              ? 'rgba(0, 0, 0, 0.03)'
              : 'rgba(255, 255, 255, 0.05)',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: theme.palette.text.primary,
              fontSize: '1.1rem'
            }}>
              {selectedCharacter.id}
            </Typography>
            <Typography variant="caption" sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              ID
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: theme.palette.text.primary,
              fontSize: '1.1rem'
            }}>
              {selectedCharacter.episode.length}
            </Typography>
                         <Typography variant="caption" sx={{ 
               color: theme.palette.text.secondary,
               fontWeight: 600,
               textTransform: 'uppercase',
               letterSpacing: '0.5px'
             }}>
               Episodes
             </Typography>
          </Box>
        </Box>

        {/* Location Information */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                backgroundColor: theme.palette.mode === 'light' 
                  ? 'rgba(5, 150, 105, 0.1)'
                  : 'rgba(0, 229, 160, 0.1)',
                borderRadius: '12px',
                padding: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PublicIcon sx={{ 
                color: theme.palette.mode === 'light' ? '#059669' : '#00E5A0', 
                fontSize: 20 
              }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ 
                color: theme.palette.text.secondary, 
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.7rem'
              }}>
                Origin
              </Typography>
              <Typography variant="body2" sx={{ 
                color: theme.palette.text.primary, 
                fontWeight: 600,
                fontSize: '0.9rem' 
              }}>
                {selectedCharacter.origin.name}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                backgroundColor: theme.palette.mode === 'light' 
                  ? 'rgba(14, 165, 233, 0.1)'
                  : 'rgba(0, 212, 255, 0.1)',
                borderRadius: '12px',
                padding: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LocationOnIcon sx={{ 
                color: theme.palette.mode === 'light' ? '#0EA5E9' : '#00D4FF', 
                fontSize: 20 
              }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ 
                color: theme.palette.text.secondary, 
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.7rem'
              }}>
                Current Location
              </Typography>
              <Typography variant="body2" sx={{ 
                color: theme.palette.text.primary, 
                fontWeight: 600,
                fontSize: '0.9rem' 
              }}>
                {selectedCharacter.location.name}
              </Typography>
            </Box>
          </Box>
        </Stack>

        

        {/* API Note */}
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            color: theme.palette.text.secondary,
            fontSize: '0.7rem',
            opacity: 0.7,
            mt: 2,
          }}
        >
          Character data from Rick and Morty API
        </Typography>
      </Box>
    </Dialog>
  );
};

export default CharacterDetail; 