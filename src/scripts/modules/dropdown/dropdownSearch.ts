import toggleDropdown from './toggleDropdown';

export default function dropdownSearch(target: HTMLElement): void {
  toggleDropdown(target);

  if (target.classList.contains('dropdown__item')) {
    console.log(target.dataset.value);
  }
}