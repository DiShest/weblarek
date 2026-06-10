import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IPage } from '../../types';

export class Page extends Component<IPage> {
  protected _counter: HTMLElement;
  protected _catalog: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._counter = this.container.querySelector('.header__basket-counter')!;
    this._catalog = this.container.querySelector('.gallery')!;
    this._wrapper = this.container.querySelector('.page__wrapper')!;
    this._basket = this.container.querySelector('.header__basket')!;

this._basket.addEventListener('click', () => {
  this.events.emit('basket:open');
});
  }

  set counter(value: number) {
    this.setText(this._counter, String(value));
  }

  set catalog(items: HTMLElement[]) {
    this._catalog.replaceChildren(...items);
  }

  set locked(value: boolean) {
    this._wrapper.classList.toggle('page__wrapper_locked', value);
  }
}