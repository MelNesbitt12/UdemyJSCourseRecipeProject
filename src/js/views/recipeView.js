import { elements } from './base'
import { Fraction } from 'fractional'

export const clearRecipe = () => {
    // each time we want to load a new recipe, we first need to use this function to clear the previous one form the page. 
    elements.recipe.innerHTML = ''
}

// create a function to format the count into fractions
const formatCount = count => {
    // return formatted string to be used in createIngredient. It will return a better formatted number
    if (count) {
        // ex: count = 2.5  ---> 2 1/2
        // ex: count = 0.5 ---> 1/2
        // round the number, using 1000  / 1000 to get four decimal places with the Math.round() function
        const newCount = Math.round(count * 1000) / 1000
        // separate integer from decimal with destructuring. This will now return an array of two values, but they are strings. so we need to use map to turn them into a numbers
        const [int, dec] = newCount.toString().split('.').map(element => parseInt(element, 10))

        if (!dec) {
            return newCount
        }
        if (int === 0) {
            // ex: 0.5  --> 1/2
            // based on count, this function will create a new fraction. It will automatically calculate the numerator and denominator, which we can grab
            const fraction = new Fraction(newCount)
            return `${fraction.numerator}/${fraction.denominator}`
        } else {
            // ex: 2.5 --> 2 1/2. We only want to turn the decimal part of the number into a fraction, so we subtract int from count
            const fraction = new Fraction(newCount - int) 
                return `${int} ${fraction.numerator}/${fraction.denominator}`
            }
        }
    return '?'

}

const createIngredient = ingredient => `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
        <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>
`
export const renderRecipe = (recipe, isLiked) => {
// render markup for the recipe on the page
    const markup = `
        <figure class="recipe__fig">
            <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
            <h1 class="recipe__title">
                <span>${recipe.title}</span>
            </h1>
        </figure>

        <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-stopwatch"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                <span class="recipe__info-text"> minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-man"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                <span class="recipe__info-text"> servings</span>

                <div class="recipe__info-buttons">
                    <button class="btn-tiny btn-decrease">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-minus"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny btn-increase">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-plus"></use>
                        </svg>
                    </button>
                </div>

            </div>
            <button class="recipe__love">
                <svg class="header__likes">
                    <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
                </svg>
            </button>
        </div>

        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map(element => createIngredient(element)).join(' ')}
            </ul>

            <button class="btn-small recipe__btn recipe__btn--add">
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
        </div>

        <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
            </p>
            <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                <span>Directions</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-right"></use>
                </svg>

            </a>
        </div>
    `
    elements.recipe.insertAdjacentHTML('afterbegin', markup)
}

export const updateServingsIngredients = recipe => {
    // Update servings
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings

    // Update ingredients. Select all ingredient counts and update one by one
    const countElements = Array.from(document.querySelectorAll('.recipe__count'))
    // we need the element and index of each item in the array. We are looping over both the recipe.ingredients array and the countElements array. Using forEach to loop over the countElement array and use current index to retrieve value from the ingredients array.
    countElements.forEach((element, i) => {
        element.textContent = formatCount(recipe.ingredients[i].count)
    })
}

