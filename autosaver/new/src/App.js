import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import "./App.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import { CiMenuKebab } from "react-icons/ci";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [autosaveStatus, setAutosaveStatus] = useState('');
  const [blogId, setBlogId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [updateTimer, setUpdateTimer] = useState(null);
  const [isOpen, setIsOpen] = useState(false);


  const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);


    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const autosaveTimer = setTimeout(() => {
      handleSubmit(); // Call handleSubmit for autosave
    }, 5000); // Autosave after 5 seconds of inactivity

    return () => clearTimeout(autosaveTimer);
  }, [title, content]);



  useEffect(() => {
    if (isEditing && title !== editedTitle && content !== editedContent) {
      // If editing and input fields changed, start or reset the timer for automatic update
      const timer = setTimeout(handleUpdate, 5000);
      setUpdateTimer(timer);
    } else {
      // If editing and input fields are not changed, clear the timer
      clearTimeout(updateTimer);
    }
  }, [title, content, editedTitle, editedContent, isEditing]);




  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Fetch blogs error:', error);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    // setAutosaveStatus('Saving...');
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    // setAutosaveStatus('Saving...');
  };

  const handleSubmit = async () => {
    try {
      // Trim the title and content to remove leading and trailing whitespace
      const trimmedTitle = title.trim();
      const trimmedContent = content.trim();
      
      // Check if the trimmed title and content are not empty
      if (trimmedTitle && trimmedContent) {
        const response = await axios.post('http://localhost:5000/api/blogs', { title: trimmedTitle, content: trimmedContent });
        setBlogs([...blogs, response.data]);
        setTitle('');
        setContent('');
        setBlogId(response.data._id);
        setAutosaveStatus('Autosaved');
      }
    } catch (error) {
      console.error('Create blog error:', error);
      setAutosaveStatus('Autosave failed');
    }
  };



  const handleEdit = (id, currentTitle, currentContent) => {
    setIsEditing(true);
    setBlogId(id);
    setEditedTitle(currentTitle);
    setEditedContent(currentContent);
  };



  const handleUpdate = async () => {
    try {
      const trimmedTitle = editedTitle.trim();
      const trimmedContent = editedContent.trim();
      
      if (trimmedTitle && trimmedContent) {
        await axios.put(`http://localhost:5000/api/blogs/${blogId}`, { title: trimmedTitle, content: trimmedContent });
        setAutosaveStatus('Autosaved');
        fetchBlogs(); // Fetch updated data
        setIsEditing(false); // Set isEditing to false after successful update
        setEditedTitle(''); // Reset editedTitle state
        setEditedContent(''); // Reset editedContent state
      }
    } catch (error) {
      console.error('Update blog error:', error);
      setAutosaveStatus('Autosave failed');
    }
  };
  

  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle('');
    setEditedContent('');
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`);
      setBlogs(blogs.filter(blog => blog._id !== id));
      console.log('Blog deleted successfully');
    } catch (error) {
      console.error('Delete blog error:', error);
    }
  };


  return (
    <div className='App d-flex vh-100 bg-primary justify-content-center align-items-center'>
    <div className='card p-3 w-50'>
      <h1>Create Blog</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <input   className='form-control mb-2'type="text" placeholder="Title" value={title} onChange={handleTitleChange} />
        <textarea   className='form-control mb-2' placeholder="Content" value={content} onChange={handleContentChange} />
        <button type="submit" className='btn btn-success' >Create</button>
      </form>
      <div>{autosaveStatus}</div>
      <div className='card p-4 w-100'>
      <h1>All Blogs</h1>
      <ul>
        {blogs.map(blog => (
          <li key={blog._id} type="none">
            {isEditing && blog._id === blogId ? (
              <>
                <input type="text" className='form-control mb-2' value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
                <textarea className='form-control mb-2' value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
                <button onClick={handleUpdate} className='btn btn-warning'>Update</button>
                <button onClick={handleCancelEdit} className='btn btn-danger'>Cancel</button>
              </>
            ) : (
              <>
              <div className='card p-3 w-80'>
              <CiMenuKebab onClick={toggleDropdown} ref={dropdownRef} style={{cursor:"pointer"}} />
            {isOpen && (
                <div className="dropdown" >
                    <ul>
                        <li type="none"  onClick={() => handleEdit(blog._id, blog.title, blog.content)}style={{cursor:"pointer"}} >Edit</li>
                        <li type="none" onClick={() => handleDelete(blog._id)}style={{cursor:"pointer"}} >Delete</li>
                    </ul>
                </div>
            )}                <h4>{blog.title}</h4>
                <p>{blog.content}</p>
              
              </div>
              </>
            )}
          </li>
        ))}
      </ul>
      </div>
      </div>
    </div>
  );
}

export default App;
