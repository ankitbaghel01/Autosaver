// components/ContentEditor.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateContent } from '../redux/actions';
import axios from 'axios';

const ContentEditor = () => {
  const [content, setContent] = useState('');
  const dispatch = useDispatch();
  const savedContent = useSelector(state => state.content);

  useEffect(() => {
    setContent(savedContent);
  }, [savedContent]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    // Dispatch action to update Redux state
    dispatch(updateContent(newContent));
  };

  useEffect(() => {
    const autosaveInterval = setInterval(() => {
      // Make API call to save content
      axios.put('/api/content', { content })
        .then(response => {
          console.log('Content saved:', response.data);
        })
        .catch(error => {
          console.error('Error saving content:', error);
        });
    }, 60000); // Autosave every 1 minute

    return () => clearInterval(autosaveInterval);
  }, [content]);

  return (
    <div>
      <textarea value={content} onChange={handleContentChange} />
    </div>
  );
};

export default ContentEditor;
