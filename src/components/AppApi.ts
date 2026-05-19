import { IApi, IOrder, IOrderResult, IProductsResponse } from '../types';

export class AppApi {
  constructor(protected api: IApi) {}

  getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>('/product');
  }

  createOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post<IOrderResult>('/order', order);
  }
}