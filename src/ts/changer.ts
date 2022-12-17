import { ICartChanger } from '../types/changer-types';

export class QuantityChanger implements ICartChanger {
  cartButtonMinus: HTMLElement | null;
  cartButtonPlus: HTMLElement | null;
  counter: HTMLElement | null;
  number: number;
  constructor() {
    this.cartButtonMinus = document.querySelector('.minus');
    this.cartButtonPlus = document.querySelector('.plus');
    this.counter = document.querySelector('.product__counter');
    this.number = Number(this.counter?.innerText);
  }

  increase() {
    this.cartButtonPlus?.addEventListener('click', () => {
      if (this.counter) {
        this.number += 1;
        this.counter.innerHTML = this.number.toString();
      }
    });
  }

  decrease() {
    this.cartButtonMinus?.addEventListener('click', () => {
      if (this.counter && this.number > 0) {
        this.number -= 1;
        this.counter.innerHTML = this.number.toString();
      }
    });
  }
}
