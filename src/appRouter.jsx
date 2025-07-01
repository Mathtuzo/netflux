import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import RootLayout from './components/RootLayout';
import Error from './pages/Error';
import DashBoard from './pages/Dashboard';
import Settings from './pages/Settings';
import Login from './pages/Login';  
import Series from './pages/Series'; 
import SeriesDetails from './pages/SeriesDetails'; 
import Films from './pages/Films';
import FilmsDetails from './pages/FilmsDetails';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Search from './pages/Search';
import UserDashboard from './pages/UserDashboard';


export default createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: '/films', element: <Films /> },
      { path: '/films/:filmsId', element: <FilmsDetails /> },
      { path: '/series/:seriesId', element: <SeriesDetails /> },
      { path: '/series', element: <Series /> },
      { path: '/admin', element: <AdminDashboard /> },
      { path: '/user', element: <UserDashboard /> },
      { path: '/search', element: <Search /> },




      { path: '/register', element: <Register /> }, 
      { path: '/login', element: <Login /> }, // 
      {
        path: '/dashboard',
        element: <DashBoard />,
        children: [
          { index: true, element: <Settings /> },
        ],
      },
    ],
  },
]);