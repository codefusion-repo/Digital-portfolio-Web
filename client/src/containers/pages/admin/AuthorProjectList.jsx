import { connect, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { get_author_portfolio_list } from "redux/actions/portfolio/portfolio";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { ADD_DELETE_POST_MODAL } from "redux/actions/modal/types";
import AdminLayout from "hocs/layouts/AdminLayout";
import { useMobile } from "context/mobile/mobileContext";
import { FaRegTrashAlt, FaEdit, FaExternalLinkAlt } from "react-icons/fa";
import Pagination from "components/pagination/Pagination";

function AuthorProjectList({
  isAuthenticated,
  get_author_portfolio_list,
  author_projects,
}) {
  const { device } = useMobile();

  const dispatch = useDispatch();

  const handleDeleteOpenModal = (slug) => {
    dispatch({
      type: ADD_DELETE_POST_MODAL,
      payload: {
        showModal: true,
        message: `Are you sure you want to delete the project "${slug}"`,
        slug: slug,
        element: "project",
      },
    });
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);

    get_author_portfolio_list();
  }, [get_author_portfolio_list]);

  let params = useParams();
  const [currentPage, setCurrentPage] = useState(
    params.currentPage ? params.currentPage : 1
  );
  const itemsPerPage = 10;
  const [data, setData] = useState(author_projects);

  let startIndex = (currentPage - 1) * itemsPerPage;
  let endIndex = startIndex + itemsPerPage;
  let currentItems = data?.slice(startIndex, endIndex);

  useEffect(() => {
    setData(author_projects);
  }, [author_projects]);

  return (
    <AdminLayout>
      <div className="flex box-xxl column padding-ms gap-s">
        <h2>Portfolio projects</h2>
        <div className="flex column f-width-ml gap-xs">
          <a href="/create_project" className="btn-large">
            <h3>Create project</h3>
          </a>
        </div>

        {isAuthenticated ? (
          <div className="flex wrap box-xxl j-center third-color gap-m">
            {currentItems &&
              currentItems.map((project) => (
                <div
                  key={project.id}
                  className={`flex wrap relative f-width-xxxxl ${
                    device > 1 ? "f-height-l" : "f-height-xxl"
                  } third-bg border-radius-xs hidden`}
                >
                  <div
                    to={`/blog/${project.slug}`}
                    className={`${
                      device > 1 ? "box-s" : "box-xxl f-height-ml"
                    } hidden`}
                  >
                    <img
                      className="fit-cover zoom-in-xs"
                      src={`${project.thumbnail}`}
                      alt="post img"
                    />
                  </div>

                  <div
                    className={`flex column ${
                      device > 1 ? "box-l" : "box-xxl"
                    } padding-ms j-space`}
                  >
                    <div>
                      <h2 className="second-color">
                        {project.title.length > 150
                          ? project.title.slice(0, 149)
                          : project.title}
                      </h2>
                      {project.status === "drafted" ? (
                        <h4 className="second-color">Draft</h4>
                      ) : project.status === "pre_production" ? (
                        <h4 className="second-color">Pre-production</h4>
                      ) : project.status === "production" ? (
                        <h4 className="second-color">Production</h4>
                      ) : project.status === "constant_updates" ? (
                        <h4 className="second-color">Updating</h4>
                      ) : project.status === "finished" ? (
                        <h4 className="second-color">Finished</h4>
                      ) : (
                        <h4 className="second-color">Undefined</h4>
                      )}

                      <h4 className="second-color">{project.category}</h4>
                      <h4 className="second-color">
                        {moment(project.published).format("LL")}
                      </h4>

                      <h5 className="base-color">
                        {project.description.length > 200
                          ? project.description.slice(0, 199) + "..."
                          : project.description}
                      </h5>
                    </div>

                    <div className="flex box-xxl gap-m a-end j-end">
                      <Link
                        className="zoom-out-xs"
                        onClick={() => handleDeleteOpenModal(project.slug)}
                      >
                        <h2>
                          <FaRegTrashAlt />
                        </h2>
                      </Link>
                      <Link
                        className="zoom-out-xs"
                        to={`/author_portfolio/${project.slug}`}
                      >
                        <h2>
                          <FaEdit />
                        </h2>
                      </Link>
                      <Link
                        className="zoom-out-xs"
                        to={`/portfolio/${project.slug}`}
                      >
                        <h2>
                          <FaExternalLinkAlt />
                        </h2>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <>
            <h3>Loading</h3>
          </>
        )}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          data={data}
        />
      </div>
    </AdminLayout>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  author_projects: state.portfolio.author_projects,
});

export default connect(mapStateToProps, {
  get_author_portfolio_list,
})(AuthorProjectList);
