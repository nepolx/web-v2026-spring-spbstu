import { Layout } from "../../app/layout";
import { LoginForm } from "../../features/auth/ui/LoginForm";
import "./LoginPage.css";
import bgImage from "../../assets/Gadget Hub Assets/images/bg.png";

const LoginPage = () => {
  return (
    
    <Layout>
      <div className="login-page-container" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="login-page-content">
        <h1 className="welcome-title header-32">Добро пожаловать!</h1>
      <LoginForm />
      </div>
      </div>
    </Layout>
  );
};

export default LoginPage;