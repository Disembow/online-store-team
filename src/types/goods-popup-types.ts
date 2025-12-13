export interface IGoodsPopup {
  popup: HTMLDivElement | null;
  img: HTMLImageElement | null;
  overlay: HTMLDivElement | null;
  show(e: Event): void;
  hide(): void;
}
