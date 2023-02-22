import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  job: null,
};

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    setJob(state, action) {
      state.job =  action.payload;
    },
  },
});

export const {setJob} = jobSlice.actions;
export default jobSlice.reducer;
