import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  fetchEstimations,
  createEstimation,
  updateEstimation,
  deleteEstimation,
  setFilters,
  setCurrentPage,
  setItemsPerPage,
} from '../store/slices/estimationSlice';
import EstimationForm from '../components/estimations/EstimationForm';
import { formatCurrency } from '../utils/helpers';

const Estimations = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    estimations = [],
    loading,
    error,
    filters,
    totalItems,
    currentPage,
    itemsPerPage,
  } = useSelector((state) => state.estimations);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEstimation, setSelectedEstimation] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [estimationToDelete, setEstimationToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchEstimations({ ...filters, page: currentPage, limit: itemsPerPage }));
  }, [dispatch, filters, currentPage, itemsPerPage]);

  const handleCreateEstimation = async (values) => {
    try {
      await dispatch(createEstimation(values)).unwrap();
      setOpenDialog(false);
      dispatch(fetchEstimations({ ...filters, page: currentPage, limit: itemsPerPage }));
    } catch (error) {
      console.error('Failed to create estimation:', error);
    }
  };

  const handleUpdateEstimation = async (values) => {
    try {
      await dispatch(updateEstimation({ id: selectedEstimation.id, data: values })).unwrap();
      setOpenDialog(false);
      setSelectedEstimation(null);
      dispatch(fetchEstimations({ ...filters, page: currentPage, limit: itemsPerPage }));
    } catch (error) {
      console.error('Failed to update estimation:', error);
    }
  };

  const handleDeleteEstimation = async () => {
    try {
      await dispatch(deleteEstimation(estimationToDelete.id)).unwrap();
      setDeleteConfirmOpen(false);
      setEstimationToDelete(null);
      dispatch(fetchEstimations({ ...filters, page: currentPage, limit: itemsPerPage }));
    } catch (error) {
      console.error('Failed to delete estimation:', error);
    }
  };

  const handleFilterChange = (field, value) => {
    dispatch(setFilters({ ...filters, [field]: value }));
  };

  const handlePageChange = (event, newPage) => {
    dispatch(setCurrentPage(newPage + 1));
  };

  const handleRowsPerPageChange = (event) => {
    dispatch(setItemsPerPage(parseInt(event.target.value, 10)));
    dispatch(setCurrentPage(1));
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="h4">{t('estimations.title')}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedEstimation(null);
                setOpenDialog(true);
              }}
            >
              {t('estimations.create')}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={t('common.search')}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  endAdornment: <SearchIcon />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DatePicker
                label={t('estimations.startDate')}
                value={filters.startDate || null}
                onChange={(date) => handleFilterChange('startDate', date)}
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    error: false,
                    size: "small"
                  } 
                }}
                format="YYYY-MM-DD"
                disablePortal
                closeOnSelect
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DatePicker
                label={t('estimations.endDate')}
                value={filters.endDate || null}
                onChange={(date) => handleFilterChange('endDate', date)}
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    error: false,
                    size: "small"
                  } 
                }}
                format="YYYY-MM-DD"
                disablePortal
                closeOnSelect
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ p: 3 }}>
          {error}
        </Typography>
      ) : estimations.length === 0 ? (
        <Typography sx={{ p: 3, textAlign: 'center' }}>
          {t('estimations.noEstimations')}
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('estimations.name')}</TableCell>
                <TableCell>{t('estimations.sections')}</TableCell>
                <TableCell>{t('estimations.items')}</TableCell>
                <TableCell>{t('estimations.total')}</TableCell>
                <TableCell>{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {estimations.map((estimation) => (
                <TableRow key={estimation.id}>
                  <TableCell>{estimation.name}</TableCell>
                  <TableCell>{estimation.sections?.length || 0}</TableCell>
                  <TableCell>
                    {estimation.sections?.reduce(
                      (total, section) => total + (section.items?.length || 0),
                      0
                    ) || 0}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(
                      estimation.sections?.reduce(
                        (total, section) =>
                          total +
                          section.items?.reduce((itemTotal, item) => {
                            const baseAmount = item.quantity * item.price;
                            return itemTotal + baseAmount + baseAmount * (item.margin / 100);
                          }, 0) || 0,
                        0
                      ) || 0
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setSelectedEstimation(estimation);
                        setOpenDialog(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setEstimationToDelete(estimation);
                        setDeleteConfirmOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={totalItems}
            page={currentPage - 1}
            onPageChange={handlePageChange}
            rowsPerPage={itemsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </TableContainer>
      )}

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedEstimation(null);
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {selectedEstimation
            ? t('estimations.edit')
            : t('estimations.create')}
        </DialogTitle>
        <DialogContent>
          <EstimationForm
            initialValues={selectedEstimation}
            onSubmit={selectedEstimation ? handleUpdateEstimation : handleCreateEstimation}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setEstimationToDelete(null);
        }}
      >
        <DialogTitle>{t('common.confirmDelete')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('estimations.deleteConfirmation', {
              name: estimationToDelete?.name,
            })}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              onClick={() => {
                setDeleteConfirmOpen(false);
                setEstimationToDelete(null);
              }}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteEstimation}
            >
              {t('common.delete')}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Estimations; 