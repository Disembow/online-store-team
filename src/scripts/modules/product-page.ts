import { targetProduct, IProductPage } from '../../types/product-page-types';

export class ProductPage implements IProductPage {
  render(targetProduct: targetProduct) {
    const [, categoryLink, brandLink, itemLink]: NodeListOf<HTMLSpanElement> = document.querySelectorAll(
      '.breadcrumbs__links'
    );
    if (categoryLink) categoryLink.innerText = targetProduct.category;
    if (brandLink) brandLink.innerText = targetProduct.brand;
    if (itemLink) itemLink.innerText = targetProduct.title;

    const photoBox = document.querySelector('.prod-photo__box');
    for (let i = 0; i < targetProduct.images.length; i++) {
      const div = document.createElement('div');
      const img = document.createElement('img');
      div.classList.add('prod-photo');
      img.classList.add('prod-photo__item');
      img.src = targetProduct.images[i];
      div.append(img);
      photoBox?.append(div);
    }

    const brandTitle = document.querySelector('.prod-brand__title') as HTMLDivElement;
    brandTitle.innerText = targetProduct.brand + '\n' + targetProduct.title;

    const description = document.querySelector('.prod__description') as HTMLParagraphElement;
    description.innerText = targetProduct.description;

    const brand = document.querySelector('.prod__category_brand') as HTMLSpanElement;
    brand.innerText = targetProduct.brand;

    const title = document.querySelector('.prod__category_title') as HTMLSpanElement;
    title.innerText = targetProduct.title;

    const category = document.querySelector('.prod__category_category') as HTMLSpanElement;
    category.innerText = targetProduct.category;

    const rating = document.querySelector('.prod__category_rating') as HTMLSpanElement;
    rating.innerText = targetProduct.rating.toString();

    const starsRating = document.querySelector('.prod__rating') as HTMLDivElement;
    for (let i = 0; i < 5; i++) {
      const div = document.createElement('div');
      div.classList.add('rating_star');
      i + 1 <= Math.round(targetProduct.rating)
        ? div.classList.add('rating_star_fill')
        : div.classList.add('rating_star_empty');
      starsRating.append(div);
    }

    const stock = document.querySelector('.prod__category_stock') as HTMLSpanElement;
    stock.innerText = targetProduct.stock.toString();

    const price = document.querySelector('.prod__category_price') as HTMLDivElement;
    price.innerText = `${targetProduct.price.toString()} USD`;

    const fullPrice = document.querySelector('.prod__category_fullprice') as HTMLDivElement;
    fullPrice.innerText = `${Math.round(
      targetProduct.price / (1 - targetProduct.discountPercentage / 100)
    ).toString()} USD`;
  }
}
