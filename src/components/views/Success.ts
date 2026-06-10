import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess> {
  protected _description: HTMLElement;
  protected _closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._description = this.container.querySelector(
      '.order-success__description'
    )!;

    this._closeButton = this.container.querySelector(
      '.order-success__close'
    )!;

    this._closeButton.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  set total(value: number) {
    this.setText(this._description, `Списано ${value} синапсов`);
  }
}