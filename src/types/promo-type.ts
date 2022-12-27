export default interface IPromoCode {
  button: HTMLButtonElement | null;
  promoList: HTMLDivElement | null;
  apply(): void;
  discount(): void;
  removePromo(e: Event): void;
}
