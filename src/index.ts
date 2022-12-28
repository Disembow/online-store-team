import './style.scss';

import { products } from './scripts/data';
import clickHandlerDocument from './scripts/clickHandlerDocument';
import { Router } from './scripts/hash-router';
import { QuantityChanger } from './scripts/modules/changer';
import { GoodsPopup } from './scripts/modules/goods-popup';
import { ProductPage } from './scripts/modules/product-page';
import { AddToCart } from './scripts/modules/add-to-cart';
import { CartView } from './scripts/modules/cart';
import { PromoCode } from './scripts/modules/promocode';

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
      }
      if (location.hash.split('/')[0] === '#cart' || location.hash.split('/')[0] === '#goods') {
        // Add products quantity counter
        document.addEventListener('click', (e) => {
          if (
            e.target instanceof HTMLElement &&
            (e.target.closest('.product') || e.target.closest('.prod-item__info'))
          ) {
            const item = <HTMLElement>e.target.closest('.product');

            const goodsQuantity = new QuantityChanger('OnlineStoreCartGN', [], item);
            if (e.target.classList.contains('minus')) {
              goodsQuantity.decrease();
            } else if (e.target.classList.contains('plus')) {
              // console.log(e.target.classList.contains('plus'));
              goodsQuantity.increase();
            }
            // console.log('GOODS');
          }
        });
      }

      // Promo code
      const promo = new PromoCode('OnlineStoreCartPromoGN');
      const promoInput = document.querySelector('.promo__input');
      promoInput?.addEventListener('input', () => promo.apply());
      promo.button?.addEventListener('click', () => promo.discount());
      promo.promoList?.addEventListener('click', (e) => promo.removePromo(e));
      if (document.readyState === 'loading') {
        document.addEventListener('load', promo.render);
      } else {
        promo.render();
      }

      // Insert new product into goods-page
      const product = new ProductPage('OnlineStoreCartGN', []); //TODO: refactor into one call
      const sublocation = window.location.hash.replace('#', '').split('/')[1];
      const targetProduct = products.products.find((e) => e.id === +sublocation);
      if (sublocation && targetProduct) {
        product.render(targetProduct);
      }

      //Add product from goos-page to cart
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

// Add cart length into header;
document.addEventListener('DOMContentLoaded', () => {
  const headerCounter = document.querySelector('.header-cart-block__count');
  if (headerCounter) {
    const cart = new CartView('OnlineStoreCartGN', []);
    cart.get();
    headerCounter.textContent = cart.localStorageValue.length.toString();

    // const promo = new PromoCode('OnlineStoreCartPromoGN');
    // promo.render();
  }
});
