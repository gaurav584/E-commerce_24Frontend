import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./api/userAPI";
import { userReducer } from "./reducer/userReducer";
import { productApi } from "./api/productAPI";
import { cartReducer } from "./reducer/cartReducer";

export const server = import.meta.env.VITE_SERVE

export const store = configureStore({
    reducer:{
        [userAPI.reducerPath]:userAPI.reducer,
        [productApi.reducerPath]:productApi.reducer,
        [userReducer.name]:userReducer.reducer,
        [cartReducer.name]:cartReducer.reducer,
    },
    middleware: (mid) => [...mid(),userAPI.middleware,productApi.middleware]
});