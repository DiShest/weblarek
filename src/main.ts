import './scss/styles.scss';

import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { AppApi } from './components/AppApi';
import { ProductsModel } from './components/models/ProductsModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';
import { IOrder } from './types';

const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);

const productsModel = new ProductsModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

console.log('Экземпляр каталога:', productsModel);
console.log('Экземпляр корзины:', basketModel);
console.log('Экземпляр покупателя:', buyerModel);

appApi
  .getProducts()
  .then((data) => {
    console.log('Данные сервера:', data);

    productsModel.setItems(data.items);
    console.log('Товары сохранены в модель:', productsModel.getItems());

    const firstProduct = productsModel.getItems()[0];
    const secondProduct = productsModel.getItems()[1];

    productsModel.setPreview(firstProduct);
    console.log('Товар по id:', productsModel.getItem(firstProduct.id));
    console.log('Товар для подробного просмотра:', productsModel.getPreview());

    basketModel.addItem(firstProduct);
    basketModel.addItem(secondProduct);

    console.log('Корзина после добавления товаров:', basketModel.getItems());
    console.log('Количество товаров в корзине:', basketModel.getCount());
    console.log('Сумма корзины:', basketModel.getTotal());
    console.log('Есть ли первый товар в корзине:', basketModel.hasItem(firstProduct.id));

    basketModel.removeItem(firstProduct.id);
    console.log('Корзина после удаления товара:', basketModel.getItems());

    buyerModel.setPayment('card');
    buyerModel.setField('address', 'Тестовый адрес');
    buyerModel.setField('email', 'test@example.com');
    buyerModel.setField('phone', '+79990000000');

    console.log('Данные покупателя:', buyerModel.getData());
    console.log('Ошибки валидации заполненных данных покупателя:', buyerModel.validate());
const buyerData = buyerModel.getData();

if (!buyerData.payment) {
  throw new Error('Не выбран способ оплаты');
}

const order: IOrder = {
  payment: buyerData.payment,
  address: buyerData.address,
  email: buyerData.email,
  phone: buyerData.phone,
  items: basketModel.getItems().map((item) => item.id),
  total: basketModel.getTotal(),
};

    console.log('Заказ для отправки:', order);

    buyerModel.clear();
    console.log('Данные покупателя после очистки:', buyerModel.getData());
    console.log('Ошибки валидации пустых данных покупателя:', buyerModel.validate());

    basketModel.clear();
    console.log('Корзина после очистки:', basketModel.getItems());
  })
  .catch((error) => {
    console.error('Ошибка запроса:', error);
  });