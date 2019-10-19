import React, { useState, useEffect } from "react";
import axios from "axios";

const GifSearch = () => {
  const [gifs, setGifs] = useState([]);
  const [search, newSearch] = useState('')
  // const handleSubmit = () => {
  //   e.preventDefault();
  //   conl
  // }

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("https://api.giphy.com/v1/gifs/search", {
        params: {
          api_key: "CE8FOeRg5gydTesey9fD2e5ruLqOULK2",
          q: `${search}`,
          limit: "20",
          rating: "R"
        }
      });
      let data = res.data.data;
      setGifs(data);
    };

    fetchData();
  }, [search]);



  console.log(search);

  return (
    <div className="search-container">
      <form className="search-bar" >
        <input placeholder="Gif Search" value={search} type="text" onChange={ e => newSearch(e.target.value)}/>
        <button type='submit' value="search">Search</button>
      </form>
      
      <div className="gif-select">
        {gifs.map(gif => (
          <div key={gif.id}>
            <video autoPlay loop playsInline poster>
              <source src={gif.images.original_mp4.mp4} type="video/mp4" />
            </video>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GifSearch;
