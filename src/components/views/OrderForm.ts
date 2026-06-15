import { Form } from './Form';
import { IEvents } from '../base/Events';
import { TPayment } from '../../types';

interface IOrderFormState {
  address?: string;
  payment?: TPayment | '';
  valid?: boolean;
  errors?: string[];
}
export class OrderForm extends Form {
  protected _cardButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;
  protected _address: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._cardButton = container.querySelector(
      'button[name="card"]'
    ) as HTMLButtonElement;

    this._cashButton = container.querySelector(
      'button[name="cash"]'
    ) as HTMLButtonElement;

    this._address = container.querySelector(
      'input[name="address"]'
    ) as HTMLInputElement;

    this._cardButton?.addEventListener('click', () => {
      this.events.emit('order.payment:change', {
        payment: 'card',
      });
    });

    this._cashButton?.addEventListener('click', () => {
      this.events.emit('order.payment:change', {
        payment: 'cash',
      });
    });
  }

  set payment(value: TPayment) {
    this._cardButton?.classList.toggle(
      'button_alt-active',
      value === 'card'
    );

    this._cashButton?.classList.toggle(
      'button_alt-active',
      value === 'cash'
    );
  }

  set address(value: string) {
    this._address.value = value;
  }

  render(state: Partial<IOrderFormState>): HTMLElement {
    super.render(state);

    if (state.address !== undefined) {
      this.address = state.address;
    }

    if (state.payment) {
  this.payment = state.payment;
}
    return this.container;
  }
}
