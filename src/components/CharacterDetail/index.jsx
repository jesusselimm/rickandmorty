import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  IconButton,
  Grid,
  Divider,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { setSelectedCharacter } from '../../features/characters/charactersSlice';

const CharacterDetail = () => {
  const dispatch = useDispatch();
  const { selectedCharacter } = useSelector((state) => state.characters);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  if (!selectedCharacter) return null;

  const handleClose = () => {
    dispatch(setSelectedCharacter(null));
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return 'success';
      case 'dead':
        return 'error';
      default:
        return 'default';
    }
  };

  const getGenderColor = (gender) => {
    switch (gender.toLowerCase()) {
      case 'male':
        return 'primary';
      case 'female':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Dialog
      open={!!selectedCharacter}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(22, 27, 46, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 229, 160, 0.2)',
          borderRadius: '20px',
          minHeight: fullScreen ? '100vh' : '450px',
          maxHeight: fullScreen ? '100vh' : '80vh',
        },
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #00E5A0 0%, #00D4FF 100%)',
        color: '#0B0D17',
        fontWeight: 700,
        borderRadius: '20px 20px 0 0',
      }}>
        <Typography variant="h5" sx={{ 
          color: '#0B0D17',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          Character Details
        </Typography>
        <IconButton 
          onClick={handleClose} 
          sx={{ 
            color: '#0B0D17',
            '&:hover': {
              backgroundColor: 'rgba(11, 13, 23, 0.1)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ 
        p: 3,
        background: 'rgba(22, 27, 46, 0.95)',
        pt: 4,
      }}>
        <Grid container spacing={3}>
          {/* Character Image */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ 
              background: 'rgba(22, 27, 46, 0.8)', 
              border: '1px solid rgba(0, 229, 160, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              mt: 1,
            }}>
              <CardMedia
                component="img"
                image={selectedCharacter.image}
                alt={selectedCharacter.name}
                sx={{ height: 300, objectFit: 'cover' }}
              />
            </Card>
          </Grid>

          {/* Character Information */}
          <Grid item xs={12} md={8}>
            <CardContent sx={{ p: 0, pt: 1 }}>
              <Typography variant="h4" gutterBottom sx={{ 
                background: 'linear-gradient(135deg, #00E5A0 0%, #00D4FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mt: 1,
                fontWeight: 700
              }}>
                {selectedCharacter.name}
              </Typography>

              <Box display="flex" gap={1} mb={3} flexWrap="wrap">
                <Chip 
                  label={selectedCharacter.status} 
                  color={getStatusColor(selectedCharacter.status)}
                  variant="filled"
                />
                <Chip 
                  label={selectedCharacter.species} 
                  sx={{ 
                    background: 'linear-gradient(135deg, #00D4FF 0%, #5DDDFF 100%)', 
                    color: '#0B0D17',
                    cursor: 'default',
                    fontWeight: 600,
                  }}
                  variant="filled"
                />
                <Chip 
                  label={selectedCharacter.gender} 
                  variant="outlined"
                  sx={{
                    borderColor: '#00E5A0',
                    color: '#00E5A0',
                    fontWeight: 600,
                  }}
                />
              </Box>

              <Divider sx={{ mb: 3, borderColor: 'rgba(0, 229, 160, 0.2)' }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    color: '#00E5A0',
                    fontWeight: 700 
                  }}>
                    Basic Information
                  </Typography>
                  <Typography variant="body1" gutterBottom sx={{ color: '#FFFFFF' }}>
                    <strong style={{ color: '#A2DCDD' }}>ID:</strong> {selectedCharacter.id}
                  </Typography>
                  <Typography variant="body1" gutterBottom sx={{ color: '#FFFFFF' }}>
                    <strong style={{ color: '#A2DCDD' }}>Status:</strong> {selectedCharacter.status}
                  </Typography>
                  <Typography variant="body1" gutterBottom sx={{ color: '#FFFFFF' }}>
                    <strong style={{ color: '#A2DCDD' }}>Species:</strong> {selectedCharacter.species}
                  </Typography>
                  <Typography variant="body1" gutterBottom sx={{ color: '#FFFFFF' }}>
                    <strong style={{ color: '#A2DCDD' }}>Gender:</strong> {selectedCharacter.gender}
                  </Typography>
                  {selectedCharacter.type && (
                    <Typography variant="body1" gutterBottom sx={{ color: '#FFFFFF' }}>
                      <strong style={{ color: '#A2DCDD' }}>Type:</strong> {selectedCharacter.type}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    color: '#00E5A0',
                    fontWeight: 700 
                  }}>
                    Location Information
                  </Typography>
                  <Typography variant="body1" gutterBottom sx={{ color: '#FFFFFF' }}>
                    <strong style={{ color: '#A2DCDD' }}>Origin:</strong> {selectedCharacter.origin.name}
                  </Typography>
                  <Typography variant="body1" gutterBottom sx={{ color: '#FFFFFF' }}>
                    <strong style={{ color: '#A2DCDD' }}>Last Known Location:</strong> {selectedCharacter.location.name}
                  </Typography>

                  <Divider sx={{ my: 2, borderColor: 'rgba(0, 229, 160, 0.2)' }} />

                  <Typography variant="h6" gutterBottom sx={{ 
                    color: '#00E5A0',
                    fontWeight: 700 
                  }}>
                    Additional Information
                  </Typography>
                  <Typography variant="body1" gutterBottom sx={{ color: '#FFFFFF' }}>
                    <strong style={{ color: '#A2DCDD' }}>Created:</strong> {new Date(selectedCharacter.created).toLocaleDateString('en-US')}
                  </Typography>
                  <Typography variant="body1" gutterBottom sx={{ color: '#FFFFFF' }}>
                    <strong style={{ color: '#A2DCDD' }}>Episode Count:</strong> {selectedCharacter.episode.length}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default CharacterDetail; 