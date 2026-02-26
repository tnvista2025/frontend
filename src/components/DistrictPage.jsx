// src/pages/DistrictPage.jsx

import React, { useState, useEffect, useRef } from "react";
import Distbg from "../assets/distbg.jpg";
import { Link, useLocation } from "react-router-dom";
import { apiService } from "../services/apiService";

const DistrictPage = () => {
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  const searchRef = useRef(null);
  const districtsSectionRef = useRef(null);
  const location = useLocation();

  // Fetch districts on component mount
  useEffect(() => {
    loadDistricts();
  }, []);

  const loadDistricts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getAllDistricts();
      setDistricts(data);
      setFilteredDistricts(data);
    } catch (err) {
      setError('Failed to load districts. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle hash navigation on page load
  useEffect(() => {
    if (location.hash === '#districts-section' && districtsSectionRef.current) {
      setTimeout(() => {
        districtsSectionRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [location, loading]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDistricts(districts);
      setSuggestions([]);
    } else {
      const filtered = districts.filter(district => 
        district.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        district.tamil_name.includes(searchQuery)
      );
      setFilteredDistricts(filtered);
      
      // Get suggestions for dropdown
      const sugg = districts.filter(district => 
        district.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSuggestions(sugg);
    }
  }, [searchQuery, districts]);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (district) => {
    setSearchQuery(district.name);
    setShowSuggestions(false);
  };

  // Handle click outside search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const visibleDistricts = filteredDistricts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredDistricts.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 8, filteredDistricts.length));
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading districts...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl">{error}</p>
          <button 
            onClick={loadDistricts}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center overflow-hidden bg-white">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${Distbg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl special-font">
            Explore Tamil Nadu
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl max-w-xl text-gray-200">
            Culture • Heritage • Innovation • Nature
          </p>

          {/* Search Bar with Suggestions */}
          <div className="relative mt-8" ref={searchRef}>
            <div className="flex bg-white/90 backdrop-blur-lg rounded-4xl shadow-2xl overflow-hidden w-80 sm:w-96">
              <input
                type="text"
                placeholder="Search districts..."
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => setShowSuggestions(true)}
                className="w-full px-6 py-4 outline-none text-sm text-gray-700"
              />
              <button className="px-6 bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 transition">
                Search
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-100/95 rounded-4xl shadow-2xl overflow-hidden z-50">
                {suggestions.map((district) => (
                  <button
                    key={district.id}
                    onClick={() => handleSuggestionClick(district)}
                    className="w-full text-left px-6 py-4 hover:bg-gray-50 transition border-b border-gray-300 last:border-0 flex items-center space-x-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                      <img 
                        src={district.image} 
                        alt={district.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/40'}
                      />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{district.name}</span>
                      <span className="text-sm text-gray-600 ml-2">{district.tamil_name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Districts Section */}
      <section 
        ref={districtsSectionRef}
        id="districts-section"
        className="w-full max-w-7xl px-4 sm:px-6 py-10 scroll-mt-20"
      >
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-gray-400 font-light">
            EXPLORE
          </span>
          <h2 className="text-4xl md:text-4xl mt-0 mb-3">
            <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent special-font">
              All Districts
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-8 mb-18 max-w-2xl mx-auto font-['Playfair_italic']">
            {districts.length} Districts • {districts.length} Stories
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleDistricts.map((district) => (
            <Link
              key={district.id}
              to={district.path}
              className="group block cursor-pointer transition-all duration-300"
            >
              <div className="bg-white border border-gray-200 rounded-e-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="relative h-60 overflow-hidden bg-gray-100">
                  <img
                    src={district.image}
                    alt={district.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                    }}
                  />
                  
                  {/* District name overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <h3 className="text-white text-lg font-bold">{district.name}</h3>
                      <p className="text-white/80 text-xs">{district.tamil_name}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 text-center">
                  <p className="text-xs text-gray-500">{district.essence}</p>
                  <p className="text-xs font-medium text-green-600">{district.specialty}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-16">
            <button 
              onClick={handleLoadMore}
              className="px-10 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-4xl font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-300 hover:scale-105"
            >
              Load More Districts
            </button>
            <p className="text-xs text-gray-400 mt-4">
              Showing {visibleCount} of {filteredDistricts.length} districts
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DistrictPage;