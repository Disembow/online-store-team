import './style.scss';
import { Router } from './ts/hash-router';
import { QuantityChanger } from './ts/changer';

// Hash-router
const router = new Router();
window.addEventListener('hashchange', router.locationHandler);
router.locationHandler();

// Quantity of goods changer
const goodsQuantity = new QuantityChanger();
goodsQuantity.increase();
goodsQuantity.decrease();
