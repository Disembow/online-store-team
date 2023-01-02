export default function toggleDropdown(target: HTMLElement): void {
  const dropdown = target.closest('.search__dropdown') || target.closest('.sort-goods__dropdown');
  const blockSelected = dropdown?.querySelector('.dropdown__selected');
  const dropdownList = dropdown?.querySelector('.dropdown__list');
  const dropdownArrow = dropdown?.querySelector('.dropdown__arrow');
  const dropdownItems = dropdown?.querySelectorAll('.dropdown__item');

  dropdownList?.classList.toggle('dropdown__list_hidden');
  dropdownArrow?.classList.toggle('dropdown__arrow_open');

  if (target.classList.contains('dropdown__item')) {
    dropdownItems?.forEach((item: Element) => {
      item.classList.remove('dropdown__item_selected');
    });
    target.classList.add('dropdown__item_selected');
    if (blockSelected instanceof HTMLElement) {
      blockSelected.innerText = target.innerText;
      blockSelected.dataset.value = target.dataset.value;
    }
  }
}
