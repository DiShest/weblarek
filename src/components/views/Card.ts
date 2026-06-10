import { Component } from '../base/Component';
import { IProduct } from '../../types';

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

interface ICard extends IProduct {
  buttonText?: string;
}
export class Card extends Component<ICard>  {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _category?: HTMLElement;
  protected _description?: HTMLElement;
protected _button?: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    actions?: ICardActions
  ) {
    super(container);

    this._title = container.querySelector('.card__title')!;
    this._price = container.querySelector('.card__price')!;
    this._description = container.querySelector('.card__text') || undefined;
this._button = container.querySelector('.card__button') || undefined;

    this._image = container.querySelector('.card__image') || undefined;
    this._category =
      container.querySelector('.card__category') || undefined;
if (actions?.onClick) {
  if (this._button) {
    this._button.addEventListener('click', actions.onClick);
  } else {
    container.addEventListener('click', actions.onClick);
  }
}
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

  set image(value: string) {
    if (this._image) {
      this.setImage(this._image, value, this._title.textContent || '');
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

set buttonText(value: string) {
  if (this._button) {
    this.setText(this._button, value);
  }
}
}