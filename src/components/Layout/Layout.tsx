import { Outlet } from "react-router-dom"
import Header from "./Header"
import { Container } from "react-bootstrap"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchUser } from "../../store/userSlice"

export const Layout = () => {
    const dispatch = useAppDispatch()
    const {user, token} = useAppSelector(store => store.userReducer)
    useEffect(() => {
        (!user.username && token) && dispatch(fetchUser())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.username, token])

    return <div>
        <Header/>
        
        {
            !token &&
            <div className="bg-primary text-white">
                <Container fluid className="text-center py-5">
                    <div className="h1 ">conduit</div>
                    <div className="h5 fw-light">A place to share your knowledge.</div>
                </Container>
            </div>
        }

        <Container fluid className="px-md-4 px-xs-3">
            <Outlet />
        </Container>
        <div className="footer">

        </div>
    </div>
}