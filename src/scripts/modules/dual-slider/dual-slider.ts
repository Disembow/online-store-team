import app from '../../app';
import fillInputTrack from './fillInputTrack';
import displayInputValue from './displayInputValue';

export default function controlDualSlider(target: HTMLInputElement) {
  const slider: HTMLElement | null = target.closest('.dual-slider');
  if (!slider) throw new Error('slider not found');
  const sliderName = slider.dataset.name;
  // Применения стиля для активного инпута, чтобы последний передвинутый thumb был выше и мог сдвинуться обратно.
  const inputs = slider.querySelectorAll('.dual-slider__input');
  inputs.forEach((input) => input.classList.remove('dual-slider__input_active'));
  target.classList.add('dual-slider__input_active');
  //
  const maxInputValue = parseInt(target.max);
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
    if (parseInt(target.value) >= upperInputValue) target.value = String(upperInputValue);
    const lowerInputValue = parseInt(target.value);
    const lowerInputValuePercent = (lowerInputValue / maxInputValue) * 100;
    const upperInputValuePercent = (upperInputValue / maxInputValue) * 100;
    fillInputTrack(inputTrack, lowerInputValuePercent, upperInputValuePercent);
    displayInputValue(lowerTextBlock, upperTextBlock, lowerInputValue, upperInputValue);
    if (sliderName) app.filterDualSlider(sliderName, lowerInputValue, upperInputValue);
  }

  if (target.dataset.name === 'upper') {
    const lowerInput: HTMLInputElement | null = slider.querySelector('[data-name="lower"]');
    if (!lowerInput) throw new Error('input not found');
    const lowerInputValue = parseInt(lowerInput.value);
    if (parseInt(target.value) <= lowerInputValue) target.value = String(lowerInputValue);
    const upperInputValue = parseInt(target.value);
    const lowerInputValuePercent = (lowerInputValue / maxInputValue) * 100;
    const upperInputValuePercent = (upperInputValue / maxInputValue) * 100;
    fillInputTrack(inputTrack, lowerInputValuePercent, upperInputValuePercent);
    displayInputValue(lowerTextBlock, upperTextBlock, lowerInputValue, upperInputValue);
    if (sliderName) app.filterDualSlider(sliderName, lowerInputValue, upperInputValue);
  }
}
