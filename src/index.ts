import './style.scss';

import { products } from './scripts/data';
import clickHandlerDocument from './scripts/clickHandlerDocument';
import inputHandlerDocument from './scripts/inputHandlerDocument';
import { Router } from './scripts/hash-router';
import { QuantityChanger } from './scripts/modules/changer';
import { GoodsPopup } from './scripts/modules/goods-popup';
import { ProductPage } from './scripts/modules/product-page';
import { AddToCart } from './scripts/modules/add-to-cart';
import { CartView } from './scripts/modules/cart';
import { PromoCode } from './scripts/modules/promocode';
import { BuyNow } from './scripts/modules/modal-buy-now';
import { Pagiantor } from './scripts/modules/cart-paginator';

// Hash-router
const router = new Router();

window.addEventListener('hashchange', () => {
  router.locationHandler();
  window.location.reload();
});
router.locationHandler();

// Delegating the click event

document.addEventListener('click', (event: MouseEvent) => clickHandlerDocument(event));
document.addEventListener('input', (event: Event) => inputHandlerDocument(event));

// Add Mutation Observer on content change in <main> element
const targetToObserve: HTMLElement | null = document.querySelector('#content');

const config = {
  childList: true,
};

const callback = function (mutationsList: MutationRecord[]) {
  const addToCart = new AddToCart('OnlineStoreCartGN', []);
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      // Image popup on goods page
      const goodsPopup = new GoodsPopup();
      const photoBox = document.querySelector('.prod-photo__box');
      const overlay = document.querySelector('.overlay');
      const closeButtonGoodsPopup = document.querySelector('.close__button_goods');

      if (location.hash.split('/')[0] === '#goods') {
        photoBox?.addEventListener('click', (e) => goodsPopup.show(e));
        overlay?.addEventListener('click', () => goodsPopup.hide());
        closeButtonGoodsPopup?.addEventListener('click', () => goodsPopup.hide());
        window.scroll(0, 0);
      } else if (location.hash.split('/')[0] === '#cart') {
        // Test order popup on validity
        const order = new BuyNow();
        if (localStorage.getItem('OnlineStoreBuyNow') === 'true') {
          order.showBillPopup();
        }
        order.showBillButton?.addEventListener('click', () => order.showBillPopup());
        order.overlay?.addEventListener('click', () => order.hideBillPopup());
        order.closeButton?.addEventListener('click', () => order.hideBillPopup());
        order.cardnumber.addEventListener('keypress', (e) =>
          order.noLetters(e, order.cardnumber, order.cardNumberLength)
        );
        order.cardnumber.addEventListener('input', () => order.changePaymentSystemImage());
        order.carddate.addEventListener('keypress', (e) => order.noLetters(e, order.carddate, order.carddateLength));
        order.carddate.addEventListener('input', () => {
          order.formatCardCode(order.carddateLength, order.carddateSplitter);
        });
        order.cvv.addEventListener('keypress', (e) => order.noLetters(e, order.cvv, order.CVVlength));
        order.cvv.addEventListener('input', () => order.numberReduce(order.CVVlength));

        order.billingForm?.addEventListener('submit', (e) => {
          if (!order.test()) {
            e.preventDefault();
          } else {
            e.preventDefault();
            order.showRedirectPopup();
            addToCart.cleanCart();
          }
        });

        // Add paginator on cart page
        const paginator = new Pagiantor('OnlineStoreCartGN', []);
        paginator.DisplayList();
        paginator.SetupPagination();
        paginator.ChangeItemPerPage();

        // Parse pagination query
        paginator.parseQueryParam();
        window.scroll(0, 0);
      }
    }

    if (location.hash.split('/')[0] === '#cart' || location.hash.split('/')[0] === '#goods') {
      // Add products quantity counter
      document.addEventListener('click', (e) => {
        if (e.target instanceof HTMLElement && (e.target.closest('.product') || e.target.closest('.prod-item__info'))) {
          let item;
          e.target.closest('.product')
            ? (item = <HTMLElement>e.target.closest('.product'))
            : (item = <HTMLElement>e.target.closest('.prod-item__info'));
          const goodsQuantity = new QuantityChanger('OnlineStoreCartGN', [], item);
          if (e.target.classList.contains('minus')) {
            goodsQuantity.decrease();
          } else if (e.target.classList.contains('plus')) {
            goodsQuantity.increase();
          }
        }
      });

      // Promo code
      const promo = new PromoCode('OnlineStoreCartPromoGN');
      promo.input?.addEventListener('input', () => promo.apply());
      promo.button?.addEventListener('click', () => promo.discount());
      promo.promoList?.addEventListener('click', (e) => promo.removePromo(e));

      if (document.readyState === 'loading') {
        document.addEventListener('load', promo.render);
      } else {
        promo.render();
      }

      // Insert new product into goods-page
      const product = new ProductPage('OnlineStoreCartGN', []);
      const sublocation = window.location.hash.replace('#', '').split('/')[1];
      const targetProduct = products.products.find((e) => e.id === +sublocation);

      if (sublocation && targetProduct && location.hash.split('/')[0] === '#goods') {
        product.render(targetProduct);
        product.buynow(targetProduct);
      }

      //Add product from goods-page to cart
      addToCart.addToCartButton?.addEventListener('click', () => {
        const quantity = document.querySelector('.product__counter');
        if (targetProduct && quantity instanceof HTMLDivElement) {
          addToCart.create(targetProduct, +quantity.innerText);
          if (addToCart.headerCounter && cart.headerValue) {
            addToCart.headerCounter.textContent = addToCart.getItemsCount();
            // cart.headerValue.textContent = cart.getTotal().toString();
            console.log(cart.getTotal());
          }
        }
      });
    }
  }
};

const observer: MutationObserver = new MutationObserver(callback);

if (targetToObserve) observer.observe(targetToObserve, config);

// Add cart length into header;
const cart = new CartView('OnlineStoreCartGN', []);
document.addEventListener('DOMContentLoaded', () => {
  cart.get();
  if (cart.headerCounter && cart.headerValue) {
    cart.headerCounter.textContent = cart.getItemsCount();
    cart.headerValue.textContent = `€${localStorage.getItem('OnlineStoreTotalValueGN')}`;
    if (!localStorage.getItem('OnlineStoreTotalValueGN')) cart.headerValue.textContent = `€0.00`;
  }
});
