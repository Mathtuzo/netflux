import './Footer.css';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="netflux-footer">
      <div className="footer-content">
        <p className="footer-contact">
          Des questions ? Contactez le service client Netflux au 0805-543-064
        </p>

        <div className="footer-links-grid">
          <ul>
            <li><Link to="/help">FAQ & Centre d'aide</Link></li>
            <li><Link to="/help">Relations Investisseurs</Link></li>
            <li><Link to="/help">Confidentialité</Link></li>
            <li><Link to="/help">Test de vitesse</Link></li>
          </ul>

          <ul>
            <li><Link to="/help">Centre d'aide</Link></li>
            <li><Link to="/help">Recrutement</Link></li>
            <li><Link to="/help">Préférences de cookies</Link></li>
            <li><Link to="/help">Mentions légales</Link></li>
          </ul>

          <ul>
            <li><Link to="/liste#favori">Ma liste</Link></li>
            <li><Link to="/subscribe">Boutique Netflux</Link></li>
            <li><Link to="/help">Informations légales</Link></li>
            <li><Link to="/help">Seulement sur Netflux</Link></li>
          </ul>

          <ul>
            <li><Link to="/help">Presse</Link></li>
            <li><Link to="/help">Conditions d'utilisation</Link></li>
            <li><Link to="/help">Nous contacter</Link></li>
            <li><Link to="/help">Garantie légale</Link></li>
          </ul>
        </div>

        <div className="footer-lang">
          <span className="lang-btn">🌐 Français</span>
        </div>

        <p className="footer-copyright">
          © 2026 Netflux, Inc. — Tous droits réservés. Projet d'études.
        </p>
      </div>
    </footer>
  );
}
