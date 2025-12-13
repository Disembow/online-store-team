export default interface IBuyNow {
  test(): boolean;
  noLetters(e: KeyboardEvent, element: HTMLInputElement, limit: number): void;
  changePaymentSystemImage(): void;
  formatCardCode(limit: number, splitter: string): void;
  numberReduce(limit: number): void;
  showBillPopup(): void;
  hideBillPopup(): void;
  showRedirectPopup(): void;
}
