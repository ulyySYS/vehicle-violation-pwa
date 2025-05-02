import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import Header from './components/Header';
import ViolationList from './components/ViolationList';
import ViolationForm from './components/ViolationForm';
import OfflineNotice from './components/OfflineNotice';
import Toast from './components/Toast';

// Hooks and services
import useOnlineStatus from './hooks/useOnlineStatus';
import { initDB, getViolations, addViolation } from './services/db';
import { setupSyncListeners } from './services/sync';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', type: 'info' });
  const isOnline = useOnlineStatus();

  useEffect(() => {
    // Initialize the database and load violations
    async function loadData() {
      try {
        await initDB();
        const data = await getViolations();
        setViolations(data);
      } catch (error) {
        console.error('Failed to load violations:', error);
        showToast('Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    }

    loadData();

    // Set up sync listeners
    setupSyncListeners((result) => {
      if (result.success) {
        showToast(result.message, 'success');
        // Reload data after sync
        loadData();
      } else {
        showToast(result.message, 'error');
      }
    });
  }, []);

  // Show toast notification
  const showToast = (message, type = 'info') => {
    setToast({
      open: true,
      message,
      type,
    });
  };

  // Handle toast close
  const handleToastClose = () => {
    setToast({ ...toast, open: false });
  };

  // Handle adding a new violation
  const handleAddViolation = async (violationData) => {
    try {
      const newViolation = await addViolation(violationData);
      setViolations([...violations, newViolation]);
      
      showToast(
        isOnline 
          ? 'Violation added successfully' 
          : 'Violation saved offline. Will sync when online.',
        'success'
      );
      
      return true;
    } catch (error) {
      console.error('Failed to add violation:', error);
      showToast('Failed to add violation', 'error');
      return false;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app-container">
          <Header isOnline={isOnline} />
          
          {/* Show offline notice when not connected */}
          {!isOnline && <OfflineNotice />}
          
          <Routes>
            <Route 
              path="/" 
              element={
                <ViolationList 
                  violations={violations} 
                  loading={loading} 
                />
              } 
            />
            <Route 
              path="/add" 
              element={
                <ViolationForm 
                  onSubmit={handleAddViolation} 
                  isOnline={isOnline}
                />
              } 
            />
          </Routes>
          
          {/* Toast notifications */}
          <Toast
            open={toast.open}
            message={toast.message}
            type={toast.type}
            onClose={handleToastClose}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;