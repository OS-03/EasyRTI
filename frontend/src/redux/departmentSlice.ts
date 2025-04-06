import { createSlice } from "@reduxjs/toolkit";

const departmentSlice = createSlice({
    name:"department",
    initialState:{
        singleDepartment:null,
        departments:[],
        searchDepartmentByText:"",
    },
    reducers:{
        // actions
        setSingleDepartment:(state,action) => {
            state.singleDepartment = action.payload;
        },
        setDepartments:(state,action) => {
            state.departments = action.payload;
        },
        setSearchDepartmentByText:(state,action) => {
            state.searchDepartmentByText = action.payload;
        }
    }
});
export const {setSingleDepartment,  setDepartments, setSearchDepartmentByText} = departmentSlice.actions;
export default departmentSlice.reducer;