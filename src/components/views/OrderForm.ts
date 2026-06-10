import { Form } from '../base/Form';
import { IEvents } from '../base/Events';
import { TPayment } from '../../types';

interface IOrderForm {
  address: string;
  payment: TPayment;
  valid: boolean;
  errors: string[];
}

export class OrderForm extends Form {
  protected _cardButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._cardButton = container.querySelector(
      'button[name="card"]'
    ) as HTMLButtonElement;

    this._cashButton = container.querySelector(
      'button[name="cash"]'
    ) as HTMLButtonElement;

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

  render(state: Partial<IOrderForm>): HTMLElement {
    super.render(state);
    return this.container;
  }
}