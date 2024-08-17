import { connect } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "assets/img/sampleBusinessImage.jpeg";
import { logout } from "redux/actions/auth/auth";
import { useState } from "react";
import { MdDashboardCustomize } from "react-icons/md";
import { useMobile } from "context/mobile/mobileContext";
import { FaBlogger } from "react-icons/fa";
import { FaFolderTree } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";

function Sidebar({ logout }) {
  const { device } = useMobile();
  const navigate = useNavigate();
  function handleLogout() {
    logout();
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  }

  const location = useLocation();

  const [open, setOpen] = useState(false);

  const handleSidebar = () => {
    const sidebar = document.getElementsByClassName("sidebar");

    if (open) {
      sidebar.removeAttribute("class", "open");
    } else {
      sidebar.addAttribute("class", "open");
    }
  };

  return (
    <nav
      className={`flex column a-center j-start ${
        device > 2 ? "f-width-l" : open ? "f-width-ml" : "f-width-s"
      } f-height-full fixed f-top f-bottom f-left third-bg base-color padding-l-s padding-r-s padding-t-l padding-b-l z-index-l gap-xxl`}
    >
      <NavLink
        to="/dashboard"
        className="flex column box-xxl f-height-m a-center gap-xs zoom-out-xs"
      >
        <img
          className="f-height-xs f-width-xs border-radius-xxs"
          src={logo}
          alt="logo img"
        />
        <h4>Digital portfolio admin</h4>
      </NavLink>

      {device < 3 && (
        <div
          // ref={headerbuttonRef}
          onClick={() => setOpen(!open)}
          className="flex box-xxl a-center j-center gap-xxs cursor-pointer cursor-pointer"
        >
          <button className="btn-small">
            {open ? (
              <div className="flex box-xxl a-center">
                <h2>
                  <i
                    className={`bx bx-x`}
                    //id="menu-icon"
                  ></i>
                </h2>

                <h3>Menú</h3>
              </div>
            ) : (
              <h2>
                <i
                  className={`bx bx-menu`}
                  //id="menu-icon"
                ></i>
              </h2>
            )}
          </button>
        </div>
      )}

      <div
        className={`flex column box-xxl ${
          device > 2 || open ? "a-start" : "a-center"
        } j-center gap-l`}
      >
        <NavLink
          to="/dashboard "
          className={`box-xxl a-center ${
            device > 2 ? "j-start" : open ? "j-start" : "j-center"
          } ${location.pathname === "/dashboard" ? "link active" : "link"}`}
        >
          <h2>
            <MdDashboardCustomize />
          </h2>
          {device > 2 || open ? "Dashboard" : ""}
        </NavLink>

        <NavLink
          to="/author_blog"
          className={`box-xxl a-center ${
            device > 2 ? "j-start" : open ? "j-start" : "j-center"
          } ${
            location.pathname.includes("/author_blog") ? "link active" : "link"
          }`}
        >
          <h2>
            <FaBlogger />
          </h2>
          {device > 2 || open ? "Blog" : ""}
        </NavLink>

        <NavLink
          to="/author_portfolio"
          className={`box-xxl a-center ${
            device > 2 ? "j-start" : open ? "j-start" : "j-center"
          } ${
            location.pathname.includes("/author_portfolio")
              ? "link active"
              : "link"
          }`}
        >
          <h2>
            <FaFolderTree />
          </h2>
          {device > 2 || open ? "Portafolio" : ""}
        </NavLink>
      </div>

      <div
        className={`flex column box-xxl ${
          device > 2 || open ? "a-start" : "a-center"
        } j-center gap-l`}
      >
        <NavLink
          className={`box-xxl a-center link-out ${
            device > 2 ? "j-start" : open ? "j-start" : "j-center"
          }`}
          onClick={() => handleLogout()}
        >
          <h2>
            <BiLogOut />
          </h2>
          {device > 2 || open ? "Log out" : ""}
        </NavLink>
      </div>
    </nav>
  );
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {
  logout,
})(Sidebar);
