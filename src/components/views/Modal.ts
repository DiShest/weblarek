import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._closeButton = this.container.querySelector('.modal__close')!;
    this._content = this.container.querySelector('.modal__content')!;

    this._closeButton.addEventListener('click', () => {
      this.close();
    });

    this.container.addEventListener('mousedown', (event) => {
      if (event.target === event.currentTarget) {
        this.close();
      }
    });
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this._content.replaceChildren();
    this.events.emit('modal:close');
  }

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}
