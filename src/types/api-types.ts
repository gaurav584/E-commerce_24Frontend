import { Product, User } from "./types";

export type CustomError = {
    status:number;
    data:{
        message:string;
        success:boolean;
    }
}

export type MessageResponse = {
    success:true,
    message:string
}

export type UserResponse = {
    success:boolean;
    user:User;
}

export type AllProductResponse = {
    success:boolean;
    products:Product[];
}

export type CategoriesResponse = {
    success:boolean;
    categories:string[];
}

export type searchProductsResponse = AllProductResponse & {
    totalPage:number
}

export type SearchProductsRequest = {
    price:number;
    page:number;
    category:string;
    search:string;
    sort:string
};

export type NewProductRequest = {
    id:string;
    formData:FormData;
}

export type UpdatedProductRequest = {
    userId:string,
    productId:string,
    formData:FormData
};

export type DeleteProductRequest = {
    userId:string,
    productId:string
}

export type ProductResponse = {
   success:boolean;
   product:Product;
}