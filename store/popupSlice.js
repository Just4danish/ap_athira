import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  item: null,
  
};

const popupSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    setPopupItem(state, action) {
      state.item =  action.payload;
    },
  },
});

export const {setPopupItem} = popupSlice.actions;
export default popupSlice.reducer;
