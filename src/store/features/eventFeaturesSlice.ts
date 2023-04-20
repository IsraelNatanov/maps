import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeaturesState } from "./typeOfSlice";



  
  const initialState: FeaturesState = {
    features: [],
  };
  export const fetchFature = createAsyncThunk(
    "feature/fetch",
    async (thunkAPI) => {
      const response = await fetch("http://localhost:9000/fullFeatures", {
        method: "GET",
      });
      const data = response.json();
      return data;
    },
  );

  export const FeatureSlice = createSlice({
    name: "feature",
    initialState,
    reducers: {
    //   addPerson: (state, action: PayloadAction<{ name: string }>) => {
    //     state.persons.push({
    //       id: state.persons.length,
    //       name: action.payload.name,
    //     });
    //   },
    },
    extraReducers: (builder) => {
      builder.addCase(fetchFature.fulfilled, (state, action) => {
        state.features = action.payload;
      });
  
    
    },
  });
  
  export default FeatureSlice.reducer;
//   export const { addPerson } = FeatureSlice.actions;


