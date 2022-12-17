import './style.scss';
import { Router } from './ts/hash-router';
import { QuantityChanger } from './ts/changer';

// Hash-router
const router = new Router();
// Quantity of goods changer
const linkToCart = document.querySelector('#cart');
// TODO: temporary solution, need to be redone
linkToCart?.addEventListener('click', (): void => {
  const goodsQuantity = new QuantityChanger();
  goodsQuantity.increase();
  goodsQuantity.decrease();
});

window.addEventListener('hashchange', () => {
  router.locationHandler;
});
router.locationHandler();
