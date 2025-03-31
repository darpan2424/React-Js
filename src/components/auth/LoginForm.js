import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Checkbox,
  FormControlLabel,
  Link as MuiLink,
} from '@mui/material';
import { loginSchema } from '../../utils/validation';
import { auth } from '../../services/api';
import { loginSuccess } from '../../store/slices/authSlice';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await auth.login(values);
        dispatch(loginSuccess(response.data));
        if (values.rememberMe) {
          localStorage.setItem('token', response.data.token);
        }
        navigate('/dashboard');
      } catch (error) {
        setErrors({ submit: error.response?.data?.message || 'Login failed' });
      } finally {
        setSubmitting(false);
      }
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
          {t('auth.login')}
        </Typography>
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
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && t(formik.errors.email)}
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
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && t(formik.errors.password)}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="rememberMe"
                color="primary"
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
              />
            }
            label={t('auth.rememberMe')}
          />
          {formik.errors.submit && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {formik.errors.submit}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={formik.isSubmitting}
          >
            {t('auth.login')}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <MuiLink component={Link} to="/register" variant="body2">
              {t('auth.register')}
            </MuiLink>
            <MuiLink component={Link} to="/forgot-password" variant="body2">
              {t('auth.forgotPassword')}
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm; 