import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { forgotPassword, clearError, clearSuccess } from '../store/slices/authSlice';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.auth);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('validation.invalidEmail'))
      .required(t('validation.required')),
  });

  useEffect(() => {
    if (success) {
      // Redirect to login after successful password reset request
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  }, [success, navigate]);

  const formik = useFormik({
    initialValues: {
      email: localStorage.getItem('rememberedEmail') || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await dispatch(forgotPassword(values.email));
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {t('auth.forgotPassword')}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
            {t('auth.resetInstructionsSent')}
          </Alert>
        )}
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label={t('auth.email')}
            name="email"
            autoComplete="email"
            autoFocus
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : t('auth.sendResetInstructions')}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Link component={RouterLink} to="/login" variant="body2">
              {t('auth.backToLogin')}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword; 