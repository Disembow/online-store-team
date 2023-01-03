import { targetProduct } from '../../types/product-page-types';

export type LocalStorageCartInfo = {
  id: number;
  title: string;
  price: number;
  brand: string;
  category: string;
  quantity: number;
};

interface IAddToCart {
  localStorageKey: string;
  localStorageValue: Array<LocalStorageCartInfo>;
  create(target: targetProduct, quantity: number): void;
  add(): void;
  get(): void;
  remove(id: number): void;
  check(target: targetProduct): void;
}

export class AddToCart implements IAddToCart {
  public localStorageKey: string;
  public localStorageValue: Array<LocalStorageCartInfo>;
  public addToCartButton: HTMLButtonElement | null;

  constructor(localStorageKey: string, localStorageValue: Array<LocalStorageCartInfo>) {
    this.localStorageKey = localStorageKey;
    this.localStorageValue = localStorageValue;
    this.addToCartButton = document.querySelector('.button__submit_cart');
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
    // const addToCartButton = document.querySelector('.button__submit_cart');
    this.localStorageValue.filter((e) => e.id === target.id).length > 0
      ? this.addToCartButton?.setAttribute('disabled', '')
      : this.addToCartButton?.removeAttribute('disabled');
  }
}
