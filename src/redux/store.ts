import { configureStore } from "@reduxjs/toolkit";

export const server = import.meta.env.VITE_SERVE

export const store = configureStore({
    reducer:{}
});