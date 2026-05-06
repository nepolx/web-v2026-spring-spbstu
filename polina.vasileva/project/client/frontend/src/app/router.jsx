import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/login/LoginPage";
import CatalogPage from "../pages/catalog/CatalogPage";
import CartPage from "../pages/cart/CartPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        
        <Route
        path="/cart"
        element={
            <ProtectedRoute>
            <CartPage />
            </ProtectedRoute>
        }
        />
      </Routes>
    </BrowserRouter>
  );
};