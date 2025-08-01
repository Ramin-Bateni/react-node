import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApi } from '../../services/api'

export const fetchMeetingData = createAsyncThunk('fetchMeetingData', async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        const url=user.role === 'superAdmin' 
        ? 'api/meeting' 
        : `api/meeting/?createBy=${user._id}`;
        
        const response = await getApi(url);

        return response;
    } catch (error) {
        throw error;
    }
});

const meetingSlice = createSlice({
    name: 'meetingData',
    initialState: {
        data: [],
        isLoading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            // fetching
            .addCase(fetchMeetingData.pending, (state) => {
                state.isLoading = true;
            })
            // success
            .addCase(fetchMeetingData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = "";
            })
            // error
            .addCase(fetchMeetingData.rejected, (state, action) => {
                state.isLoading = false;
                state.data = [];
                state.error = action.error.message;
            });
    },
});

export default meetingSlice.reducer;