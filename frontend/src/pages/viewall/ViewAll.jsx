import React, { useEffect, useState } from "react";
import { useBeerContextApi } from "../../context/beerContextApi";
import SingleBeer from "../../components/singleBeer";
import Nodatafound from "../../components/Error/Nodatafound";
import Navbar from "../../components/navBar/Navbar";
import SortFilter from "../../components/sortfilter/SortFilter";
import { useParams } from "react-router-dom";
import "./viewall.css";

export default function ViewAll() {
  const { products, setSearchComp, setCartComp, setProducts } = useBeerContextApi();
  const [visibleProducts, setVisibleProducts] = useState(20);
  const { category, ingredient } = useParams();

  function Throttle(func, delay) {
    let lastFunc;
    let lastRan;
    return function () {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if (Date.now() - lastRan >= delay) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, delay - (Date.now() - lastRan));
      }
    };
  }

  // Check if the user has scrolled near the bottom
  function handleScroll() {
    const scrollableHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;

    if (scrollableHeight - scrollTop - viewportHeight < 100) {
      setVisibleProducts((prevProducts) => (prevProducts += 20));
    }
  }

  useEffect(() => {
    setSearchComp(true);
    setCartComp(true);
    window.scrollTo(0, 0);
    window.addEventListener("scroll", Throttle(handleScroll, 2000));
  }, []);
  return (
    <>
      <Navbar />
      {/* <SortFilter /> */}
      <div className="filteredProductsFilter">
        {products !== null && products.length ? (
          <div>
            <div className="filteredBeerProducts">
              {products
                .filter((item) => item[category ? "strCategory" : "strIngredient1"].toLowerCase() === (category || ingredient).toLowerCase())
                .slice(0, visibleProducts)
                .map((beer, index) => (
                  <SingleBeer key={index} beer={beer} />
                ))}
            </div>
            {visibleProducts < products.filter((item) => item[category ? "strCategory" : "strIngredient1"].toLowerCase() === (category || ingredient).toLowerCase()).length && (
              <div style={{ textAlign: "center", width: "100%", paddingBottom: "20px", fontSize: "1.25rem" }}>
                <p>Loading...</p>
              </div>
            )}
          </div>
        ) : (
          <Nodatafound />
        )}
      </div>
    </>
  );
}