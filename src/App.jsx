import { RouterProvider } from 'react-router-dom'
import appRouter from './appRouter'
import './App.css'

export default function App() {
  

  return  <RouterProvider router={appRouter}></RouterProvider>
}


