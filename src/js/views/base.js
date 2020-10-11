/* create an object that will contain all of the elements we need from the DOM. Elements that are being used and reused across different modules */
export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResults: document.querySelector('.results'),
    searchResultList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
}

/* create an object to store the element string class names */
export const elementStrings = {
    loader: 'loader'
}

// pass parent element in as argument to loader, and attach loader as child of the parent, so the loader will be attached to it
export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `
    // add loader to the beginning of the parent element
    parent.insertAdjacentHTML('afterbegin', loader)
}

// create the clear loader method:
export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`)
    if (loader) {
        loader.parentElement.removeChild(loader)
    }
}