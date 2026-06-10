import { Component } from '../base/Component';
import { IProduct } from '../../types';

interface IBasketItem extends IProduct {
  index: number;
}

interface IBasketItemActions {
  onClick: () => void;
}

export class BasketItem extends Component<IBasketItem> {
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions: IBasketItemActions) {
    super(container);

    this._index = this.container.querySelector('.basket__item-index')!;
    this._title = this.container.querySelector('.card__title')!;
    this._price = this.container.querySelector('.card__price')!;
    this._button = this.container.querySelector('.basket__item-delete')!;

    this._button.addEventListener('click', actions.onClick);
  }

  set index(value: number) {
    this.setText(this._index, String(value));
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set price(value: number | null) {
    this.setText(
      this._price,
      value === null ? 'Бесценно' : `${value} синапсов`
    );
  }
}