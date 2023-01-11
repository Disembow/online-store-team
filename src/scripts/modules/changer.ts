import { ICartChanger } from '../../types/changer-types';
import { LocalStorage } from '../../types/product-page-types';
import { LocalStorageCartInfo } from '../../types/add-to-cart-types';
import { CartView } from './cart';
import { Pagiantor } from './cart-paginator';
// import { PromoCode } from './promocode';
// const promocode = new PromoCode('OnlineStoreCartPromoGN');

export class QuantityChanger extends CartView implements ICartChanger {
  private target: HTMLElement;
  private counter: HTMLElement | null;
  private stock: number | null | undefined;
  private quantity: number;
  private price: number;
  private subtotal: HTMLSpanElement | null;
  private targetId: number;
  private currentValue: HTMLDivElement | null;
  constructor(localStorageKey: string, localStorageValue: Array<LocalStorageCartInfo>, target: HTMLElement) {
    super(localStorageKey, localStorageValue);
    this.target = target;
    this.counter = target.querySelector('.product__counter');
    this.stock = Number(target.querySelector('.product__stock_item')?.textContent);
    this.quantity = Number(this.counter?.innerText);
    this.price = Number(target.querySelector('.product__price_item')?.textContent?.replace('€', ''));
    this.subtotal = target.querySelector('.product__subtotal');
    this.targetId = Number(this.target.querySelector('.product__id_item')?.textContent);
    this.currentValue = document.querySelector('.product-value__sum_current');
  }

  private setQuantity() {
    if (location.hash.split('/')[0] === '#cart') {
      super.get();
      const item = this.localStorageValue.filter((e) => e.id === this.targetId)[0];
      if (this.quantity > 0) item.quantity = this.quantity;
      if (this.headerCounter) this.headerCounter.textContent = super.getItemsCount();
      super.add();
    }
  }

  public increase() {
    if (this.counter && this.stock && this.quantity < this.stock) {
      this.quantity += 1;
      this.counter.textContent = this.quantity.toString();

      this.setQuantity();
      this.recount();
      this.recountDiscount();
    }
  }

  public decrease() {
    if (this.counter && this.quantity > 0) {
      if (location.hash.split('/')[0] === '#goods' && this.quantity > 1) {
        this.quantity -= 1;
        this.counter.textContent = this.quantity.toString();
      } else if (location.hash.split('/')[0] === '#cart') {
        this.quantity -= 1;
        this.counter.textContent = this.quantity.toString();
        if (this.quantity === 0) {
          this.deleteFromCart();
          const p = new Pagiantor('OnlineStoreCartGN', []);
          p.parseQueryParam();
          p.DisplayList();
          p.SetupPagination();
        }
      } else {
        this.quantity -= 1;
        this.counter.textContent = this.quantity.toString();
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

  public recountDiscount() {
    super.get();
    const promosStr = localStorage.getItem('OnlineStoreCartPromoGN');
    const curr = document.querySelectorAll('.product-value__sum_colored')[1];
    const prev = document.querySelectorAll('.product-value__sum_colored')[0];
    const headerTotal = document.querySelector('.header-total-price__sum');

    console.log(promosStr);
    if (promosStr) {
      const promos = JSON.parse(promosStr);
      if (headerTotal && prev && curr) {
        if (promos.length > 0) {
          const sum = (+super.getTotal() * (1 - 0.1 * promos.length)).toFixed(2);
          curr.textContent = `€${sum}`;
          headerTotal.textContent = `€${sum}`;
        } else if (promos.length === 0) {
          headerTotal.textContent = `€${super.getTotal()}`;
          curr.textContent = `€${super.getTotal()}`;
        }
        prev.textContent = `€${super.getTotal()}`;
      }
    } else if (headerTotal) {
      headerTotal.textContent = `€${super.getTotal()}`;
    }
  }
}
