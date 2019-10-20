import React, { useState, useEffect, useRef, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroller";
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
            // console.log("visible");
            return setOffset(prevOffset => prevOffset + 24);
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
                console.log(i)
                return i.images.original.url;
              })
            ])
          ];
        });

        setTotalCount(res.data.pagination.total_count > 0);
        setLoading(false);
        // console.log(data);
      })
      .catch(e => {
        if (axios.isCancel(e)) return;
      });

    return () => cancel();
  }, [search, offset]);

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
        </form>
        <div className="gif-select">
          {gifs.map((gif, index) => {
            if (gifs.length === index + 1) {
              return (
                <div ref={lastGifElRef} key={index}>
                  <img src={gif} alt="" />
                  {/* <video autoPlay loop playsInline>
                    <source src={gif} type="video/mp4" />
                  </video> */}
                </div>
              );
            } else {
              return (
                <div key={index}>
                  <img src={gif} alt="" />
                  {/* <video autoPlay loop playsInline>
                    <source src={gif} type="video/mp4" />
                  </video> */}
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
