import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider, CssBaseline, Typography, Box, Container, Paper, GlobalStyles, useMediaQuery } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useMemo, useEffect } from 'react';
import CharactersTable from './components/CharactersTable';
import FilterForm from './components/FilterForm';
import CharacterDetail from './components/CharacterDetail';

const createAppTheme = (mode) => createTheme({
  palette: {
    mode,
    background: {
      default: mode === 'light' ? '#F8FAFC' : '#0B0D17',
      paper: mode === 'light' ? '#FFFFFF' : '#161B2E',
    },
    primary: {
      main: mode === 'light' ? '#059669' : '#00E5A0',
      light: mode === 'light' ? '#10B981' : '#4FFFC4',
      dark: mode === 'light' ? '#047857' : '#00B584',
    },
    secondary: {
      main: mode === 'light' ? '#0EA5E9' : '#00D4FF',
      light: mode === 'light' ? '#38BDF8' : '#5DDDFF',
      dark: mode === 'light' ? '#0284C7' : '#00A8CC',
    },
    accent: {
      main: mode === 'light' ? '#EC4899' : '#FF6B9D',
      light: mode === 'light' ? '#F472B6' : '#FF8FB3',
      dark: mode === 'light' ? '#DB2777' : '#E04A7A',
    },
    text: {
      primary: mode === 'light' ? '#1F2937' : '#FFFFFF',
      secondary: mode === 'light' ? '#6B7280' : '#B8C5D6',
    },
    info: {
      main: mode === 'light' ? '#06B6D4' : '#64DFDF',
    },
    warning: {
      main: mode === 'light' ? '#F59E0B' : '#FFB800',
    },
    success: {
      main: mode === 'light' ? '#059669' : '#00E5A0',
    },
    error: {
      main: mode === 'light' ? '#DC2626' : '#FF5757',
    },
    // Custom gradient colors
    gradient: {
      primary: mode === 'light' 
        ? 'linear-gradient(135deg, #059669 0%, #0EA5E9 100%)'
        : 'linear-gradient(135deg, #00E5A0 0%, #00D4FF 100%)',
      secondary: mode === 'light'
        ? 'linear-gradient(135deg, #EC4899 0%, #F59E0B 100%)'
        : 'linear-gradient(135deg, #FF6B9D 0%, #FFB800 100%)',
      background: mode === 'light'
        ? 'linear-gradient(135deg, #F8FAFC 0%, #E5E7EB 100%)'
        : 'linear-gradient(135deg, #161B2E 0%, #0B0D17 100%)',
    },
    // Custom theme colors
    surface: {
      main: mode === 'light' ? '#FFFFFF' : '#161B2E',
      variant: mode === 'light' ? '#F1F5F9' : '#1F2937',
      hover: mode === 'light' ? '#F8FAFC' : '#374151',
    },
    border: {
      main: mode === 'light' ? '#E5E7EB' : '#374151',
      light: mode === 'light' ? '#F3F4F6' : '#4B5563',
      accent: mode === 'light' 
        ? 'rgba(5, 150, 105, 0.2)' 
        : 'rgba(0, 229, 160, 0.2)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3.5rem',
      background: mode === 'light' 
        ? 'linear-gradient(135deg, #059669 0%, #0EA5E9 100%)'
        : 'linear-gradient(135deg, #00E5A0 0%, #00D4FF 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h3: {
      fontWeight: 700,
      background: mode === 'light' 
        ? 'linear-gradient(135deg, #059669 0%, #0EA5E9 100%)'
        : 'linear-gradient(135deg, #00E5A0 0%, #00D4FF 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h4: {
      fontWeight: 600,
      color: mode === 'light' ? '#059669' : '#00E5A0',
    },
    h5: {
      fontWeight: 600,
      color: mode === 'light' ? '#059669' : '#00E5A0',
    },
    h6: {
      fontWeight: 600,
      color: mode === 'light' ? '#059669' : '#00E5A0',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'transparent',
          backdropFilter: 'none',
          border: 'none',
          borderRadius: '0px',
          boxShadow: 'none',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          background: mode === 'light'
            ? 'linear-gradient(135deg, #059669 0%, #0EA5E9 100%)'
            : 'linear-gradient(135deg, #00E5A0 0%, #00D4FF 100%)',
          '& .MuiTableCell-head': {
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: '12px',
          boxShadow: mode === 'light' 
            ? '0 2px 8px rgba(0, 0, 0, 0.1)'
            : '0 2px 8px rgba(0, 0, 0, 0.2)',
        },
        colorSuccess: {
          background: mode === 'light'
            ? 'linear-gradient(135deg, #059669 0%, #10B981 100%)'
            : 'linear-gradient(135deg, #00E5A0 0%, #4FFFC4 100%)',
          color: mode === 'light' ? '#FFFFFF' : '#0B0D17',
        },
        colorError: {
          background: mode === 'light'
            ? 'linear-gradient(135deg, #DC2626 0%, #EC4899 100%)'
            : 'linear-gradient(135deg, #FF5757 0%, #FF6B9D 100%)',
          color: '#FFFFFF',
        },
        colorWarning: {
          background: mode === 'light'
            ? 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)'
            : 'linear-gradient(135deg, #FFB800 0%, #FFC947 100%)',
          color: mode === 'light' ? '#FFFFFF' : '#0B0D17',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: mode === 'light' 
            ? '0 4px 16px rgba(0, 0, 0, 0.1)'
            : '0 4px 16px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease',
        },
        contained: {
          background: mode === 'light'
            ? 'linear-gradient(135deg, #059669 0%, #0EA5E9 100%)'
            : 'linear-gradient(135deg, #00E5A0 0%, #00D4FF 100%)',
          color: mode === 'light' ? '#FFFFFF' : '#0B0D17',
          '&:hover': {
            background: mode === 'light'
              ? 'linear-gradient(135deg, #10B981 0%, #38BDF8 100%)'
              : 'linear-gradient(135deg, #4FFFC4 0%, #5DDDFF 100%)',
            transform: 'translateY(-2px)',
            boxShadow: mode === 'light'
              ? '0 6px 20px rgba(5, 150, 105, 0.3)'
              : '0 6px 20px rgba(0, 229, 160, 0.3)',
          },
        },
        outlined: {
          borderColor: mode === 'light' 
            ? 'rgba(5, 150, 105, 0.5)'
            : 'rgba(0, 229, 160, 0.5)',
          color: mode === 'light' ? '#059669' : '#00E5A0',
          '&:hover': {
            borderColor: mode === 'light' ? '#059669' : '#00E5A0',
            backgroundColor: mode === 'light' 
              ? 'rgba(5, 150, 105, 0.1)'
              : 'rgba(0, 229, 160, 0.1)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            background: mode === 'light' 
              ? 'rgba(255, 255, 255, 0.8)'
              : 'rgba(22, 27, 46, 0.6)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: mode === 'light' 
                ? 'rgba(255, 255, 255, 0.9)'
                : 'rgba(22, 27, 46, 0.8)',
              borderColor: mode === 'light' ? '#059669' : '#00E5A0',
            },
            '&.Mui-focused': {
              backgroundColor: mode === 'light' ? '#FFFFFF' : 'rgba(22, 27, 46, 0.9)',
              boxShadow: mode === 'light'
                ? '0 0 0 2px rgba(5, 150, 105, 0.3)'
                : '0 0 0 2px rgba(0, 229, 160, 0.3)',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          background: mode === 'light' 
            ? 'rgba(255, 255, 255, 0.8)'
            : 'rgba(22, 27, 46, 0.6)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: mode === 'light' 
              ? 'rgba(255, 255, 255, 0.9)'
              : 'rgba(22, 27, 46, 0.8)',
            borderColor: mode === 'light' ? '#059669' : '#00E5A0',
          },
          '&.Mui-focused': {
            backgroundColor: mode === 'light' ? '#FFFFFF' : 'rgba(22, 27, 46, 0.9)',
            boxShadow: mode === 'light'
              ? '0 0 0 2px rgba(5, 150, 105, 0.3)'
              : '0 0 0 2px rgba(0, 229, 160, 0.3)',
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: mode === 'light' 
    ? [
        'none',
        '0 1px 3px rgba(0, 0, 0, 0.05)',
        '0 4px 6px rgba(0, 0, 0, 0.07)',
        '0 8px 15px rgba(0, 0, 0, 0.1)',
        '0 12px 25px rgba(0, 0, 0, 0.12)',
        '0 16px 35px rgba(0, 0, 0, 0.15)',
      ]
    : [
        'none',
        '0 2px 4px rgba(0, 0, 0, 0.1)',
        '0 4px 8px rgba(0, 0, 0, 0.15)',
        '0 8px 16px rgba(0, 0, 0, 0.2)',
        '0 12px 24px rgba(0, 0, 0, 0.25)',
        '0 16px 32px rgba(0, 0, 0, 0.3)',
      ],
});

function App() {
  // Kullanıcının sistem tercihini algıla
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  // Tema modunu belirle (sistem tercihine göre)
  const themeMode = prefersDarkMode ? 'dark' : 'light';
  
  // Temayı oluştur
  const theme = useMemo(() => createAppTheme(themeMode), [themeMode]);

  // Sayfa title'ını ayarla
  useEffect(() => {
    document.title = 'Rick and Morty Characters - Explore the Multiverse';
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            body: {
              background: themeMode === 'light' 
                ? 'linear-gradient(135deg, #F8FAFC 0%, #E5E7EB 100%)'
                : 'linear-gradient(135deg, #0B0D17 0%, #161B2E 50%, #1A1F35 100%)',
              minHeight: '100vh',
              position: 'relative',
            },
            '*': {
              scrollbarWidth: 'thin',
              scrollbarColor: themeMode === 'light' 
                ? '#059669 #F1F5F9'
                : '#00E5A0 #161B2E',
            },
            '*::-webkit-scrollbar': {
              width: '8px',
            },
            '*::-webkit-scrollbar-track': {
              background: themeMode === 'light' ? '#F1F5F9' : '#161B2E',
              borderRadius: '4px',
            },
            '*::-webkit-scrollbar-thumb': {
              background: themeMode === 'light'
                ? 'linear-gradient(135deg, #059669 0%, #0EA5E9 100%)'
                : 'linear-gradient(135deg, #00E5A0 0%, #00D4FF 100%)',
              borderRadius: '4px',
            },
            '*::-webkit-scrollbar-thumb:hover': {
              background: themeMode === 'light'
                ? 'linear-gradient(135deg, #10B981 0%, #38BDF8 100%)'
                : 'linear-gradient(135deg, #4FFFC4 0%, #5DDDFF 100%)',
            },
          }}
        />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box
            sx={{
              textAlign: 'center',
              mb: 4,
              position: 'relative',
            }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{
                mb: 2,
                background: 'linear-gradient(135deg, #00E5A0 0%, #00D4FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 4px 20px rgba(0, 229, 160, 0.3)',
                animation: 'fadeInUp 1s ease-out',
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
              }}
            >
              Rick and Morty Characters
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                opacity: 0.8,
                animation: 'fadeInUp 1s ease-out 0.2s both',
              }}
            >
              Explore the multiverse of characters
            </Typography>
          </Box>
          <FilterForm />
          <CharactersTable />
          <CharacterDetail />
        </Container>
      </ThemeProvider>
    </Provider>
  );
}

export default App;