import './style.scss';
import { Router } from './scripts/hash-router';
import { QuantityChanger } from './scripts/modules/changer';

// Hash-router
const router = new Router();
// Quantity of goods changer
const linkToCart: HTMLElement | null = document.querySelector('#cart');
// TODO: temporary solution, need to be redone
linkToCart?.addEventListener('click', (): void => {
  const goodsQuantity = new QuantityChanger();
  goodsQuantity.increase();
  goodsQuantity.decrease();
});

window.addEventListener('hashchange', router.locationHandler);
router.locationHandler();
