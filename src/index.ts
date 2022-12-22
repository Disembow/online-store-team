import './style.scss';

import { products } from './scripts/data';
import clickHandlerDocument from './scripts/clickHandlerDocument';
import { Router } from './scripts/hash-router';
import { QuantityChanger } from './scripts/modules/changer';
import { GoodsPopup } from './scripts/modules/goods-popup';
import { ProductPage } from './scripts/modules/product-page';
import { AddToCart } from './scripts/modules/add-to-cart';

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
      // Item quantity changer on cart page
      const goodsQuantity = new QuantityChanger();
      // Image popup on goods page
      const goodsPopup = new GoodsPopup();
      const photoBox = document.querySelector('.prod-photo__box');
      const overlay = document.querySelector('.overlay');

      if (location.hash.split('/')[0] === '#goods') {
        photoBox?.addEventListener('click', (e) => goodsPopup.show(e));
        overlay?.addEventListener('click', () => goodsPopup.hide());

        goodsQuantity.increase();
        goodsQuantity.decrease();
      } else if (location.hash === '#cart') {
        goodsQuantity.increase();
        goodsQuantity.decrease();
      }

      // Insert new product into goods-page
      const sublocation = window.location.hash.replace('#', '').split('/')[1];
      const targetProduct = products.products.find((e) => e.id === +sublocation);
      if (sublocation && targetProduct) {
        const product = new ProductPage();
        product.render(targetProduct);
      }

      //Add product from googs-page to cart
      const addToCart = new AddToCart();
      const addToCartButton = document.querySelector('.button__submit_cart');
      addToCartButton?.addEventListener('click', () => {
        const quantity = document.querySelector('.product__counter');
        if (targetProduct && quantity instanceof HTMLDivElement) {
          addToCart.create(targetProduct, +quantity.innerText);
        }
      });
      // if (targetProduct) addToCart.check(targetProduct);
    }
  }
};

const observer = new MutationObserver(callback);

if (targetToObserve) observer.observe(targetToObserve, config);
