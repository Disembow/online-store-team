import { CartView } from './cart';
import { LocalStorageCartInfo } from './add-to-cart';

// const cartData: string[] = [
//   'Item 1',
//   'Item 2',
//   'Item 3',
//   'Item 4',
//   'Item 5',
//   'Item 6',
//   'Item 7',
//   'Item 8',
//   'Item 9',
//   'Item 10',
//   'Item 11',
//   'Item 12',
//   'Item 13',
//   'Item 14',
//   'Item 15',
//   'Item 16',
//   'Item 17',
//   'Item 18',
//   'Item 19',
//   'Item 20',
//   'Item 21',
//   'Item 22',
//   'Item 23',
//   'Item 24',
//   'Item 25',
//   'Item 26',
//   'Item 27',
//   'Item 28',
//   'Item 29',
//   'Item 30',
//   'Item 31',
//   'Item 32',
//   'Item 33',
//   'Item 34',
// ];

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
      console.log('pageCount >>> ', pageCount);
      // console.log('this.localStorageValue >>> ', this.localStorageValue);

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
