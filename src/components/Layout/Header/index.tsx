import { memo, useMemo } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./style.scss";
import { UserPopup } from "components/Popup/UserPopup";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faGear,
  faUser,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import { logout, Popup, setShowPopup } from "store/userSlice";
import resetData from "utils/resetData";

const Header = () => {
  const dispatch = useAppDispatch();
  const {
    user,
    showPopup: show,
    status,
  } = useAppSelector((store) => store.userReducer);
  const userLoading = status.getUser === "loading";

  const userName: string = useMemo(() => {
    if (!user) return "";
    return user.username.length > 10
      ? user.username.substring(0, 10) + "..."
      : user.username;
  }, [user]);

  const showPopup = (name: Popup) => {
    dispatch(
      setShowPopup({
        name,
        open: true,
      })
    );
  };

  const handleLogout = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(logout());
    resetData();
  };

  return (
    <div className="shadow-sm sticky-top" style={{ zIndex: 1030 }}>
      <Navbar collapseOnSelect expand="lg" bg="white" variant="light">
        <Container fluid className="px-md-4 px-xs-3">
          <Navbar.Brand>
            <Link to="/" className="text-primary">
              conduit
            </Link>
          </Navbar.Brand>
          <Navbar>
            {userLoading ? (
              <NavDropdown
                title={
                  <span className="user-info text-secondary">
                    <span className="avatar">
                      <img
                        src="https://api.realworld.io/images/smiley-cyrus.jpeg"
                        alt=""
                      />
                    </span>
                    User name
                  </span>
                }
                id="collasible-nav-dropdown"
                className="ms-auto"
                children={undefined}
              ></NavDropdown>
            ) : user ? (
              <NavDropdown
                title={
                  <span className="user-info text-secondary">
                    <span className="avatar">
                      <img src={user.image} alt="" />
                    </span>
                    {userName}
                  </span>
                }
                id="collasible-nav-dropdown"
                className="ms-auto"
              >
                <Link className="dropdown-item" to="/demo-conduit/editor">
                  <FontAwesomeIcon icon={faPenToSquare} className="me-2" />
                  New Article
                </Link>
                <Link className="dropdown-item" to="/demo-conduit/settings">
                  <FontAwesomeIcon icon={faGear} className="me-2" />
                  Settings
                </Link>
                <Link
                  className="dropdown-item"
                  to={`/demo-conduit/profiles/@${user.username}`}
                >
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Profile
                </Link>

                <NavDropdown.Divider />

                <NavDropdown.Item onClick={handleLogout}>
                  <FontAwesomeIcon icon={faRightFromBracket} className="me-2" />
                  Log out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav className="ms-auto">
                <Link to="/">Home</Link>
                <Link
                  to=""
                  onClick={(e) => {
                    e.preventDefault();
                    showPopup(Popup.LOGIN);
                  }}
                >
                  Sign in
                </Link>
                <Link
                  to=""
                  onClick={(e) => {
                    e.preventDefault();
                    showPopup(Popup.REGISTER);
                  }}
                >
                  Sign Up
                </Link>
              </Nav>
            )}
          </Navbar>
        </Container>
      </Navbar>
      {show.open && <UserPopup />}
    </div>
  );
};

export default memo(Header);
