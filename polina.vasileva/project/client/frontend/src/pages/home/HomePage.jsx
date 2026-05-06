import { useRef, useState } from "react";
import { Layout } from "../../app/layout";
import banner from "../../assets/Gadget Hub Assets/images/banner.png";
import products from "../../assets/Gadget Hub Assets/data/goods.json";
import subtract from "../../assets/Gadget Hub Assets/images/Subtract.png";
import star from "../../assets/Gadget Hub Assets/images/star.png";
import arrowLeft from "../../assets/Gadget Hub Assets/images/arrow-left.png";
import arrowRight from "../../assets/Gadget Hub Assets/images/arrow-right.png";
import benefits from "../../assets/Gadget Hub Assets/images/benefits.png"
import contacts from "../../assets/Gadget Hub Assets/images/contacts.png"
import "./HomePage.css";
import "../../shared/styles/global.css";

const CARD_WIDTH = 286;
const GAP = 16;
const VISIBLE = 3;
const STEP = CARD_WIDTH + GAP;

const hitProducts = products.filter((p) => p.hit === true);
const newProducts = products.filter((p) => p.new === true);

const Carousel = ({ items }) => {
  const [index, setIndex] = useState(0);
  const trackRef = useRef(null);
  const maxOffset = Math.max(0, items.length - VISIBLE);

  const goTo = (newIndex) => {
    const clamped = Math.max(0, Math.min(maxOffset, newIndex));
    setIndex(clamped);
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${clamped * STEP}px)`;
    }
  };

  return (
    <div className="carousel-wrapper">
      <button
        className="carousel-arrow"
        onClick={() => goTo(index - 1)}
        disabled={index === 0}
      >
        <img src={arrowLeft} alt="Назад" />
      </button>

      <div className="carousel-viewport">
        <div className="carousel-track" ref={trackRef}>
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <button
        className="carousel-arrow"
        onClick={() => goTo(index + 1)}
        disabled={index >= maxOffset}
      >
        <img src={arrowRight} alt="Вперед" />
      </button>
    </div>
  );
};

const ProductCard = ({ product }) => (
  <div className="product-card">
    <div className="product-card__badges">
      {product.hit && <span className="product-card__badge product-card__hit">Хит</span>}
      {product.new && <span className="product-card__badge product-card__new">Новинка</span>}
    </div>
    <div className="product-card__img-wrap">
      <img
        src={`/src/assets/Gadget Hub Assets/images/goods/image_${product.id}.png`}
        alt={product.name}
        className="product-card__img"
      />
    </div>
    <p className="product-card__price">{product.price.toLocaleString("ru-RU")} ₽</p>
    <p className="product-card__name">{product.name}</p>
    {product.rating && (
      <div className="product-card__rating">
        ⭐ {product.rating}
      </div>
    )}
  </div>
);

const HomePage = () => {
  return (
    <Layout>
      <div className="homepage-wrapper">
        <div className="homepage-container">

          <div className="banner">
            <img src={banner} alt="Super Sale" />
          </div>

          {/* Хиты продаж */}
          <div className="hits-section">
            <div className="hits-info">
              <img src={subtract} className="fire-icon" alt="Fire" />
              <h2 className="header-32" style={{ paddingTop: "20px", whiteSpace: "nowrap" }}>Хиты продаж</h2>
              <p>Тысячи покупателей уже одобрили эти товары. Самые популярные, проверенные и надёжные гаджеты!</p>
            </div>
            <Carousel items={hitProducts} />
          </div>

          {/* Новинки */}
          <div className="hits-section" style={{ marginTop: "80px" }}>
            <div className="hits-info">
              <img src={star} className="star-icon" alt="Star" />
              <h2 className="header-32" style={{ paddingTop: "20px", whiteSpace: "nowrap" }}>Новинки</h2>
              <p>Их только произвели — они уже у нас! Всё самое новое и свежее на рынке электроники.</p>
            </div>
            <Carousel items={newProducts} />
          </div>

          <div className="benefits-section">
            <h2 className="header-32" style={{ paddingTop: "20px", whiteSpace: "nowrap" }}>Преимущества</h2>
            <img src={benefits} className="benefits-cards" alt="Fire"></img>
          </div>

          <div className="benefits-section">
            <h2 className="header-32" style={{ paddingTop: "20px", whiteSpace: "nowrap" }}>Контакты</h2>
            <img src={contacts} className="benefits-cards" alt="Fire"></img>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
