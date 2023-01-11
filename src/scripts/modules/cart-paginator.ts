import { CartView } from './cart';
import { LocalStorageCartInfo } from '../../types/add-to-cart-types';

export class Pagiantor extends CartView {
  wrapper: HTMLDivElement | null;
  paginationElement: HTMLDivElement | null;
  itemPerPageSelect: HTMLSelectElement | null;
  itemNumber: NodeListOf<HTMLSpanElement> | null;
  itemCount: HTMLSpanElement | null;
  currentPage: number;
  rows: number;

  constructor(localStorageKey: string, localStorageValue: Array<LocalStorageCartInfo>) {
    super(localStorageKey, localStorageValue);
    this.wrapper = document.querySelector('.products__container');
    this.paginationElement = document.querySelector('.pagenumbers');
    this.itemPerPageSelect = document.querySelector('.goods-per-page');
    this.itemNumber = document.querySelectorAll('.product__number');
    this.itemCount = document.querySelector('.product-items__count');

    this.currentPage = 1;
    this.rows = 4;
  }

  public DisplayList() {
    super.get();

    const start = this.rows * (this.currentPage - 1);
    const end = start + this.rows;
    const paginatedItems = this.localStorageValue.slice(start, end).map((e) => e.id);

    if (paginatedItems.length === 0) {
      this.currentPage--;
      this.setQueryParams();
      this.parseQueryParam();
    }

    const wrapper = document.querySelector('.products__container');
    if (wrapper) {
      wrapper.innerHTML = '';
      super.render(paginatedItems);
    }

    if (this.itemCount) this.itemCount.textContent = `${this.localStorageValue.length}`;
    if (this.headerCounter) this.headerCounter.textContent = super.getItemsCount();

    document.querySelectorAll('.product__number')?.forEach((e, i) => (e.textContent = `${start + i + 1}`));
  }

  public SetupPagination() {
    super.get();

    if (this.paginationElement) {
      this.paginationElement.innerHTML = '';

      const pageCount = Math.ceil(this.localStorageValue.length / this.rows);

      for (let i = 1; i <= pageCount; i++) {
        const button = this.PaginationButton(i);
        this.paginationElement.appendChild(button);
      }
    }
  }

  private PaginationButton(page: number): HTMLButtonElement {
    const button = document.createElement('button');
    button.innerText = page.toString();
    button.classList.add('button', 'button_round');

    if (this.currentPage === page) button.classList.add('button_active');

    button.addEventListener('click', () => {
      this.currentPage = page;
      this.DisplayList();

      const currentButton = document.querySelector('.button_active');
      currentButton?.classList.remove('button_active');

      button.classList.add('button_active');

      this.setQueryParams();
    });

    return button;
  }

  public ChangeItemPerPage() {
    super.get();

    this.itemPerPageSelect?.addEventListener('change', () => {
      this.rows = Number(this.itemPerPageSelect?.value);
      if (this.currentPage > Math.ceil(this.localStorageValue.length / this.rows)) {
        this.currentPage = Math.ceil(this.localStorageValue.length / this.rows);
      }

      this.SetupPagination();
      this.DisplayList();
      this.setQueryParams();
    });
  }

  public parseQueryParam() {
    if (location.hash.includes('/')) {
      const searchState = location.hash.split('/?')[1].split('&');

      this.currentPage = +searchState[0].split('=')[1];
      this.rows = +searchState[1].split('=')[1];
      if (this.itemPerPageSelect) this.itemPerPageSelect.selectedIndex = this.rows / 4 - 1;

      this.SetupPagination();
      this.DisplayList();
    }
  }

  public setQueryParams() {
    const state = `#cart/?page=${this.currentPage}&itemperpage=${this.rows}`;
    window.history.pushState(null, '', state);
  }
}
