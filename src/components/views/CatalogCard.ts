import { Card } from './Card';

export class CatalogCard extends Card {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);

    this._image = this.container.querySelector('.card__image')!;
    this._category = this.container.querySelector('.card__category')!;

    this.container.addEventListener('click', onClick);
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
}
