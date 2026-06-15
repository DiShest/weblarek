import { Card } from './Card';

export class CatalogCard extends Card {
  constructor(container: HTMLElement, onClick: () => void) {
    super(container);

    this.container.addEventListener('click', onClick);
  }
}