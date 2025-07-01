import { Link, Outlet } from "react-router-dom"

export default function Dashboard() {
  return (
    <>
    <div className="container mt-5">
    <h1 className="text-center">Paramètres</h1>
    <main>
         <Outlet />
    </main>
    </div>

    </>
  )
}