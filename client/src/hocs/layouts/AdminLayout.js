import { connect } from "react-redux";
import { motion } from "framer-motion";
import { useEffect } from "react";
import {
  check_authenticated,
  load_user,
  refresh,
} from "redux/actions/auth/auth";
import Modal from "components/Modal";
import { useMobile } from "context/mobile/mobileContext";
import Sidebar from "components/navigation/Sidebar";

function AdminLayout({
  children,
  check_authenticated,
  refresh,
  load_user,
  user_loading,
  isAuthenticated,
  user,
}) {
  const { device } = useMobile();

  useEffect(() => {
    isAuthenticated ? (
      <></>
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

      {isAuthenticated && isAuthenticated ? (
        <div
          className={`flex column f-height-full ${
            device > 2 ? "sidebar-p-m" : "sidebar-p-s"
          } a-center j-center four-bg gap-s third-color padding-s`}
        >
          <Sidebar />

          {children}
        </div>
      ) : (
        <section className="flex column a-center j-center four-bg gap-s third-color">
          <h1>No authenticated</h1>
          <a className="btn-middle" href="/">
            <h3>Go home</h3>
          </a>
        </section>
      )}

      <Modal />
    </motion.div>
  );
}

const mapStateToProps = (state) => ({
  user_loading: state.auth.user_loading,
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  check_authenticated,
  refresh,
  load_user,
})(AdminLayout);
