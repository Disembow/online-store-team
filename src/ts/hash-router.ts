import { IRouter, IRoutes } from '../types/hash-router-types';

const pageTitle = 'Online store';

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
    title: 'About Us | ' + pageTitle,
    description: 'Cart page',
  },
  goods: {
    template: 'templates/goods.html',
    title: 'Goods | ' + pageTitle,
    description: 'Page for goods',
  },
};

export class Router implements IRouter {
  locationHandler = async () => {
    let location = window.location.hash.replace('#', '').split('?')[0];

    if (location.length === 0) {
      location = '/';
    }

    const route = routes[location] || routes['404'];
    const html = await fetch(route.template).then((response) => response.text());

    const content: HTMLElement | null = document.getElementById('content');
    if (content) content.innerHTML = html;
    document.title = route.title;

    const pageName: HTMLElement | null = document.querySelector('meta[name="description"]');
    if (pageName) pageName.setAttribute('content', route.description);
  };
}
