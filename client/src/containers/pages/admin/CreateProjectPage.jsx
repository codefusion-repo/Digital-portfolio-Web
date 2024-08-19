import React from "react";
import { connect } from "react-redux";
import AdminLayout from "hocs/layouts/AdminLayout";
import CreateProject from "./CreateProject";

function CreateProjectPage() {
  return (
    <AdminLayout>
      <div className="flex box-xxl column padding-s">
        <CreateProject />
      </div>
    </AdminLayout>
  );
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(CreateProjectPage);
