import './style.scss';

import { products } from './scripts/data';
import clickHandlerDocument from './scripts/clickHandlerDocument';
import { Router } from './scripts/hash-router';
import { QuantityChanger } from './scripts/modules/changer';
import { GoodsPopup } from './scripts/modules/goods-popup';
import { ProductPage } from './scripts/modules/product-page';
import { AddToCart } from './scripts/modules/add-to-cart';
import { CartView } from './scripts/modules/cart';

// Hash-router
const router = new Router();

window.addEventListener('hashchange', router.locationHandler);
router.locationHandler();

// Delegating the click event
document.addEventListener('click', (event: MouseEvent) => clickHandlerDocument(event));

// Add Mutation Observer on content change in <main> element
const targetToObserve: HTMLElement | null = document.querySelector('#content');

const config = {
  childList: true,
};

const callback = function (mutationsList: MutationRecord[]) {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      // Image popup on goods page
      const goodsPopup = new GoodsPopup();
      const photoBox = document.querySelector('.prod-photo__box');
      const overlay = document.querySelector('.overlay');

      if (location.hash.split('/')[0] === '#goods') {
        photoBox?.addEventListener('click', (e) => goodsPopup.show(e));
        overlay?.addEventListener('click', () => goodsPopup.hide());

        // goodsQuantity.increase();
        // goodsQuantity.decrease();
      }

      // Insert new product into goods-page
      const product = new ProductPage('OnlineStoreCartGN', []); //TODO: refactor into one call
      const sublocation = window.location.hash.replace('#', '').split('/')[1];
      const targetProduct = products.products.find((e) => e.id === +sublocation);
      if (sublocation && targetProduct) {
        product.render(targetProduct);
      }

      //Add product from googs-page to cart
      const addToCart = new AddToCart('OnlineStoreCartGN', []); //TODO: refactor into one call
      const addToCartButton = document.querySelector('.button__submit_cart');
      addToCartButton?.addEventListener('click', () => {
        const quantity = document.querySelector('.product__counter');
        if (targetProduct && quantity instanceof HTMLDivElement) {
          addToCart.create(targetProduct, +quantity.innerText);
        }
      });

      // Render products into cart from localStorage
      const cart = new CartView('OnlineStoreCartGN', []); //TODO: refactor into one call
      cart.render();
    }
  }
};

const observer = new MutationObserver(callback);

if (targetToObserve) observer.observe(targetToObserve, config);

// Add products quantity counter
document.addEventListener('click', (e) => {
  if (e.target instanceof HTMLElement) {
    const item = <HTMLElement>e.target.closest('.product');
    const goodsQuantity = new QuantityChanger('OnlineStoreCartGN', [], item);
    if (e.target.classList.contains('minus')) {
      goodsQuantity.decrease();
    } else if (e.target.classList.contains('plus')) {
      goodsQuantity.increase();
    }
  }
});
