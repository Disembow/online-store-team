import { ICartChanger } from '../../types/changer-types';
import { LocalStorageCartInfo } from './add-to-cart';
import { CartView } from './cart';

export class QuantityChanger extends CartView implements ICartChanger {
  private target: HTMLElement;
  private counter: HTMLElement | null;
  private stock: number | null | undefined;
  private quantity: number;
  private price: number;
  private subtotal: HTMLSpanElement | null;
  private targetId: number;
  constructor(localStorageKey: string, localStorageValue: Array<LocalStorageCartInfo>, target: HTMLElement) {
    super(localStorageKey, localStorageValue);
    this.target = target;
    this.counter = target.querySelector('.product__counter');
    this.stock = Number(target.querySelector('.product__stock_item')?.textContent);
    this.quantity = Number(this.counter?.innerText);
    this.price = Number(target.querySelector('.product__price_item')?.textContent?.replace('€', ''));
    this.subtotal = target.querySelector('.product__subtotal');
    this.targetId = Number(this.target.querySelector('.product__id_item')?.textContent);
  }

  private setQuantity() {
    super.get();

    const item = this.localStorageValue.filter((e) => e.id === this.targetId)[0];
    item.quantity = this.quantity;

    super.add();
  }

  public increase() {
    super.get();
    if (this.counter && this.stock && this.quantity < this.stock) {
      this.quantity += 1;
      this.counter.textContent = this.quantity.toString();

      // console.log('+');

      this.recount();
      this.recountDiscount();
      this.setQuantity();
    }
  }

  public decrease() {
    super.get();
    if (this.counter && this.quantity > 0) {
      this.quantity -= 1;
      this.counter.textContent = this.quantity.toString();

      // this.deleteFromCart(); // TODO: removed only for testing
      this.recount();
      this.recountDiscount();
      this.setQuantity();
    }
  }

  deleteFromCart() {
    if (this.quantity === 0) this.target.remove();
    this.remove(this.targetId);
  }

  private recount() {
    if (this.subtotal) {
      this.subtotal.textContent = `€${(this.price * this.quantity).toFixed(2)}`;
      super.getTotal();
    }
  }

  private recountDiscount() {
    const promosStr = localStorage.getItem('OnlineStoreCartPromoGN');
    if (promosStr) {
      const promos = JSON.parse(promosStr);
      const total = document.querySelector('.product-value__sum_current')?.querySelector('.product-value__sum_colored');
      if (promos.length > 0 && total) {
        const sum = (
          Number(
            document
              .querySelector('.product-value__sum_previous')
              ?.querySelector('.product-value__sum_colored')
              ?.textContent?.replace('€', '')
          ) *
          (1 - 0.1 * promos.length)
        ).toFixed(2);

        total.textContent = `€${sum}`;
        const headerTotal = document.querySelector('.header-total-price__sum');

        if (headerTotal && sum) headerTotal.textContent = `€${sum}`;
      }
    }
  }
}
