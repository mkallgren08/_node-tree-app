import axios from "axios";

export default {
  //Gets a test case
  getNodeData: function(){
    return axios.get("/api/nodes")
  },
  //Get all animals
  getBiodiversity: function(){
    return axios.get("/api/biodiversity")
  },

  // Gets all books
  getArticles: function() {
    return axios.get("/api/articles");
  },
  // Gets the book with the given id
  getArticle: function(id) {
    return axios.get("/api/articles/" + id);
  },
  // Deletes the book with the given id
  deleteArticle: function(id) {
    return axios.delete("/api/articles/" + id);
  },
  // Saves a node to the database
  saveNode: function(articleData) {
    return axios.post("/api/articles", articleData);
  }
};
