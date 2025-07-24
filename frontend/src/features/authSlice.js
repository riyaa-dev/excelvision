import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const API_URL = "http://localhost:5000/api/auth";

export const registerUser = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
  try {
    const res = await axios.post(`${API_URL}/register`, userData);
    localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || { message: "Registration failed" });
  }
});

export const loginUser = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
  try {
    const res = await axios.post(`${API_URL}/login`, userData);
     localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || { message: "Login failed" });
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token")
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, state => { state.loading = true; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(loginUser.pending, state => { state.loading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
         state.token = action.payload.token;

        localStorage.setItem("token", action.payload.token);

      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;