export default function setDropdown(): void {
  const dropdowns = document.querySelectorAll('.dropdown');
  if (!(dropdowns instanceof NodeList) || dropdowns === null) throw new Error('dropdowns is null');

  dropdowns.forEach((dropdown: Element) => {
    const blockSelected = dropdown.querySelector('.dropdown__selected');
    if (!(blockSelected instanceof HTMLElement) || blockSelected === null) throw new Error('blockSelected is null');

    const dropdownList = dropdown.querySelector('.dropdown__list');
    if (!(dropdownList instanceof HTMLElement) || dropdownList === null) throw new Error('dropdownList is null');

    const dropdownArrow = dropdown.querySelector('.dropdown__arrow');
    if (!(dropdownArrow instanceof HTMLElement) || dropdownArrow === null) throw new Error('dropdownArrow is null');

    const dropdownItems = document.querySelectorAll('.dropdown__item');
    if (!(dropdownItems instanceof NodeList) || dropdownItems === null) throw new Error('dropdownItems is null');

    window.addEventListener('click', (event): void => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || target === null) throw new Error('is null');
      if (!target.closest('.dropdown')) {
        dropdownList.classList.add('dropdown__list_hidden');
        dropdownArrow.classList.remove('dropdown__arrow_open');
      }
    });

    dropdown.addEventListener('click', (event): void => {
      dropdownList.classList.toggle('dropdown__list_hidden');
      dropdownArrow.classList.toggle('dropdown__arrow_open');

      const target = event.target;
      if (!(target instanceof HTMLElement) || target === null) throw new Error('is null');

      if (target.classList.contains('dropdown__item')) {
        dropdownItems.forEach((item: Element) => {
          item.classList.remove('dropdown__item_selected');
        });
        target.classList.add('dropdown__item_selected');
        blockSelected.innerText = target.innerText;
      }
    });
  });
}
