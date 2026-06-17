import { Component } from '../base/Component';
import { IProduct } from '../../types';

export interface ICard extends Omit<IProduct, 'image'> {
  image?: {
    src: string;
    alt: string;
  };
  buttonText?: string;
  disabled?: boolean;
  index?: number;
}

export class Card extends Component<ICard> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this._title = container.querySelector('.card__title')!;
    this._price = container.querySelector('.card__price')!;
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
