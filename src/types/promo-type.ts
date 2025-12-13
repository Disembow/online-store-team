export default interface IPromoCode {
  key: string;
  button: HTMLButtonElement | null;
  promoList: HTMLDivElement | null;
  apply(): void;
  discount(): void;
  getCartSumWithDiscount(): number | undefined;
  removePromo(e: Event): void;
}
