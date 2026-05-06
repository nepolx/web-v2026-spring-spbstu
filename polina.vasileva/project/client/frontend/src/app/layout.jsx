import { Header } from "../widgets/header/header";
import { Footer } from "../widgets/footer/footer";
import "../shared/styles/global.css"

export const Layout = ({ children }) => {
  return (
    <div className="app-wrapper">
      <Header />
      
      <main className="main-content">
        
          {children}
        
      </main>

      <Footer />
    </div>
  );
};