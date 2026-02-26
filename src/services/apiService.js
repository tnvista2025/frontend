// src/services/apiService.js

// API Base URL - Change this when deploying
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const apiService = {
  // ========== DISTRICTS ==========
  async getAllDistricts() {
    try {
      const response = await fetch(`${API_BASE_URL}/districts/`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching districts:', error);
      return [];
    }
  },

  async getDistrictById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/districts/${id}/`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching district ${id}:`, error);
      return null;
    }
  },

  async searchDistricts(query) {
    if (query.length < 2) return [];
    try {
      const response = await fetch(`${API_BASE_URL}/districts/search/?q=${query}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error searching districts:', error);
      return [];
    }
  },

  // ========== PLACES ==========
  async getAllPlaces() {
    try {
      const response = await fetch(`${API_BASE_URL}/places/`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching places:', error);
      return [];
    }
  },

  async getPlaceById(placeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/places/${placeId}/`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching place ${placeId}:`, error);
      return null;
    }
  },

  async getPlacesByDistrict(districtId) {
    try {
      const response = await fetch(`${API_BASE_URL}/districts/${districtId}/places/`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching places for district ${districtId}:`, error);
      return [];
    }
  },

  // ========== HERO SLIDES ==========
  async getHeroSlides() {
    try {
      const response = await fetch(`${API_BASE_URL}/hero-slides/`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      return [];
    }
  }
};