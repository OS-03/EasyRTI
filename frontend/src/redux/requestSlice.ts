import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
    name:"request",
    initialState:{
        allRequests:[],
        allAdminResponse:[],
        singleRequest:null, 
        searchRequestByText:"",
        allsubmittedRequests:[], // Add this field to store submitted requests
        searchedQuery:"",
    },
    reducers:{
        // actions
        setAllRequests:(state,action) => {
            state.allRequests = action.payload;
        },
        setSingleRequest:(state,action) => {
            state.singleRequest = action.payload;
        },
        setAllAdminResponse:(state,action) => {
            state.allAdminResponse = action.payload;
        },
        setSearchRequestByText:(state,action) => {
            state.searchRequestByText = action.payload;
        },
        setAllSubmittedRequests:(state,action) => {
            state.allsubmittedRequests = action.payload; // Update submitted requests
        },
        setSearchedQuery:(state,action) => {
            state.searchedQuery = action.payload;
        },
    }
});
export const {
    setAllRequests, 
    setSingleRequest, 
    setAllAdminResponse,
    setSearchRequestByText, 
    setAllSubmittedRequests,
    setSearchedQuery,
} = requestSlice.actions;
export default requestSlice.reducer;