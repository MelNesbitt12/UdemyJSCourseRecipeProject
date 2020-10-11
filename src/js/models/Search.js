// default exports - when we only want to export one thing from a module 
import axios from 'axios'

export default class Search {
    constructor(query) {
        this.query = query
        
    }
    // method to get results from search query. This is an async function, so it will return a promise
    async getResults() {
        try {
             const res = await axios(`https://forkify-api.herokuapp.com/api/search/?q=${this.query}`)
            //  data from the search is stored on the Search object in the this.result property
             this.result = res.data.recipes
            //  console.log(this.result)
         } catch(error) {
             alert(error)
         }   
     }
     
}
