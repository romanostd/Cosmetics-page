import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CosmeticList.css";

function CosmeticList() {
  const [cosmetics, setCosmetics] = useState([]);
  const [favoriteCosmetics, setFavoriteCosmetics] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showFavoriteIcons, setShowFavoriteIcons] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    axios
      .get("https://makeup-api.herokuapp.com/api/v1/products.json?limit=30")
      .then((response) => {
        setCosmetics(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar os cosméticos:", error);
      });
  }, []);

  const toggleFavoriteIcon = (cosmeticId) => {
    setShowFavoriteIcons({ ...showFavoriteIcons, [cosmeticId]: true });
  };

  const hideFavoriteIcon = (cosmeticId) => {
    if (
      !favoriteCosmetics.includes(
        cosmetics.find((cosmetic) => cosmetic.id === cosmeticId)
      )
    ) {
      setShowFavoriteIcons({ ...showFavoriteIcons, [cosmeticId]: false });
    }
  };

  const toggleFavorite = (cosmetic) => {
    if (favoriteCosmetics.includes(cosmetic)) {
      setFavoriteCosmetics(
        favoriteCosmetics.filter((item) => item !== cosmetic)
      );
    } else {
      setFavoriteCosmetics([...favoriteCosmetics, cosmetic]);
    }
  };

  const filteredCosmetics = cosmetics.filter((cosmetic) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      (cosmetic.name &&
        cosmetic.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (cosmetic.category &&
        cosmetic.category.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (cosmetic.price && cosmetic.price.toString().includes(searchTerm))
    );
  });

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  const filterByCategory = (cosmetic) => {
    if (!cosmetic || !cosmetic.category) {
      return false;
    }
    if (selectedCategories.length === 0) {
      return true;
    }
    return selectedCategories.some(
      (category) => cosmetic.category.toLowerCase() === category.toLowerCase()
    );
  };

  const sortCosmetics = (cosmeticsToSort) => {
    if (sortOption === "asc-price") {
      return [...cosmeticsToSort].sort((a, b) => a.price - b.price);
    } else if (sortOption === "desc-price") {
      return [...cosmeticsToSort].sort((a, b) => b.price - a.price);
    } else if (sortOption === "asc-name") {
      return [...cosmeticsToSort].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "desc-name") {
      return [...cosmeticsToSort].sort((a, b) => b.name.localeCompare(a.name));
    } else {
      return cosmeticsToSort;
    }
  };

  return (
    <div className="margin-top">
      <div className="filter-grid">
        <div>
          <input
          className="search-bar"
            type="text"
            placeholder="Pesquisar por nome, categoria ou preço"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="fa-solid fa-magnifying-glass search-icon"></span> 
        </div>
        <div className="sort-select">
  <select
    className="select-bar"
    value={sortOption}
    onChange={(e) => setSortOption(e.target.value)}
  >
    <option value="">Ordenar por</option>
    <option value="asc-price">Preço Ascendente</option>
    <option value="desc-price">Preço Descendente</option>
    <option value="asc-name">Nome Ascendente</option>
    <option value="desc-name">Nome Descendente</option>
  </select>
</div>

      </div>
      <div className="main-container">
        <div className="side-filter">
          <div className="category-buttons">
          <div className="filter-font margin-botton">Filtrar por categoria</div>
            <button
              className={
                selectedCategories.includes("pencil") ? "filter-selected-button" : "filter-button"
              }
              onClick={() => toggleCategory("pencil")}
            >
              Pencil
            </button>
            <button
              className={selectedCategories.includes("cream") ? "filter-selected-button" : "filter-button"}
              onClick={() => toggleCategory("cream")}
            >
              Cream
            </button>
            <button
              className={
                selectedCategories.includes("palette") ? "filter-selected-button" : "filter-button"
              }
              onClick={() => toggleCategory("palette")}
            >
              Palette
            </button>
            <button
              className={
                selectedCategories.includes("lipstick") ? "filter-selected-button" : "filter-button"
              }
              onClick={() => toggleCategory("lipstick")}
            >
              Lipstick
            </button>
            <button
              className={
                selectedCategories.includes("liquid") ? "filter-selected-button" : "filter-button"
              }
              onClick={() => toggleCategory("liquid")}
            >
              Liquid
            </button>
            <button
              className={
                selectedCategories.includes("powder") ? "filter-selected-button" : "filter-button"
              }
              onClick={() => toggleCategory("powder")}
            >
              Powder
            </button>
          </div>

          <div className="filter-font">Filtrar por favoritos</div>
          <label className="switch">
  <input
    type="checkbox"
    checked={showFavorites}
    onChange={() => setShowFavorites(!showFavorites)}
  />
  <span className="slider round"></span>
</label>
        </div>
        <div className="product-grid">
          {sortCosmetics(filteredCosmetics.filter(filterByCategory)).map(
            (cosmetic) => (
              <div
                key={cosmetic.id}
                onMouseEnter={() => toggleFavoriteIcon(cosmetic.id)}
                onMouseLeave={() => hideFavoriteIcon(cosmetic.id)}
                className={`product ${
                  showFavorites && !favoriteCosmetics.includes(cosmetic)
                    ? "hidden"
                    : ""
                }`}
              >
                <img
                  src={cosmetic.image_link}
                  alt={cosmetic.name}
                  width={200}
                  height={200}
                  className="product-image"
                />
                <div className="product-details">
                  <div className="product-price">R$ {cosmetic.price}  <i
                    onClick={() => {
                      toggleFavorite(cosmetic);
                      toggleFavoriteIcon(cosmetic.id);
                    }}
                    className={`fa-regular fa-star ${
                      showFavoriteIcons[cosmetic.id] ? "" : " hidden"
                    } ${
                      favoriteCosmetics.includes(cosmetic)
                        ? "fa-solid fa-star"
                        : " "
                    }`}
                  ></i></div>
                 
                  <div className="product-name filter-font">{cosmetic.name}</div>
                  <div className="product-category">{cosmetic.category}</div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default CosmeticList;
