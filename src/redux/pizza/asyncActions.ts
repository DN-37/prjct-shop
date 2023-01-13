import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Pizza, SearchPizzaParams } from './types';

export const fetchPizzas = createAsyncThunk('pizza/fetchPizzasStatus', async (params: SearchPizzaParams) => {
  const { sortBy, order, category, search, currentPage } = params;
  const { data } = await axios.get(
    `https://639d8cce1ec9c6657baca8b6.mockapi.io/items?page=${currentPage}&limit=4&category=${category}&sortBy=${sortBy}&order=${order}&search=${search}`,
  );
  return data as Pizza[];
});