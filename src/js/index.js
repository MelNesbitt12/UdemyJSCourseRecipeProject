// Global app controller
import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List'
import Likes from './models/Likes'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as likesView from './views/likesView'
import { elements, renderLoader, clearLoader } from './views/base'

/* Global state of the app - one object which stores the state of our app
    * - Search object
    * - Current recipe object 
    * - Shopping list object
    * - Liked recipes 
*/
const state = {}

/*
SEARCH CONTROLLER
*/
// create a function to be run whenever the form is submitted
const controlSearch = async () => {
    // 1. get the query from the view (aka read the input from the input field)
    const query =  searchView.getInput()

    // 2. if there is a query:
    if (query) {
        // we create a new search object that contains the query and add it to state
        state.search = new Search(query)

        // 3. Prepare UI for results
        searchView.clearInput()
        searchView.clearResults()
            // render our loader by passing in the parent element. The parent element is the results div in the HTML
        renderLoader(elements.searchResults)
        
        try {
            // 4. Search for recipes using the state.search.getResults() method. This will return a promise, we have to wait until the promise resolves and comes back with our data. 
            await state.search.getResults() 

            // 5. Render results on UI only AFTER we receive the results from the API. First we start by removing the loader from any previous search 
            clearLoader()
            searchView.renderResults(state.search.result)
        } catch (error) {
           alert('Something went wrong with your search...')
         // we want to clear the page load if there is an error 
           clearLoader()
        }    
    }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault()
  controlSearch()
})


// element that is available on load is .results_pages, so this is where we attach our event handler:
elements.searchResPages.addEventListener('click', e => {
    // when there are a number of elements, we can use closest method. This method returns the closest ancestor of the current element which matches the selectors given in the parameter. We are only interested in clicks to the button itself:
    const btn = e.target.closest('.btn-inline')
    if (btn) {
        // read out the data that is stored in the gotopage data attribute you created. Convert the page number to a number. Use 10 to specify that we are using base 10 
        const goToPage = parseInt(btn.dataset.gotopage, 10)
        // clear results before moving on to the next page
        searchView.clearResults()

        // rendering the results based on the page we are currently on
        searchView.renderResults(state.search.result, goToPage)

        // console.log(goToPage)
    }
    
})

/*
RECIPE CONTROLLER
*/

const controlRecipe = async () => {
    // window.location is entire URL. If we use the hash property on it, we just get the hash(containig the id)
    // getting rid of the hash symbol by replacing it with nothing, because we only want the id number
    const id = window.location.hash.replace('#', '')
    // console.log(id)
    // if the recipe exists based on the id:
    if(id) {

        // Prepare UI for changes
        // clear any previous recipe from the page
        recipeView.clearRecipe()
        // render the loader. Pass in parent so the loader knows where to display itself on the page
        renderLoader(elements.recipe)
        // highlight the selected search item
        if(state.search) {
            searchView.highlightSelected(id)
        }

        // Create new recipe object. Save Recipe in our state object.
        state.recipe = new Recipe(id)

         // We need to account for whether or not the promise is rejected. 
        try {
        // Get recipe data and parse ingredients. We can load our recipe data in the background by waiting for the promise. 
    
            await state.recipe.getRecipe()
            // console.log(state.recipe.ingredients)
            state.recipe.parseIngredients()

            // call calcTime and calcServings 
            state.recipe.calcTime()
            state.recipe.calcServings()

            // Render the recipe on the UI
            // clear loader once data has been returned 
            clearLoader()
            // pass the recipe and whether or not it has been liked into the renderRecipe function
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                )

        } catch (error) {
            // console.log(error)
            alert('Error processing recipe!')
        }
    }
}

// whenever the hash is chnaged, the controlRecipe function will be called, logging current hash to console 
// window.addEventListener('hashchange', controlRecipe)
// // add event listener to load event, which fires whenever the page is loader
// window.addEventListener('load', controlRecipe)

// here is how you add the same event listener to different events to make code cleaner
// we saved the strings for 2 event types into an array, looped over them, and with forEach, called window.addEventListener to each of them, calling the corresponding function for each. 
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))


/*
LIST CONTROLLER
*/
const controlList = () => {
    // Create a new list if there is not yet a list
    if(!state.list) {
        // initialize a list with an empty object
        state.list = new List()
    }
    // Add each ingredient to the list by passing in current item count, unit and ingredient from state
    state.recipe.ingredients.forEach(element => {
        const item = state.list.addItem(element.count, element.unit, element.ingredient)
        // using the renderItem method in the listView file to print(render) the item information on the page 
        listView.renderItem(item)
    })
}

// Handle delete and update list item events. We want to catch them on elements.shopping
elements.shopping.addEventListener('click', event => {
    // Try and read the id of the element that was clicked on. We use .closest because we need to find the specific element that contains the id we want to delete. Find an element with the shopping item class on it, close to where the click occured. 
    const id = event.target.closest('.shopping__item').dataset.itemid

    // Handle the delete button. Test if target matches the shopping__delete class. matches will return true or false.
    if(event.target.matches('.shopping__delete, .shopping__delete *')) {
        // if true, delete from state
        state.list.deleteItem(id)
        // Delete from UI
        listView.deleteItem(id)
        // Handle the count update
    } else if (event.target.matches('.shopping__count-value')) {
        // read the data from the UI and update it in state. Our target is the exact element that was clicked. We can use the value property to get the value of the element clicked
        const val = parseFloat(event.target.value)
        state.list.updateCount(id, val)
    }
})

/*
LIKE CONTROLLER
*/

const controlLike = () => {
    if(!state.likes) {
        state.likes = new Likes()
    }
    const currentID = state.recipe.id
    // First possible state: user has NOT yet been liked. 
    if(!state.likes.isLiked(currentID)){
        // Add liked to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )
        // Toggle the like button
        likesView.toggleLikeBtn(true)

        // Add like to UI list 
        likesView.renderLike(newLike)
        

    } else {
    // Second possible state: user HAS liked current recipe. If we hit the button, we want to remove the recipe from the likes array.
        // Remove like from state
        state.likes.deleteLike(currentID)
        // Toggle like button
        likesView.toggleLikeBtn(false)

        // Remove like from UI list 
        likesView.deleteLike(currentID)

    }
    likesView.toggleLikeMenu(state.likes.getNumLikes())
    
}

// re-store liked recipes on page load
window.addEventListener('load', () => {
    // create new Likes object, which will be empty when the page loads
    state.likes = new Likes()

    // restoring likes after page load 
    state.likes.readStorage()

    // Toggle like menu button 
    likesView.toggleLikeMenu(state.likes.getNumLikes())

    // Render existing liked recipes in the likes menu
    state.likes.likes.forEach(like => likesView.renderLike(like))
})


// Handling event handlers for decrease/increase buttons for recipe servings. We need to use event delegation because these buttons will not available on page load. The only thing that is available on page load is the recipe element (Which we will attach the event to), and then use target property to figure out where the click actually happens. 
// All of the events that happen on the recipe element are all handled within this event handler function 
elements.recipe.addEventListener('click', event => {
    // test what was clicked and then react accordingly, with .matches. Select the element and any child elements with *.
    if(event.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked, we can decrease servings but only if servings is greater than 1
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('decrease')
            recipeView.updateServingsIngredients(state.recipe)
        }
    } else if(event.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('increase')
        recipeView.updateServingsIngredients(state.recipe)
        // checking to see where the click happens (on either the button or any of the children of the button)
    } else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //Add ingredients to shopping list 
        controlList()
    } else if (event.target.matches('.recipe__love, .recipe__love *')) {
        // Call Like controller 
        controlLike()
    }

})
