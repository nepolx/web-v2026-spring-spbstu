import { useState, useMemo } from "react";
import { Layout } from "../../app/layout";
import allProducts from "../../assets/Gadget Hub Assets/data/goods.json";
import { ProductModal } from "../../features/product-modal/ProductModal";
import { useCartContext } from "../../shared/context/Usecartcontext";
import "./CatalogPage.css";
import cartIcon from "../../assets/Gadget Hub Assets/images/icons/cart2.svg"; 
import "../../shared/styles/global.css"
const PAGE_SIZE = 9;

const TYPES = [
  "Смартфоны",
  "Фитнес браслеты",
  "Портативная акустика",
  "Очки виртуальной реальности",
  "Электротранспорт",
  "Умные часы",
  "Наушники",
  "Аксессуары",
];
const COLORS = [
  "Красный", "Оранжевый", "Желтый", "Зеленый", "Голубой",
  "Синий", "Фиолетовый", "Белый", "Серый", "Черный", "Бежевый",
];

const MIN_PRICE = Math.min(...allProducts.map((p) => p.price));
const MAX_PRICE = Math.max(...allProducts.map((p) => p.price));

const CatalogPage = () => {
  const { qtyMap, addToCart, changeQty } = useCartContext();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sort, setSort] = useState("new");
  const [priceFrom, setPriceFrom] = useState(MIN_PRICE);
  const [priceTo, setPriceTo] = useState(MAX_PRICE);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [appliedTypes, setAppliedTypes] = useState([]);
  const [appliedColors, setAppliedColors] = useState([]);
  const [appliedFrom, setAppliedFrom] = useState(MIN_PRICE);
  const [appliedTo, setAppliedTo] = useState(MAX_PRICE);
  const [page, setPage] = useState(1);

  const toggleType = (t) =>
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  const toggleColor = (c) =>
    setSelectedColors((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  const handleApply = () => {
    setAppliedTypes(selectedTypes);
    setAppliedColors(selectedColors);
    setAppliedFrom(priceFrom);
    setAppliedTo(priceTo);
    setPage(1);
  };

  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedColors([]);
    setPriceFrom(MIN_PRICE);
    setPriceTo(MAX_PRICE);
    setAppliedTypes([]);
    setAppliedColors([]);
    setAppliedFrom(MIN_PRICE);
    setAppliedTo(MAX_PRICE);
    setPage(1);
  };

  const filtered = useMemo(() => {
    let list = allProducts.filter(
      (p) =>
        p.price >= appliedFrom &&
        p.price <= appliedTo &&
        (appliedTypes.length === 0 || appliedTypes.includes(p.type)) &&
        (appliedColors.length === 0 || appliedColors.includes(p.color))
    );
    if (sort === "new") {
      const newItems = list.filter(x => x.new === true);
      const oldItems = list.filter(x => x.new !== true);
      list = [...newItems, ...oldItems];
    }
    if (sort === "popular") {
      const popItems = list.filter(x => x.hit === true);
      const nopopItems = list.filter(x => x.hit !== true);
      list = [...popItems, ...nopopItems];
    }
    if (sort === "cheap") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "expensive") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [sort, appliedFrom, appliedTo, appliedTypes, appliedColors]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++)
        pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <Layout>
      <div className="catalog-wrapper">
        <div className="catalog-container">
          <h1 className="catalog-title header-32">Каталог товаров</h1>

          <div className="sort-tabs">
            {[
              { key: "new", label: "Новые" },
              { key: "popular", label: "Популярные" },
              { key: "cheap", label: "Подешевле" },
              { key: "expensive", label: "Подороже" },
            ].map((s) => (
              <button
                key={s.key}
                className={`sort-tab ${sort === s.key ? "sort-tab--active" : ""}`}
                onClick={() => { setSort(s.key); setPage(1); }}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="catalog-body">
            <div className="catalog-main">
              {paginated.length === 0 ? (
                <p className="catalog-empty">Ничего не найдено</p>
              ) : (
                <div className="catalog-grid">
                  {paginated.map((p) => {
                    const qty = qtyMap.get(p.id) ?? 0;
                    const inCart = qty > 0;
                    return (
                      <div
                        key={p.id}
                        className="catalog-card"
                        onClick={() => setSelectedProduct(p)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="catalog-card__badges">
                          {p.new && <span className="catalog-card__badge catalog-card__new">Новинка</span>}
                          {p.hit && <span className="catalog-card__badge catalog-card__hit">Хит</span>}
                        </div>
                        <div className="catalog-card__img-wrap">
                          <img
                            src={`/src/assets/Gadget Hub Assets/images/goods/image_${p.id}.png`}
                            alt={p.name}
                            className="catalog-card__img"
                          />
                        </div>
                        <p className="catalog-card__price">{p.price.toLocaleString("ru-RU")} ₽</p>
                        <p className="catalog-card__name">{p.name}</p>
                        <div className="catalog-card__rating">⭐ {p.rating}</div>
                        <div className="catalog-card__actions">
                        {!inCart ? (
                          <button
                            className="catalog-card__btn"
                            onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                          >
                            <img src={cartIcon} alt="" className="icon-blue" /> 
                            В корзину
                          </button>
                        ) : (
                          <div
                            className="catalog-card__qty"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button className="modal-btn-incart">
                          <img src={cartIcon} alt="" className="icon-blue" /> 
                          {qty} шт.</button>
                          <div className="catalog-card__counter">
                            <button
                              className="catalog-card__qty-btn"
                              onClick={() => changeQty(p.id, -1)}
                            >−</button>
                            <span>{qty}</span>
                            <button
                              className="catalog-card__qty-btn"
                              onClick={() => changeQty(p.id, 1)}
                            >+</button>
                          </div>
                          </div>
                        )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination__arrow"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >‹</button>
                  {getPageNumbers().map((p, i) =>
                    p === "..." ? (
                      <span key={i} className="pagination__dots">...</span>
                    ) : (
                      <button
                        key={p}
                        className={`pagination__btn ${page === p ? "pagination__btn--active" : ""}`}
                        onClick={() => setPage(p)}
                      >{p}</button>
                    )
                  )}
                  <button
                    className="pagination__arrow"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >›</button>
                </div>
              )}
            </div>

            {/* Filters sidebar */}
            <aside className="catalog-filters">
              <div className="filter-section">
                <p className="filter-title">Цена, ₽</p>
                <div className="price-inputs">
                  <div className="price-input-wrap">
                    <span className="price-label">От</span>
                    <input
                      type="number"
                      className="price-input"
                      value={priceFrom}
                      onChange={(e) => setPriceFrom(Math.min(Number(e.target.value), priceTo - 1))}
                    />
                  </div>
                  <div className="price-input-wrap">
                    <span className="price-label">До</span>
                    <input
                      type="number"
                      className="price-input"
                      value={priceTo}
                      onChange={(e) => setPriceTo(Math.max(Number(e.target.value), priceFrom + 1))}
                    />
                  </div>
                </div>
                <div 
  className="price-range"
  style={{
    background: `linear-gradient(
      to right,
      #E4E7EB 0%,
      #E4E7EB ${((priceFrom - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%,
      #00E398 ${((priceFrom - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%,
      #00E398 ${((priceTo - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%,
      #E4E7EB ${((priceTo - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%,
      #E4E7EB 100%
    )`
  }}
>
  <input
    type="range" 
    min={MIN_PRICE} 
    max={MAX_PRICE} 
    value={priceFrom}
    onChange={(e) => setPriceFrom(Math.min(Number(e.target.value), priceTo - 1))}
    className="range-slider range-slider--from"
  />
  <input
    type="range" 
    min={MIN_PRICE} 
    max={MAX_PRICE} 
    value={priceTo}
    onChange={(e) => setPriceTo(Math.max(Number(e.target.value), priceFrom + 1))}
    className="range-slider range-slider--to"
  />
</div>
              </div>

              <div className="filter-section">
                <p className="filter-title">Тип товара</p>
                {TYPES.map((t) => (
                  <label key={t} className="filter-checkbox">
                    <input type="checkbox" checked={selectedTypes.includes(t)} onChange={() => toggleType(t)} />
                    <span>{t}</span>
                  </label>
                ))}
              </div>

              <div className="filter-section">
                <p className="filter-title">Цвет</p>
                {COLORS.map((c) => (
                  <label key={c} className="filter-checkbox">
                    <input type="checkbox" checked={selectedColors.includes(c)} onChange={() => toggleColor(c)} />
                    <span>{c}</span>
                  </label>
                ))}
              </div>

              <div className="filter-actions">
                <button className="filter-btn-apply" onClick={handleApply}>Показать</button>
                <button className="filter-btn-reset" onClick={handleReset}>Сбросить</button>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        cartItems={qtyMap}
        onAddToCart={addToCart}
        onChangeQty={changeQty}
      />
    </Layout>
  );
};

export default CatalogPage;