import { memo, useMemo } from "react"
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap"
import { Link } from "react-router-dom"
import './style.scss'
import { UserPopup } from "../../Popup/UserPopup"
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare, faGear, faUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons"

import { logout, setPopupType, setShowPopup } from "../../../store/userSlice"

const Header = () => {
    const dispatch = useAppDispatch()
    const {user, showPopup: show, status} = useAppSelector(store => store.userReducer)
    const userLoading = status.getUser === "loading"

    const userName:string = useMemo(() => {
        return user.username.length > 10 ? user.username.substring(0,10) + '...' : user.username
    }, [user.username])

    const showPopup = (type: 'login' | 'register') => {
        dispatch(setShowPopup(true))
        dispatch(setPopupType(type))
    }

    const handleLogout = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        dispatch(logout())
    }

    const handleNavClick = () => {
        window.scrollTo(0, 0)
    }

    return <div className="shadow-sm sticky-top" style={{zIndex: 1030}}>
        <Navbar collapseOnSelect expand="lg" bg="white" variant="light">
            <Container fluid className="px-md-4 px-xs-3">
                <Navbar.Brand>
                    <Link to="/" className="text-primary">conduit</Link>
                </Navbar.Brand>
                <Navbar>
                    {
                        userLoading ?
                        <NavDropdown title={<span className="text-secondary"><img src="https://api.realworld.io/images/smiley-cyrus.jpeg" alt="" />User name</span>} id="collasible-nav-dropdown" className="ms-auto">
                        </NavDropdown>
                        :
                        user.token ? 
                        <NavDropdown title={<span className="text-secondary"><img src={user.image} alt="" />{userName}</span>} id="collasible-nav-dropdown" className="ms-auto">
                            <Link className="dropdown-item" to="/editor" onClick={handleNavClick}>
                                <FontAwesomeIcon icon={faPenToSquare} className="me-2"/>
                                New Article
                            </Link>
                            <Link className="dropdown-item" to="/settings" onClick={handleNavClick}>
                                <FontAwesomeIcon icon={faGear} className="me-2"/>
                                Settings
                            </Link>
                            <Link className="dropdown-item" to={`/profiles/@${user.username}`} onClick={handleNavClick}>
                                <FontAwesomeIcon icon={faUser} className="me-2"/>
                                Profile
                            </Link>

                            <NavDropdown.Divider />

                            <NavDropdown.Item onClick={handleLogout}>
                                <FontAwesomeIcon icon={faRightFromBracket} className="me-2"/>
                                Log out
                            </NavDropdown.Item>
                        </NavDropdown>
                        :
                        <Nav className="ms-auto">
                            <Link to="/">Home</Link>
                            <Link to="" onClick={(e) => {
                                e.preventDefault()
                                showPopup('login')
                            }}>Sign in</Link>
                            <Link to="" onClick={(e) => {
                                e.preventDefault()
                                showPopup('register')
                            }}>Sign Up</Link>
                        </Nav>
                    }
                </Navbar>
            </Container>
        </Navbar>
        {
            show && <UserPopup/>
        }
    </div>
}

export default memo(Header)