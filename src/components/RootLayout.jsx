import MainNavigation from "./MainNavigation";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <>
        <MainNavigation/>
        <main>
            <Outlet />
        </main>
     </>
  )
}