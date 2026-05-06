import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../../app/layout";
import { useCartContext } from "../../shared/context/Usecartcontext";
import { createOrder, getOrders } from "../../shared/api/authApi";
import cartEmpty from "../../assets/Gadget Hub Assets/images/empty_cart.svg";
import succOrder from "../../assets/Gadget Hub Assets/images/success_order.svg";
import "./CartPage.css";

const pluralItems = (n) => {
  if (n % 10 === 1 && n % 100 !== 11) return "товар";
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return "товара";
  return "товаров";
};

const CartPage = () => {
  const { cart, qtyMap, changeQty, removeItem, removeItems, clearCart } = useCartContext();

  const items = [...cart.values()];
  const isEmpty = items.length === 0;

  // ─── Checkboxes ─────────────────────────────────────────────────────────────
  const [selected, setSelected] = useState(new Set());
  const allIds = items.map((v) => v.product.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(allIds));
  };

  const countItems = [...selected].reduce((s, id) => s + (qtyMap.get(id) ?? 0), 0);
  const totalPrice = [...selected].reduce((s, id) => {
    const item = cart.get(id);
    return s + (item ? item.product.price * item.qty : 0);
  }, 0);

  // ─── Tabs ────────────────────────────────────────────────────────────────────
  const [tab, setTab] = useState("cart");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  const handleTabHistory = async () => {
    setTab("history");
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const data = await getOrders();
      setOrders(data);
    } catch {
      setOrdersError("Не удалось загрузить историю заказов");
    } finally {
      setOrdersLoading(false);
    }
  };

  // ─── Confirm delete modal ────────────────────────────────────────────────────
  const [confirmItem, setConfirmItem] = useState(null);

  const handleRemoveClick = (product) => setConfirmItem(product);
  const handleConfirmDelete = () => {
    if (confirmItem) removeItem(confirmItem.id);
    setConfirmItem(null);
  };
  const handleCancelDelete = () => setConfirmItem(null);

  const handleRemoveSelected = () => {
  if (selected.size === 0) return;
  
  const selectedIds = Array.from(selected);
  removeItems(selectedIds); 
  setSelected(new Set());  
  };

  // ─── Order form ──────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    phone: "",
    email: "",
    delivery: "pickup",
    address: "",
    payment: "",
    packaging: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null); 
  const [orderLoading, setOrderLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const errors = {};
    if (!form.email.trim()) {
      errors.email = "Заполните обязательное поле";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Введите корректный e-mail";
    }
    if (form.delivery === "delivery" && !form.address.trim()) {
      errors.address = "Введите адрес доставки";
    }
    if (!form.payment) {
      errors.payment = "Выберите способ оплаты";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const itemsToOrder = selected.size > 0
      ? [...cart.values()].filter((v) => selected.has(v.product.id))
      : [...cart.values()];

    const orderPayload = {
      items: itemsToOrder.map(({ product, qty }) => ({
        productId: product.id,
        name: product.name,
        price: product.price,
        qty,
      })),
      phone: form.phone,
      email: form.email,
      delivery: form.delivery,
      address: form.delivery === "delivery" ? form.address : "",
      payment: form.payment,
      packaging: form.packaging,
    };

    setOrderLoading(true);
    setServerError("");
    try {
      const result = await createOrder(orderPayload);
      clearCart();
      setPlacedOrder(result); 
      setOrderPlaced(true);
    } catch (err) {
      const msg = err?.response?.data?.message ?? "Ошибка при оформлении заказа";
      setServerError(msg);
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <Layout>
      <div className="cart-wrapper">
        <div className="cart-container">

          {/* Tabs */}
          <div className="cart-tabs">
            <button
              className={`cart-tab ${tab === "cart" ? "cart-tab--active" : ""}`}
              onClick={() => setTab("cart")}
            >
              Корзина
            </button>
            <button
              className={`cart-tab ${tab === "history" ? "cart-tab--active" : ""}`}
              onClick={handleTabHistory}
            >
              История заказов
            </button>
          </div>

          {/* Cart tab */}
          {tab === "cart" && (
            <>
              {/* ── Success ─────────────────────────────────────────────────── */}
              {orderPlaced ? (
                <div className="cart-empty">
                  <h2 className="cart-empty__title">
                    Спасибо, ваш заказ успешно оформлен!
                  </h2>
                  <p className="cart-empty__sub">
                    Мы свяжемся с вами в ближайшее время.
                  </p>
                  <div className="cart-empty__actions">
                    <Link to="/catalog">
                      <button className="cart-btn-primary">Перейти в каталог</button>
                    </Link>
                    <button
                      className="cart-btn-link"
                      onClick={() => { setOrderPlaced(false); handleTabHistory(); }}
                    >
                      История заказов
                    </button>
                  </div>
                </div>

              /* ── Empty ──────────────────────────────────────────────────── */
              ) : isEmpty ? (
                <div className="cart-empty">
                  <div className="cart-empty__icon">
                    <img src={cartEmpty} alt="Корзина пуста" />
                  </div>
                  <h2 className="cart-empty__title">Пока пусто</h2>
                  <p className="cart-empty__sub">
                    Ознакомьтесь с новинками и хитами на главной<br />
                    или найдите нужное в каталоге
                  </p>
                  <div className="cart-empty__actions">
                    <Link to="/catalog">
                      <button className="cart-btn-primary">Перейти в каталог</button>
                    </Link>
                    <Link to="/">
                      <button className="cart-btn-link">Главная страница</button>
                    </Link>
                  </div>
                </div>

              /* ── Items ──────────────────────────────────────────────────── */
              ) : (
                <>
                  <div className="cart-list">
                    <div className="cart-select-all">
                      <label className="cart-checkbox-label">
                        <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                        <span>Выбрать все</span>
                      </label>
                      {selected.size > 0 && (
                        <button className="cart-remove-selected" onClick={handleRemoveSelected}>
                          ✕ Удалить все
                        </button>
                      )}
                    </div>

                    {items.map(({ product, qty }) => (
                      <div key={product.id} className="cart-item">
                        <label className="cart-checkbox-label">
                          <input
                            type="checkbox"
                            checked={selected.has(product.id)}
                            onChange={() => toggleSelect(product.id)}
                          />
                        </label>

                        <div className="cart-item__img-wrap">
                          <img
                            src={`/src/assets/Gadget Hub Assets/images/goods/image_${product.id}.png`}
                            alt={product.name}
                            className="cart-item__img"
                          />
                        </div>

                        <p className="cart-item__name">{product.name}</p>

                        <div className="cart-item__actions-wrapper">
                          <div className="cart-item__qty">
                            <button className="cart-qty-btn" onClick={() => changeQty(product.id, -1)}>−</button>
                            <span className="cart-qty-num">{qty}</span>
                            <button className="cart-qty-btn" onClick={() => changeQty(product.id, 1)}>+</button>
                          </div>
                          <p className="cart-item__price">
                            {(product.price * qty).toLocaleString("ru-RU")} ₽
                          </p>
                          <button className="cart-item__remove" onClick={() => handleRemoveClick(product)}>
                            ✕ Удалить
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="cart-total">
                      {countItems} товара на {totalPrice.toLocaleString("ru-RU")} ₽
                    </div>
                  </div>

                  {/* Order form */}
                  <div className="cart-order">
                    <h2 className="cart-order__title">Оформление заказа</h2>
                    <div className="cart-order__card">
                      <form onSubmit={handleOrder} noValidate>

                        <div className="order-row">
                          <div className="order-field">
                            <label className="order-label">Телефон</label>
                            <input
                              type="tel"
                              className="order-input"
                              value={form.phone}
                              placeholder="+7 (___) ___-__-__"
                              onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            />
                          </div>

                          <div className="order-field">
                            <label className="order-label">
                              E-mail <span className="order-required">*</span>
                            </label>
                            <input
                              type="email"
                              className={`order-input ${formErrors.email ? "order-input--error" : ""}`}
                              value={form.email}
                              onChange={(e) => {
                                setForm({ ...form, email: e.target.value });
                                if (formErrors.email) setFormErrors({ ...formErrors, email: "" });
                              }}
                            />
                            {formErrors.email && (
                              <p className="order-error">{formErrors.email}</p>
                            )}
                          </div>
                        </div>

                        <div className="order-radio-group">
                          <label className="order-radio-label">
                            <input
                              type="radio" name="delivery" value="pickup"
                              checked={form.delivery === "pickup"}
                              onChange={() => setForm({ ...form, delivery: "pickup", address: "" })}
                            />
                            Самовывоз
                          </label>
                          <label className="order-radio-label">
                            <input
                              type="radio" name="delivery" value="delivery"
                              checked={form.delivery === "delivery"}
                              onChange={() => setForm({ ...form, delivery: "delivery" })}
                            />
                            Доставка
                          </label>
                        </div>

                        {form.delivery === "delivery" && (
                          <div className="order-field order-field--mb">
                            <label className="order-label">
                              Адрес доставки <span className="order-required">*</span>
                            </label>
                            <input
                              type="text"
                              className={`order-input ${formErrors.address ? "order-input--error" : ""}`}
                              value={form.address}
                              placeholder="Город, улица, дом, квартира"
                              onChange={(e) => {
                                setForm({ ...form, address: e.target.value });
                                if (formErrors.address) setFormErrors({ ...formErrors, address: "" });
                              }}
                            />
                            {formErrors.address && (
                              <p className="order-error">{formErrors.address}</p>
                            )}
                          </div>
                        )}

                        <div className="order-field">
                          <label className="order-label">Способ оплаты</label>
                          <select
                            className={`order-select ${formErrors.payment ? "order-input--error" : ""}`}
                            value={form.payment}
                            onChange={(e) => {
                              setForm({ ...form, payment: e.target.value });
                              if (formErrors.payment) setFormErrors({ ...formErrors, payment: "" });
                            }}
                          >
                            <option value="">Не выбрано</option>
                            <option value="card">Банковская карта</option>
                            <option value="cash">Наличные</option>
                            <option value="online">Онлайн-оплата</option>
                          </select>
                          {formErrors.payment && (
                            <p className="order-error">{formErrors.payment}</p>
                          )}
                        </div>

                        <label className="order-checkbox-label">
                          <input
                            type="checkbox"
                            checked={form.packaging}
                            onChange={(e) => setForm({ ...form, packaging: e.target.checked })}
                          />
                          Нужна упаковка
                        </label>

                        {serverError && (
                          <p className="order-error order-error--server">{serverError}</p>
                        )}

                        <button
                          type="submit"
                          className="cart-btn-primary order-submit"
                          disabled={orderLoading}
                        >
                          {orderLoading ? "Оформляем..." : "Оформить заказ"}
                        </button>

                      </form>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* History tab */}
          {tab === "history" && (
            <div className="cart-history">
              {ordersLoading ? (
                <p className="cart-history__loading">Загрузка...</p>
              ) : ordersError ? (
                <p className="cart-history__error">{ordersError}</p>
              ) : orders.length === 0 ? (
                <div className="cart-empty">
                  <h2 className="cart-empty__title">История заказов пуста</h2>
                  <p className="cart-empty__sub">Здесь будут отображаться ваши прошлые заказы</p>
                </div>
              ) : (
                <div className="cart-orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="cart-order-row">
                      <span className="cart-order-row__id">
                        № {order.id} от {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                      </span>
                      <span className="cart-order-row__count">
                        {order.items.reduce((s, i) => s + i.qty, 0)}{" "}
                        {pluralItems(order.items.reduce((s, i) => s + i.qty, 0))}
                      </span>
                      <span className="cart-order-row__total">
                        {order.total.toLocaleString("ru-RU")} ₽
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Confirm delete modal */}
      {confirmItem && (
        <div className="confirm-overlay" onClick={handleCancelDelete}>
          <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
            <button className="confirm-close" onClick={handleCancelDelete}>✕</button>
            <p className="confirm-text">
              Вы действительно хотите удалить{" "}
              <strong>{confirmItem.name}</strong>?
            </p>
            <div className="confirm-actions">
              <button className="confirm-btn-cancel" onClick={handleCancelDelete}>Отмена</button>
              <button className="confirm-btn-delete" onClick={handleConfirmDelete}>Да, удалить</button>
            </div>
          </div>
        </div>
      )}

      {/* Thank-you modal */}
      {placedOrder && (
        <div className="confirm-overlay" onClick={() => setPlacedOrder(null)}>
          <div className="thankyou-card" onClick={(e) => e.stopPropagation()}>
            <button className="confirm-close" onClick={() => setPlacedOrder(null)}>✕</button>
            <div className="thankyou-emoji">
              <img src={succOrder} alt="Корзина пуста" />
            </div>
            <h2 className="thankyou-title">Спасибо за заказ!</h2>
            <p className="thankyou-sub">
              Номер заказа {placedOrder.id}.<br />
              Мы свяжемся с вами в течение 10 минут, чтобы уточнить
              удобное для вас время доставки
            </p>
            <div className="thankyou-actions">
              <button
                className="cart-btn-primary"
                onClick={() => { setPlacedOrder(null); handleTabHistory(); }}
              >
                Ок
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CartPage;