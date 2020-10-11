import { elements } from './base'

/* Using a named export to read the input from our input form
    - return the input value of the field
    - select DOM element, get the value and return it 
*/
export const getInput = () => elements.searchInput.value 

// clearing the input field after search 
export const clearInput = () => {
    elements.searchInput.value = ''
}
// clear the results from the side view by setting the inner HTML of the results to nothing when another search happens. Here we are also clearing the buttons when we go to a  new page as well
export const clearResults = () => {
    elements.searchResultList.innerHTML = ''
    elements.searchResPages.innerHTML = ''
}

// add a function to keep the selected recipe highlighted on the left side:
export const highlightSelected = id => {
    // clear the previous selected highlighted recipe
    const resultsArr = Array.from(document.querySelectorAll('.results__link'))
    resultsArr.forEach(element => {
        element.classList.remove('results__link--active')
    })
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active')
}

// private function to limit the recipe titles. Pass in the title and a title limit as params:
/*
// ex: 'Pasta with tomato and spinach' 
acc: 0 / acc + current.length = 5 / newTitle = ['Pasta']
acc: 5 / acc + current.length = 9 / newTitle = ['Pasta', 'with']
acc: 9 / acc + current.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
acc: 15 / acc + current.length = 18. This word makes the value larger than the limit, so it will not be pushed into the array
acc: 18 / acc + current.length = 24. This word makes the value larger than the limit, so it will not be pushed into the array
*/

// we export this function in order to use it in the likesView, to limit the liked recipe title on the sidebar 
export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = []
    if (title.length > limit){
        // split the title by spaces so that it becomes an array of words. We can use the reduce method and pass in the accumulator and the current value as inputs. The second value passed into the reduce function is the initial value of the accumulator, which is 0. Throuhgout the loops we will add to the accumulator. reduce method has an accumulator built in as a parameter.
        title.split(' ').reduce((acc, current) => {
            // if the accumulator value plus the current word length is less than the limit value
            if (acc + current.length < limit) {
                // push current word into the array
                newTitle.push(current)
            }
            // the value that is returned in each loop of the reduce method will be the new accumulator
            return acc + current.length
        }, 0)
        // return the result as a string with spaces between the words with the join method
        return `${newTitle.join(' ')}...`
    } 
    // don't need the else here
    return title
}

// create a function that receives just one recipe:
const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `
    // inserting the markup for each of the recipe elements
    elements.searchResultList.insertAdjacentHTML('beforeend', markup)  
}

// return the markup for the button we are rendering
// type: 'prev' or 'next'
// Into this function we are passing the page we are currently on as well as the type of button
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-gotopage=${type === 'prev' ? page - 1 : page + 1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    </button>
`

// create a function to render the buttons to change pages. a private function we will call from renderResults:
const renderButtons = (page, numResults, resPerPage) => {
    // render the buttons according to the number of page we are on
    // 1. we need to know which page we are on, and how many pages there are? Divide number of results / results displayed per page. Math.ceiling will round the results to the next integer (ex: if we have 45 recipes, that would be 4.5 per page, so we want to round up to 5)
    const pages = Math.ceil(numResults / resPerPage)
    let button
    // determine which buttons to render based on page number. We only want a first button if there is more than one page.
    if (page === 1 && pages > 1){
        // Button to go to the next page
        button = createButton(page, 'next')
    } else if (page < pages){
        // Render both buttons, because this means we are on the middle page
        button = `
            ${createButton(page, 'next')}
            ${createButton(page, 'prev')}
        `
    } else if (page === pages && pages > 1) { // page === pages gives us the last page. We only want to render this button if there is more than one page
        //  Button to go to the previous page
        button = createButton(page, 'prev')
    }
    // insert the element into the DOM
    elements.searchResPages.insertAdjacentHTML('afterbegin', button)
}

// create a function that will receive the search results and then print each recipe, page, and results per page in the array to the UI
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // display the number of results per page (0-based). On page number 1, it will be 1-1 (0) * 10 so we start at zero
    const start = (page - 1) * resPerPage
    // end is just the page * resPerPage
    const end = page * resPerPage

    // take a part of the recipes array, with the slice method, which returns the shallow portion of the current array into a new array 
    recipes.slice(start, end).forEach(renderRecipe)

    // render pagination buttons with current page and recpies.length(the number of recipes), and results per page:
    renderButtons(page, recipes.length, resPerPage)
}