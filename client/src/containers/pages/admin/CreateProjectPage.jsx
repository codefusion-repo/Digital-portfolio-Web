import axios from "axios";
import React from "react";
import Sidebar from "components/navigation/Sidebar";
import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import slugify from "slugify";
import { ADD_MSJ_MODAL } from "redux/actions/modal/types";
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
