export interface ICartChanger {
  target: HTMLElement | null;
  counter: HTMLElement | null;
  stock: number | null | undefined;
  number: number;
  increase(): void;
  decrease(): void;
}
