import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchEstimations = createAsyncThunk(
  'estimations/fetchEstimations',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.get('/estimations', { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchEstimationById = createAsyncThunk(
  'estimations/fetchEstimationById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/estimations/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createEstimation = createAsyncThunk(
  'estimations/createEstimation',
  async (estimationData, { rejectWithValue }) => {
    try {
      const response = await api.post('/estimations', estimationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateEstimation = createAsyncThunk(
  'estimations/updateEstimation',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/estimations/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteEstimation = createAsyncThunk(
  'estimations/deleteEstimation',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/estimations/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const addSection = createAsyncThunk(
  'estimations/addSection',
  async ({ estimationId, sectionData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/estimations/${estimationId}/sections`,
        sectionData
      );
      return { estimationId, section: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateSection = createAsyncThunk(
  'estimations/updateSection',
  async ({ estimationId, sectionId, sectionData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/estimations/${estimationId}/sections/${sectionId}`,
        sectionData
      );
      return { estimationId, sectionId, section: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteSection = createAsyncThunk(
  'estimations/deleteSection',
  async ({ estimationId, sectionId }, { rejectWithValue }) => {
    try {
      await api.delete(`/estimations/${estimationId}/sections/${sectionId}`);
      return { estimationId, sectionId };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addItem = createAsyncThunk(
  'estimations/addItem',
  async ({ estimationId, sectionId, itemData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/estimations/${estimationId}/sections/${sectionId}/items`,
        itemData
      );
      return { estimationId, sectionId, item: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateItem = createAsyncThunk(
  'estimations/updateItem',
  async ({ estimationId, sectionId, itemId, itemData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/estimations/${estimationId}/sections/${sectionId}/items/${itemId}`,
        itemData
      );
      return { estimationId, sectionId, itemId, item: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteItem = createAsyncThunk(
  'estimations/deleteItem',
  async ({ estimationId, sectionId, itemId }, { rejectWithValue }) => {
    try {
      await api.delete(
        `/estimations/${estimationId}/sections/${sectionId}/items/${itemId}`
      );
      return { estimationId, sectionId, itemId };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  estimations: [],
  currentEstimation: null,
  filters: {
    search: '',
    startDate: null,
    endDate: null,
    status: null,
  },
  loading: false,
  error: null,
  totalItems: 0,
  currentPage: 1,
  itemsPerPage: 10,
};

const estimationSlice = createSlice({
  name: 'estimations',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Estimations
      .addCase(fetchEstimations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEstimations.fulfilled, (state, action) => {
        state.loading = false;
        state.estimations = action.payload.items || [];
        state.totalItems = action.payload.total || 0;
      })
      .addCase(fetchEstimations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch estimations';
      })
      // Fetch Single Estimation
      .addCase(fetchEstimationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEstimationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEstimation = action.payload;
      })
      .addCase(fetchEstimationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch estimation';
      })
      // Create Estimation
      .addCase(createEstimation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEstimation.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.estimations = [action.payload, ...state.estimations];
          state.totalItems += 1;
        }
      })
      .addCase(createEstimation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create estimation';
      })
      // Update Estimation
      .addCase(updateEstimation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEstimation.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.estimations.findIndex(e => e.id === action.payload.id);
          if (index !== -1) {
            state.estimations[index] = action.payload;
          }
          if (state.currentEstimation?.id === action.payload.id) {
            state.currentEstimation = action.payload;
          }
        }
      })
      .addCase(updateEstimation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update estimation';
      })
      // Delete Estimation
      .addCase(deleteEstimation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEstimation.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.estimations = state.estimations.filter(e => e.id !== action.payload);
          state.totalItems -= 1;
          if (state.currentEstimation?.id === action.payload) {
            state.currentEstimation = null;
          }
        }
      })
      .addCase(deleteEstimation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete estimation';
      })
      // Add Section
      .addCase(addSection.fulfilled, (state, action) => {
        const estimation = state.estimations.find(
          (e) => e.id === action.payload.estimationId
        );
        if (estimation) {
          estimation.sections.push(action.payload.section);
        }
      })
      // Update Section
      .addCase(updateSection.fulfilled, (state, action) => {
        const estimation = state.estimations.find(
          (e) => e.id === action.payload.estimationId
        );
        if (estimation) {
          const sectionIndex = estimation.sections.findIndex(
            (s) => s.id === action.payload.sectionId
          );
          if (sectionIndex !== -1) {
            estimation.sections[sectionIndex] = action.payload.section;
          }
        }
      })
      // Delete Section
      .addCase(deleteSection.fulfilled, (state, action) => {
        const estimation = state.estimations.find(
          (e) => e.id === action.payload.estimationId
        );
        if (estimation) {
          estimation.sections = estimation.sections.filter(
            (s) => s.id !== action.payload.sectionId
          );
        }
      })
      // Add Item
      .addCase(addItem.fulfilled, (state, action) => {
        const estimation = state.estimations.find(
          (e) => e.id === action.payload.estimationId
        );
        if (estimation) {
          const section = estimation.sections.find(
            (s) => s.id === action.payload.sectionId
          );
          if (section) {
            section.items.push(action.payload.item);
          }
        }
      })
      // Update Item
      .addCase(updateItem.fulfilled, (state, action) => {
        const estimation = state.estimations.find(
          (e) => e.id === action.payload.estimationId
        );
        if (estimation) {
          const section = estimation.sections.find(
            (s) => s.id === action.payload.sectionId
          );
          if (section) {
            const itemIndex = section.items.findIndex(
              (i) => i.id === action.payload.itemId
            );
            if (itemIndex !== -1) {
              section.items[itemIndex] = action.payload.item;
            }
          }
        }
      })
      // Delete Item
      .addCase(deleteItem.fulfilled, (state, action) => {
        const estimation = state.estimations.find(
          (e) => e.id === action.payload.estimationId
        );
        if (estimation) {
          const section = estimation.sections.find(
            (s) => s.id === action.payload.sectionId
          );
          if (section) {
            section.items = section.items.filter(
              (i) => i.id !== action.payload.itemId
            );
          }
        }
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setCurrentPage,
  setItemsPerPage,
  clearError,
} = estimationSlice.actions;

export default estimationSlice.reducer; 