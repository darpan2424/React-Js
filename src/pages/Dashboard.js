import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
} from '@mui/material';
import {
  Business,
  Calculate,
  Assignment,
  CheckCircle,
  Pending,
  Error,
} from '@mui/icons-material';
import { fetchProjects } from '../store/slices/projectSlice';
import { fetchEstimations } from '../store/slices/estimationSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { projects: projectsList, loading: projectsLoading } = useSelector(
    (state) => state.projects
  );
  const { estimations: estimationsList, loading: estimationsLoading } =
    useSelector((state) => state.estimations);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchProjects());
        await dispatch(fetchEstimations());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle color="success" />;
      case 'pending':
        return <Pending color="warning" />;
      default:
        return <Error color="error" />;
    }
  };

  const recentProjects = projectsList.slice(0, 5);
  const recentEstimations = estimationsList.slice(0, 5);

  if (projectsLoading || estimationsLoading) {
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
      <Typography variant="h4" gutterBottom>
        {t('dashboard.welcome')}
      </Typography>
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Business sx={{ mr: 1 }} />
              <Typography variant="h6">{t('dashboard.totalProjects')}</Typography>
            </Box>
            <Typography variant="h4">{projectsList.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Calculate sx={{ mr: 1 }} />
              <Typography variant="h6">
                {t('dashboard.totalEstimations')}
              </Typography>
            </Box>
            <Typography variant="h4">{estimationsList.length}</Typography>
          </Paper>
        </Grid>

        {/* Recent Projects */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.recentProjects')}
            </Typography>
            <List>
              {recentProjects.map((project) => (
                <ListItem key={project.id}>
                  <ListItemIcon>
                    {getStatusIcon(project.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={project.name}
                    secondary={project.client}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Estimations */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.recentEstimations')}
            </Typography>
            <List>
              {recentEstimations.map((estimation) => (
                <ListItem key={estimation.id}>
                  <ListItemIcon>
                    <Assignment />
                  </ListItemIcon>
                  <ListItemText
                    primary={estimation.title}
                    secondary={estimation.client}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 