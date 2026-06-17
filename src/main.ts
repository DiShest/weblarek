import './scss/styles.scss';

import { Api } from './components/base/api';
import { EventEmitter } from './components/base/Events';
import { API_URL, CDN_URL } from './utils/constants';
import { AppApi } from './components/AppApi';
import { ProductsModel } from './components/models/ProductsModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';
import { Page } from './components/views/Page';
import { CatalogCard } from './components/views/CatalogCard';
import { PreviewCard } from './components/views/PreviewCard';
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
page.counter = basketModel.getCount();

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

const orderElement = orderTemplate.content
  .querySelector('.form')!
  .cloneNode(true) as HTMLFormElement;

const orderForm = new OrderForm(orderElement, events);

const contactsElement = contactsTemplate.content
  .querySelector('.form')!
  .cloneNode(true) as HTMLFormElement;

const contactsForm = new ContactsForm(contactsElement, events);

const previewElement = cardPreviewTemplate.content
  .querySelector('.card')!
  .cloneNode(true) as HTMLElement;

const previewCard = new PreviewCard(previewElement, () => {
  events.emit('preview:buy');
});

const successElement = successTemplate.content
  .querySelector('.order-success')!
  .cloneNode(true) as HTMLElement;

const success = new Success(successElement, events);

events.on<{ items: IProduct[] }>('catalog:changed', ({ items }) => {
  const cards = items.map((item) => {
    const cardElement = cardCatalogTemplate.content
      .querySelector('.card')!
      .cloneNode(true) as HTMLElement;

    const card = new CatalogCard(cardElement, () => {
      events.emit('product:select', item);
    });

    return card.render({
      ...item,
      image: {
        src: `${CDN_URL}${item.image}`,
        alt: item.title,
      },
    });
  });

  page.catalog = cards;
});

events.on<IProduct>('product:select', (item) => {
  productsModel.setPreview(item);
});

events.on<IProduct>('preview:changed', (item) => {
  const isInBasket = basketModel.hasItem(item.id);

  const buttonText =
    item.price === null
      ? 'Недоступно'
      : isInBasket
        ? 'Удалить из корзины'
        : 'Купить';

  modal.render({
    content: previewCard.render({
      ...item,
      image: {
        src: `${CDN_URL}${item.image}`,
        alt: item.title,
      },
      buttonText,
      disabled: item.price === null,
    }),
  });
});

events.on('preview:buy', () => {
  const item = productsModel.getPreview();

  if (!item || item.price === null) {
    return;
  }

  if (basketModel.hasItem(item.id)) {
    basketModel.removeItem(item.id);
  } else {
    basketModel.addItem(item);
  }

  modal.close();
});

events.on<{ items: IProduct[] }>('basket:changed', () => {
  page.counter = basketModel.getCount();

  const basketItems = basketModel.getItems().map((item, index) => {
    const itemElement = cardBasketTemplate.content
      .querySelector('.basket__item')!
      .cloneNode(true) as HTMLElement;

    const basketItem = new BasketItem(itemElement, {
      onClick: () => {
       events.emit('basket:remove', { id: item.id });
      },
    });

    return basketItem.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  basket.render({
    items: basketItems,
    total: basketModel.getTotal(),
    disabled: basketModel.getCount() === 0,
  });
});

events.on<{ id: string }>('basket:remove', ({ id }) => {
  basketModel.removeItem(id);
});

const basketElement = basketTemplate.content
  .querySelector('.basket')!
  .cloneNode(true) as HTMLElement;

const basket = new Basket(basketElement, events);

events.on('basket:open', () => {
  modal.render({
    content: basket.render(),
  });
});

events.on('order:open', () => {
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();

  modal.render({
    content: orderForm.render({
      address: buyer.address,
      payment: buyer.payment,
      valid: !errors.payment && !errors.address,
      errors: [errors.payment, errors.address].filter(
        (error): error is string => Boolean(error)
      ),
    }),
  });
});

events.on<{ field: 'address'; value: string }>(
  'order.address:change',
  ({ field, value }) => {
    buyerModel.setField(field, value);
  }
);

events.on<{ payment: TPayment }>('order.payment:change', ({ payment }) => {
  buyerModel.setPayment(payment);
});

events.on('order:submit', () => {
  const errors = buyerModel.validate();

  modal.render({
    content: contactsForm.render({
      valid: !errors.email && !errors.phone,
      errors: [errors.email, errors.phone].filter((error): error is string => Boolean(error)),
    }),
  });
});

events.on<{ field: 'email' | 'phone'; value: string }>(
  'contacts.email:change',
  ({ field, value }) => {
    buyerModel.setField(field, value);
  }
);

events.on<{ field: 'email' | 'phone'; value: string }>(
  'contacts.phone:change',
  ({ field, value }) => {
    buyerModel.setField(field, value);
  }
);

events.on('buyer:changed', () => {
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();

  orderForm.render({
    address: buyer.address,
    payment: buyer.payment,
    valid: !errors.payment && !errors.address,
    errors: [errors.payment, errors.address].filter(
      (error): error is string => Boolean(error)
    ),
  });

  contactsForm.render({
    email: buyer.email,
    phone: buyer.phone,
    valid: !errors.email && !errors.phone,
    errors: [errors.email, errors.phone].filter(
      (error): error is string => Boolean(error)
    ),
  });
});

events.on('contacts:submit', () => {
  const buyer = buyerModel.getData();

  const order: IOrder = {
    payment: buyer.payment as TPayment,
    address: buyer.address,
    email: buyer.email,
    phone: buyer.phone,
    items: basketModel.getItems().map((item) => item.id),
    total: basketModel.getTotal(),
  };

  appApi
    .createOrder(order)
    .then((result) => {
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