import { Link, useNavigate } from "react-router-dom";
import "./header.css";
import profileIcon from "../../assets/Gadget Hub Assets/images/icons/profile.svg";
import catalogIcon from "../../assets/Gadget Hub Assets/images/icons/catalog.svg"; 
import cartIcon from "../../assets/Gadget Hub Assets/images/icons/card.svg";
import { useCartContext } from "../../shared/context/Usecartcontext";

export const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { totalCount } = useCartContext();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-link">
          <h1 className="title">
            <span className="accent">Gadget</span> Hub
          </h1>
        </Link>

        <nav className="nav-group">
          <Link to="/catalog" className="nav-item header-16">
            <img src={catalogIcon} alt="" className="icon-blue" />
            Каталог
          </Link>

          <div className="auth-section">
            {user ? (
              <div className="user-controls">
                <Link to="/cart" className="nav-item header-16">
                  <img src={cartIcon} alt="" className="icon-blue" />
                  Корзина
                  {totalCount > 0 && (
                    <span className="cart-badge">{totalCount}</span>
                  )}
                </Link>
                <button onClick={handleLogout} className="nav-item header-16">
                  <img src={profileIcon} alt="" className="icon-blue" />
                  Выйти
                </button>
              </div>
            ) : (
              <Link to="/login" className="nav-item header-16">
                <img src={profileIcon} alt="" className="icon-blue" />
                Войти
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};