// reducers.js
import { combineReducers } from 'redux';
import exampleReducer from './exampleReducer.js'; // Import your reducer(s)

const rootReducer = combineReducers({
  example: exampleReducer, // Replace 'exampleReducer' with your actual reducer
  // Add more reducers here if needed
});

export default rootReducer;
