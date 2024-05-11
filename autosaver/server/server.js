const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Blog Model
const Blog = require('./models/Blog');

// Get all blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get blog by ID
app.get('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    const blogData = blog.toJSON(); // Convert Mongoose document to JSON
    // Convert ObjectId to string
    blogData.id = blogData._id.toString();
    delete blogData._id; // Remove the original _id field
    res.json(blogData);
  } catch (error) {
    console.error('Get blog by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new blog
app.post('/api/blogs', async (req, res) => {
  try {
    const { title, content } = req.body;
    const newBlog = new Blog({ title, content });
    await newBlog.save();
    res.json(newBlog);
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update blog by ID
app.put('/api/blogs/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
    res.json(updatedBlog);
  } catch (error) {
    console.error('Update blog by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete blog by ID
app.delete('/api/blogs/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/autosave/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (content) updatedFields.content = content;
    
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    res.json(updatedBlog);
  } catch (error) {
    console.error('Autosave error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
