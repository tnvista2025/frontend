import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import HomePage from "./components/HomePage";
import About from "./components/About";
import DistrictPage from "./components/DistrictPage";
import PdktDist from "./components/PdktDist";
import MaduraiDist from "./components/MaduraiDist";
import PlaceDetails from "./components/PlaceDetails";
import Gallery from "./components/Gallery";
// REMOVE THIS LINE: import LoginPage from "./components/LoginPage";

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HomePage />
              <Gallery />
              <About />
            </>
          }
        />

        <Route path="/districtpage" element={<DistrictPage />} />
        <Route path="/pdktdist" element={<PdktDist />} />
        <Route path="/maduraidist" element={<MaduraiDist />} />
        <Route path="/place/:id" element={<PlaceDetails />} />
        
        {/* REMOVE THIS RULE: <Route path="/login" element={<LoginPage />} /> */}
        
        {/* Signup route removed because modal handles signup in real-time */}
      </Routes>
    </HashRouter>
  );
};

export default App;