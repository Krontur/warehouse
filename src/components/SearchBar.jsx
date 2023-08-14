import React, { useState } from 'react';
import '../css/SearchBar.css';
import { FaFilterCircleXmark, FaMagnifyingGlass } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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
        placeholder="Produkte suchen..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button type="button" onClick={handleOnClear}>
        <FaFilterCircleXmark/>
      </button>
      <button type="submit">
        <FaMagnifyingGlass/>
      </button>
    </form>
  );
};

export default SearchBar;
