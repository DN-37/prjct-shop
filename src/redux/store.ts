import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './slices/cartSlice';
import filterSlice from './slices/filterSlice';
import pizzaSlice from './slices/pizzaSlice';
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    filter: filterSlice,
    cart: cartSlice,
    pizza: pizzaSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();