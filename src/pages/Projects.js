import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import { projectSchema } from '../utils/validation';
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  setSelectedProject,
} from '../store/slices/projectSlice';

const ProjectForm = ({ open, onClose, initialValues, onSubmit }) => {
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: initialValues || {
      name: '',
      description: '',
      client: '',
      startDate: '',
      endDate: '',
      status: 'pending',
    },
    validationSchema: projectSchema,
    onSubmit: (values) => {
      onSubmit(values);
      onClose();
    },
    enableReinitialize: true,
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialValues ? t('projects.editProject') : t('projects.newProject')}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            name="name"
            label={t('projects.projectName')}
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && t(formik.errors.name)}
          />
          <TextField
            fullWidth
            margin="normal"
            name="description"
            label={t('projects.projectDescription')}
            multiline
            rows={3}
            value={formik.values.description}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="client"
            label={t('projects.client')}
            value={formik.values.client}
            onChange={formik.handleChange}
            error={formik.touched.client && Boolean(formik.errors.client)}
            helperText={formik.touched.client && t(formik.errors.client)}
          />
          <TextField
            fullWidth
            margin="normal"
            name="startDate"
            label={t('projects.startDate')}
            type="date"
            value={formik.values.startDate}
            onChange={formik.handleChange}
            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
            helperText={formik.touched.startDate && t(formik.errors.startDate)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="normal"
            name="endDate"
            label={t('projects.endDate')}
            type="date"
            value={formik.values.endDate}
            onChange={formik.handleChange}
            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
            helperText={formik.touched.endDate && t(formik.errors.endDate)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="normal"
            name="status"
            label={t('projects.status')}
            select
            value={formik.values.status}
            onChange={formik.handleChange}
            error={formik.touched.status && Boolean(formik.errors.status)}
            helperText={formik.touched.status && t(formik.errors.status)}
          >
            <MenuItem value="pending">{t('projects.statusPending')}</MenuItem>
            <MenuItem value="in_progress">{t('projects.statusInProgress')}</MenuItem>
            <MenuItem value="completed">{t('projects.statusCompleted')}</MenuItem>
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button onClick={formik.handleSubmit} variant="contained">
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Projects = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { projects: projectsList, loading } = useSelector(
    (state) => state.projects
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleOpenDialog = (project = null) => {
    if (project) {
      const formattedProject = {
        ...project,
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
      };
      setSelectedProject(formattedProject);
    } else {
      setSelectedProject(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedProject(null);
    setOpenDialog(false);
  };

  const handleSubmit = async (values) => {
    try {
      if (selectedProject) {
        await dispatch(updateProject({ id: selectedProject.id, projectData: values })).unwrap();
      } else {
        await dispatch(createProject(values)).unwrap();
      }
      await dispatch(fetchProjects());
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('common.confirmDelete'))) {
      try {
        await dispatch(deleteProject(id)).unwrap();
        await dispatch(fetchProjects());
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const filteredProjects = projectsList.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4">{t('projects.title')}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          {t('projects.newProject')}
        </Button>
      </Box>

      <TextField
        fullWidth
        margin="normal"
        label={t('common.search')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('projects.projectName')}</TableCell>
              <TableCell>{t('projects.client')}</TableCell>
              <TableCell>{t('projects.startDate')}</TableCell>
              <TableCell>{t('projects.endDate')}</TableCell>
              <TableCell>{t('projects.status')}</TableCell>
              <TableCell align="right">{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.client}</TableCell>
                <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(project.endDate).toLocaleDateString()}</TableCell>
                <TableCell>{t(`projects.status${project.status}`)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(project)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(project.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ProjectForm
        open={openDialog}
        onClose={handleCloseDialog}
        initialValues={selectedProject}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

export default Projects; 