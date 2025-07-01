import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials)=>{
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                if(
                    (credentials.identifiant === "admin" && credentials.password === "admin") ||
                    (credentials.identifiant === "user" && credentials.password === "user")
                ){
                    resolve({
                        id: credentials.identifiant === "admin" ? 1 : 2,
                        identifiant: credentials.identifiant,
                        password: credentials.password
                    })
                }else{
                    reject(new Error("Identifiant ou mot de passe incorrect"))
                }
            }, 1000)
        })
    }
)


const initialState = {
    isConnected: false,
    error: false,
    loading: false,
    user: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state, action)=>{
            state.isConnected = false
        }
    },
    extraReducers: (builder) =>{
        builder.addCase(loginUser.pending, (state, action)=>{
            state.loading = true

        })
        builder.addCase(loginUser.fulfilled, (state, action)=>{
            state.loading = false
            state.isConnected = true
            state.user = action.payload
            state.error = false
        })
        builder.addCase(loginUser.rejected, (state, action)=>{
            state.loading = false
            state.error = action.error.message
            state.isConnected = false
            state.user = null
        })
    }
})

export default authSlice.reducer
export const {logout } = authSlice.actions