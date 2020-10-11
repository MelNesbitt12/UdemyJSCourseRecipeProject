import { elements } from './base'
import { limitRecipeTitle } from './searchView' 

// Create function to toggle Like button. pass in isLiked, a boolean that lets us know whether the liked button is true or false
export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined'
    // we are selecting the liked button using the recipe love class, but then targetting the child element of that class (use). THis will allow us to change the href to outlined or not
    // set href attribute to the icon name, according to isLiked
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`)

}

export const toggleLikeMenu = numLikes => {
    // based on number of likes, we are going to determine if we should show the Likes menu or not 
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden'
}

// render likes into likes menu
export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.image}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `
    elements.likesList.insertAdjacentHTML('beforeend', markup)
}

// add delete like function
export const deleteLike = id => {
    // we want to delete the entire list item element, so we select the parent Element 
    const element = document.querySelector(`.likes__link[href*="#${id}"]`).parentElement
    if(element) {
        element.parentElement.removeChild(element)
    }
}