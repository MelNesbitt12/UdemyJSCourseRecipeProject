// Another list, but instead of saving the ingredients, we will save likes
export default class Likes {
    constructor() {
        this.likes = []
    }
    // pass in the data we need to display the liked recipes in the UI
    addLike(id, title, author, image) {
        const like = { id, title, author, image} 
        this.likes.push(like)

        // Persist data in localStorage
        this.persistData()

        return like
    }

    deleteLike(id) {
        const index = this.likes.findIndex(element => element.id === id)
        // deleting the item from our items array
        // splice method: pass in a start index and then how many elements we want to take, it will then return these elements and remove them from the original array 
        // based on passed-in id, we want to find position of the item that matches that id. We start at position where item is located and remove one element
        this.likes.splice(index, 1)

        // Persist data in localStorage
        this.persistData()

    }
    // test if we have a liked item in the array. We have to know if, when we load a recipe, it has been liked or not.
    isLiked(id) {
        // try and find the index of the id, and see if it is different from -1. If the index is -1, it means it is not in the likes array. If the recipe with the id = -1, it means it is not in the liked array so we do not display the liked icon on the recipe page.
        return this.likes.findIndex(element => element.id === id) !== -1
    }

    getNumLikes() {
        return this.likes.length
    }

    persistData() {
        // convert likes array into a string in order to save in local storage
        localStorage.setItem('likes', JSON.stringify(this.likes))
    }

    // method to retrieve stored data from localStorage
    readStorage () {
        // use JSON.parse to turn the string back into a JSON object
        const storage = JSON.parse(localStorage.getItem('likes'))
        // if storage exists, we are re-storing the resulting likes from localStorage back into this.likes
        if(storage) {
            this.likes = storage
        }
    }
}