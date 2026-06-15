import { Card } from './Card';

export class PreviewCard extends Card {
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);

    this._button = this.container.querySelector('.card__button')!;
    this._button.addEventListener('click', onClick);
  }

  set buttonText(value: string) {
    this.setText(this._button, value);
  }
}
