// src/pages/PlaceDetails.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";

const PlaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    loadPlaceDetails();
  }, [id]);

  const loadPlaceDetails = async () => {
    setLoading(true);
    try {
      const data = await apiService.getPlaceById(id);
      if (data) {
        setPlace(data);
      } else {
        setError('Place not found');
      }
    } catch (err) {
      setError('Failed to load place details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Loading place details...</p>
        </div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-xl text-red-600">{error || 'Place not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Gallery images (use hero_image if no gallery)
  const galleryImages = place.gallery_images?.length > 0 
    ? place.gallery_images 
    : [place.hero_image];

  return (
    <div className="bg-[#f2f2f7] text-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] sm:h-[70vh] overflow-hidden">
        <img
          src={galleryImages[selectedImage]}
          alt={place.name}
          className="w-full h-full object-cover"
          onError={(e) => e.target.src = 'https://via.placeholder.com/1200x800'}
        />
        
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-center">
            {place.name}
          </h1>
          <p className="mt-3 text-lg text-white/80">
            {place.location}
          </p>
          {place.tagline && (
            <p className="mt-2 text-white/60 italic max-w-2xl text-center">
              {place.tagline}
            </p>
          )}
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 px-5 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition z-10"
        >
          ← Back
        </button>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 space-y-12 pb-16">
        {/* Main Info Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-[28px] shadow-2xl p-6 sm:p-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-semibold mb-4">History</h2>
              <p className="text-gray-700 leading-relaxed">
                {place.history || 'History details not available.'}
              </p>
              
              {place.architecture && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-2">Architecture</h3>
                  <p className="text-gray-600">{place.architecture}</p>
                </div>
              )}
            </div>
            
            <div>
              {place.deity && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700">Presiding Deity</h3>
                  <p className="text-xl text-green-700">{place.deity}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                {place.timings && (
                  <div className="bg-white rounded-xl p-4 shadow">
                    <h4 className="text-sm text-gray-500">Timings</h4>
                    <p className="font-medium">{place.timings}</p>
                  </div>
                )}
                
                {place.best_month && (
                  <div className="bg-white rounded-xl p-4 shadow">
                    <h4 className="text-sm text-gray-500">Best Time</h4>
                    <p className="font-medium">{place.best_month}</p>
                  </div>
                )}
              </div>
              
              {place.festivals?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Festivals</h3>
                  <div className="flex flex-wrap gap-2">
                    {place.festivals.map((festival, index) => (
                      <span key={index} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                        {festival}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* How to Reach */}
        {place.reach && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">How to Reach</h2>
            <p className="text-gray-700">{place.reach}</p>
          </div>
        )}

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <div>
            <h2 className="text-3xl font-semibold mb-6 text-center">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className="overflow-hidden rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
                >
                  <img
                    src={img}
                    alt={`${place.name} ${index + 1}`}
                    className="w-full h-64 object-cover"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/400x300'}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceDetails;