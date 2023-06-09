import { Outlet } from "react-router-dom"
import Header from "./Header"
import { Container } from "react-bootstrap"

export const Layout = () => {
    return <div>
        <Header />
        <Container>
            <Outlet />
        </Container>
        <div className="footer">

        </div>
    </div>
}