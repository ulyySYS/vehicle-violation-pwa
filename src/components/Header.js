import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';
import Tooltip from '@mui/material/Tooltip';

function Header({ isOnline }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Vehicle Violation Tracker
          </RouterLink>
        </Typography>

        {/* Show online/offline status indicator */}
        <Tooltip title={isOnline ? 'Online' : 'Offline'}>
          <IconButton color="inherit" edge="start" size="small" sx={{ mr: 2 }}>
            {isOnline ? <WifiIcon /> : <WifiOffIcon />}
          </IconButton>
        </Tooltip>

        {/* Navigation buttons */}
        <Box>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
            startIcon={<ListIcon />}
          >
            Violations
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/add"
            startIcon={<AddIcon />}
          >
            Add New
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;