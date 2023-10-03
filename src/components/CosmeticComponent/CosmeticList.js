import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CosmeticList.css';

function CosmeticList() {
  const [cosmetics, setCosmetics] = useState([]);
  const [favoriteCosmetics, setFavoriteCosmetics] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showFavoriteIcons, setShowFavoriteIcons] = useState({});

  useEffect(() => {
    axios.get('https://makeup-api.herokuapp.com/api/v1/products.json?limit=30')
      .then((response) => {
        const limitedCosmetics = response.data.slice(0, 100);
        setCosmetics(limitedCosmetics);
      })
      .catch((error) => {
        console.error('Erro ao buscar os cosméticos:', error);
      });
  }, []);

  const toggleFavoriteIcon = (cosmeticId) => {
    setShowFavoriteIcons({ ...showFavoriteIcons, [cosmeticId]: true });
  };

  const hideFavoriteIcon = (cosmeticId) => {
    if (!favoriteCosmetics.includes(cosmetics.find((cosmetic) => cosmetic.id === cosmeticId))) {
      setShowFavoriteIcons({ ...showFavoriteIcons, [cosmeticId]: false });
    }
  };

  const toggleFavorite = (cosmetic) => {
    if (favoriteCosmetics.includes(cosmetic)) {
      setFavoriteCosmetics(favoriteCosmetics.filter((item) => item !== cosmetic));
    } else {
      setFavoriteCosmetics([...favoriteCosmetics, cosmetic]);
    }
  };

  return (
    <div>
      <button onClick={() => setShowFavorites(!showFavorites)}>
        {showFavorites ? 'Mostrar Todos' : 'Mostrar Favoritos'}
      </button>
      <div className="product-grid">
        {cosmetics.map((cosmetic) => (
          <div
            key={cosmetic.id}
            onMouseEnter={() => toggleFavoriteIcon(cosmetic.id)} 
            onMouseLeave={() => hideFavoriteIcon(cosmetic.id)} 
            className={`product ${showFavorites && !favoriteCosmetics.includes(cosmetic) ? 'hidden' : ''}`}
          >
            <img
              src={cosmetic.image_link}
              alt={cosmetic.name}
              width={200}
              height={200}
              className="product-image"
            />
            <div className="product-details">
              <div className="product-price">R$ {cosmetic.price}</div>
              <i
                onClick={() => {
                  toggleFavorite(cosmetic);
                  toggleFavoriteIcon(cosmetic.id);
                }}
                className={`fas fa-star ${showFavoriteIcons[cosmetic.id] ? '' : ' hidden'} ${favoriteCosmetics.includes(cosmetic) ? ' filled' : ' '}`}
              ></i>
              <div className="product-name">{cosmetic.name}</div>
              <div className="product-category">{cosmetic.category}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CosmeticList;
