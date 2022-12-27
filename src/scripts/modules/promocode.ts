export class PromoCode implements IPromoCode {
  input: HTMLInputElement | null;
  button: HTMLButtonElement | null;
  promocodes: string[];
  usedPromocodes: string[];
  discountRate: number;
  discountRateMin = 0;
  discountRateMax = 0.5;
  constructor() {
    this.input = document.querySelector('.promo__input');
    this.button = document.querySelector('.promo__button');
    this.promocodes = ['RSS', 'RSFE'];
    this.usedPromocodes = [];
    this.discountRate = 0;
  }

  public apply() {
    if (this.promocodes.includes(String(this.input?.value))) {
      this.button?.removeAttribute('disabled');
    } else {
      this.button?.setAttribute('disabled', 'disabled');
    }
  }

  public discount() {
    // Add new total value
    const total = <HTMLTemplateElement | null>document.getElementById('cart-summary');
    const promo = <HTMLTemplateElement | null>document.getElementById('cart-promos');
    const summary = document.querySelector('.summary__box');
    const clone = <Element>total?.content.cloneNode(true);
    const value = clone?.querySelector('.product-value__sum_colored');
    const lastValue: Element = document.querySelectorAll('.product-value__sum_colored')[0];

    this.discountRate += 0.1;
    if (this.usedPromocodes.includes(String(this.input?.value))) alert('This promo code was alredy used.');
    if (
      value &&
      this.discountRate > this.discountRateMin &&
      this.discountRate <= this.discountRateMax &&
      !this.usedPromocodes.includes(String(this.input?.value))
    ) {
      value.textContent = `€${(Number(lastValue.textContent?.replace('€', '')) * (1 - this.discountRate)).toFixed(2)}`;
      if (clone) summary?.append(clone);

      const totalArray: NodeListOf<HTMLSpanElement> = document.querySelectorAll('.product-value__sum');
      totalArray.forEach((e, i, a) =>
        i !== a.length - 1
          ? e.classList.add('product-value__sum_previous')
          : e.classList.remove('product-value__sum_previous')
      );

      if (this.discountRate >= this.discountRateMax) this.button?.setAttribute('disabled', 'disabled');

      // Add promo code to code-list
      const promoList = document.querySelector('.summary__promos');
      const clonePromo = <Element>promo?.content.cloneNode(true);
      const promoValue = clonePromo.querySelector('.promo-code__title');
      if (promoValue && this.input) promoValue.textContent = `Used promo code - ${this.input?.value}`;
      promoList?.append(clonePromo);

      this.usedPromocodes.push(String(this.input?.value));
      console.log(this.usedPromocodes);
    }
  }
}

interface IPromoCode {
  input: HTMLInputElement | null;
  button: HTMLButtonElement | null;
  promocodes: string[];
  apply(): void;
}
