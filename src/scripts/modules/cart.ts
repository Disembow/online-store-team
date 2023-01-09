import { AddToCart } from './add-to-cart';
import { LocalStorageCartInfo } from '../../types/add-to-cart-types';
import { products } from '../data';

export class CartView extends AddToCart {
  headerValue: HTMLSpanElement | null;
  productBox: HTMLDivElement | null;
  mainCartTitle: HTMLHeadingElement | null;
  emptyCartTitle: HTMLHeadingElement | null;
  innerWrapper: HTMLDivElement | null;

  constructor(localStorageKey: string, localStorageValue: Array<LocalStorageCartInfo>) {
    super(localStorageKey, localStorageValue);
    this.productBox = document.querySelector('.products__container');
    this.headerValue = document.querySelector('.header-total-price__sum');
    this.mainCartTitle = document.querySelector('.cart__title');
    this.emptyCartTitle = document.querySelector('.cart__title_empty');
    this.innerWrapper = document.querySelector('.inner-wrapper');
  }

  public render(array: number[]) {
    this.clean();

    const template = <HTMLTemplateElement | null>document.getElementById('product-template');

    const image: HTMLAnchorElement | null | undefined = template?.content.querySelector('.product__image');
    const title: HTMLAnchorElement | null | undefined = template?.content.querySelector('.product__title_item');
    const brand = template?.content.querySelector('.product__brand_item');
    const mainId = template?.content.querySelector('.product__id_item');
    const category = template?.content.querySelector('.product__category_item');
    const description = template?.content.querySelector('.product__description_item');
    const rating = template?.content.querySelector('.product__rating_item');
    const price = template?.content.querySelector('.product__price_item');
    const counter = template?.content.querySelector('.product__counter');
    const stock = template?.content.querySelector('.product__stock_item');
    const subtotal = template?.content.querySelector('.product__subtotal');

    for (let i = 0; i < array.length; i++) {
      const targetProduct = products.products.find((e) => e.id === array[i]);
      if (
        targetProduct &&
        image &&
        title &&
        brand &&
        mainId &&
        category &&
        description &&
        rating &&
        price &&
        counter &&
        stock &&
        subtotal
      ) {
        image.style.backgroundImage = `url(${targetProduct.thumbnail})`;
        image.href = `#goods/${targetProduct.id}`;
        title.textContent = targetProduct.title;
        title.href = `#goods/${targetProduct.id}`;

        brand.textContent = targetProduct.brand;
        mainId.textContent = targetProduct.id.toString();
        category.textContent = targetProduct.category;
        description.textContent = targetProduct.description;
        rating.textContent = targetProduct.rating.toString();
        price.textContent = `€${targetProduct.price.toFixed(2)}`;
        counter.textContent = this.localStorageValue[i].quantity.toString();
        stock.textContent = targetProduct.stock.toString();
        subtotal.textContent = `€${(this.localStorageValue[i].quantity * targetProduct.price).toFixed(2)}`;
      }

      const node = template?.content.cloneNode(true);
      if (node) this.productBox?.append(node);
    }
    this.getTotal();
  }

  public getTotal() {
    super.get();
    const sum = this.localStorageValue.reduce((a, c) => (a += c.quantity * c.price), 0).toFixed(2);
    const total = document.querySelectorAll('.product-value__sum_colored')[0];
    if (location.hash === '#cart' && total) {
      total.textContent = `€${sum}`;
    }
    localStorage.setItem('OnlineStoreTotalValueGN', sum);
    if (this.headerValue) this.headerValue.textContent = `€${sum}`;
    return sum;
  }

  private clean() {
    while (this.productBox?.firstChild) {
      this.productBox.removeChild(this.productBox.firstChild);
    }

    if (!this.localStorageValue || this.localStorageValue.length === 0) {
      this.mainCartTitle?.classList.add('hidden');
      this.emptyCartTitle?.classList.remove('hidden');
      this.innerWrapper?.classList.add('hidden');
    }
  }
}
