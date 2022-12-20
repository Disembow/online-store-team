import './style.scss';

import setDropdown from './scripts/modules/dropdown/dropdown';
import { Router } from './scripts/hash-router';
import { QuantityChanger } from './scripts/modules/changer';
import { GoodsPopup } from './scripts/modules/goods-popup';

// Hash-router
const router = new Router();

window.addEventListener('hashchange', router.locationHandler);
router.locationHandler();

// Main page headers Dropdown
setDropdown();

// Add Mutation Observer on content change in <main> element
const targetToObserve: HTMLElement | null = document.querySelector('#content');

const config = {
  childList: true,
};

const callback = function (mutationsList: MutationRecord[]) {
  if (mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Image popup on goods page
        const photoBox = document.querySelector('.prod-photo__box');
        const overlay = document.querySelector('.overlay');

        const goodsPopup = new GoodsPopup();

        photoBox?.addEventListener('click', (e) => goodsPopup.show(e));
        overlay?.addEventListener('click', () => goodsPopup.hide());

        // Item quantity changer on cart page
        const goodsQuantity = new QuantityChanger();
        goodsQuantity.increase();
        goodsQuantity.decrease();
      }
    }
  }
};

const observer = new MutationObserver(callback);

if (targetToObserve) observer.observe(targetToObserve, config);
