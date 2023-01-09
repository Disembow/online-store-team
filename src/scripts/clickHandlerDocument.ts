import dropdownSearch from './modules/dropdown/dropdownSearch';
import dropdownSortGoods from './modules/dropdown/dropdownSortGoods';
import toggleViewGoods from './modules/toggleViewGoods/toggleViewGoods';
import copyUrl from './modules/copy-url/copyUrl';
import app from './app';

export default function clickHandlerDocument(event: MouseEvent): void {
  const target = event.target;

  if (target === null) throw new Error('target is null');

  if (target instanceof HTMLElement) {
    //
    // Dropdown Search - выпадающий список для поисковой строки
    //
    if (!target.closest('.search__dropdown')) {
      const dropdown = document.querySelector('.search__dropdown');
      dropdown?.querySelector('.dropdown__list')?.classList.add('dropdown__list_hidden');
      dropdown?.querySelector('.dropdown__arrow')?.classList.remove('dropdown__arrow_open');
    } else {
      dropdownSearch(target);
    }
    //
    // Dropdown Sort goods - выпадающий список для сортировки продуктов
    //
    if (!target.closest('.sort-goods__dropdown')) {
      const dropdown = document.querySelector('.sort-goods__dropdown');
      dropdown?.querySelector('.dropdown__list')?.classList.add('dropdown__list_hidden');
      dropdown?.querySelector('.dropdown__arrow')?.classList.remove('dropdown__arrow_open');
    } else {
      dropdownSortGoods(target);
    }
    //
    // Переключение вида отображения товаров на главной странице
    //
    if (
      target.classList.contains('goods-list-view__item') &&
      !target.classList.contains('goods-list-view__item_active')
    ) {
      toggleViewGoods(target);
    }
    //
    // Активный сайдбар с фильтрами и затемнение
    //
    if (target.classList.contains('goods-list-filter')) {
      const asideBlock: HTMLElement | null = document.querySelector('.main-aside');
      if (asideBlock) asideBlock.classList.add('main-aside_active');
      const overlayBlock: HTMLElement | null = document.querySelector('.overlay');
      if (overlayBlock) overlayBlock.classList.add('overlay_active');
    }

    if (target.classList.contains('overlay') || target.id === 'main-aside-close') {
      const asideBlock: HTMLElement | null = document.querySelector('.main-aside');
      if (asideBlock) asideBlock.classList.remove('main-aside_active');
      const overlayBlock: HTMLElement | null = document.querySelector('.overlay');
      if (overlayBlock) overlayBlock.classList.remove('overlay_active');
    }
    //
    // Кнопка RESET
    //
    if (target.id === 'reset') {
      app.reset();
    }
    //
    // Кнопка COPY
    //
    if (target.id === 'copy') {
      copyUrl(target);
    }
  }
}
