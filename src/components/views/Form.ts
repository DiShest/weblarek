import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
export interface IFormState {
  valid: boolean;
  errors: string[];
}

export class Form extends Component<IFormState> {
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(
    protected container: HTMLFormElement,
    protected events: IEvents
  ) {
    super(container);

    this._submitButton = this.container.querySelector(
      'button[type=submit]'
    )!;

    this._errors = this.container.querySelector('.form__errors')!;

    this.container.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;

      this.events.emit(`${this.container.name}.${target.name}:change`, {
        field: target.name,
        value: target.value,
      });
    });

    this.container.addEventListener('submit', (event: Event) => {
      event.preventDefault();

      this.events.emit(`${this.container.name}:submit`);
    });
  }

  set valid(value: boolean) {
    this.setDisabled(this._submitButton, !value);
  }

  set errors(value: string[]) {
    this.setText(this._errors, value.join('; '));
  }

  render(state: Partial<IFormState>): HTMLElement {
    super.render(state);
    return this.container;
  }
}