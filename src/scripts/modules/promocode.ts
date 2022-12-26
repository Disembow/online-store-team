export class PromoCode implements IPromoCode {
  input: HTMLInputElement | null;
  button: HTMLButtonElement | null;
  promocodes: string[];
  constructor() {
    this.input = document.querySelector('.promo__input');
    this.button = document.querySelector('.promo__button');
    this.promocodes = ['RS', 'RSFE'];
  }

  apply() {
    const total = document.querySelector('.product-value__sum');
    if (this.promocodes.includes(String(this.input?.value))) {
      this.button?.removeAttribute('disabled');
      const clone = <HTMLElement>total?.cloneNode(true);
      const value: HTMLSpanElement | null = clone?.querySelector('.product-value__sum_colored');
      if (value) value.textContent = `${Number(value.textContent) * 0.9}`;
      // TODO: finish this)
    } else {
      this.button?.setAttribute('disabled', 'disabled');
    }
  }
}

interface IPromoCode {
  input: HTMLInputElement | null;
  button: HTMLButtonElement | null;
  promocodes: string[];
  apply(): void;
}
