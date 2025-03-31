import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import estimationReducer from './slices/estimationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    estimations: estimationReducer,
  },
});

export default store; 