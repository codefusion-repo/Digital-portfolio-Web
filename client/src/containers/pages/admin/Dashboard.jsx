import Sidebar from "components/navigation/Sidebar";
import AdminLayout from "hocs/layouts/AdminLayout";

import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import CreatePost from "./CreatePost";
import CreateProject from "./CreateProject";
import { useMobile } from "context/mobile/mobileContext";
import { useState } from "react";

function Dashboard({ isAuthenticated }) {
  const { device } = useMobile();

  return (
    <AdminLayout>
      <Helmet>
        <title>Name | Dashboard</title>
      </Helmet>

      <div className="flex box-xxl wrap padding-s">
        <div className={`"flex column ${device > 2 ? "box-m" : "box-xxl"}`}>
          <CreatePost />
        </div>
        <div className={`"flex column ${device > 2 ? "box-m" : "box-xxl"}`}>
          <CreateProject />
        </div>
      </div>
    </AdminLayout>
  );
}
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, {})(Dashboard);
