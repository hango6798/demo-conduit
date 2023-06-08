import { Outlet } from "react-router-dom"
import Header from "./Header"

export const Layout = () => {
    return <div>
        <Header />
        <div className="content">
            <Outlet />
        </div>
        <div className="footer">

        </div>
    </div>
}