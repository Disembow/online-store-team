export default function displayInputValue(
  lowerTextBlock: HTMLElement,
  upperTextBlock: HTMLElement,
  min: number,
  max: number
): void {
  lowerTextBlock.textContent = `${Math.round(min)}`;
  upperTextBlock.textContent = `${Math.round(max)}`;
}
