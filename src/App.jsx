import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer/Footer';
import Acceuil from './assets/Acceuil';
import Liste from './components/liste/liste';
import Login from './components/login/Login';
import Signin from './components/login/Signin';
import SubscribePage from './pages/subscribe/subscribe';
import DropDowns from './components/faq/dropdowns';
import SearchPage from './pages/search/SearchPage';
import ErrorBoundary from './components/error/ErrorBoundary';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Header />
        <main className="app-main">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Acceuil />} />
              <Route path="/home" element={<Acceuil />} />
              <Route path="/films" element={<Acceuil filterType="film" />} />
              <Route path="/series" element={<Acceuil filterType="serie" />} />
              <Route path="/liste" element={<Liste />} />
              <Route path="/help" element={<DropDowns />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/subscribe" element={<SubscribePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="*" element={<Acceuil />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
