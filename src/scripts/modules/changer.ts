import { ICartChanger } from '../../types/changer-types';
import { LocalStorage } from '../../types/product-page-types';
import { LocalStorageCartInfo } from './add-to-cart';
import { CartView } from './cart';
import { Pagiantor } from './cart-paginator';

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

    if (location.hash.split('/')[0] === '#cart') {
      const item = this.localStorageValue.filter((e) => e.id === this.targetId)[0];
      item.quantity = this.quantity;
    }

    super.add();
  }

  public increase() {
    if (this.counter && this.stock && this.quantity < this.stock) {
      this.quantity += 1;
      console.log('plus', this.quantity);
      this.counter.textContent = this.quantity.toString();

      this.setQuantity();
      this.recount();
      this.recountDiscount();
    }
  }

  public decrease() {
    if (this.counter && this.quantity > 0) {
      this.quantity -= 1;
      console.log('minus', this.quantity);
      this.counter.textContent = this.quantity.toString();

      if (location.hash.split('/')[0] === '#cart' && this.quantity === 0) {
        this.deleteFromCart();
        const p = new Pagiantor('OnlineStoreCartGN', []);
        p.DisplayList();
        p.SetupPagination();
      }

      this.setQuantity();
      this.recount();
      this.recountDiscount();
    }
  }

  deleteFromCart() {
    this.target.remove();

    const LS = localStorage.getItem('OnlineStoreCartGN');
    if (LS) {
      let data: Array<LocalStorage> = JSON.parse(LS);
      data = data.filter((e) => e.id !== this.targetId);
      localStorage.setItem('OnlineStoreCartGN', JSON.stringify(data));
    }
  }

  private recount() {
    if (this.subtotal) {
      this.subtotal.textContent = `€${(this.price * this.quantity).toFixed(2)}`;
      super.getTotal();
    }
  }

  private recountDiscount() {
    super.get();
    const promosStr = localStorage.getItem('OnlineStoreCartPromoGN');
    if (promosStr) {
      const promos = JSON.parse(promosStr);
      const total = document.querySelector('.product-value__sum_current')?.querySelector('.product-value__sum_colored');
      if (promos.length > 0) {
        const sum = (+super.getTotal() * (1 - 0.1 * promos.length)).toFixed(2);
        if (total) total.textContent = `€${sum}`;

        const headerTotal = document.querySelector('.header-total-price__sum');
        localStorage.setItem('OnlineStoreTotalValueGN', sum);
        if (headerTotal && sum) headerTotal.textContent = `€${sum}`;
      }
    }
  }
}
