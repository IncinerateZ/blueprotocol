const { configureStore } = require('@reduxjs/toolkit');
const { counterSlice } = require('./slices/counterSlice');

const makeStore = () =>
    configureStore({ reducer: { [counterSlice.name]: counterSlice.reducer } });
