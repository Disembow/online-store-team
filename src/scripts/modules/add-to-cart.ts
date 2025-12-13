import { targetProduct } from '../../types/product-page-types';
import { LocalStorageCartInfo, IAddToCart } from '../../types/add-to-cart-types';

export class AddToCart implements IAddToCart {
  public localStorageKey: string;
  public localStorageValue: Array<LocalStorageCartInfo>;
  public addToCartButton: HTMLButtonElement | null;
  public headerCounter: HTMLDivElement | null;

  constructor(localStorageKey: string, localStorageValue: Array<LocalStorageCartInfo>) {
    this.localStorageKey = localStorageKey;
    this.localStorageValue = localStorageValue;
    this.addToCartButton = document.querySelector('.button__submit_cart');
    this.headerCounter = document.querySelector('.header-cart-block__count');
  }

  public get() {
    const data = localStorage.getItem(this.localStorageKey);
    if (data) this.localStorageValue = JSON.parse(data);
  }

  public add() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.localStorageValue));
  }

  public remove(id: number) {
    this.get();
    this.localStorageValue = this.localStorageValue.filter((e) => e.id !== id);
    this.add();
  }

  public cleanCart() {
    localStorage.removeItem(this.localStorageKey);
  }

  public create(target: targetProduct, quantity: number) {
    this.get();
    if (this.localStorageValue.filter((e) => e.id === target.id).length === 0) {
      this.localStorageValue.push({
        id: target.id,
        title: target.title,
        price: target.price,
        brand: target.brand,
        category: target.category,
        quantity: quantity,
      });
    } else {
      this.localStorageValue.map((e) => {
        if (e.id === target.id) e.quantity = quantity;
      });
    }
    this.add();
    this.check(target);
  }

  public check(target: targetProduct) {
    this.get();
    if (this.localStorageValue.filter((e) => e.id === target.id).length > 0 && this.addToCartButton) {
      this.addToCartButton?.setAttribute('disabled', '');
      this.addToCartButton.textContent = 'Already in cart';
    } else {
      this.addToCartButton?.removeAttribute('disabled');
    }
  }

  public getItemsCount(): string {
    return this.localStorageValue.reduce((a, c) => a + c.quantity, 0).toString();
  }
}
