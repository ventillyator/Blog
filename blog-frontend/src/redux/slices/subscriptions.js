import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

// Асинхронные экшены для получения постов подписанных пользователей и подписки на пользователя
export const fetchSubscribedPosts = createAsyncThunk('subscriptions/fetchSubscribedPosts', async () => {
    const { data } = await axios.get('/users/subscriptions/posts');
    return data;
});

export const subscribeToUser = createAsyncThunk('subscriptions/subscribeToUser', async (userId) => {
    const { data } = await axios.post('/users/subscribe', { userId });
    return data;
});

const subscriptionsSlice = createSlice({
    name: 'subscriptions',
    initialState: {
        posts: {
            items: [],
            status: 'idle'
        },
        status: 'idle'
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubscribedPosts.pending, (state) => {
                state.posts.status = 'loading';
            })
            .addCase(fetchSubscribedPosts.fulfilled, (state, action) => {
                state.posts.items = action.payload;
                state.posts.status = 'succeeded';
            })
            .addCase(fetchSubscribedPosts.rejected, (state) => {
                state.posts.status = 'failed';
            })
            .addCase(subscribeToUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(subscribeToUser.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(subscribeToUser.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export default subscriptionsSlice.reducer;
