import toggleDropdown from './toggleDropdown';
import app from '../../app';

export default function dropdownSortGoods(target: HTMLElement): void {
  toggleDropdown(target);

  if (target.classList.contains('dropdown__item')) {
    const name = target.dataset.sortName;
    const value = target.dataset.value;
    if (name && value) app.sort(name, value);
  }
}
