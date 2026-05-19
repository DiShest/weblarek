import {
  IOrder,
  TFormErrors,
  TPayment,
} from '../../types';

export class OrderModel {
  protected order: IOrder = {
    payment: '',
    address: '',
    email: '',
    phone: '',
    items: [],
    total: 0,
  };

  setField<K extends keyof IOrder>(
    field: K,
    value: IOrder[K]
  ): void {
    this.order[field] = value;
  }

  getOrder(): IOrder {
    return this.order;
  }

  clear(): void {
    this.order = {
      payment: '',
      address: '',
      email: '',
      phone: '',
      items: [],
      total: 0,
    };
  }

  validate(): TFormErrors {
    const errors: TFormErrors = {};

    if (!this.order.payment) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }

    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }

    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    }

    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }

    return errors;
  }

  setItems(items: string[]): void {
    this.order.items = items;
  }

  setTotal(total: number): void {
    this.order.total = total;
  }

  setPayment(payment: TPayment): void {
    this.order.payment = payment;
  }
}