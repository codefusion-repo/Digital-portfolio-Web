import { connect } from "react-redux";
import Navbar from "components/navigation/Navbar";
import Footer from "components/navigation/Footer";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { get_portfolio_list } from "redux/actions/portfolio/portfolio";
import { get_categories } from "redux/actions/categories/categories";
import { get_blog_list } from "redux/actions/blog/blog";
import {
  check_authenticated,
  load_user,
  refresh,
} from "redux/actions/auth/auth";
import Modal from "components/Modal";

function Layout({
  children,

  projects,
  get_portfolio_list,

  categories,
  get_categories,

  blog_list,
  get_blog_list,

  check_authenticated,
  refresh,
  load_user,
  user_loading,
  isAuthenticated,
  user,
}) {
  useEffect(() => {
    window.scrollTo(0, 0);

    if (!projects) {
      get_portfolio_list();
    }
    // eslint-disable-next-line
  }, [projects]);

  useEffect(() => {
    if (!categories) {
      get_categories();
    }
    // eslint-disable-next-line
  }, [categories]);

  useEffect(() => {
    if (!blog_list) {
      get_blog_list();
    }
    // eslint-disable-next-line
  }, [blog_list]);

  useEffect(() => {
    isAuthenticated ? (
      <>{}</>
    ) : (
      <>
        {check_authenticated()}
        {refresh()}
        {load_user()}
      </>
    );
  }, [isAuthenticated, check_authenticated, refresh, load_user]);
  return (
    <motion.div
      initial={{ opacity: 0, transition: { duration: 0.1 } }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
    >
      <link
        href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
        rel="stylesheet"
      ></link>
      <Navbar />

      {children}

      <Modal />

      <Footer />
    </motion.div>
  );
}

const mapStateToProps = (state) => ({
  projects: state.portfolio.projects,
  categories: state.categories.categories,
  blog_list: state.blog.blog_list,

  user_loading: state.auth.user_loading,
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  get_portfolio_list,
  get_categories,
  get_blog_list,
  check_authenticated,
  refresh,
  load_user,
})(Layout);
