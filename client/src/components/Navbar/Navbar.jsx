import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import decode from "jwt-decode";

import { setCurrentUser } from "../../actions/currentUser";
import logo from "../../assets/logo-stackoverflow.png";
import search from "../../assets/search-solid.svg";
import Avatar from "../Avatar/Avatar";
import LeftSidebar from "../LeftSidebar/LeftSidebar";
import GoogleTranslate from "../Language/GoogleTranslate";

import "./Navbar.css";
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownLoaded, setDropdownLoaded] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  var User = useSelector((state) => state.currentUserReducer);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
    dispatch(setCurrentUser(null));
  };

  useEffect(() => {
    const token = User?.token;
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        handleLogout();
      }
    }

    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))));
  }, [dispatch]);

  return (
    <>
      <nav className="main-nav">
        <div className="navbar">
          {/* <div
            className={`toggleBtn ${isOpen ? "open" : ""}`}
            onClick={toggleSidebar}
          >
            <i className="fas fa-bars"></i>
          </div> */}
          <Link to="/" className=" nav-logo">
            <img src={logo} id="logo" alt="logo" />
          </Link>
          <Link to="/about" className="nav-item nav-btn">
            About
          </Link>

          <form>
            <input type="text" placeholder="Search..." className="search-bar" />
            <img src={search} alt="search" width="20" className="search-icon" />
          </form>
          <div className="language">
            <button onClick={() => window.location.reload()}>Language</button>
            <GoogleTranslate />
          </div>

          {User === null ? (
            <Link to="Auth" className="nav-item nav-links">
              Log in
            </Link>
          ) : (
            <>
              <Avatar
                backgroundColor="#009bff"
                px="10px"
                py="4px"
                borderRadius="50%"
                color="white"
                className="avatar"
              >
                <Link
                  to={`/Users/${User?.result?._id}`}
                  style={{ color: "white", textDecoration: "none" }}
                >
                  {User?.result?.name
                    ? User.result.name.charAt(0).toUpperCase()
                    : ""}
                </Link>
              </Avatar>

              <button className="nav-item nav-links " onClick={handleLogout}>
                Log Out
              </button>
              {/* <Link to={"user/auth-otp"}>
                <button className="nav-item nav-links ">Check Auth</button>
              </Link> */}
            </>
          )}
          <div
            className={`toggle-btn ${isOpen ? "open" : ""}`}
            onClick={toggleDropdown}
          >
            {isOpen ? (
              <i class="fa-solid fa-x"></i>
            ) : (
              <i className="fas fa-bars"></i>
            )}
          </div>
        </div>
        {/* dropdown menu */}
        <div className={`dropdown-menu ${isOpen ? "open" : ""}`}>
          <Link
            to="/about"
            className="nav-items nav-btns"
            onClick={closeDropdown}
          >
            About
          </Link>
          {User === null ? (
            <Link
              to="Auth"
              className="nav-items nav-links1"
              onClick={closeDropdown}
            >
              Log in
            </Link>
          ) : (
            <>
              {/* <Avatar
                backgroundColor="#009bff"
                px="1px"
                py="3px"
                borderRadius="5px"
                color="white"
                className="avatar"
              >
                <Link
                  to={`/Users/${User?.result?._id}`}
                  style={{ color: "white", textDecoration: "none" }}
                >
                  {User.result.name.charAt(0).toUpperCase()}
                </Link>
              </Avatar> */}

              <button
                className="nav-items nav-links1 "
                onClick={() => {
                  handleLogout();
                  closeDropdown();
                }}
              >
                Log Out
              </button>
              {/* <Link to={"user/auth-otp"}>
                <button className="nav-items nav-links1 ">Check Auth</button>
              </Link> */}
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
