import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import WifiOffIcon from '@mui/icons-material/WifiOff';

function OfflineNotice() {
  return (
    <Box sx={{ p: 2 }}>
      <Alert
        severity="warning"
        icon={<WifiOffIcon fontSize="inherit" />}
        sx={{
          '& .MuiAlert-icon': {
            alignItems: 'center'
          }
        }}
      >
        <AlertTitle>You are offline</AlertTitle>
        You can still view and add vehicle violations. All changes will be synchronized once you're back online.
      </Alert>
    </Box>
  );
}

export default OfflineNotice;