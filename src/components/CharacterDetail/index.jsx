import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { RemoveScroll } from 'react-remove-scroll';
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
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PublicIcon from '@mui/icons-material/Public';
import TvIcon from '@mui/icons-material/Tv';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Redux actions
import { setSelectedCharacter } from '../../features/characters/charactersSlice';

/**
 * CharacterDetail Component
 * Displays detailed information about a selected character in a modern modal
 * Features: Responsive design, accessibility, error handling, clean design
 */
const CharacterDetail = () => {
  // Redux state management
  const dispatch = useDispatch();
  const { selectedCharacter } = useSelector((state) => state.characters || {});
  
  // Theme and responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Early return if no character is selected
  if (!selectedCharacter) return null;

  /**
   * Handle modal close with validation
   * Clears the selected character from Redux state
   */
  const handleClose = () => {
    try {
      dispatch(setSelectedCharacter(null));
    } catch (error) {
      console.error('Error closing character detail modal:', error);
    }
  };

  /**
   * Get status color based on character status
   * Returns appropriate color for character status indicator
   * 
   * @param {string} status - Character status (Alive, Dead, unknown)
   * @returns {string} Hex color code
   */
  const getStatusColor = (status) => {
    if (!status || typeof status !== 'string') {
      return '#FFB800'; // Default color for unknown status
    }
    
    switch (status.toLowerCase()) {
      case 'alive':
        return '#00E5A0';
      case 'dead':
        return '#FF5757';
      default:
        return '#FFB800';
    }
  };

  /**
   * Get status background color with opacity
   * 
   * @param {string} status - Character status
   * @returns {string} RGBA color string
   */
  const getStatusBgColor = (status) => {
    if (!status || typeof status !== 'string') {
      return 'rgba(255, 184, 0, 0.1)';
    }
    
    switch (status.toLowerCase()) {
      case 'alive':
        return 'rgba(0, 229, 160, 0.1)';
      case 'dead':
        return 'rgba(255, 87, 87, 0.1)';
      default:
        return 'rgba(255, 184, 0, 0.1)';
    }
  };

  /**
   * Validate character data structure
   * Ensures all required fields exist with fallbacks
   */
  const validateCharacterData = (character) => {
    if (!character || typeof character !== 'object') {
      return false;
    }
    
    // Check for required fields
    const requiredFields = ['id', 'name', 'image'];
    return requiredFields.every(field => character[field]);
  };

  // Validate character data before rendering
  if (!validateCharacterData(selectedCharacter)) {
    return (
      <Dialog open={true} onClose={handleClose} maxWidth="xs">
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Invalid character data. Unable to display character details.
          </Alert>
          <Button onClick={handleClose} variant="contained" fullWidth>
            Close
          </Button>
        </Box>
      </Dialog>
    );
  }

  // Safe access to character properties with fallbacks
  const characterData = {
    id: selectedCharacter.id || 'Unknown',
    name: selectedCharacter.name || 'Unknown Character',
    image: selectedCharacter.image || '',
    status: selectedCharacter.status || 'unknown',
    species: selectedCharacter.species || 'Unknown',
    gender: selectedCharacter.gender || 'Unknown',
    origin: selectedCharacter.origin?.name || 'Unknown',
    location: selectedCharacter.location?.name || 'Unknown',
    episodeCount: selectedCharacter.episode?.length || 0,
    created: selectedCharacter.created || null,
  };

  return (
    <RemoveScroll enabled={!!selectedCharacter}>
      <Dialog
      open={!!selectedCharacter}
      onClose={handleClose}
      fullScreen={isSmallMobile}
      maxWidth="xs"
      disableBackdropClick={false}
      disableEscapeKeyDown={false}
      aria-labelledby="character-detail-title"
      aria-describedby="character-detail-description"
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
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
        },
      }}
      sx={{
        zIndex: 1400,
      }}
    >
      {/* Modern Profile Card Container */}
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
        role="dialog"
        aria-labelledby="character-detail-title"
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
          aria-label="Close character details"
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        {/* Profile Image Section */}
        <Box sx={{ mb: 3, position: 'relative' }}>
          <Avatar
            src={characterData.image}
            alt={`${characterData.name} character portrait`}
            sx={{
              width: 120,
              height: 120,
              margin: '0 auto',
              border: '4px solid',
              borderColor: getStatusColor(characterData.status),
              boxShadow: `0 8px 32px ${getStatusColor(characterData.status)}40`,
            }}
            onError={(e) => {
              // Handle image load errors gracefully
              e.target.style.display = 'none';
              console.warn('Failed to load character image:', characterData.image);
            }}
          />
        </Box>

        {/* Character Name */}
        <Typography
          id="character-detail-title"
          variant="h5"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 1,
            fontSize: '1.4rem',
            wordBreak: 'break-word', // Prevent overflow with long names
          }}
        >
          {characterData.name}
        </Typography>

        {/* Character Description */}
        <Typography
          id="character-detail-description"
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            mb: 3,
            fontSize: '0.95rem',
            fontWeight: 500,
          }}
        >
          {characterData.species} • {characterData.gender}
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
          {/* Character ID */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: theme.palette.text.primary,
              fontSize: '1.1rem'
            }}>
              {characterData.id}
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
          
          {/* Episode Count */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: theme.palette.text.primary,
              fontSize: '1.1rem'
            }}>
              {characterData.episodeCount}
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
          {/* Origin */}
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
            <Box sx={{ flex: 1, textAlign: 'left' }}>
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
                fontSize: '0.9rem',
                wordBreak: 'break-word',
              }}>
                {characterData.origin}
              </Typography>
            </Box>
          </Box>

          {/* Current Location */}
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
            <Box sx={{ flex: 1, textAlign: 'left' }}>
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
                fontSize: '0.9rem',
                wordBreak: 'break-word',
              }}>
                {characterData.location}
              </Typography>
            </Box>
          </Box>
        </Stack>

        {/* API Attribution Note */}
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
    </RemoveScroll>
  );
};

// PropTypes for type checking and documentation
CharacterDetail.propTypes = {
  // Component currently receives no props, but good practice to include
};

CharacterDetail.displayName = 'CharacterDetail';

export default CharacterDetail; 