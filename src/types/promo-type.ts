export default interface IPromoCode {
  key: string;
  button: HTMLButtonElement | null;
  promoList: HTMLDivElement | null;
  apply(): void;
  discount(): void;
  removePromo(e: Event): void;
}
