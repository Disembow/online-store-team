import controlDualSlider from './modules/dual-slider/dual-slider';

export default function inputHandlerDocument(event: Event): void {
  const target = event.target;

  if ((!target || !(target instanceof HTMLInputElement)) && window.location.hash === '')
    throw new Error('target is null or not input');

  if (target instanceof HTMLInputElement && target.classList.contains('dual-slider__input')) {
    controlDualSlider(target);
  }
}
