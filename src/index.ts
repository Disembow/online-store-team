import './style.scss';
import { Router } from './ts/hash-router';

const router = new Router();

window.addEventListener('hashchange', router.locationHandler);

router.locationHandler();
