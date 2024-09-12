import { useEffect, useRef, useState } from "react";
import { useMobile } from "context/mobile/mobileContext";

function CategoriesHeader({ category, search, categories, onSubmit }) {
  const { device } = useMobile();

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
              <button
                onClick={() => onSubmit("category", "all")}
                className={`${category === "all" ? "link active" : "link"}`}
              >
                All
              </button>
              {categories &&
                categories.map((c) => (
                  <button
                    onClick={() => onSubmit("category", c.slug)}
                    key={c.id}
                    className={`${
                      category === c.slug ? "link active" : "link"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
            </nav>
          )}
        </>
      )}
      {device > 2 && (
        <nav className="flex box-xxl f-height-full a-center j-start gap-xl">
          <button
            onClick={() => onSubmit("category", "all")}
            className={`${category === "all" ? "link active" : "link"}`}
          >
            All
          </button>

          {categories &&
            categories.map((c) => (
              <button
                onClick={() => onSubmit("category", c.slug)}
                key={c.id}
                className={`${category === c.slug ? "link active" : "link"}`}
              >
                {c.name}
              </button>
            ))}
        </nav>
      )}

      <div className="flex box-s a-end j-center gap-xxs column">
        <form className="flex gap-xs" id="search-form">
          <input
            className="input-middle"
            onChange={(e) => onSubmit("search", e.target.value)}
            value={search}
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
        {/* <h5 className="padding-l-xxs">{error}</h5>*/}
      </div>
    </header>
  );
}

export default CategoriesHeader;
