// src/pages/PdktDist.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";

const PdktDist = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [heroPlaces, setHeroPlaces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const DISTRICT_ID = 1; // Pudukkottai ID

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    setLoading(true);
    try {
      const data = await apiService.getPlacesByDistrict(DISTRICT_ID);
      setPlaces(data);
      
      // Set hero places (first 4 or all if less than 4)
      const hero = data.slice(0, 4);
      setHeroPlaces(hero);
      if (hero.length > 0) {
        setSelected(hero[0]);
      }
    } catch (err) {
      setError('Failed to load places');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!selected || heroPlaces.length === 0) return;
    
    const currentIndex = heroPlaces.findIndex(p => p.id === selected.id);
    const nextIndex = (currentIndex + 1) % heroPlaces.length;
    setSelected(heroPlaces[nextIndex]);
  };

  // Auto slide
  useEffect(() => {
    if (heroPlaces.length > 0) {
      const interval = setInterval(handleNext, 3000);
      return () => clearInterval(interval);
    }
  }, [selected, heroPlaces]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Loading places...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={loadPlaces}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!selected || places.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-600">No places found in this district</p>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section - Similar to PdktDist */}
      <div className="relative w-full h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
             style={{ backgroundImage: `url(${selected.hero_image})` }} />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute top-10 left-10 text-white z-10">
          <h1 className="text-5xl font-bold">{selected.name}</h1>
          <p className="text-xl text-amber-300">{selected.location}</p>
        </div>

        {/* Hero Cards */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-10">
          {heroPlaces.map((place) => (
            <div
              key={place.id}
              onClick={() => setSelected(place)}
              className={`rounded-lg overflow-hidden cursor-pointer transition-all ${
                selected.id === place.id ? 'w-48 h-64' : 'w-32 h-48 opacity-60'
              }`}
            >
              <img src={place.hero_image} alt={place.name} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* More Places Section */}
      <section className="py-16 bg-white">
        <h2 className="text-center text-3xl sm:text-4xl font-bold mb-10">
          More Places to Explore
        </h2>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {places.map((place) => (
            <div
              key={place.id}
              onClick={() => navigate(`/place/${place.id}`)}
              className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer transition-transform hover:-translate-y-1"
            >
              <img
                src={place.hero_image}
                alt={place.name}
                className="w-full h-48 object-cover"
                onError={(e) => e.target.src = 'https://via.placeholder.com/300x200'}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{place.name}</h3>
                <p className="text-sm text-gray-500">{place.location}</p>
                {place.tagline && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{place.tagline}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default PdktDist;