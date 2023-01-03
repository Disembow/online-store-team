const cartData: string[] = [
  'Item 1',
  'Item 2',
  'Item 3',
  'Item 4',
  'Item 5',
  'Item 6',
  'Item 7',
  'Item 8',
  'Item 9',
  'Item 10',
  'Item 11',
  'Item 12',
  'Item 13',
  'Item 14',
  'Item 15',
  'Item 16',
  'Item 17',
  'Item 18',
  'Item 19',
  'Item 20',
  'Item 21',
  'Item 22',
  'Item 23',
  'Item 24',
  'Item 25',
  'Item 26',
  'Item 27',
  'Item 28',
  'Item 29',
  'Item 30',
  'Item 31',
  'Item 32',
  'Item 33',
  'Item 34',
];

export class Pagiantor {
  cartData: string[];
  wrapper: HTMLDivElement | null;
  paginationElement: HTMLDivElement | null;
  itemPerPageSelect: HTMLSelectElement | null;
  currentPage: number;
  rows: number;

  constructor(cartData: string[]) {
    // constructor() {
    this.cartData = cartData;
    this.wrapper = document.querySelector('.list');
    this.paginationElement = document.querySelector('.pagenumbers');
    this.itemPerPageSelect = document.querySelector('.goods-per-page');

    this.currentPage = 1;
    this.rows = 4;
  }

  getDataToDraw() {
    const data = localStorage.getItem('OnlineStoreCartGN');
    if (data) {
      const dataToDraw: Array<string> = JSON.parse(data);
      return dataToDraw;
    }
  }

  DisplayList() {
    if (this.wrapper) {
      this.wrapper.innerHTML = '';
      this.currentPage;

      const start = this.rows * (this.currentPage - 1);
      const end = start + +this.rows;
      const paginatedItems = this.cartData.slice(start, end);

      for (let i = 0; i < paginatedItems.length; i++) {
        const item = paginatedItems[i];

        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerText = item; // TODO: add item drawing here!

        this.wrapper.appendChild(itemElement);
      }
    }
  }

  SetupPagination() {
    if (this.paginationElement) {
      this.paginationElement.innerHTML = '';

      const pageCount = Math.ceil(this.cartData.length / this.rows);

      for (let i = 1; i <= pageCount; i++) {
        const button = this.PaginationButton(i);
        this.paginationElement.appendChild(button);
      }
    }
  }

  private PaginationButton(page: number): HTMLButtonElement {
    const button = document.createElement('button');
    button.innerText = page.toString();
    button.classList.add('button');

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
    this.itemPerPageSelect?.addEventListener('change', () => {
      this.rows = Number(this.itemPerPageSelect?.value);
      if (this.currentPage > Math.ceil(this.cartData.length / this.rows)) {
        this.currentPage = Math.ceil(this.cartData.length / this.rows);
      }
      this.SetupPagination();
      this.DisplayList();
    });
  }
}

const paginator = new Pagiantor(cartData);
paginator.DisplayList();
paginator.SetupPagination();
paginator.ChangeItemPerPage();
// const data = paginator.getDataToDraw();
// console.log(data);
