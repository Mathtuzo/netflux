import home from '../../assets/svg/home.svg';
import film from '../../assets/svg/film-icon.svg';
import serie from '../../assets/svg/serie-icon.svg';
import news from '../../assets/svg/news-icon.svg';
import favori from '../../assets/svg/favori-icon.svg';
import User from '../user/user';
import { Link, useLocation } from 'react-router-dom';
import Searchbar from '../searchbar/searchbar';

function Navbar() {
  const location = useLocation();

  const navbar = [
    { title: "Accueil", img: home, path: "/" },
    { title: "Films", img: film, path: "/films" },
    { title: "Séries", img: serie, path: "/series" },
    { title: "Ma Liste", img: favori, path: "/liste#favori" },
    { title: "FAQ", img: news, path: "/help" },
  ];

  return (
    <nav className="main-nav">
      <Link to="/" className="netflux-brand">
        <svg className="netflux-logo-icon" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="navNfLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#002b54" />
              <stop offset="100%" stopColor="#001830" />
            </linearGradient>
            <linearGradient id="navNfCenter" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00a0ff" />
              <stop offset="45%" stopColor="#006ec2" />
              <stop offset="100%" stopColor="#003362" />
            </linearGradient>
            <linearGradient id="navNfRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#004b87" />
              <stop offset="100%" stopColor="#002244" />
            </linearGradient>
          </defs>
          <rect width="36" height="36" rx="8" fill="#0a1829" stroke="#004b87" strokeWidth="1.5" />
          <path d="M7 6H13V30H7V6Z" fill="url(#navNfLeft)" />
          <path d="M23 6H29V30H23V6Z" fill="url(#navNfRight)" />
          <path d="M7 6H13L29 30H23L7 6Z" fill="url(#navNfCenter)" />
        </svg>
        <span className="netflux-brand-text">NETFLUX</span>
      </Link>

      <div className="nav-links">
        {navbar.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              id={`nav-element-${index}`}
              className={`nav-item ${isActive ? "active-link" : ""}`}
            >
              <img src={item.img} alt={item.title} className="nav-icon" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>

      <div className="nav-right">
        <Searchbar />
        <User />
      </div>
    </nav>
  );
}

export default Navbar;