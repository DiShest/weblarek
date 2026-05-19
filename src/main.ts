import './scss/styles.scss';

import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { AppApi } from './components/AppApi';
import { ProductsModel } from './components/models/ProductsModel';
import { BasketModel } from './components/models/BasketModel';
import { OrderModel } from './components/models/OrderModel';

const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);

const productsModel = new ProductsModel();
const basketModel = new BasketModel();
const orderModel = new OrderModel();

console.log('Экземпляр каталога:', productsModel);
console.log('Экземпляр корзины:', basketModel);
console.log('Экземпляр заказа:', orderModel);

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

    orderModel.setPayment('card');
    orderModel.setField('address', 'Тестовый адрес');
    orderModel.setField('email', 'test@example.com');
    orderModel.setField('phone', '+79990000000');
    orderModel.setItems(basketModel.getItems().map((item) => item.id));
    orderModel.setTotal(basketModel.getTotal());

    console.log('Данные заказа:', orderModel.getOrder());
    console.log('Ошибки валидации заполненного заказа:', orderModel.validate());

    orderModel.clear();
    console.log('Заказ после очистки:', orderModel.getOrder());
    console.log('Ошибки валидации пустого заказа:', orderModel.validate());

    basketModel.clear();
    console.log('Корзина после очистки:', basketModel.getItems());
  })
  .catch((error) => {
    console.error('Ошибка запроса:', error);
  });