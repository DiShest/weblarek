export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

export type TPayment = 'card' | 'cash' | '';

export interface IOrder {
  payment: TPayment;
  address: string;
  email: string;
  phone: string;
  items: string[];
  total: number;
}

export type TOrderForm = Pick<IOrder, 'payment' | 'address'>;

export type TContactsForm = Pick<IOrder, 'email' | 'phone'>;

export type TOrderData = Omit<IOrder, 'items' | 'total'>;

export interface IOrderResult {
  id: string;
  total: number;
}

export type TFormErrors = Partial<Record<keyof IOrder, string>>;