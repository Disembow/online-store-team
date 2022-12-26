import { ICartChanger } from '../../types/changer-types';
import { LocalStorageCartInfo } from './add-to-cart';
import { CartView } from './cart';

export class QuantityChanger extends CartView implements ICartChanger {
  private target: HTMLElement | null;
  private counter: HTMLElement | null;
  private stock: number | null | undefined;
  private quantity: number;
  private price: number;
  private subtotal: HTMLSpanElement | null;
  private total: HTMLSpanElement | null;
  constructor(localStorageKey: string, localStorageValue: Array<LocalStorageCartInfo>, target: HTMLElement) {
    super(localStorageKey, localStorageValue);
    this.target = target;
    this.counter = target.querySelector('.product__counter');
    this.stock = Number(target.querySelector('.product__stock_item')?.textContent);
    this.quantity = Number(this.counter?.innerText);
    this.price = Number(target.querySelector('.product__price_item')?.textContent?.replace('€', ''));
    this.subtotal = target.querySelector('.product__subtotal');
    this.total = target.querySelector('.product-value__sum_colored');
  }

  increase() {
    if (this.counter && this.stock && this.quantity < this.stock) {
      this.quantity += 1;
      this.counter.textContent = this.quantity.toString();
      this.recount();
    }
  }

  decrease() {
    if (this.counter && this.quantity > 0) {
      this.quantity -= 1;
      this.counter.textContent = this.quantity.toString();
      this.recount();
    }
  }

  recount() {
    if (this.subtotal) {
      this.subtotal.textContent = `€${(this.price * this.quantity).toFixed(2)}`;
      super.getTotal();
    }
  }
}
