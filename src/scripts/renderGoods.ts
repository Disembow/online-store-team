import { products } from './data';
import { targetProduct } from '../types/product-page-types';

export class Render {
  private _container: HTMLElement | null;
  private _goodsList: targetProduct[];
  private _filters: {
    category: string[];
    brand: string[];
  };
  constructor() {
    this._container = null;
    this._filters = {
      category: ['smartphones'],
      brand: [],
    };
    this._goodsList = products.products.map((prod) => prod);
    /* this._goodsList = products.products
      .map((prod) => prod)
      .filter((item) => {
        if (this._filters.category.length && this._filters.brand.length) {
          return (
            this._filters.category.includes(item.category.toLowerCase()) &&
            this._filters.brand.includes(item.brand.toLowerCase())
          );
        } else if (!this._filters.category.length && this._filters.brand.length) {
          return this._filters.brand.includes(item.brand.toLowerCase());
        } else if (this._filters.category.length && !this._filters.brand.length) {
          return this._filters.category.includes(item.category.toLowerCase());
        }
      }); */
  }
  public set container(elem: HTMLElement | null) {
    if (elem) this._container = elem;
  }
  public start() {
    console.log('start');
    this._checkURLSearchParams();
    this._renderGoods();
    this._renderFilterBlocks('category');
    this._renderFilterBlocks('brand');
    this._renderCountCurrentFilter();
  }
  public filter() {
    console.log('filter');
  }
  public sort() {
    console.log('sort');
  }
  private _checkURLSearchParams() {
    console.log(window.location.search);
  }
  private _renderGoods() {
    if (!this._container) throw new Error('Goods container not found');
    const list: string = this._goodsList.reduce((acc, prod) => {
      return (
        acc +
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
      </div>`
      );
    }, '');
    this._container.innerHTML = list;
  }
  private _renderFilterBlocks(prop: string) {
    const filterBlock: HTMLElement | null = document.querySelector(`[data-filter-list="${prop.toLowerCase()}"]`);
    if (!filterBlock) throw new Error('Goods container not found');
    const filters: { [key: string]: number } = products.products.reduce((acc: { [key: string]: number }, cur) => {
      if (prop === 'category') {
        acc[cur.category.toLowerCase()] = (acc[cur.category.toLowerCase()] || 0) + 1;
      } else if (prop === 'brand') {
        acc[cur.brand.toLowerCase()] = (acc[cur.brand.toLowerCase()] || 0) + 1;
      }
      return acc;
    }, {});
    const content = Object.keys(filters).reduce((acc, cur) => {
      return (
        acc +
        `
      <li class="checkbox-block__item">
          <label class="checkbox-block__label">
            <input class="checkbox-block__input" type="checkbox" name="${prop}" value="${cur.toLowerCase()}">
            <span class="checkbox-block__input-fake"></span>
            <span class="checkbox-block__text">${cur[0].toUpperCase() + cur.slice(1).toLocaleLowerCase()}</span>
          </label>
          <div class="checkbox-block__count-wrap">
            <span class="checkbox-block__count-current" data-filter-name="${prop}" data-filter-value="${cur.toLowerCase()}">0</span>
            <span class="checkbox-block__count-separator">/</span>
            <span class="checkbox-block__count-total">${filters[cur]}</span>
          </div>
        </li>
      `
      );
    }, '');
    filterBlock.innerHTML = content;
  }
  private _renderCountCurrentFilter() {
    const currentCountBlocks: NodeListOf<HTMLElement> = document.querySelectorAll('.checkbox-block__count-current');
    currentCountBlocks.forEach((item) => {
      const currentCount = this._goodsList.filter((prod) => {
        if (item.dataset.filterValue && item.dataset.filterName) {
          if (item.dataset.filterName === 'category') {
            return prod.category.toLowerCase() === item.dataset.filterValue.toLowerCase();
          } else if (item.dataset.filterName === 'brand') {
            return prod.brand.toLowerCase() === item.dataset.filterValue.toLowerCase();
          }
        }
      }).length;
      item.textContent = String(currentCount);
      const itemWrap: HTMLElement | null = item.closest('.checkbox-block__item');
      if (!currentCount) {
        itemWrap?.classList.add('checkbox-block__item_disabled');
      } else {
        itemWrap?.classList.remove('checkbox-block__item_disabled');
      }
    });
    console.log(this._goodsList);
  }
}
