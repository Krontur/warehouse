import React, { useState } from 'react';
import '../css/SearchBar.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input 
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button type="submit">Search </button>
    </form>
  );
};

export default SearchBar;
