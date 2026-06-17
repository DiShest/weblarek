import { Card } from './Card';

export class PreviewCard extends Card {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);

    this._image = this.container.querySelector('.card__image')!;
    this._category = this.container.querySelector('.card__category')!;
    this._description = this.container.querySelector('.card__text')!;
    this._button = this.container.querySelector('.card__button')!;

    this._button.addEventListener('click', onClick);
  }

  set image(value: { src: string; alt: string }) {
    this.setImage(this._image, value.src, value.alt);
  }

  set category(value: string) {
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

  set description(value: string) {
    this.setText(this._description, value);
  }

  set buttonText(value: string) {
    this.setText(this._button, value);
  }

  set disabled(value: boolean) {
    this.setDisabled(this._button, value);
  }
}

