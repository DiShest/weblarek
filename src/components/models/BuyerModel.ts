import { IBuyer, TFormErrors, TPayment } from '../../types';
import { IEvents } from '../base/Events';

export class BuyerModel {
  protected buyer: IBuyer = {
    payment: '',
    email: '',
    address: '',
    phone: '',
  };

  constructor(protected events: IEvents) {}

  setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
    this.buyer[field] = value;
    this.events.emit('buyer:changed', this.getData());
  }

  setPayment(payment: TPayment): void {
    this.buyer.payment = payment;
    this.events.emit('buyer:changed', this.getData());
  }

  getData(): IBuyer {
    return this.buyer;
  }

  validate(): TFormErrors {
    const errors: TFormErrors = {};

    if (!this.buyer.payment) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }

    if (!this.buyer.address) {
      errors.address = 'Необходимо указать адрес';
    }

    if (!this.buyer.email) {
      errors.email = 'Необходимо указать email';
    }

    if (!this.buyer.phone) {
      errors.phone = 'Необходимо указать телефон';
    }

    return errors;
  }

  clear(): void {
    this.buyer = {
      payment: '',
      email: '',
      address: '',
      phone: '',
    };

    this.events.emit('buyer:changed', this.getData());
  }
}