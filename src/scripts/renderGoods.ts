import { products } from './data';
import { targetProduct } from '../types/product-page-types';

export class Render {
  private _container: HTMLElement | null;
  private _goodsList: targetProduct[];
  constructor() {
    this._container = null;
    this._goodsList = products.products.map((prod) => prod);
  }
  public set container(elem: HTMLElement | null) {
    if (elem) this._container = elem;
  }
  start() {
    console.log('start');
    this._render();
  }
  _render() {
    if (!this._container) throw new Error('Goods container not found');
    const list: string = this._goodsList.reduce((acc, prod) => {
      // const card: string = ''
      return (
        `
      <div class="goods-card-preview" data-view="grid">
        <div class="goods-card-preview__discount light-block-2">-${prod.discountPercentage}%</div>
        <div class="goods-card-preview__img-wrap" data-view="grid">
        <a href="#goods/${prod.id}"><img class="goods-card-preview__img" src="${prod.thumbnail}"
            alt="Chappals"></img></a>
        </div>
        <div class="goods-card-preview__info" data-view="grid">
        <h3 class="goods-card-preview__title" data-view="grid"><a class="goods-card-preview__link base-link" href="#goods/${prod.id}">${prod.title}</a></h3>
          <span class="goods-card-preview__description">${prod.description}</span>
          <div class="goods-card-preview__properties">
            <span>Category</span>
            <span class="goods-card-preview__properties-item">${prod.category}</span>
            <span>Brand</span>
            <span class="goods-card-preview__properties-item">${prod.brand}</span>
            <span>Stock</span>
            <span class="goods-card-preview__properties-item">${prod.stock}</span>
          </div>
        </div>
        <div class="goods-card-preview__buy" data-view="grid">
          <span class="goods-card-preview__price">${prod.price} USD</span>
          <div class="goods-card-preview__buy-info" data-view="grid">
            <span class="goods-card-preview__ship">Free Shipping</span>
            <span class="goods-card-preview__delivery">Delivery in 1 day</span>
          </div>
          <button class="button goods-card-preview__button" type="button">+ Add to cart</button>
        </div>
      </div>` + acc
      );
    }, '');
    this._container.innerHTML = list;
  }
}
