export class PromoCode implements IPromoCode {
  private input: HTMLInputElement | null;
  public button: HTMLButtonElement | null;
  public promoList: HTMLDivElement | null;
  private summary: HTMLDivElement | null;
  private promocodes: string[];
  private usedPromocodes: string[];
  private discountRate: number;
  private discountRateMin = 0;
  private discountRateMax = 0.5;
  private discountRatePerPromo = 0.1;
  constructor() {
    this.input = document.querySelector('.promo__input');
    this.button = document.querySelector('.promo__button');
    this.promoList = document.querySelector('.summary__promos');
    this.summary = document.querySelector('.summary__box');
    this.promocodes = ['RSS', 'RSFE', 'XTDM', 'CIMA', 'DPFR', 'MMPZ'];
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
    const clone = <Element>total?.content.cloneNode(true);
    const value = clone?.querySelector('.product-value__sum_colored');
    const lastValue: Element = document.querySelectorAll('.product-value__sum_colored')[0];

    this.discountRate += this.discountRatePerPromo;
    if (this.usedPromocodes.includes(String(this.input?.value))) alert('This promo code was alredy used.');
    if (
      value &&
      this.discountRate > this.discountRateMin &&
      this.discountRate <= this.discountRateMax &&
      !this.usedPromocodes.includes(String(this.input?.value))
    ) {
      value.textContent = `€${(Number(lastValue.textContent?.replace('€', '')) * (1 - this.discountRate)).toFixed(2)}`;

      if (clone) this.summary?.append(clone);

      const totalArray: NodeListOf<HTMLSpanElement> = document.querySelectorAll('.product-value__sum');
      totalArray.forEach((e, i, a) =>
        i !== a.length - 1
          ? e.classList.add('product-value__sum_previous')
          : e.classList.remove('product-value__sum_previous')
      );

      if (this.discountRate >= this.discountRateMax) this.button?.setAttribute('disabled', 'disabled');

      // Add promo code to code-list
      const clonePromo = <Element>promo?.content.cloneNode(true);
      const promoValue = clonePromo.querySelector('.promo-code__title');
      if (promoValue && this.input) promoValue.textContent = `Used promo code - ${this.input?.value}`;
      this.promoList?.append(clonePromo);

      this.usedPromocodes.push(String(this.input?.value));
    }
  }

  removePromo(e: Event) {
    console.log(this.usedPromocodes);
    const target = <Element>e.target;
    const targetParent = <Element>target.parentNode;
    targetParent.remove();

    const [, promo] = <Array<string>>targetParent.firstElementChild?.textContent?.split(' - ');
    this.usedPromocodes = this.usedPromocodes.filter((e) => e !== promo);
    this.discountRate -= this.discountRatePerPromo;
    console.log(this.usedPromocodes);

    this.summary?.lastElementChild?.remove();
    this.summary?.lastElementChild?.classList.remove('product-value__sum_previous');
  }
}

interface IPromoCode {
  button: HTMLButtonElement | null;
  promoList: HTMLDivElement | null;
  apply(): void;
  discount(): void;
  removePromo(e: Event): void;
}
