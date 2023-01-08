import { products } from './data';
import { targetProduct } from '../types/product-page-types';
import toggleViewGoods from './modules/toggleViewGoods/toggleViewGoods';
import fillInputTrack from './modules/dual-slider/fillInputTrack';

class App {
  private _container: HTMLElement | null;
  private _goodsList: targetProduct[];
  constructor() {
    this._container = null;
    this._goodsList = products.products.map((prod) => prod);
  }
  public start(): void {
    this._filter();
    this._renderGoods();
    this._setViewGoodsList();
    this._renderCountGoods();
    this._setSearchInputValue();
    this._renderFilterBlocks('category');
    this._renderFilterBlocks('brand');
    this._renderCountCurrentFilter();
    this._renderDualSliderBlocks('price');
    this._renderDualSliderBlocks('stock');
    this._setDualSliderBlock();
    this._renderNoGoodsMessage();
  }
  public set container(element: HTMLElement) {
    if (element) this._container = element;
  }
  public filterCheckbox(name: string, value: string, checked: boolean): void {
    // Установка query параметров
    const url = new URL(window.location.href);
    const params = url.searchParams;
    if (params.has(name)) {
      let paramsList = params.get(name)?.split('↕');
      if (!paramsList) throw new Error('paramsList is null');
      if (checked) {
        paramsList.push(value);
      } else {
        paramsList = paramsList.filter((item) => item !== value);
      }
      if (paramsList.length) {
        url.searchParams.set(name, paramsList.sort().join('↕'));
      } else {
        url.searchParams.delete(name);
      }
    } else {
      url.searchParams.set(name, value);
    }
    url.searchParams.sort();
    window.history.replaceState({}, '', url);
    this._filter();
    this._renderGoods();
    this._setViewGoodsList();
    this._renderCountCurrentFilter();
    this._renderCountGoods();
    this._setDualSliderBlock();
    this._renderNoGoodsMessage();
  }
  public filterDualSlider(name: string, lowerInputValue: number, upperInputValue: number) {
    // Установка query параметров
    const url = new URL(window.location.href);
    url.searchParams.set(name, `${lowerInputValue}↕${upperInputValue}`);
    url.searchParams.sort();
    window.history.replaceState({}, '', url);
    this._filter();
    this._renderGoods();
    this._setViewGoodsList();
    this._renderCountCurrentFilter();
    this._renderCountGoods();
    this._setDualSliderBlock(name === 'price' ? 'stock' : 'price');
    this._renderNoGoodsMessage();
  }
  public filterSearch(value: string) {
    const url = new URL(window.location.href);
    value = value.replace(/^\s+/g, '');
    if (value) url.searchParams.set('search', value);
    else url.searchParams.delete('search');
    url.searchParams.sort();
    window.history.replaceState({}, '', url);
    this._filter();
    this._renderGoods();
    this._setViewGoodsList();
    this._renderCountCurrentFilter();
    this._renderCountGoods();
    this._setDualSliderBlock();
    this._renderNoGoodsMessage();
  }
  public setViewURLSearchParams(view: string): void {
    const url = new URL(window.location.href);
    url.searchParams.set('view', view);
    url.searchParams.sort();
    window.history.replaceState({}, '', url);
  }
  public sort(): void {
    console.log('sort');
  }
  private _filter() {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    // Парсинг категорий и брэндов
    let categoryList: string[] = [];
    let brandList: string[] = [];
    if (params.has('category')) {
      const categoryParams = params.get('category');
      if (categoryParams) categoryList = categoryParams.split('↕');
    }
    if (params.has('brand')) {
      const brandParams = params.get('brand');
      if (brandParams) brandList = brandParams.split('↕');
    }
    // Парсинг цен и стока
    let priceList: string[] = [];
    let stockList: string[] = [];
    if (params.has('price')) {
      const priceParams = params.get('price');
      if (priceParams) priceList = priceParams.split('↕');
    }
    if (params.has('stock')) {
      const stockParams = params.get('stock');
      if (stockParams) stockList = stockParams.split('↕');
    }
    // Парсинг поиска
    let searchValue = '';
    if (params.has('search')) {
      const paramSearch = params.get('search');
      if (paramSearch) searchValue = paramSearch.toLowerCase();
    }
    // Фильтрация
    this._goodsList = products.products.filter((item) => {
      // Фильтрация | Чекбоксы категорий и брэндов
      let isCheckbox = true;
      if (categoryList.length && brandList.length) {
        isCheckbox = categoryList.includes(item.category.toLowerCase()) && brandList.includes(item.brand.toLowerCase());
      } else if (!categoryList.length && brandList.length) {
        isCheckbox = brandList.includes(item.brand.toLowerCase());
      } else if (categoryList.length && !brandList.length) {
        isCheckbox = categoryList.includes(item.category.toLowerCase());
      }
      // Фильтрация | price и stock
      const isPriceTrue = priceList.length
        ? item.price >= Number(priceList[0]) && item.price <= Number(priceList[1])
        : true;
      const isStockTrue = stockList.length
        ? item.stock >= Number(stockList[0]) && item.stock <= Number(stockList[1])
        : true;
      // Фильтрация | поиск
      let isSearchTrue: boolean;
      {
        const isTitleTrue = item.title.toLowerCase().includes(searchValue);
        const isDescriptionTrue = item.description.toLowerCase().includes(searchValue);
        const isCategoryTrue = item.category.toLowerCase().includes(searchValue);
        const isBrandTrue = item.brand.toLowerCase().includes(searchValue);
        const isPriceTrue = String(item.price).replace(/\.+/g, '').includes(searchValue);
        const isDiscountTrue = String(item.discountPercentage).replace(/\.+/g, '').includes(searchValue);
        const isRatingTrue = String(item.rating).replace(/\.+/g, '').includes(searchValue);
        const isStockTrue = String(item.stock).replace(/\.+/g, '').includes(searchValue);
        isSearchTrue =
          isTitleTrue ||
          isDescriptionTrue ||
          isCategoryTrue ||
          isBrandTrue ||
          isPriceTrue ||
          isDiscountTrue ||
          isRatingTrue ||
          isStockTrue;
      }

      return isCheckbox && isPriceTrue && isStockTrue && isSearchTrue;
    });
  }
  private _checkedActiveInputFilter(name: string) {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    let list: string[] = [];
    if (params.has(name)) {
      const nameParams = params.get(name);
      if (nameParams) list = nameParams.split('↕');
    }
    const inputsCategory = document.querySelectorAll(`[name="${name}"]`);
    if (inputsCategory) {
      inputsCategory.forEach((input) => {
        if (input instanceof HTMLInputElement && list.includes(input.value)) {
          input.checked = true;
        }
      });
    }
  }
  private _setViewGoodsList(): void {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const view = params.get('view');
    if (view === 'list' || view === 'grid') {
      toggleViewGoods(undefined, view);
    }
  }
  private _renderGoods(): void {
    if (!this._container) throw new Error('Goods container not found');
    const list: string = this._goodsList.reduce((acc, prod) => {
      return (
        acc +
        `
      <div class="goods-card-preview" data-view="grid">
        <div class="goods-card-preview__discount light-block-2">-${prod.discountPercentage}%</div>
        <div class="goods-card-preview__img-wrap" data-view="grid">
        <a href="#goods/${prod.id}" onclick="window.history.replaceState({}, '', window.location.origin);"><img class="goods-card-preview__img" src="${prod.thumbnail}"
            alt="Chappals"></img></a>
        </div>
        <div class="goods-card-preview__info" data-view="grid">
        <h3 class="goods-card-preview__title" data-view="grid"><a class="goods-card-preview__link base-link" onclick="window.history.replaceState({}, '', window.location.origin);" href="#goods/${prod.id}">${prod.title}</a></h3>
          <span class="goods-card-preview__description">${prod.description}</span>
          <div class="goods-card-preview__properties">
            <span>Category</span>
            <span class="goods-card-preview__properties-item">${prod.category}</span>
            <span>Brand</span>
            <span class="goods-card-preview__properties-item">${prod.brand}</span>
            <span>Stock</span>
            <span class="goods-card-preview__properties-item">${prod.stock}</span>
            <span>Rating</span>
            <span class="goods-card-preview__properties-item">${prod.rating}</span>
          </div>
        </div>
        <div class="goods-card-preview__buy" data-view="grid">
          <span class="goods-card-preview__price">${prod.price} EUR</span>
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
  private _renderFilterBlocks(prop: string): void {
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
    this._checkedActiveInputFilter(prop);
  }
  private _renderCountCurrentFilter(): void {
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
  }
  private _renderDualSliderBlocks(name: string): void {
    // min и max значения для слайдеров
    let values: number[] = [];
    if (name === 'price') values = products.products.map((item) => item.price);
    if (name === 'stock') values = products.products.map((item) => item.stock);
    const min = Math.min(...values);
    const max = Math.max(...values);
    // рендеринг
    const dualSliderBlock: HTMLElement | null = document.querySelector(`[data-name="${name.toLowerCase()}"]`);
    if (!dualSliderBlock) throw new Error('Goods container not found');
    dualSliderBlock.innerHTML = `
    <div class="dual-slider__display">
      <span class="dual-slider__text" data-display="lower">${min}</span>
      <span class="dual-slider__text" data-display="upper">${max}</span>
    </div>
    <input class="dual-slider__input" type="range" min="${min}" max="${max}" value="${min}" step="1" data-name="lower">
    <input class="dual-slider__input" type="range" min="${min}" max="${max}" value="${max}" step="1" data-name="upper">
    <div class="dual-slider__between-track"></div>`;
  }
  private _setDualSliderBlock(name?: string) {
    if (!name || name === 'price') {
      // Определение элементов
      const sliderPrice: HTMLElement | null = document.querySelector('[data-name="price"]');
      if (!sliderPrice) throw new Error('sliderPrice not found');
      const lowerTextBlock: HTMLElement | null = sliderPrice.querySelector('[data-display="lower"]');
      if (!lowerTextBlock) throw new Error('lowerTextBlock not found');
      const upperTextBlock: HTMLElement | null = sliderPrice.querySelector('[data-display="upper"]');
      if (!upperTextBlock) throw new Error('upperTextBlock not found');
      const inputLower: HTMLInputElement | null = sliderPrice.querySelector('input[data-name="lower"]');
      if (!inputLower) throw new Error('inputLower not found');
      const inputUpper: HTMLInputElement | null = sliderPrice.querySelector('input[data-name="upper"]');
      if (!inputUpper) throw new Error('inputUpper not found');
      const inputTrack: HTMLElement | null = sliderPrice.querySelector('.dual-slider__between-track');
      if (!inputTrack) throw new Error('inputTrack not found');
      // Получение значений min и max
      const valuesPrice = this._goodsList.map((item) => item.price);
      const minPrice = valuesPrice.length ? Math.min(...valuesPrice) : Number(inputLower.min);
      const maxPrice = valuesPrice.length ? Math.max(...valuesPrice) : Number(inputLower.max);
      const maxInputValue = parseInt(inputLower.max);
      const lowerInputValuePercent = (minPrice / maxInputValue) * 100;
      const upperInputValuePercent = (maxPrice / maxInputValue) * 100;
      // Рендеринг текстовых значений
      lowerTextBlock.textContent = `${Math.round(minPrice)}`;
      upperTextBlock.textContent = `${Math.round(maxPrice)}`;
      // Рендеринг положения ползунка и трека инпута
      inputLower.value = String(minPrice);
      inputUpper.value = String(maxPrice);
      fillInputTrack(inputTrack, lowerInputValuePercent, upperInputValuePercent);
    }
    if (!name || name === 'stock') {
      // Определение элементов
      const sliderStock: HTMLElement | null = document.querySelector('[data-name="stock"]');
      if (!sliderStock) throw new Error('sliderStock not found');
      const lowerTextBlock: HTMLElement | null = sliderStock.querySelector('[data-display="lower"]');
      if (!lowerTextBlock) throw new Error('lowerTextBlock not found');
      const upperTextBlock: HTMLElement | null = sliderStock.querySelector('[data-display="upper"]');
      if (!upperTextBlock) throw new Error('upperTextBlock not found');
      const inputLower: HTMLInputElement | null = sliderStock.querySelector('input[data-name="lower"]');
      if (!inputLower) throw new Error('inputLower not found');
      const inputUpper: HTMLInputElement | null = sliderStock.querySelector('input[data-name="upper"]');
      if (!inputUpper) throw new Error('inputUpper not found');
      const inputTrack: HTMLElement | null = sliderStock.querySelector('.dual-slider__between-track');
      if (!inputTrack) throw new Error('inputTrack not found');
      // Получение значений min и max
      const valuesStock = this._goodsList.map((item) => item.stock);
      const minStock = valuesStock.length ? Math.min(...valuesStock) : Number(inputLower.min);
      const maxStock = valuesStock.length ? Math.max(...valuesStock) : Number(inputLower.max);
      const maxInputValue = parseInt(inputLower.max);
      const lowerInputValuePercent = (minStock / maxInputValue) * 100;
      const upperInputValuePercent = (maxStock / maxInputValue) * 100;
      // Рендеринг текстовых значений
      lowerTextBlock.textContent = `${Math.round(minStock)}`;
      upperTextBlock.textContent = `${Math.round(maxStock)}`;
      // Рендеринг положения ползунка и трека инпута
      inputLower.value = String(minStock);
      inputUpper.value = String(maxStock);
      fillInputTrack(inputTrack, lowerInputValuePercent, upperInputValuePercent);
    }
  }
  private _renderCountGoods(): void {
    const totalBlock: HTMLElement | null = document.querySelector('.goods-list-total__content');
    if (totalBlock) {
      totalBlock.textContent = String(this._goodsList.length);
    }
  }
  private _setSearchInputValue() {
    const searchInput = document.getElementById('search-input');
    if (!(searchInput && searchInput instanceof HTMLInputElement)) throw new Error('searchInput is null');
    const url = new URL(window.location.href);
    const params = url.searchParams;
    if (params.has('search')) {
      const paramSearch = params.get('search');
      if (paramSearch) searchInput.value = paramSearch;
    }
  }
  private _renderNoGoodsMessage(): void {
    if (!this._goodsList.length) {
      if (!this._container) throw new Error('Goods container not found');
      this._container.innerHTML = `<div class='no-found-goods'>No products found &#128554;</div>`;
    }
  }
}

const app = new App();

export default app;
