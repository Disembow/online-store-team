import { targetProduct } from './product-page-types';

export type LocalStorageCartInfo = {
  id: number;
  title: string;
  price: number;
  brand: string;
  category: string;
  quantity: number;
};

export interface IAddToCart {
  localStorageKey: string;
  localStorageValue: Array<LocalStorageCartInfo>;
  create(target: targetProduct, quantity: number): void;
  add(): void;
  get(): void;
  remove(id: number): void;
  check(target: targetProduct): void;
}
