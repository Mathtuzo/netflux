import { createSlice } from "@reduxjs/toolkit";

export const favorySlice = createSlice({
  name: "favory",
  initialState: {
    titles: [],
  },
  reducers: {
    addFavory: (state, action) => {
        console.log(action.payload)
      state.titles.push(action.payload)
      
    },
    removeFavory: (state, action)=>{
        state.titles = state.titles.filter((art)=> art.id != action.payload.id)
    }
   
  },
});

export const { addFavory,  removeFavory} = favorySlice.actions;
export default favorySlice.reducer;
