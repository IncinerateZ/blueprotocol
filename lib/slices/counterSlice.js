import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

export const counterSlice = createSlice({
    name: 'counter',
    initialState: { count: 0 },
    reducers: {
        addCounter: (state) => {
            state.count++;
        },
        setCounter: (state, action) => {
            state.count = action.payload;
        },
    },

    extraReducers: {
        [HYDRATE]: (state, action) => {
            console.log('[HYDRATE]', state, action.payload);
            return {
                ...state,
                ...action.payload.subject,
            };
        },
    },
});
