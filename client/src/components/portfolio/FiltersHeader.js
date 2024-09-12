import { useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  GET_PORTFOLIO_FILTER_FAIL,
  GET_PORTFOLIO_FILTER_SUCCESS,
} from "redux/actions/portfolio/types";
import { useMobile } from "context/mobile/mobileContext";

function FiltersHeader({ setLoading, projects }) {
  const { device } = useMobile();

  const [formData, setFormData] = useState({
    category: "all",
    status: "all",
    search: "",
  });

  const { category, status, search } = formData;

  const dispatch = useDispatch();

  const onSubmit = (e) => {
    setLoading(true);

    let data = null;

    if (e.target.name === "category") {
      setFormData({ ...formData, category: e.target.value });
      data = {
        category: e.target.value,
        status: status,
        search: search,
      };
    }
    if (e.target.name === "status") {
      setFormData({ ...formData, status: e.target.value });
      data = {
        category: category,
        status: e.target.value,
        search: search,
      };
    }
    if (e.target.name === "search") {
      setFormData({ ...formData, search: e.target.value });
      data = {
        category: category,
        status: status,
        search: e.target.value,
      };
    }

    console.log("c: ", data.category);
    console.log("s: ", data.status);
    console.log("s: ", data.search);

    if (!projects) {
      dispatch({
        type: GET_PORTFOLIO_FILTER_FAIL,
        payload: [],
      });
      setLoading(false);
      return;
    }

    const fetchFilterData = async () => {
      let res = undefined;

      if (data.category === "all" && data.status === "all") {
        res = projects;
      } else if (data.category !== "all" && data.status !== "all") {
        res = projects.filter(
          (p) => p.category === data.category && p.status === data.status
        );
      } else if (data.category !== "all" && data.status === "all") {
        res = projects.filter((p) => p.category === data.category);
      } else if (data.category === "all" && data.status !== "all") {
        res = projects.filter((p) => p.status === data.status);
      }

      if (data.search.length > 0) {
        res = res.filter((p) =>
          p.title.toLowerCase().includes(data.search.toLowerCase())
        );
      }

      console.log("Filtered Projects: ", res);

      dispatch({
        type: GET_PORTFOLIO_FILTER_SUCCESS,
        payload: res,
      });

      setLoading(false);
    };
    fetchFilterData();
  };

  return (
    <header className="flex box-xxl f-height-s fixed f-left f-top a-center j-center base-border-b padding-l-m padding-r-m navbar-m-s third-bg z-index-m">
      <form
        action="#"
        className="flex box-xxl f-height-full a-center j-space gap-m"
        encType="multipart/form-data"
      >
        <div className="flex gap-m">
          <div className={`flex ${device > 1 ? "" : "box-m"} column`}>
            <h4>Filter by category</h4>

            <select
              className={`${device > 1 ? "select-small" : "select-large"}`}
              onChange={(e) => onSubmit(e)}
              type="select"
              id="category"
              name="category"
              defaultValue="all"
            >
              <option value="all">All</option>
              <option value="sp-1">Sample category 1</option>
              <option value="sp-2">Sample category 2</option>
              <option value="sp-3">Sample category 3</option>
              <option value="sp-4">Sample category 4</option>
            </select>
          </div>

          <div className={`flex ${device > 1 ? "" : "box-m"} column`}>
            <h4>Filter by state</h4>
            <select
              className={`${device > 1 ? "select-small" : "select-large"}`}
              onChange={(e) => onSubmit(e)}
              type="select"
              id="status"
              name="status"
              defaultValue="all"
            >
              <option value="all">All</option>
              <option value="pre_production">Pre-production</option>
              <option value="production">Production</option>
              <option value="constant_updates">Updating</option>
              <option value="finished">Finished</option>
            </select>
          </div>
        </div>

        <div
          className={`flex ${
            device > 1 ? "" : "box-m"
          } gap-xs a-center j-center`}
        >
          <input
            className="input-middle"
            onChange={(e) => onSubmit(e)}
            value={search}
            id="search"
            name="search"
            type="search"
            placeholder="Search..."
          />
          <button className="btn-small base-color">
            <h2>
              <i className="bx bx-search"></i>
            </h2>
          </button>
        </div>
      </form>
    </header>
  );
}
const mapStateToProps = (state) => ({
  projects: state.portfolio.projects,
});
export default connect(mapStateToProps, {})(FiltersHeader);
