import axios from 'axios'

// each recipe is identified by an id, and when we create a new recipe object, we will pass in that exact id
export default class Recipe {
    constructor (id) {
        this.id = id
    }
    // when we make our ajax call, we will use the id to grab the appropriate recipe from the database
    // axios call wil return a promise 
    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`)
            this.title = res.data.recipe.title
            this.author = res.data.recipe.publisher
            this.img = res.data.recipe.image_url
            this.url = res.data.recipe.source_url
            this.ingredients = res.data.recipe.ingredients
        } catch (error) {
            console.log(error)
            alert('Something went wrong :/')
        }
    }
    // method to estimate the time it takes to cook the recipe
    calcTime() {
        // Assuming that we need 15 mins for each 3 ingredients
        const numIngredients = this.ingredients.length
        const periods = Math.ceil(numIngredients / 3)
        this.time = periods * 15
    }

    calcServings() {
        this.servings = 4
    }

    parseIngredients() {
        // create two arrays: 1. units as they appear in ingredients. 2. units as we want them to appear
        const unitsLong= ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds']
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound']
        // destructuring the unitsShort array
        const units = [...unitsShort, 'kg', 'gram']

        // create a new array of ingredients based on old ones
        // on each iteration, we return a value that is store in the newIngredients array
        const newIngredients = this.ingredients.map(element => {
            // 1. Uniform units 
            // create a variable based on the current ingredient, set to lowercase
            let ingredient = element.toLowerCase()
            // loop over unitsLong possibilities to replace the ingredient with the value at the same poisition in the unitShort array
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i])
            })

            // 2. Remove parathenses using regex. Replace everything inside the parentheses and the parentheses themselves with nothing
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ')

            // 3. Parse ingredients into count, unit and ingredient
            // first we have to test if there is a unit in the string, and if so, where it's located. So first we convert the ingredient into an array:
            const arrIng = ingredient.split(' ')
            // find index at which unit is located.Pass in callback function that, for each element, the method tests whether or not that unit is found within the units array:
            // ex: oz. findIndex will loop over the unitsShort array and will return true only if there is a unit in the array with the value oz. It will then return the index in which oz is true.
            const unitIndex = arrIng.findIndex(element2 => units.includes(element2))

            let objectIng
            if(unitIndex > -1) {
                // There is a unit:
                // anything that comes before the unitIndex, will be considered part of the count
                // ex 4 1/2 cups. Our count will be [4, 1/2] --> when you use eval, this will turn into "4+1/2". JS will do the math and calculate 4.5
                // ex 4 cups. Our count will be [4]
                const arrCount = arrIng.slice(0, unitIndex)
                let count
                // if the number of elements before the unitIndex is 1
                if (arrCount.length === 1) {
                    // then count = 0, aka the first element of the array, which is a number
                    // use eval. If there is a minus between the two numbers (ex: 4 - 1/2 tsp), eval will replace it with a +, and then evaluate it into one number
                    count = eval(arrIng[0].replace('-', '+'))
                } else {
                    // if we have more than one number at the start of the array, we have to join the two numbers (which are really just strings) together and then evaluate them
                    count = eval(arrIng.slice(0, unitIndex).join('+'))
                }

                objectIng = {
                    count: count,
                    unit: arrIng[unitIndex],
                    // the ingredient will begin right after the unitIndex 
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrIng[0], 10)){
                // We take the first element of the array and convert it to a number. If conversion is successful, it will coerce to a number and return true
                // There is NO unit, but the first element is a number
                objectIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1){
                // there is no unit in the array and no number in first position in the array
                objectIng = {
                    count: 1,
                    unit: '',
                    ingredient: ingredient
                }
            }
            return objectIng 

        })
        this.ingredients = newIngredients 
    }
    updateServings(type) {
        // Servings. This will assign the value to newServings, but will not immediately update this.servings
        const newServings = type === 'decrease' ? this.servings - 1 : this.servings + 1

        // Ingredients. Update all of the count numbers based on changing serving amounts. 
        this.ingredients.forEach(currIng => {
            // change current ingredient count by multiplying the current count by newServings/current servings
            currIng.count *= (newServings / this.servings)
        })

        this.servings = newServings
    }
}