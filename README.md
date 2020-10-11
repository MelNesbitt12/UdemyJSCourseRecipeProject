### Forkify: Code-Along Recipe App from Udemy Javascript Masterclass

Completed as a code-along project within The Complete Javascript Course (https://www.udemy.com/course/the-complete-javascript-course/). This recipe application is designed to search and retrieve recipe data from a 3rd-party API. Users can search for recipes using a limited number of search queries, select a recipe from the results, and presents the user with the following data:
- recipe image
- recipe name
- ingredients
- time to cook
- number of servings
- recipe author

This application also allows users to populate a shopping list based on the recipe they are viewing, as well as build a list of liked recipes that remain in local storage upon page refresh. 

## Setup Steps:

- Fork and clone this repository.
- Create and checkout to a new branch to begin your work.
- Run `npm install` to install all dependencies
- Use `npm run start` to spin up the server.

## Important Links:
- [Forkify API Documentation](https://forkify-api.herokuapp.com/)

## Technologies Used:
- HTML/CSS
- Javascript
- NPM
- Webpack 
- Babel
- ES6 modules
- Axios


## Tasks

`npm` is used as a task runner for this project. These are the commands available:

| Command                | Effect                                                                                                      |
|------------------------|-------------------------------------------------------------------------------------------------------------|
| `npm run start`       | Starts a development server with `nodemon` that automatically refreshes when you change something.                                                                                         |
| `npm test`             | Runs automated tests.                                                                                       |
| `npm run debug-server` | Starts the server in debug mode, which will print lots of extra info about what's happening inside the app. |

Developers should run these often!

- `npm run nag`: runs code quality analysis tools on your code and complains.
- `npm run make-standard`: reformats all your code in the JavaScript Standard
  Style.
- `npm run start`: generates bundles, watches, and livereloads.
- `npm run build`: place bundled styles and scripts where `index.html` can find
    them
- `npm run deploy`: builds and deploys master branch


### Resource Routes

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| GET    | `/search?q=<item>`     | `recipes#index`  |
| GET    | `/get?rId=id`          | `recipe#show`    |

