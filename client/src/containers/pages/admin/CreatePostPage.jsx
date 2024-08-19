import React from "react";
import { connect } from "react-redux";
import AdminLayout from "hocs/layouts/AdminLayout";
import CreatePost from "./CreatePost";

function CreatePostPage() {
  return (
    <AdminLayout>
      <div className="flex box-xxl column padding-s">
        <CreatePost />
      </div>
    </AdminLayout>
  );
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(CreatePostPage);
