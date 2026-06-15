import { Form } from './Form';
import { IEvents } from '../base/Events';

interface IContactsFormState {
  email?: string;
  phone?: string;
  valid?: boolean;
  errors?: string[];
}

export class ContactsForm extends Form {
  protected _email: HTMLInputElement;
  protected _phone: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._email = this.container.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement;

    this._phone = this.container.querySelector(
      'input[name="phone"]'
    ) as HTMLInputElement;
  }

  set email(value: string) {
    this._email.value = value;
  }

  set phone(value: string) {
    this._phone.value = value;
  }

  render(state: Partial<IContactsFormState>): HTMLElement {
    super.render(state);

    if (state.email !== undefined) {
      this.email = state.email;
    }

    if (state.phone !== undefined) {
      this.phone = state.phone;
    }

    return this.container;
  }
}
