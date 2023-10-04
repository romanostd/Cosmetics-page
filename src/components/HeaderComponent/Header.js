import React from "react";
import "./Header.css";

function Header() {
  return (
    <div className="header-container">
      <img
        src="/images/synvia_logo.png"
        alt="Imagem Esquerda"
        className="header-image-left"
      />
      <img
        src="/images/synvia_profile_icon.png"
        alt="Imagem Direita"
        className="header-image-right"
      />
    </div>
  );
}

export default Header;
