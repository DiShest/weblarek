import { Form } from '../base/Form';

interface IContactsForm {
  email: string;
  phone: string;
  valid: boolean;
  errors: string[];
}

export class ContactsForm extends Form {
  render(state: Partial<IContactsForm>): HTMLElement {
    super.render(state);
    return this.container;
  }
}