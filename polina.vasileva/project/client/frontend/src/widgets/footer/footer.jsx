import "./footer.css";
import PhoneIcon from "../../assets/Gadget Hub Assets/images/icons/mobile.svg";
import VkIcon from "../../assets/Gadget Hub Assets/images/social icons/vk.png";
import TelegramIcon from "../../assets/Gadget Hub Assets/images/social icons/telegram.png";
import WhatsAppIcon from "../../assets/Gadget Hub Assets/images/social icons/whatsapp.png";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner">

        <div className="footer__brand">
          <span className="footer__title">Gadget Hub</span>
          <span className="footer__subtitle">Магазин надёжных гаджетов</span>
          <span className="footer__copy">© 2024 ООО "Гаджет Хаб". Все права защищены</span>
        </div>

        <div className="footer__phone">
          <img src={PhoneIcon} alt="phone" width={20} height={20} />
          <span className="footer__phone-number">8 (800) 678-34-24</span>
        </div>

        <div className="footer__socials">
          <img src={VkIcon} alt="VK" width={36} height={36} />
          <img src={TelegramIcon} alt="Telegram" width={36} height={36} />
          <img src={WhatsAppIcon} alt="WhatsApp" width={36} height={36} />
        </div>

      </div>
    </footer>
  );
};