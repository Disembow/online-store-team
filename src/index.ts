import './style.scss';

import clickHandlerDocument from './scripts/clickHandlerDocument';
import setDropdown from './scripts/modules/dropdown/dropdown';
import { Router } from './scripts/hash-router';
import { QuantityChanger } from './scripts/modules/changer';

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

window.addEventListener('hashchange', router.locationHandler);
router.locationHandler();

setDropdown(); // Выпадающие селект опций для поисковой строки

document.addEventListener('click', (event: MouseEvent) => clickHandlerDocument(event));

//
//
interface IGoodsPopup {
  show(e: Event): void;
}
class GoodsPopup implements IGoodsPopup {
  popup: HTMLDivElement | null;
  img: HTMLImageElement | null;
  overlay: HTMLDivElement | null;
  constructor() {
    this.popup = document.querySelector('.prod-photo__popup');
    this.img = document.querySelector('.popup__item');
    this.overlay = document.querySelector('.overlay');
  }

  show(e: Event) {
    const target: EventTarget | null = e.target;
    if (target instanceof HTMLImageElement && target.classList.contains('prod-photo__item') && this.img) {
      this.popup?.classList.add('prod-photo__popup_active');
      this.img.alt = 'Big product photo';
      this.img.src = target.src;
      this.overlay?.classList.add('overlay_active');
    }
  }
  hide(e: Event) {
    const target: EventTarget | null = e.target;
    console.log(target);
    if (target instanceof HTMLDivElement && target.classList.contains('overlay_active')) {
      this.popup?.classList.remove('prod-photo__popup_active');
    }
  }
}

const linkToGoods = document.querySelector('#goods');
linkToGoods?.addEventListener('click', () => {
  const photoBox = document.querySelector('.prod-photo__box');
  photoBox?.addEventListener('click', (e) => {
    const goodsPopup = new GoodsPopup();
    goodsPopup.show(e);
  });
  // goodsPopup.hide(e);
});
