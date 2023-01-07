import renderGoods from '../../renderGoods';

export default function toggleViewGoods(target?: HTMLElement, view?: string) {
  const buttons = document.querySelectorAll('.goods-list-view__item');
  buttons?.forEach((btn) => btn.classList.remove('goods-list-view__item_active'));

  target?.classList.add('goods-list-view__item_active');
  if (target?.dataset.viewValue) renderGoods.setViewURLSearchParams(target.dataset.viewValue);

  const btnActive = document.querySelector(`[data-view-value="${view}"]`);
  btnActive?.classList.add('goods-list-view__item_active');

  const products = document.querySelectorAll('[data-view]');
  products?.forEach((product) => {
    if (product instanceof HTMLElement) {
      product.dataset.view = target?.dataset.viewValue || view;
    }
  });
}
