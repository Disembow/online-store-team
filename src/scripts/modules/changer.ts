import { ICartChanger } from '../../types/changer-types';

export class QuantityChanger implements ICartChanger {
  target: HTMLElement | null;
  counter: HTMLElement | null;
  stock: number | null | undefined;
  number: number;
  constructor(target: HTMLElement) {
    this.target = target;
    this.counter = target.querySelector('.product__counter');
    this.stock = Number(target.querySelector('.product__stock_item')?.textContent);
    this.number = Number(this.counter?.innerText);
  }

  increase() {
    if (this.counter && this.stock && this.number < this.stock) {
      console.log(this.target);
      this.number += 1;
      this.counter.textContent = this.number.toString();
    }
  }

  decrease() {
    if (this.counter && this.number > 0) {
      this.number -= 1;
      this.counter.textContent = this.number.toString();
    }
  }
}
