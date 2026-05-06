import { AppRouter } from "./app/router";
import { CartProvider } from "./shared/context/CartProvider";

function App() {
  return <CartProvider><AppRouter /></CartProvider>;
}

export default App;