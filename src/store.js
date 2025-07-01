import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"
import favoryReducer from "./slices/favorySlice";

export default configureStore({
    reducer:{
        auth: authReducer,
        favory: favoryReducer,
        
    }
})


