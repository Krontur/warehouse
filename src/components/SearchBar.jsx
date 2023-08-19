import React, { useState } from 'react';
import '../css/SearchBar.css';
import { FaFilterCircleXmark, FaMagnifyingGlass } from 'react-icons/fa6'

const SearchBar = ({ onSearch, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleOnClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input 
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button type="button" onClick={handleOnClear}>
        <FaFilterCircleXmark size="lg"/>
      </button>
      <button type="submit">
        <FaMagnifyingGlass size="lg"/>
      </button>
    </form>
  );
};

export default SearchBar;
