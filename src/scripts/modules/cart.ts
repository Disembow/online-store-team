import { AddToCart } from './add-to-cart';
import { LocalStorageCartInfo } from './add-to-cart';
import { products } from '../data';

export class CartView extends AddToCart {
  constructor(localStorageKey: string, localStorageValue: Array<LocalStorageCartInfo>) {
    super(localStorageKey, localStorageValue);
  }

  render() {
    super.get();

    const productBox = document.querySelector('.products__container');
    while (productBox?.firstChild) {
      productBox.removeChild(productBox.firstChild);
    }

    const template = <HTMLTemplateElement | null>document.getElementById('product-template');

    const image: HTMLDivElement | null | undefined = template?.content.querySelector('.product__image');
    const title = template?.content.querySelector('.product__title_item');
    const brand = template?.content.querySelector('.product__brand_item');
    const category = template?.content.querySelector('.product__category_item');
    const description = template?.content.querySelector('.product__description_item');
    const rating = template?.content.querySelector('.product__rating_item');
    const price = template?.content.querySelector('.product__price_item');
    const counter = template?.content.querySelector('.product__counter');
    const stock = template?.content.querySelector('.product__stock_item');
    const subtotal = template?.content.querySelector('.product__subtotal');

    for (let i = 0; i < this.localStorageValue.length; i++) {
      const id = this.localStorageValue[i].id;
      const targetProduct = products.products.find((e) => e.id === id);
      if (
        targetProduct &&
        image &&
        title &&
        brand &&
        category &&
        description &&
        rating &&
        price &&
        counter &&
        stock &&
        subtotal
      ) {
        image.style.backgroundImage = `url(${targetProduct?.thumbnail})`;
        title.textContent = targetProduct.title;
        brand.textContent = targetProduct.brand;
        category.textContent = targetProduct.category;
        description.textContent = targetProduct.description;
        rating.textContent = targetProduct.rating.toString();
        price.textContent = `€${targetProduct.price.toFixed(2)}`;
        counter.textContent = this.localStorageValue[i].quantity.toString();
        stock.textContent = targetProduct.stock.toString();
        subtotal.textContent = `€${(this.localStorageValue[i].quantity * targetProduct.price).toFixed(2)}`;
      }

      const node = template?.content.cloneNode(true);
      if (node) productBox?.append(node);
      this.getTotal();
    }
  }

  getTotal() {
    const total = document.querySelectorAll('.product-value__sum_colored')[0];
    const headerTotal = document.querySelector('.header-total-price__sum');
    const subtotalValue = document.querySelectorAll('.product__subtotal');
    const headerCounter = document.querySelector('.header-cart-block__count');
    const sum = Array.from(subtotalValue)
      .map((e) => e.textContent?.replace('€', ''))
      .reduce((a, c) => (a += Number(c)), 0);
    if (total && headerTotal && headerCounter) {
      total.textContent = `€${sum.toFixed(2)}`;
      headerTotal.textContent = `€${sum.toFixed(2)}`;
      headerCounter.textContent = `${subtotalValue.length}`;
    }
  }
}
