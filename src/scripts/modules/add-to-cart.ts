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
  localStorageKey: string;
  localStorageValue: Array<LocalStorageCartInfo>;

  constructor(localStorageKey: string, localStorageValue: Array<LocalStorageCartInfo>) {
    this.localStorageKey = localStorageKey;
    this.localStorageValue = localStorageValue;
  }

  get() {
    const data = localStorage.getItem(this.localStorageKey);
    if (data) this.localStorageValue = JSON.parse(data);
  }

  add() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.localStorageValue));
  }

  public remove(id: number) {
    this.get();
    this.localStorageValue = this.localStorageValue.filter((e) => e.id !== id);
    this.add();
    // console.log(this.localStorageValue);
  }

  create(target: targetProduct, quantity: number) {
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

  check(target: targetProduct) {
    this.get();
    const addToCartButton = document.querySelector('.button__submit_cart');
    this.localStorageValue.filter((e) => e.id === target.id).length > 0
      ? addToCartButton?.setAttribute('disabled', '')
      : addToCartButton?.removeAttribute('disabled');
  }
}
