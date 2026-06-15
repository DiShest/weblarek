import { Component } from '../base/Component';
import { IProduct } from '../../types';

export interface ICard extends IProduct {
  buttonText?: string;
  index?: number;
  imageAlt?: string;
}

export class Card extends Component<ICard> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _category?: HTMLElement;
  protected _description?: HTMLElement;
  protected _imageAlt = '';

  constructor(container: HTMLElement) {
    super(container);

    this._title = container.querySelector('.card__title')!;
    this._price = container.querySelector('.card__price')!;
    this._description = container.querySelector('.card__text') || undefined;
    this._image = container.querySelector('.card__image') || undefined;
    this._category =
      container.querySelector('.card__category') || undefined;
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

  set imageAlt(value: string) {
    this._imageAlt = value;
  }

  set image(value: string) {
    if (this._image) {
      this.setImage(this._image, value, this._imageAlt);
    }
  }

  set category(value: string) {
    if (this._category) {
      this.setText(this._category, value);

      this._category.className = 'card__category';

      const categoryClassMap: Record<string, string> = {
        'софт-скил': 'card__category_soft',
        'хард-скил': 'card__category_hard',
        'другое': 'card__category_other',
        'дополнительное': 'card__category_additional',
        'кнопка': 'card__category_button',
      };

      this._category.classList.add(
        categoryClassMap[value] ?? 'card__category_other'
      );
    }
  }

  set description(value: string) {
    if (this._description) {
      this.setText(this._description, value);
    }
  }
}