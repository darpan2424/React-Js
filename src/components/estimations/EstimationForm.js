import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useTranslation } from 'react-i18next';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string(),
  sections: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Section name is required'),
      description: Yup.string(),
      items: Yup.array().of(
        Yup.object().shape({
          title: Yup.string().required('Title is required'),
          description: Yup.string(),
          unit: Yup.string().required('Unit is required'),
          quantity: Yup.number()
            .required('Quantity is required')
            .min(0, 'Quantity must be positive'),
          price: Yup.number()
            .required('Price is required')
            .min(0, 'Price must be positive'),
          margin: Yup.number()
            .required('Margin is required')
            .min(0, 'Margin must be positive')
            .max(100, 'Margin must be less than 100'),
        })
      ),
    })
  ),
});

const calculateItemTotal = (item) => {
  const baseAmount = item.quantity * item.price;
  const marginAmount = baseAmount * (item.margin / 100);
  return baseAmount + marginAmount;
};

const calculateSectionTotal = (section) => {
  return section.items.reduce((total, item) => total + calculateItemTotal(item), 0);
};

const calculateEstimationTotal = (sections) => {
  return sections.reduce((total, section) => total + calculateSectionTotal(section), 0);
};

const EstimationForm = ({ initialValues, onSubmit }) => {
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: initialValues || {
      name: '',
      description: '',
      sections: [
        {
          name: '',
          description: '',
          items: [
            {
              title: '',
              description: '',
              unit: '',
              quantity: 0,
              price: 0,
              margin: 0,
            },
          ],
        },
      ],
    },
    validationSchema,
    onSubmit,
  });

  const addSection = () => {
    const sections = [...formik.values.sections];
    sections.push({
      name: '',
      description: '',
      items: [
        {
          title: '',
          description: '',
          unit: '',
          quantity: 0,
          price: 0,
          margin: 0,
        },
      ],
    });
    formik.setFieldValue('sections', sections);
  };

  const removeSection = (sectionIndex) => {
    const sections = [...formik.values.sections];
    sections.splice(sectionIndex, 1);
    formik.setFieldValue('sections', sections);
  };

  const addItem = (sectionIndex) => {
    const sections = [...formik.values.sections];
    sections[sectionIndex].items.push({
      title: '',
      description: '',
      unit: '',
      quantity: 0,
      price: 0,
      margin: 0,
    });
    formik.setFieldValue('sections', sections);
  };

  const removeItem = (sectionIndex, itemIndex) => {
    const sections = [...formik.values.sections];
    sections[sectionIndex].items.splice(itemIndex, 1);
    formik.setFieldValue('sections', sections);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          name="name"
          label={t('estimations.name')}
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          name="description"
          label={t('estimations.description')}
          multiline
          rows={3}
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
        />
      </Box>

      {formik.values.sections.map((section, sectionIndex) => (
        <Paper key={sectionIndex} sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">
              {t('estimations.section')} {sectionIndex + 1}
            </Typography>
            <IconButton
              color="error"
              onClick={() => removeSection(sectionIndex)}
              disabled={formik.values.sections.length === 1}
            >
              <RemoveIcon />
            </IconButton>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name={`sections.${sectionIndex}.name`}
                label={t('estimations.sectionName')}
                value={section.name}
                onChange={formik.handleChange}
                error={
                  formik.touched.sections?.[sectionIndex]?.name &&
                  Boolean(formik.errors.sections?.[sectionIndex]?.name)
                }
                helperText={
                  formik.touched.sections?.[sectionIndex]?.name &&
                  formik.errors.sections?.[sectionIndex]?.name
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name={`sections.${sectionIndex}.description`}
                label={t('estimations.sectionDescription')}
                value={section.description}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {t('estimations.items')}
            </Typography>
            {section.items.map((item, itemIndex) => (
              <Box key={itemIndex} sx={{ mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name={`sections.${sectionIndex}.items.${itemIndex}.title`}
                      label={t('estimations.itemTitle')}
                      value={item.title}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.sections?.[sectionIndex]?.items?.[itemIndex]?.title &&
                        Boolean(formik.errors.sections?.[sectionIndex]?.items?.[itemIndex]?.title)
                      }
                      helperText={
                        formik.touched.sections?.[sectionIndex]?.items?.[itemIndex]?.title &&
                        formik.errors.sections?.[sectionIndex]?.items?.[itemIndex]?.title
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name={`sections.${sectionIndex}.items.${itemIndex}.description`}
                      label={t('estimations.itemDescription')}
                      value={item.description}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      name={`sections.${sectionIndex}.items.${itemIndex}.unit`}
                      label={t('estimations.unit')}
                      value={item.unit}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.sections?.[sectionIndex]?.items?.[itemIndex]?.unit &&
                        Boolean(formik.errors.sections?.[sectionIndex]?.items?.[itemIndex]?.unit)
                      }
                      helperText={
                        formik.touched.sections?.[sectionIndex]?.items?.[itemIndex]?.unit &&
                        formik.errors.sections?.[sectionIndex]?.items?.[itemIndex]?.unit
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      type="number"
                      name={`sections.${sectionIndex}.items.${itemIndex}.quantity`}
                      label={t('estimations.quantity')}
                      value={item.quantity}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.sections?.[sectionIndex]?.items?.[itemIndex]?.quantity &&
                        Boolean(formik.errors.sections?.[sectionIndex]?.items?.[itemIndex]?.quantity)
                      }
                      helperText={
                        formik.touched.sections?.[sectionIndex]?.items?.[itemIndex]?.quantity &&
                        formik.errors.sections?.[sectionIndex]?.items?.[itemIndex]?.quantity
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      type="number"
                      name={`sections.${sectionIndex}.items.${itemIndex}.price`}
                      label={t('estimations.price')}
                      value={item.price}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.sections?.[sectionIndex]?.items?.[itemIndex]?.price &&
                        Boolean(formik.errors.sections?.[sectionIndex]?.items?.[itemIndex]?.price)
                      }
                      helperText={
                        formik.touched.sections?.[sectionIndex]?.items?.[itemIndex]?.price &&
                        formik.errors.sections?.[sectionIndex]?.items?.[itemIndex]?.price
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      type="number"
                      name={`sections.${sectionIndex}.items.${itemIndex}.margin`}
                      label={t('estimations.margin')}
                      value={item.margin}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.sections?.[sectionIndex]?.items?.[itemIndex]?.margin &&
                        Boolean(formik.errors.sections?.[sectionIndex]?.items?.[itemIndex]?.margin)
                      }
                      helperText={
                        formik.touched.sections?.[sectionIndex]?.items?.[itemIndex]?.margin &&
                        formik.errors.sections?.[sectionIndex]?.items?.[itemIndex]?.margin
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="body1">
                      {t('estimations.total')}: ${calculateItemTotal(item).toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <IconButton
                      color="error"
                      onClick={() => removeItem(sectionIndex, itemIndex)}
                      disabled={section.items.length === 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                </Grid>
                {itemIndex < section.items.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => addItem(sectionIndex)}
              sx={{ mt: 2 }}
            >
              {t('estimations.addItem')}
            </Button>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Typography variant="h6">
              {t('estimations.sectionTotal')}: ${calculateSectionTotal(section).toFixed(2)}
            </Typography>
          </Box>
        </Paper>
      ))}

      <Box sx={{ mb: 3 }}>
        <Button startIcon={<AddIcon />} onClick={addSection}>
          {t('estimations.addSection')}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          {t('estimations.estimationTotal')}: ${calculateEstimationTotal(formik.values.sections).toFixed(2)}
        </Typography>
        <Button variant="contained" color="primary" type="submit">
          {t('common.save')}
        </Button>
      </Box>
    </form>
  );
};

export default EstimationForm; 