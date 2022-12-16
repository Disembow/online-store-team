import { IRouter, IRoutes } from '../types/hash-router-types';

const pageTitle = 'Online store';

const routes: IRoutes = {
  404: {
    template: 'templates/404.html',
    title: '404 | ' + pageTitle,
    description: 'Page not found',
  },
  '/': {
    template: 'templates/index.html',
    title: 'Home | ' + pageTitle,
    description: 'This is the home page',
  },
  about: {
    template: 'templates/about.html',
    title: 'About Us | ' + pageTitle,
    description: 'This is the about page',
  },
  contact: {
    template: 'templates/contact.html',
    title: 'Contact Us | ' + pageTitle,
    description: 'This is the contact page',
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
