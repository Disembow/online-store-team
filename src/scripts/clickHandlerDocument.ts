export default function clickHandlerDocument(event: MouseEvent): void {
  const target = event.target;

  if (target === null) throw new Error('target is null');

  if (target instanceof HTMLAnchorElement) {
    console.dir(target.hash);
    // Действия при нажатии на ссылки страниц/товаров
  }

  if (target instanceof HTMLElement) {
    console.dir(target.className);
    // Блок с выбранными фильтрами
    if (target.classList.contains('selected-filters-block__item')) {
      // Удаление при нажатии на крестик
      target.remove();
      // Дальнейшие действия с query параметрами
    }
  }
}
