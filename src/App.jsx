import React, { useState, useEffect } from "react";
import "./Main.css";
import GifSearch from "./Components/gifSearch.jsx";
import InPlay from "./Components/InPlay";

const App = () => {

  return (
    <div className="App">
      <InPlay />
      <GifSearch />
    </div>
  );
};

export default App;
