import { createWrapper } from 'next-redux-wrapper';
import { useDispatch, useSelector } from 'react-redux';

const { configureStore } = require('@reduxjs/toolkit');
const { counterSlice } = require('./slices/counterSlice');

const makeStore = () =>
    configureStore({ reducer: { [counterSlice.name]: counterSlice.reducer } });

export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
export const wrapper = createWrapper(makeStore);
