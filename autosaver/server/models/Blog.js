const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    id:{
      type: String,
      require:true
    },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ''
  }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
