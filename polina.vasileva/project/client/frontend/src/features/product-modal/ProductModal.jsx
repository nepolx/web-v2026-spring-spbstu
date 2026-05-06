import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductModal.css";
import cartIcon from "../../assets/Gadget Hub Assets/images/icons/cart2.svg"; 
import "../../shared/styles/global.css"

/**
 * ProductModal
 * Props:
 *   product    — объект товара (или null, если закрыто)
 *   onClose    — закрыть модалку
 *   cartItems  — Map<id, qty>
 *   onAddToCart(product)
 *   onChangeQty(id, delta)
 */
export const ProductModal = ({ product, onClose, cartItems = new Map(), onAddToCart, onChangeQty }) => {
  useEffect(() => {
    if (!product) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [product, onClose]);

  const navigate = useNavigate();


  if (!product) return null;

  const qty = cartItems.get(product.id) ?? 0;
  const inCart = qty > 0;

  const specs = [
    product.warranty && { label: "Гарантия", value: product.warranty },
    product.screen   && { label: "Экран",    value: product.screen },
    product.cpu      && { label: "Процессор",value: product.cpu },
    product.memory   && { label: "Память",   value: product.memory },
    product.battery  && { label: "Батарея",  value: product.battery },
    product.color    && { label: "Цвет",     value: product.color },
  ].filter(Boolean);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-body">
          <div className="modal-img-wrap">
            <img
              src={`/src/assets/Gadget Hub Assets/images/goods/image_${product.id}.png`}
              alt={product.name}
              className="modal-img"
            />
          </div>

          <div className="modal-info">
            <h2 className="modal-title">{product.name}</h2>
            <div className="modal-rating">⭐ {product.rating}</div>

            {product.description && (
              <p className="modal-description">{product.description}</p>
            )}

            {specs.length > 0 && (
              <>
                <p className="modal-specs-title">Характеристики</p>
                <ul className="modal-specs">
                  {specs.map((s) => (
                    <li key={s.label} className="modal-spec-row">
                      <span className="modal-spec-label">{s.label}</span>
                      <span className="modal-spec-dots" />
                      <span className="modal-spec-value">{s.value}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="modal-footer">
              <h1 className="header32">{product.price.toLocaleString("ru-RU")} ₽</h1>

              {!inCart ? (
                <button
                  className="modal-btn-add"
                  onClick={() => onAddToCart(product)}
                >
                  <img src={cartIcon} alt="" className="icon-blue" /> 
                  В корзину
                </button>
              ) : (
                <div className="modal-qty-wrap">
                  <button className="modal-qty-btn" onClick={() => onChangeQty(product.id, -1)}>−</button>
                  <span className="modal-qty">{qty}</span>
                  <button className="modal-qty-btn" onClick={() => onChangeQty(product.id, 1)}>+</button>
                  <button className="modal-btn-incart" onClick={(e) => { 
                      e.stopPropagation(); 
                      navigate("/cart");
                    }}>
                    <img src={cartIcon} alt="" className="icon-blue" /> 
                    В корзине {qty} шт.
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
