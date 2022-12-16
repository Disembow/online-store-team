export interface ICartChanger {
  cartButtonMinus: HTMLElement | null;
  cartButtonPlus: HTMLElement | null;
  counter: HTMLElement | null;
  number: number;
  increase(): void;
  decrease(): void;
}
