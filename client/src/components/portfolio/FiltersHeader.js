import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  GET_PORTFOLIO_LIST_FAIL,
  GET_PORTFOLIO_LIST_SUCCESS,
} from "redux/actions/portfolio/types";
import { useMobile } from "context/mobile/mobileContext";

function FiltersHeader({ setLoading }) {
  const { device } = useMobile();

  const [formData, setFormData] = useState({
    category: "all",
    status: "all",
  });
  const { category, status } = formData;

  const dispatch = useDispatch();

  const onSubmit = (e) => {
    setLoading(true);

    let data = null;

    if (e.target.name === "category") {
      setFormData({ ...formData, category: e.target.value });
      data = {
        category: e.target.value,
        status: status,
      };
    }
    if (e.target.name === "status") {
      setFormData({ ...formData, status: e.target.value });
      data = {
        category: category,
        status: e.target.value,
      };
    }
    const fetchFilterData = async () => {
      const config = {
        headers: {
          Accept: "application/json",
        },
      };

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/portfolio/filter`,
          data,
          config
        );

        if (res.status === 200) {
          setLoading(false);
          dispatch({
            type: GET_PORTFOLIO_LIST_SUCCESS,
            payload: res.data,
          });
        } else {
          setLoading(false);
          dispatch({
            type: GET_PORTFOLIO_LIST_FAIL,
          });
        }
      } catch (err) {
        setLoading(false);
        dispatch({
          type: GET_PORTFOLIO_LIST_FAIL,
        });
      }
    };
    fetchFilterData();
  };

  return (
    <header className="flex box-xxl f-height-s fixed f-left f-top a-center j-center base-border-b padding-l-m padding-r-m navbar-m-s third-bg z-index-m">
      <form
        action="#"
        className="flex box-xxl f-height-full a-center gap-m"
        encType="multipart/form-data"
      >
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
      </form>
    </header>
  );
}

export default FiltersHeader;
