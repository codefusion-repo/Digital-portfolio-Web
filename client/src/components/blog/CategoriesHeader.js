import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useMobile } from "context/mobile/mobileContext";

function CategoriesHeader({ categories }) {
  const { device } = useMobile();
  const location = useLocation();
  const navigate = useNavigate();

  const [term, setTerm] = useState("");
  const handleChange = (e) => {
    setTerm(e.target.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (term.length >= 1) {
      setTimeout(() => navigate("/search/" + term), 0.2);
      setTerm("");
    } else {
      displayError();
    }
  };

  function displayError() {
    let error = "Debes ingresar al menos 1 carácter.";
    let e = document.getElementById("error");

    e.textContent = error;
    console.log("error");
  }

  const [open, setOpen] = useState(false);

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
    <header className="flex box-xxl f-height-s fixed f-left f-top gap-m a-center j-center base-border-b padding-l-m padding-r-m navbar-m-s third-bg z-index-m">
      {device < 3 && (
        <>
          <div
            ref={headerbuttonRef}
            onClick={() => setOpen(!open)}
            className="flex box-xxl a-center j-start gap-xxs cursor-pointer"
          >
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
            <h2>Categories</h2>
          </div>

          {open && (
            <nav
              ref={headerBoxRef}
              className="flex absolute f-top f-left box-xxl column a-center j-start base-border-b gap-xl navbar-m-s padding-m third-bg"
            >
              <NavLink
                to="/blog"
                className={`${
                  location.pathname.includes("/blog") ? "link active" : "link"
                }`}
              >
                All
              </NavLink>
              {categories &&
                categories.map((category) => (
                  <NavLink
                    to={`/category/${category.slug}`}
                    key={category.id}
                    className={`${
                      location.pathname === `category/${category.slug}`
                        ? "link active"
                        : "link"
                    }`}
                  >
                    {category.name}
                  </NavLink>
                ))}
            </nav>
          )}
        </>
      )}
      {device > 2 && (
        <nav className="flex box-xxl f-height-full a-center j-start gap-xl">
          <NavLink
            to="/blog"
            className={`${
              location.pathname.includes("/blog") ? "link active" : "link"
            }`}
          >
            All
          </NavLink>

          {categories &&
            categories.map((category) => (
              <NavLink
                to={`/category/${category.slug}`}
                key={category.id}
                className={`${
                  location.pathname === `category/${category.slug}`
                    ? "link active"
                    : "link"
                }`}
              >
                {category.name}
              </NavLink>
            ))}
        </nav>
      )}

      <div className="flex box-s a-end j-center gap-xxs column">
        <form
          className="flex gap-xs"
          id="search-form"
          onSubmit={(e) => onSubmit(e)}
        >
          <input
            className="input-middle"
            onChange={(e) => handleChange(e)}
            value={term}
            id="search"
            name="search"
            type="search"
            placeholder="Search..."
          />
          <button className="btn-small base-color" form="search-form">
            <h2>
              <i className="bx bx-search"></i>
            </h2>
          </button>
        </form>
        <h5 className="padding-l-xxs" id="error"></h5>
      </div>
    </header>
  );
}

export default CategoriesHeader;
