import { IGoodsPopup } from '../../types/goods-popup-types';
export class GoodsPopup implements IGoodsPopup {
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
      this.img.src = target.src;
      this.overlay?.classList.add('overlay_active');
    }
  }

  hide() {
    this.overlay?.classList.remove('overlay_active');
    this.popup?.classList.remove('prod-photo__popup_active');
  }
}
