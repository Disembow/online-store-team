function fillInputTrack(track: HTMLElement, min: number, max: number): void {
  track.style.background = `linear-gradient(to right, transparent ${min}%, #6A983C ${min}%, #6A983C ${max}%, transparent ${max}%)`;
}

function displayInputValue(lowerTextBlock: HTMLElement, upperTextBlock: HTMLElement, min: number, max: number): void {
  lowerTextBlock.textContent = `${Math.round(min)}$`;
  upperTextBlock.textContent = `${Math.round(max)}$`;
}

export default function controlDualSlider(target: HTMLInputElement) {
  const slider: HTMLElement | null = target.closest('.dual-slider');
  if (!slider) throw new Error('slider not found');
  const maxInputValue = parseInt(target.max);
  const gapBetweenInput = maxInputValue / 10;
  const inputTrack: HTMLElement | null = slider.querySelector('.dual-slider__between-track');
  if (!inputTrack) throw new Error('inputTrack not found');
  const lowerTextBlock: HTMLElement | null = slider.querySelector('[data-display="lower"]');
  if (!lowerTextBlock) throw new Error('lowerTextBlock not found');
  const upperTextBlock: HTMLElement | null = slider.querySelector('[data-display="upper"]');
  if (!upperTextBlock) throw new Error('upperTextBlock not found');

  if (target.dataset.name === 'lower') {
    const upperInput: HTMLInputElement | null = slider.querySelector('[data-name="upper"]');
    if (!upperInput) throw new Error('input not found');
    const upperInputValue = parseInt(upperInput.value);
    if (parseInt(target.value) >= upperInputValue - gapBetweenInput)
      target.value = String(upperInputValue - gapBetweenInput);
    const lowerInputValue = parseInt(target.value);
    const lowerInputValuePercent = (lowerInputValue / maxInputValue) * 100;
    const upperInputValuePercent = (upperInputValue / maxInputValue) * 100;
    fillInputTrack(inputTrack, lowerInputValuePercent, upperInputValuePercent);
    displayInputValue(lowerTextBlock, upperTextBlock, lowerInputValue, upperInputValue);
  }

  if (target.dataset.name === 'upper') {
    const lowerInput: HTMLInputElement | null = slider.querySelector('[data-name="lower"]');
    if (!lowerInput) throw new Error('input not found');
    const lowerInputValue = parseInt(lowerInput.value);
    if (parseInt(target.value) <= lowerInputValue + gapBetweenInput)
      target.value = String(lowerInputValue + gapBetweenInput);
    const upperInputValue = parseInt(target.value);
    const lowerInputValuePercent = (lowerInputValue / maxInputValue) * 100;
    const upperInputValuePercent = (upperInputValue / maxInputValue) * 100;
    fillInputTrack(inputTrack, lowerInputValuePercent, upperInputValuePercent);
    displayInputValue(lowerTextBlock, upperTextBlock, lowerInputValue, upperInputValue);
  }
}
