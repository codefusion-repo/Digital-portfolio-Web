import axios from "axios";
import React from "react";
import Sidebar from "components/navigation/Sidebar";
import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { get_categories } from "redux/actions/categories/categories";
import slugify from "slugify";
import { ADD_MSJ_MODAL } from "redux/actions/modal/types";
import AdminLayout from "hocs/layouts/AdminLayout";
import { useMobile } from "context/mobile/mobileContext";
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
