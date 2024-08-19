import Layout from "hocs/layouts/Layout";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import { get_portfolio_list } from "redux/actions/portfolio/portfolio";
import { Link, useParams } from "react-router-dom";
import FiltersHeader from "components/portfolio/FiltersHeader";
import Pagination from "components/pagination/Pagination";

function Portfolio({ get_portfolio_list, portfolio_list }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    get_portfolio_list();
    // eslint-disable-next-line
  }, []);

  let params = useParams();
  const [currentPage, setCurrentPage] = useState(
    params.currentPage ? params.currentPage : 1
  );
  const itemsPerPage = 10;
  const [data, setData] = useState(portfolio_list);

  let startIndex = (currentPage - 1) * itemsPerPage;
  let endIndex = startIndex + itemsPerPage;
  let currentItems = data?.slice(startIndex, endIndex);

  useEffect(() => {
    setData(portfolio_list);
  }, [portfolio_list]);

  return (
    <Layout>
      <Helmet>
        <title>Name | Portafolio</title>
      </Helmet>
      <FiltersHeader setLoading={setLoading} />

      <section
        className="flex column box-xxl navbar-m-m four-bg z-index-xxs"
        id="portfolio"
      >
        <div className="flex gap-s margin-b-m">
          <h1 className="third-color">Our</h1>
          <h1 className="second-color">Projects</h1>
        </div>
        <div className="flex wrap box-xxl j-center third-color gap-m">
          {loading ? (
            <h2>Loading...</h2>
          ) : (
            <>
              {portfolio_list && portfolio_list.length > 0 ? (
                <>
                  {currentItems &&
                    currentItems.map((project) => (
                      <Link
                        to={`${project.slug}`}
                        key={project.id}
                        className="flex relative f-width-xl f-height-xl border-radius-xs hidden"
                      >
                        <img src={`${project.thumbnail}`} alt="logo" />
                        <div className="flex column box-xxl f-height-full a-center j-center absolute f-top f-left opacity-xs base-bg base-color padding-m gap-s">
                          <h3>{project.title}</h3>
                          <p>{project.description}</p>
                          <Link className="zoom-out-xs" to={`${project.slug}`}>
                            <h2>
                              <i className="bx bx-link-external"></i>
                            </h2>
                          </Link>
                        </div>
                      </Link>
                    ))}
                </>
              ) : (
                <h2 className="box-xxl padding-l-xs">No projects found</h2>
              )}
            </>
          )}

          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            data={data}
          />
        </div>
      </section>
    </Layout>
  );
}
const mapStateToProps = (state) => ({
  portfolio_list: state.portfolio.portfolio_list,
});
export default connect(mapStateToProps, {
  get_portfolio_list,
})(Portfolio);
