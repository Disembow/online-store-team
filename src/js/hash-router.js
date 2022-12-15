const pageTitle = "JS Single Page Application Router";

const routes = {
	404: {
		template: "templates/404.html",
		title: "404 | " + pageTitle,
		description: "Page not found",
	},
	"/": {
		template: "templates/index.html",
		title: "Home | " + pageTitle,
		description: "This is the home page",
	},
	about: {
		template: "templates/about.html",
		title: "About Us | " + pageTitle,
		description: "This is the about page",
	},
	contact: {
		template: "templates/contact.html",
		title: "Contact Us | " + pageTitle,
		description: "This is the contact page",
	},
};

class Router {
  locationHandler = async () => {
    let location = window.location.hash.replace("#", "").split('?')[0];
    // console.log(location === '' ? 'empty' : location);
    console.log(location.length)

    if (location.length === 0) {
      location = "/";
    }

    const route = routes[location] || routes["404"];
    const html = await fetch(route.template).then((response) => response.text());

    document.getElementById("content").innerHTML = html;
    document.title = route.title;
    document
      .querySelector('meta[name="description"]')
      .setAttribute("content", route.description);
  };
}

const router = new Router();

window.addEventListener("hashchange", router.locationHandler);

router.locationHandler();
