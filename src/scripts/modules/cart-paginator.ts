import { CartView } from './cart';
import { LocalStorageCartInfo } from './add-to-cart';

export class Pagiantor extends CartView {
  wrapper: HTMLDivElement | null;
  paginationElement: HTMLDivElement | null;
  itemPerPageSelect: HTMLSelectElement | null;
  currentPage: number;
  rows: number;

  constructor(localStorageKey: string, localStorageValue: Array<LocalStorageCartInfo>) {
    super(localStorageKey, localStorageValue);
    this.wrapper = document.querySelector('.products__container');
    this.paginationElement = document.querySelector('.pagenumbers');
    this.itemPerPageSelect = document.querySelector('.goods-per-page');

    this.currentPage = 1;
    this.rows = 4;
  }

  DisplayList() {
    super.get();
    if (this.wrapper) {
      this.wrapper.innerHTML = '';
      this.currentPage;

      const start = this.rows * (this.currentPage - 1);
      const end = start + this.rows;
      const paginatedItems = this.localStorageValue.slice(start, end).map((e) => e.id);

      super.render(paginatedItems);
    }
  }

  SetupPagination() {
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
    });

    return button;
  }

  ChangeItemPerPage() {
    super.get();
    this.itemPerPageSelect?.addEventListener('change', () => {
      this.rows = Number(this.itemPerPageSelect?.value);
      console.log('rows>>> ', this.rows);
      if (this.currentPage > Math.ceil(this.localStorageValue.length / this.rows)) {
        this.currentPage = Math.ceil(this.localStorageValue.length / this.rows);
      }
      this.SetupPagination();
      this.DisplayList();
    });
  }
}
