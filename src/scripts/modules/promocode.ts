import IPromoCode from '../../types/promo-type';
import { LocalStorage } from '../../types/product-page-types';

export class PromoCode implements IPromoCode {
  public key: string;
  private input: HTMLInputElement | null;
  public button: HTMLButtonElement | null;
  public promoList: HTMLDivElement | null;
  private summary: HTMLDivElement | null;
  private total: HTMLTemplateElement | null;
  private promo: HTMLTemplateElement | null;
  private lastValue: Element;
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
    this.summary = document.querySelector('.summary__box');
    this.total = <HTMLTemplateElement | null>document.getElementById('cart-summary');
    this.promo = <HTMLTemplateElement | null>document.getElementById('cart-promos');
    this.lastValue = document.querySelectorAll('.product-value__sum_colored')[0];
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

  public render() {
    this.getFromLocalStorage(this.key);

    if (this.usedPromocodes.length !== 0 && this.promoList?.children.length === 0) {
      const clone = <Element>this.total?.content.cloneNode(true);
      const sum = this.getCartSum();
      const value = clone?.querySelector('.product-value__sum_colored');

      if (value && sum) {
        value.textContent = `€${(sum * (1 - this.discountRatePerPromo * this.usedPromocodes.length)).toFixed(2)}`;
      }

      this.usedPromocodes.map((e) => {
        if (clone) this.summary?.append(clone);

        const totalArray: NodeListOf<HTMLSpanElement> = document.querySelectorAll('.product-value__sum');
        totalArray.forEach((e, i, a) =>
          i !== a.length - 1
            ? e.classList.add('product-value__sum_previous')
            : e.classList.remove('product-value__sum_previous')
        );

        if (this.discountRate >= this.discountRateMax) this.button?.setAttribute('disabled', 'disabled');

        const clonePromo = <Element>this.promo?.content.cloneNode(true);
        const promoValue = clonePromo.querySelector('.promo-code__title');

        if (promoValue && this.input) promoValue.textContent = `Used promo code - ${e}`;

        this.promoList?.append(clonePromo);
      });
    }
  }

  public apply() {
    this.getFromLocalStorage(this.key);
    if (this.promocodes.includes(String(this.input?.value)) && !this.promocodes.includes(String(this.input?.value))) {
      this.button?.removeAttribute('disabled');
    } else {
      this.button?.setAttribute('disabled', 'disabled');
    }
  }

  public discount() {
    // Add new total value
    const clone = <Element>this.total?.content.cloneNode(true);
    const value = clone?.querySelector('.product-value__sum_colored');

    this.discountRate += this.discountRatePerPromo;
    if (this.usedPromocodes.includes(String(this.input?.value))) alert('This promo code was alredy used.');

    if (
      value &&
      this.discountRate > this.discountRateMin &&
      this.discountRate <= this.discountRateMax &&
      !this.usedPromocodes.includes(String(this.input?.value))
    ) {
      value.textContent = `€${(Number(this.lastValue.textContent?.replace('€', '')) * (1 - this.discountRate)).toFixed(
        2
      )}`;

      if (clone) this.summary?.append(clone);

      const totalArray: NodeListOf<HTMLSpanElement> = document.querySelectorAll('.product-value__sum');
      totalArray.forEach((e, i, a) =>
        i !== a.length - 1
          ? e.classList.add('product-value__sum_previous')
          : e.classList.remove('product-value__sum_previous')
      );

      if (this.discountRate >= this.discountRateMax) this.button?.setAttribute('disabled', 'disabled');

      // Add promo code to code-list
      const clonePromo = <Element>this.promo?.content.cloneNode(true);
      const promoValue = clonePromo.querySelector('.promo-code__title');
      if (promoValue && this.input) promoValue.textContent = `Used promo code - ${this.input?.value}`;
      this.promoList?.append(clonePromo);

      this.usedPromocodes.push(String(this.input?.value));
      this.setToLocalStorage(this.key);
    }
  }

  public removePromo(e: Event) {
    this.getFromLocalStorage(this.key);
    const target = <Element>e.target;
    const targetParent = <Element>target.parentNode;
    targetParent.remove();

    const [, promo] = <Array<string>>targetParent.firstElementChild?.textContent?.split(' - ');
    this.usedPromocodes = this.usedPromocodes.filter((e) => e !== promo);
    this.setToLocalStorage(this.key);
    this.discountRate -= this.discountRatePerPromo;

    this.summary?.lastElementChild?.remove();
    this.summary?.lastElementChild?.classList.remove('product-value__sum_previous');
  }
}
