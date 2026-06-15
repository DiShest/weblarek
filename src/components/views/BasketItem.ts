import { Card } from './Card';



interface IBasketItemActions {
  onClick: () => void;
}

export class BasketItem extends Card {
  protected _index: HTMLElement;
  protected _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: IBasketItemActions) {
    super(container);

    this._index = this.container.querySelector('.basket__item-index')!;
    this._deleteButton = this.container.querySelector('.basket__item-delete')!;

    this._deleteButton.addEventListener('click', actions.onClick);
  }

  set index(value: number) {
    this.setText(this._index, String(value));
  }
}