import { connect } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useMobile } from "context/mobile/mobileContext";
import logo from "assets/img/sampleBusinessImage.jpeg";

function Navbar() {
  /*window.onscroll = function() {scrollfunction()}
    function scrollfunction() {
        if(document.getElementById('header')){
            if(document.body.scrollTop > 50 || document.documentElement.scrollTop > 50){
                document.getElementById('header').classList.add('navbar-shadow')
            }else{
                document.getElementById('header').classList.remove('navbar-shadow');
                
            }
        }
    }*/
  const { device } = useMobile();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const headerBoxRef = useRef(null);
  const headerbuttonRef = useRef(null);

  const detectOutClick = (e) => {
    // Asegúrate de que el evento es del tipo MouseEvent
    const target = e.target;

    if (
      headerBoxRef.current &&
      !headerBoxRef.current.contains(target) &&
      headerbuttonRef.current &&
      !headerbuttonRef.current.contains(target)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", detectOutClick);
    return () => {
      document.removeEventListener("click", detectOutClick);
    };
  }, []);
  return (
    // header section design
    <header
      id="header"
      className="flex relative box-xxl f-height-s fixed f-left f-top a-center j-center base-border-b padding-l-m padding-r-m third-bg z-index-l"
    >
      <NavLink
        to="/home"
        className="flex box-xs f-height-full gap-s zoom-out-xxs a-center j-start t-start cursor-pointer"
      >
        <img
          src={logo}
          className="fit-cover f-width-xs f-height-xs"
          alt="logo"
        />
        <h3>Example name</h3>
      </NavLink>

      {device < 2 && (
        <>
          <div
            ref={headerbuttonRef}
            onClick={() => setOpen(!open)}
            className="flex box-xxl a-center j-end gap-xxs cursor-pointer cursor-pointer"
          >
            <h2>Menú</h2>
            <h1>
              {open ? (
                <i
                  className={`bx bx-x`}
                  //id="menu-icon"
                ></i>
              ) : (
                <i
                  className={`bx bx-menu`}
                  //id="menu-icon"
                ></i>
              )}
            </h1>
          </div>
          {open && (
            <nav
              ref={headerBoxRef}
              className="flex absolute f-top f-left box-xxl column a-center j-end base-border-b gap-xl navbar-m-s padding-m third-bg"
            >
              <NavLink
                to="/home"
                className={`${
                  location.pathname.includes("/home") ? "link active" : "link"
                }`}
              >
                Home
              </NavLink>
              <NavLink
                to="/services"
                className={`${
                  location.pathname.includes("/services")
                    ? "link active"
                    : "link"
                }`}
              >
                Services
              </NavLink>
              <NavLink
                to="/portfolio"
                className={`${
                  location.pathname.includes("/portfolio")
                    ? "link active"
                    : "link"
                }`}
              >
                Portfolio
              </NavLink>
              <NavLink
                to="/about"
                className={`${
                  location.pathname.includes("/about") ? "link active" : "link"
                }`}
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                className={`${
                  location.pathname.includes("/contact")
                    ? "link active"
                    : "link"
                }`}
              >
                Contact
              </NavLink>
              <NavLink
                to="/blog"
                className={`${
                  location.pathname.includes("/blog") ? "link active" : "link"
                }`}
              >
                Blog
              </NavLink>
            </nav>
          )}
        </>
      )}
      {device > 1 && (
        <nav className="flex box-xxl f-height-full a-center j-end gap-xl">
          <NavLink
            to="/home"
            className={`${
              location.pathname.includes("/home") ? "link active" : "link"
            }`}
          >
            Home
          </NavLink>
          <NavLink
            to="/services"
            className={`${
              location.pathname.includes("/services") ? "link active" : "link"
            }`}
          >
            Services
          </NavLink>
          <NavLink
            to="/portfolio"
            className={`${
              location.pathname.includes("/portfolio") ? "link active" : "link"
            }`}
          >
            Portfolio
          </NavLink>
          <NavLink
            to="/about"
            className={`${
              location.pathname.includes("/about") ? "link active" : "link"
            }`}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={`${
              location.pathname.includes("/contact") ? "link active" : "link"
            }`}
          >
            Contact
          </NavLink>
          <NavLink
            to="/blog"
            className={`${
              location.pathname.includes("/blog") ? "link active" : "link"
            }`}
          >
            Blog
          </NavLink>
        </nav>
      )}
    </header>
  );
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(Navbar);
