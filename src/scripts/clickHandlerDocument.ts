import dropdownSearch from './modules/dropdown/dropdownSearch';

export default function clickHandlerDocument(event: MouseEvent): void {
  const target = event.target;

  if (target === null) throw new Error('target is null');

  if (target instanceof HTMLAnchorElement) {
    console.dir(target.hash);
    // Действия при нажатии на ссылки страниц/товаров
  }

  if (target instanceof HTMLElement) {
    // console.dir(target.className);
    //
    // Блок с выбранными фильтрами
    //
    if (target.classList.contains('selected-filters-block__item')) {
      // Удаление при нажатии на крестик
      target.remove();
      // Дальнейшие действия с query параметрами --->
    }
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
  }
}
