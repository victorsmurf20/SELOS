import React from 'react';
import './footer.css';


const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h2 className="footer-logo">SENAI HelpDesk</h2>
          <p>
            Oferecendo suporte técnico ágil e eficiente para garantir que suas operações nunca parem. 
            Estamos aqui para ajudar a resolver seus problemas com rapidez e precisão.
          </p>
        </div>

        <div className="footer-section contact-info">
          <h3>Contato</h3>
          <span><i className="fas fa-phone"></i> &nbsp;0800 000 1234</span>
          <span><i className="fas fa-envelope"></i> &nbsp;suporte@senaidesk.com.br</span>
          <span><i className="fas fa-map-marker-alt"></i> &nbsp;Setor Bancário Norte, Quadra 1 - Brasília, DF</span>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} SENAI HelpDesk | Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;