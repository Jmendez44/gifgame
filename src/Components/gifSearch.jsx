import React, { useState, useEffect, useRef, useCallback } from "react";

import axios from "axios";

const GifSearch = () => {
  const [gifs, setGifs] = useState([]);
  const [search, newSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const searchEmpty = search === "" ? "trending" : "search";

  const observer = useRef();
  const lastGifElRef = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && totalCount) {
            if (offset >= totalCount) {
              return setLoading(false);
            }
            // console.log(offset);
            // console.log(totalCount);
            // console.log("visible");
            setOffset(prevOffset => prevOffset + 24);
          }
        },
        { threshold: 1.0 }
      );
      if (node) observer.current.observe(node);
    },
    [loading, totalCount]
  );

  const handleSearch = e => {
    newSearch(e.target.value);
  };

  useEffect(() => {
    setGifs([]);
    setOffset(0);
  }, [search]);

  useEffect(() => {
    let cancel;
    setLoading(true);
    axios({
      method: "GET",
      url: `https://api.giphy.com/v1/gifs/${searchEmpty}`,
      params: {
        api_key: "CE8FOeRg5gydTesey9fD2e5ruLqOULK2",
        q: search,
        limit: "24",
        offset: offset,
        rating: "R"
      },
      cancelToken: new axios.CancelToken(c => (cancel = c))
    })
      .then(res => {
        let data = res.data.data;
        // console.log(offset);
        // setGifs(data)
        setGifs(prevGifs => {
          // console.log(...prevGifs)
          return [
            ...new Set([
              ...prevGifs,
              ...data.map(i => {
                // console.log(i)
                return i.images.original_mp4.mp4;
              })
            ])
          ];
        });

        setTotalCount(res.data.pagination.total_count);
        setLoading(false);
        // console.log(data);
      })
      .catch(e => {
        if (axios.isCancel(e)) return;
      });

    return () => cancel();
  }, [search, offset]);

  // console.log(totalCount)

  return (
    <div className="chat-container">
      <div className="search-container">
        <form className="search-bar">
          <input
            placeholder="Gif Search"
            value={search}
            type="text"
            onChange={handleSearch}
          />
          <div className="btns">
            <button>btn1</button><button>btn2</button>
          </div>
        </form>
        <div className="gif-select">
          {gifs.map((gif, index) => {
            if (gifs.length === index + 1) {
              return (
                <div ref={lastGifElRef} key={index}>
                  <video autoPlay loop playsInline>
                    <source src={gif} type="video/mp4" />
                  </video>
                </div>
              );
            } else {
              return (
                <div key={index}>
                  <video autoPlay loop playsInline>
                    <source src={gif} type="video/mp4" />
                  </video>
                </div>
              );
            }
          })}
          <div className="loading">{loading && "Loading..."}</div>
        </div>
      </div>
      <div className="chat"></div>
    </div>
  );
};

export default GifSearch;
