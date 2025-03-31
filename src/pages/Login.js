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
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
} from '@mui/material';
import { login, clearError, clearSuccess } from '../store/slices/authSlice';

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success, isAuthenticated } = useSelector((state) => state.auth);
  const [rememberMe, setRememberMe] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('validation.invalidEmail'))
      .required(t('validation.required')),
    password: Yup.string()
      .min(6, t('validation.minLength', { field: t('auth.password'), min: 6 }))
      .required(t('validation.required')),
  });

  useEffect(() => {
    // Check for stored credentials
    const storedEmail = localStorage.getItem('rememberedEmail');
    if (storedEmail) {
      setRememberMe(true);
    }

    // Clear any previous success/error states
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  useEffect(() => {
    // Redirect if already authenticated or on successful login
    if (isAuthenticated || success) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, success, navigate]);

  const formik = useFormik({
    initialValues: {
      email: localStorage.getItem('rememberedEmail') || '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(login(values)).unwrap();
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', values.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
      } catch (err) {
        // Error is handled by the reducer
        console.error('Login failed:', err);
      }
    },
  });

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
    if (!event.target.checked) {
      localStorage.removeItem('rememberedEmail');
    }
  };

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
          {t('auth.login')}
        </Typography>
        {error && (
          <Alert 
            severity="error" 
            sx={{ mt: 2, width: '100%' }}
            onClose={() => dispatch(clearError())}
          >
            {error}
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
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={t('auth.password')}
            type="password"
            id="password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            disabled={loading}
          />
          <FormControlLabel
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={rememberMe}
                onChange={handleRememberMeChange}
                disabled={loading}
              />
            }
            label={t('auth.rememberMe')}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : t('auth.login')}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link component={RouterLink} to="/forgot-password" variant="body2">
              {t('auth.forgotPassword')}
            </Link>
            <Link component={RouterLink} to="/register" variant="body2">
              {t('auth.noAccount')}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login; 