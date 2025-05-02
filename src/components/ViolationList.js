import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AddIcon from '@mui/icons-material/Add';
import { format } from 'date-fns';

function ViolationList({ violations, loading }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter violations based on search term
  const filteredViolations = violations.filter(
    (violation) =>
      violation.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.violationType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format the date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1">
          Vehicle Violations
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/add"
        >
          Add Violation
        </Button>
      </Box>

      {/* Search field */}
      <TextField
        fullWidth
        margin="normal"
        variant="outlined"
        placeholder="Search by plate number or violation type"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Violations list */}
      <Paper elevation={2} sx={{ mt: 2 }}>
        {filteredViolations.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="subtitle1" color="text.secondary">
              No violations found.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              component={RouterLink}
              to="/add"
              sx={{ mt: 2 }}
            >
              Add Your First Violation
            </Button>
          </Box>
        ) : (
          <List>
            {filteredViolations.map((violation, index) => (
              <React.Fragment key={violation.id}>
                <ListItem alignItems="flex-start">
                  <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                    <DirectionsCarIcon color="action" fontSize="large" />
                  </Box>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" component="span">
                          {violation.plateNumber}
                        </Typography>
                        <Chip
                          label={violation.violationType}
                          color="primary"
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {violation.location}
                        </Typography>
                        <Typography component="div" variant="body2" color="text.secondary">
                          {formatDate(violation.timestamp)}
                        </Typography>
                        {violation.notes && (
                          <Typography component="div" variant="body2">
                            {violation.notes}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
                {index < filteredViolations.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}

export default ViolationList;