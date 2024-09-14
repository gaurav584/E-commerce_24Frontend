import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./api/userAPI";
import { userReducer } from "./reducer/userReducer";
import { productApi } from "./api/productAPI";
import { cartReducer } from "./reducer/cartReducer";
import { orderApi } from "./api/orderApi";

export const server = import.meta.env.VITE_SERVE

export const store = configureStore({
    reducer:{
        [userAPI.reducerPath]:userAPI.reducer,
        [productApi.reducerPath]:productApi.reducer,
        [userReducer.name]:userReducer.reducer,
        [cartReducer.name]:cartReducer.reducer,
        [orderApi.reducerPath]:orderApi.reducer
    },
    middleware: (mid) => [...mid(),userAPI.middleware,productApi.middleware,orderApi.middleware]
});


export type RootState = ReturnType<typeof store.getState>;