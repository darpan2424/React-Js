import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  rememberMe: Yup.boolean(),
});

export const registerSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

export const projectSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .required('Name is required'),
  description: Yup.string(),
  client: Yup.string().required('Client is required'),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date()
    .min(Yup.ref('startDate'), 'End date must be after start date')
    .required('End date is required'),
  status: Yup.string()
    .oneOf(['active', 'completed', 'onHold'], 'Invalid status')
    .required('Status is required'),
});

export const estimationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .required('Title is required'),
  projectId: Yup.string().required('Project is required'),
  sections: Yup.array().of(
    Yup.object().shape({
      title: Yup.string()
        .min(3, 'Section title must be at least 3 characters')
        .required('Section title is required'),
      items: Yup.array().of(
        Yup.object().shape({
          name: Yup.string()
            .min(3, 'Item name must be at least 3 characters')
            .required('Item name is required'),
          quantity: Yup.number()
            .min(0, 'Quantity must be greater than or equal to 0')
            .required('Quantity is required'),
          unitPrice: Yup.number()
            .min(0, 'Unit price must be greater than or equal to 0')
            .required('Unit price is required'),
        })
      ),
    })
  ),
}); 