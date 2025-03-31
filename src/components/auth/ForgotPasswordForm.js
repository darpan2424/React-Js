import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Link as MuiLink,
} from '@mui/material';
import { auth } from '../../services/api';

const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('validation.invalidEmail')
    .required('validation.required'),
});

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await auth.forgotPassword(values.email);
        navigate('/login', {
          state: { message: t('auth.passwordResetSuccess') },
        });
      } catch (error) {
        setErrors({ submit: error.response?.data?.message || 'Request failed' });
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
          {t('auth.forgotPassword')}
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
            {t('auth.forgotPassword')}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <MuiLink component={Link} to="/login" variant="body2">
              {t('auth.login')}
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPasswordForm; 