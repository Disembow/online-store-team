import IPromoCode from '../../types/promo-type';
import { LocalStorage } from '../../types/product-page-types';

export class PromoCode implements IPromoCode {
  public key: string;
  public input: HTMLFormElement | null;
  public button: HTMLButtonElement | null;
  public promoList: HTMLDivElement | null;
  private valueBox: HTMLDivElement | null;
  private prevValueBox: HTMLDivElement | null;
  private promo: HTMLTemplateElement | null;
  private promocodes: string[];
  private usedPromocodes: string[];
  private discountRateMin = 0;
  private discountRateMax = 0.5;
  private discountRatePerPromo = 0.1;
  private discountRate = 0;
  constructor(key: string) {
    this.key = key;
    this.input = document.querySelector('.promo__input');
    this.button = document.querySelector('.promo__button');
    this.promoList = document.querySelector('.summary__promos');
    this.valueBox = document.querySelector('.product-value__sum_current');
    this.prevValueBox = document.querySelector('.product-value__sum');
    this.promo = <HTMLTemplateElement | null>document.getElementById('cart-promos');
    this.promocodes = ['RSS', 'RSFE', 'XTDM', 'CIMA', 'DPFR', 'MMPZ'];
    this.usedPromocodes = [];
  }

  private setToLocalStorage(key: string) {
    localStorage.setItem(key, `${JSON.stringify(this.usedPromocodes)}`);
  }

  private getFromLocalStorage(key: string) {
    const data = localStorage.getItem(key);
    if (data) this.usedPromocodes = JSON.parse(data);
  }

  private getCartSum() {
    const data = localStorage.getItem('OnlineStoreCartGN');
    if (data) {
      const cart: Array<LocalStorage> = JSON.parse(data);
      let sum = 0;
      cart.map((e) => {
        sum = sum + Number(e.price) * Number(e.quantity);
      });
      return sum;
    }
  }

  public getCartSumWithDiscount() {
    const sum = this.getCartSum();
    if (sum) return sum * (1 - this.discountRatePerPromo * this.usedPromocodes.length);
  }

  public render() {
    this.getFromLocalStorage(this.key);
    const priceBox = this.valueBox?.querySelector('.product-value__sum_colored');
    if (priceBox) priceBox.textContent = `€${this.getCartSumWithDiscount()?.toFixed(2)}`;
    if (this.usedPromocodes.length !== 0 && this.promoList?.children.length === 0) {
      this.valueBox?.classList.remove('hidden');

      // Render used promo codes
      this.usedPromocodes.map((e) => {
        const totalArray: NodeListOf<HTMLSpanElement> = document.querySelectorAll('.product-value__sum');
        totalArray.forEach((e, i, a) =>
          i !== a.length - 1
            ? e.classList.add('product-value__sum_previous')
            : e.classList.remove('product-value__sum_previous')
        );

        if (this.discountRate >= this.discountRateMax) this.button?.setAttribute('disabled', 'disabled');

        const clonePromo = <Element>this.promo?.content.cloneNode(true);
        const promoValue = clonePromo.querySelector('.promo-code__title');

        if (promoValue && this.input) promoValue.textContent = `Promo ${e} -10%`;

        this.promoList?.append(clonePromo);
      });
    }

    this.addTotalToHeader();
  }

  public apply() {
    this.getFromLocalStorage(this.key);
    if (
      this.promocodes.includes(String(this.input?.value)) &&
      !this.usedPromocodes.includes(String(this.input?.value))
    ) {
      this.button?.removeAttribute('disabled');
    } else {
      this.button?.setAttribute('disabled', 'disabled');
    }
  }

  public discount() {
    // Add new total value
    this.valueBox?.classList.remove('hidden');
    this.prevValueBox?.classList.add('product-value__sum_previous');
    const value = this.valueBox?.querySelector('.product-value__sum_colored');

    this.discountRate += this.discountRatePerPromo;
    if (this.usedPromocodes.includes(String(this.input?.value))) alert('This promo code was alredy used.');

    if (
      value &&
      this.discountRate > this.discountRateMin &&
      this.discountRate <= this.discountRateMax &&
      !this.usedPromocodes.includes(String(this.input?.value))
    ) {
      this.usedPromocodes.push(String(this.input?.value));
      this.setToLocalStorage(this.key);
      value.textContent = `€${this.getCartSumWithDiscount()?.toFixed(2)}`;

      if (this.discountRate >= this.discountRateMax) this.button?.setAttribute('disabled', 'disabled');

      // Add promo code to code-list
      const clonePromo = <Element>this.promo?.content.cloneNode(true);
      const promoValue = clonePromo.querySelector('.promo-code__title');
      if (promoValue && this.input) promoValue.textContent = `Promo ${this.input?.value} -10%`;
      this.promoList?.append(clonePromo);

      this.addTotalToHeader();
    }
  }

  public removePromo(e: Event) {
    this.getFromLocalStorage(this.key);
    const target = <Element>e.target;
    const targetParent = <Element>target.parentNode;
    targetParent.remove();

    const [, promo] = <Array<string>>targetParent.firstElementChild?.textContent?.split(' ');
    this.usedPromocodes = this.usedPromocodes.filter((e) => e !== promo);
    this.setToLocalStorage(this.key);
    this.discountRate -= this.discountRatePerPromo;

    if (this.usedPromocodes.length === 0) {
      this.valueBox?.classList.add('hidden');
      this.prevValueBox?.classList.remove('product-value__sum_previous');
    }

    this.render();
    this.addTotalToHeader();
  }

  private addTotalToHeader() {
    const headerTotal = document.querySelector('.header-total-price__sum');
    const sum = this.getCartSumWithDiscount()?.toFixed(2);
    if (headerTotal && sum) {
      localStorage.setItem('OnlineStoreTotalValueGN', sum);
      headerTotal.textContent = `€${
        sum
          .split('.')[0]
          .split('')
          .map((e, i) => (i % 3 === 0 ? e + ' ' : e))
          .join('')
          .trim() +
        '.' +
        sum.replace('€', '').split('.')[1]
      }`;
    }
  }
}
