import {configureStore} from '@reduxjs/toolkit';
import jobSlice from './jobSlice';

const store = configureStore({
  reducer: {
    jobSlice: jobSlice,
  },
});

export default store;
