import axios from "axios";
import React, { useEffect, useRef } from "react";
import { connect, useDispatch } from "react-redux";
import { get_author_blog_list } from "redux/actions/blog/blog";
import { get_author_portfolio_list } from "redux/actions/portfolio/portfolio";
import { ADD_MSJ_MODAL, REMOVE_MODAL } from "redux/actions/modal/types";

function Modal({
  showModal,
  message,
  slug,
  element,
  get_author_blog_list,
  get_author_portfolio_list,
}) {
  const dispatch = useDispatch();

  function handleOpenModal(msj) {
    dispatch({
      type: ADD_MSJ_MODAL,
      payload: {
        showModal: true,
        message: msj,
      },
    });
  }
  const handleCloseModal = () => {
    dispatch({
      type: REMOVE_MODAL,
    });
  };
  const handleConfirm = () => {
    if (slug !== null) {
      if (element !== null) {
        if (element === "project") {
          deleteProject(slug);
        }
        if (element === "post") {
          deletePost(slug);
        }
      }
    } else {
      dispatch({
        type: REMOVE_MODAL,
      });
    }
  };
  function deletePost(slug) {
    const config = {
      headers: {
        Accept: "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };

    const fetchDelete = async (slug) => {
      try {
        const res = await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/blog/delete/${slug}`,
          config
        );

        if (res.status === 200) {
          handleOpenModal(res.data.success);

          get_author_blog_list();
        } else {
          handleOpenModal("Error when deleting the post");
        }
      } catch (err) {
        handleOpenModal("Error when deleting the post");
      }
    };
    fetchDelete(slug);
  }

  function deleteProject(slug) {
    const config = {
      headers: {
        Accept: "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };

    const fetchDelete = async (slug) => {
      try {
        const res = await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/portfolio/delete/${slug}`,
          config
        );

        if (res.status === 200) {
          handleOpenModal(res.data.success);

          get_author_portfolio_list();
        } else {
          handleOpenModal("Error when deleting the project");
        }
      } catch (err) {
        handleOpenModal("Error when deleting the project");
      }
    };
    fetchDelete(slug);
  }

  const backgroundModalRef = useRef(null);
  const modalRef = useRef(null);

  const detectOutClick = (e) => {
    const target = e.target;
    if (
      backgroundModalRef.current &&
      backgroundModalRef.current.contains(target) &&
      modalRef.current &&
      !modalRef.current.contains(target)
    ) {
      handleCloseModal();
    }
  };

  useEffect(() => {
    document.addEventListener("click", (e) => detectOutClick(e));
    return () => {
      document.removeEventListener("click", (e) => detectOutClick(e));
    };
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {showModal && showModal ? (
        <div
          ref={backgroundModalRef}
          className="flex fixed f-top f-left box-xxl m-height-full solid-bg a-center j-center z-index-xl padding-l-l padding-r-l fade-in-xxs"
        >
          <div
            ref={modalRef}
            className="flex column f-width-xxxxl m-height-s a-center j-center third-bg padding-m gap-m border-radius-xxs"
          >
            {message && message ? <h4>{message}</h4> : <h4>Cargando...</h4>}

            {slug != null ? (
              <div className="flex gap-xxxl">
                <button
                  className="btn-small"
                  onClick={() => handleCloseModal()}
                >
                  <h3>No</h3>
                </button>
                <button className="btn-small" onClick={() => handleConfirm()}>
                  <h3>Yes</h3>
                </button>
              </div>
            ) : (
              <button className="btn-small" onClick={() => handleConfirm()}>
                <h3>Ok</h3>
              </button>
            )}

            <div className="absolute f-top f-right margin-ml">
              <button
                className="btn-small base-color"
                onClick={() => handleCloseModal()}
              >
                <h1>
                  <i className="bx bx-x"></i>
                </h1>
                <h2>Close</h2>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
const mapStateToProps = (state) => ({
  showModal: state.modal.showModal,
  message: state.modal.message,
  slug: state.modal.slug,
  element: state.modal.element,
});
export default connect(mapStateToProps, {
  get_author_blog_list,
  get_author_portfolio_list,
})(Modal);
