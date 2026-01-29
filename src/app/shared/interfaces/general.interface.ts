import { ProductI } from "./product.interface";

export interface GeneralI<T = any>{
    data: T[];
}

export interface ResponseI {
    message: string;
    data?: ProductI;
    name?: string;
}