// represent shopping list through an object
import uniqid from 'uniqid'

export default class List {
    // not passing anything into constructor. When we initialize a new list, we don't need to start with naything.
    constructor() {
        // when we start adding elements to a list, they will be pushed to the items array
        this.items = []
    }
    // pass in count, unit and ingredient 
    addItem(count, unit, ingredient) {
        const item = {
            // we need each item to have a unique id, so that we can update/delete them. We are including a library to add unique ids
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        // push newly-created item into items array and return the newly created item
        this.items.push(item)
        return item
    }
    // pass in id of item we want to delete, which we will get from the UI.
    deleteItem (id) {
        // find the element in the array that has the same id as the id we pass in
        const index = this.items.findIndex(element => element.id === id)
        // deleting the item from our items array
        // splice method: pass in a start index and then how many elements we want to take, it will then return these elements and remove them from the original array 
        // slice method: takes in the starting and ending indexes, does not mutate original array  
        // [2, 4, 8] splice(1, 2) --> return [4, 8], original array: [2]
        // [2, 4, 8] slice(1, 2) --> return 4, original array: [2, 4, 8]
        // based on passed-in id, we want to find position of the item that matches that id. We start at position where item is located and remove one element
        this.items.splice(index, 1)
    }

    // Update the count of the item in the shooping list. Pass in id of element we want to update and the new count
    updateCount(id, newCount) {
        // loop through all elements in items array, select the one that has the same id that we pass into the function. We return an object and update the count value.
        // we want to find the item itself, instead of just returning the index, and then set the count of the item to newCount
        this.items.find(element => element.id === id).count = newCount
    }
}