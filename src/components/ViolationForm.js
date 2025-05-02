import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// Violation types
const violationTypes = [
  'Illegal Parking',
  'Speeding',
  'Red Light',
  'No Seatbelt',
  'Expired Registration',
  'Driving Under Influence',
  'Improper Lane Change',
  'Using Phone While Driving',
  'Expired License',
  'Other'
];

function ViolationForm({ onSubmit, isOnline }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    plateNumber: '',
    violationType: '',
    location: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formValues.plateNumber.trim()) {
      newErrors.plateNumber = 'Plate number is required';
    }
    
    if (!formValues.violationType) {
      newErrors.violationType = 'Violation type is required';
    }
    
    if (!formValues.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Create violation object with timestamp
      const violationData = {
        ...formValues,
        timestamp: new Date().toISOString()
      };
      
      // Submit the form data
      const success = await onSubmit(violationData);
      
      if (success) {
        // Navigate back to the list page
        navigate('/');
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Record New Violation
      </Typography>
      
      {!isOnline && (
        <Alert severity="info" sx={{ mb: 2 }}>
          You're currently offline. The violation will be stored locally and synced when you're back online.
        </Alert>
      )}
      
      <Paper elevation={2} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="License Plate Number"
            name="plateNumber"
            value={formValues.plateNumber}
            onChange={handleChange}
            error={!!errors.plateNumber}
            helperText={errors.plateNumber}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField
            fullWidth
            select
            label="Violation Type"
            name="violationType"
            value={formValues.violationType}
            onChange={handleChange}
            error={!!errors.violationType}
            helperText={errors.violationType}
            margin="normal"
            required
          >
            {violationTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formValues.location}
            onChange={handleChange}
            error={!!errors.location}
            helperText={errors.location}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField
            fullWidth
            label="Additional Notes"
            name="notes"
            value={formValues.notes}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
            InputLabelProps={{ shrink: true }}
          />
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/')}
              startIcon={<CancelIcon />}
              disabled={loading}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={24} /> : <SaveIcon />}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Violation'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default ViolationForm;