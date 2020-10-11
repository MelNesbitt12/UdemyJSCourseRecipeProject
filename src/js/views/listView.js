import { elements } from './base'

// One method to render the item, based on item object
export const renderItem = item => {
    const markup = `
        <li class="shopping__item" data-itemid=${item.id}>
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `
    elements.shopping.insertAdjacentHTML('beforeend', markup)
}

// One method to delete the item, based on id
export const deleteItem = id => {
    // select the item based on the data attribute of id
    const item = document.querySelector(`[data-itemid="${id}"]`)
    // move up to parent in order to remove the child
    if(item) {
        item.parentElement.removeChild(item)
    }
}