import './scss/styles.scss';

import { Api } from './components/base/api';
import { EventEmitter } from './components/base/Events';
import { API_URL, CDN_URL } from './utils/constants';
import { AppApi } from './components/AppApi';
import { ProductsModel } from './components/models/ProductsModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';
import { Page } from './components/views/Page';
import { Card } from './components/views/Card';
import { Modal } from './components/views/Modal';
import { Basket } from './components/views/Basket';
import { BasketItem } from './components/views/BasketItem';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { Success } from './components/views/Success';
import { IOrder, IProduct, TPayment } from './types';

const events = new EventEmitter();

const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);

const productsModel = new ProductsModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

const page = new Page(document.body, events);
page.counter = 0;

const modal = new Modal(
  document.querySelector<HTMLElement>('#modal-container')!,
  events
);

const cardCatalogTemplate =
  document.querySelector<HTMLTemplateElement>('#card-catalog')!;
const cardPreviewTemplate =
  document.querySelector<HTMLTemplateElement>('#card-preview')!;
const basketTemplate =
  document.querySelector<HTMLTemplateElement>('#basket')!;
const cardBasketTemplate =
  document.querySelector<HTMLTemplateElement>('#card-basket')!;
const orderTemplate =
  document.querySelector<HTMLTemplateElement>('#order')!;
const contactsTemplate =
  document.querySelector<HTMLTemplateElement>('#contacts')!;
const successTemplate =
  document.querySelector<HTMLTemplateElement>('#success')!;

let orderForm: OrderForm | null = null;
let contactsForm: ContactsForm | null = null;

const validateOrderForm = () => {
  const buyer = buyerModel.getData();
  const errors: string[] = [];

  if (!buyer.payment) {
    errors.push('Необходимо выбрать способ оплаты');
  }

  if (!buyer.address) {
    errors.push('Необходимо указать адрес');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

const validateContactsForm = () => {
  const buyer = buyerModel.getData();
  const errors: string[] = [];

  if (!buyer.email) {
    errors.push('Необходимо указать email');
  }

  if (!buyer.phone) {
    errors.push('Необходимо указать телефон');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

events.on<{ items: IProduct[] }>('catalog:changed', ({ items }) => {
  const cards = items.map((item) => {
    const cardElement = cardCatalogTemplate.content
      .querySelector('.card')!
      .cloneNode(true) as HTMLElement;

    const card = new Card(cardElement, {
      onClick: () => {
        productsModel.setPreview(item);
      },
    });

    return card.render({
      ...item,
      image: `${CDN_URL}${item.image}`,
    });
  });

  page.catalog = cards;
});

events.on<IProduct>('preview:changed', (item) => {
  const cardElement = cardPreviewTemplate.content
    .querySelector('.card')!
    .cloneNode(true) as HTMLElement;

  const card = new Card(cardElement, {
    onClick: () => {
      basketModel.addItem(item);
      modal.close();
    },
  });

  modal.render({
    content: card.render({
      ...item,
      image: `${CDN_URL}${item.image}`,
      buttonText: 'Купить',
    }),
  });
});

events.on<{ items: IProduct[] }>('basket:changed', () => {
  page.counter = basketModel.getCount();
});

events.on('basket:open', () => {
  const basketElement = basketTemplate.content
    .querySelector('.basket')!
    .cloneNode(true) as HTMLElement;

  const basket = new Basket(basketElement, events);

  const basketItems = basketModel.getItems().map((item, index) => {
    const itemElement = cardBasketTemplate.content
      .querySelector('.basket__item')!
      .cloneNode(true) as HTMLElement;

    const basketItem = new BasketItem(itemElement, {
      onClick: () => {
        basketModel.removeItem(item.id);
        events.emit('basket:open');
      },
    });

    return basketItem.render({
      ...item,
      index: index + 1,
    });
  });

  modal.render({
    content: basket.render({
      items: basketItems,
      total: basketModel.getTotal(),
      selected: basketModel.getItems().map((item) => item.id),
    }),
  });
});

events.on('order:open', () => {
  const orderElement = orderTemplate.content
    .querySelector('.form')!
    .cloneNode(true) as HTMLFormElement;

  orderForm = new OrderForm(orderElement, events);

  const buyer = buyerModel.getData();

  modal.render({
    content: orderForm.render({
      ...validateOrderForm(),
      ...(buyer.payment ? { payment: buyer.payment } : {}),
    }),
  });
});

events.on<{ field: 'address'; value: string }>(
  'order.address:change',
  ({ field, value }) => {
    buyerModel.setField(field, value);

    const buyer = buyerModel.getData();

    orderForm?.render({
      ...validateOrderForm(),
      ...(buyer.payment ? { payment: buyer.payment } : {}),
    });
  }
);

events.on<{ payment: TPayment }>('order.payment:change', ({ payment }) => {
  buyerModel.setPayment(payment);

  orderForm?.render({
    ...validateOrderForm(),
    payment,
  });
});

events.on('order:submit', () => {
  const contactsElement = contactsTemplate.content
    .querySelector('.form')!
    .cloneNode(true) as HTMLFormElement;

  contactsForm = new ContactsForm(contactsElement, events);

  modal.render({
    content: contactsForm.render(validateContactsForm()),
  });
});

events.on<{ field: 'email' | 'phone'; value: string }>(
  'contacts.email:change',
  ({ field, value }) => {
    buyerModel.setField(field, value);
    contactsForm?.render(validateContactsForm());
  }
);

events.on<{ field: 'email' | 'phone'; value: string }>(
  'contacts.phone:change',
  ({ field, value }) => {
    buyerModel.setField(field, value);
    contactsForm?.render(validateContactsForm());
  }
);

events.on('contacts:submit', () => {
  const buyer = buyerModel.getData();

  if (!buyer.payment) {
    return;
  }

  const order: IOrder = {
    payment: buyer.payment,
    address: buyer.address,
    email: buyer.email,
    phone: buyer.phone,
    items: basketModel.getItems().map((item) => item.id),
    total: basketModel.getTotal(),
  };

  appApi
    .createOrder(order)
    .then((result) => {
      const successElement = successTemplate.content
        .querySelector('.order-success')!
        .cloneNode(true) as HTMLElement;

      const success = new Success(successElement, events);

      basketModel.clear();
      buyerModel.clear();

      modal.render({
        content: success.render({
          total: result.total,
        }),
      });
    })
    .catch((error) => {
      console.error('Ошибка оформления заказа:', error);
    });
});

events.on('success:close', () => {
  modal.close();
});

appApi
  .getProducts()
  .then((data) => {
    productsModel.setItems(data.items);
  })
  .catch((error) => {
    console.error('Ошибка загрузки товаров:', error);
  });