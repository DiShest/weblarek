import { IBuyer, TFormErrors, TPayment } from '../../types';

export class BuyerModel {
  protected buyer: IBuyer = {
    email: '',
    address: '',
    phone: '',
  };

  setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
    this.buyer[field] = value;
  }

  setPayment(payment: TPayment): void {
    this.buyer.payment = payment;
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
      email: '',
      address: '',
      phone: '',
    };
  }
}