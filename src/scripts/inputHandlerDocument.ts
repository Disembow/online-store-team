import controlDualSlider from './modules/dual-slider/dual-slider';
import app from './app';

export default function inputHandlerDocument(event: Event): void {
  const target = event.target;

  if (!target || !(target instanceof HTMLInputElement)) throw new Error('target is null or not input');

  if (target.name === 'category' || target.name === 'brand') {
    app.filterCheckbox(target.name, target.value, target.checked);
  }

  if (target.classList.contains('dual-slider__input')) {
    controlDualSlider(target);
  }
}
