import { memo, useState } from "react"
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap"
import { Link } from "react-router-dom"
import './style.scss'
import { UserPopup } from "../Popup/UserPopup"

const Header = () => {
    const [show, setShow] = useState<boolean>(false)
    const [popupType, setPopupType] = useState<string>('')

    const showPopup = (type:string) => {
        setShow(true)
        setPopupType(type)
    }

    return <div>
        <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
            <Container>
                <Navbar.Brand>
                    <Link to="/" className="text-white">conduit</Link>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ms-auto">
                        <Link to="/">Home</Link>
                        <Link to="" onClick={() => showPopup('login')}>Sign in</Link>
                        <Link to="" onClick={() => showPopup('register')}>Sign Up</Link>
                    </Nav>  
                </Navbar.Collapse>
                
            </Container>
        </Navbar>
        {
            show && <UserPopup setShow={setShow} popupType={popupType} setPopupType={setPopupType}/>
        }
    </div>
}

export default memo(Header)