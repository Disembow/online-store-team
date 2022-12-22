import { IRouter, IRoutes } from '../types/hash-router-types';
import { products } from './data';

const pageTitle = 'Online store';
const IdArray: number[] = [];
products.products.map((e) => IdArray.push(e.id));

const routes: IRoutes = {
  '/': {
    template: 'templates/main.html',
    title: 'Main | ' + pageTitle,
    description: 'This is the home page',
  },
  404: {
    template: 'templates/404.html',
    title: '404 | ' + pageTitle,
    description: 'Page not found',
  },
  cart: {
    template: 'templates/cart.html',
    title: 'Cart | ' + pageTitle,
    description: 'Cart page',
  },
  goods: {
    template: 'templates/goods.html',
    title: 'Goods | ' + pageTitle,
    description: 'Page for goods',
    goodsID: IdArray,
  },
};

export class Router implements IRouter {
  locationHandler = async () => {
    let location = window.location.hash.replace('#', '');
    const mainlocation = window.location.hash.replace('#', '').split('/')[0];

    if (location.length === 0) {
      location = '/';
    }

    const route = routes[mainlocation] || routes['404'];
    if (typeof route.template === 'string' && typeof route.title === 'string') {
      const html = await fetch(route.template).then((response) => response.text());
      const content: HTMLElement | null = document.getElementById('content');
      if (content) content.innerHTML = html;
      document.title = route.title;
    }

    const pageName: HTMLElement | null = document.querySelector('meta[name="description"]');
    if (pageName && typeof route.description === 'string') pageName.setAttribute('content', route.description);
  };
}
