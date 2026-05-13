'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert, 
  Snackbar,
  CircularProgress,
  IconButton,
  Breadcrumbs,
  Link
} from '@mui/material';
import { 
  Send as SendIcon, 
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function SendEmailPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    to_email: '',
    subject: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'success' as 'success' | 'error' });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: 'Email sent successfully!', type: 'success' });
        setFormData({ to_email: '', subject: '', content: '' });
      } else {
        setMessage({ text: data.detail || 'Failed to send email', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
          <Link 
            component="button"
            onClick={() => router.push('/')}
            sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: '#d1fc00' } }}
          >
            Home
          </Link>
          <Typography color="white">Admin</Typography>
          <Typography color="#d1fc00">Send Email</Typography>
        </Breadcrumbs>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => router.back()} 
            sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
            Send <span style={{ color: '#d1fc00' }}>Email</span>
          </Typography>
        </Box>
      </Box>

      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          bgcolor: 'rgba(255,255,255,0.03)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 4
        }}
      >
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Recipient Email"
              name="to_email"
              type="email"
              required
              value={formData.to_email}
              onChange={handleChange}
              variant="outlined"
              placeholder="user@example.com"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: '#d1fc00' },
                  '&.Mui-focused fieldset': { borderColor: '#d1fc00' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#d1fc00' },
              }}
            />

            <TextField
              fullWidth
              label="Subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: '#d1fc00' },
                  '&.Mui-focused fieldset': { borderColor: '#d1fc00' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#d1fc00' },
              }}
            />

            <TextField
              fullWidth
              label="Message Content"
              name="content"
              required
              multiline
              rows={8}
              value={formData.content}
              onChange={handleChange}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: '#d1fc00' },
                  '&.Mui-focused fieldset': { borderColor: '#d1fc00' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#d1fc00' },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              sx={{
                py: 1.5,
                bgcolor: '#d1fc00',
                color: 'black',
                fontWeight: 700,
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: '#b8e000',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
                mt: 2
              }}
            >
              {loading ? 'Sending...' : 'Send Notification'}
            </Button>
          </Box>
        </form>
      </Paper>

      <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(209, 252, 0, 0.05)', borderRadius: 2, border: '1px dashed rgba(209, 252, 0, 0.3)' }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmailIcon sx={{ fontSize: 16, color: '#d1fc00' }} />
          Note: This email will be sent from <strong>{process.env.NEXT_PUBLIC_FROM_EMAIL || 'hieuvovan2409@gmail.com'}</strong>.
        </Typography>
      </Box>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={message.type} 
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Container>
  );
}
