import { connect, useDispatch } from "react-redux";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  get_author_blog_list,
  get_author_blog_list_page,
} from "redux/actions/blog/blog";
import React, { useState } from "react";
import Sidebar from "components/navigation/Sidebar";
import moment from "moment";
import SmallSetPagination from "components/pagination/SmallSetPagination";
import axios from "axios";
import { ADD_DELETE_POST_MODAL } from "redux/actions/modal/types";
import AdminLayout from "hocs/layouts/AdminLayout";
import { FaRegTrashAlt, FaEdit, FaExternalLinkAlt } from "react-icons/fa";
import { useMobile } from "context/mobile/mobileContext";

function AuthorPostList({
  isAuthenticated,
  get_author_blog_list,
  get_author_blog_list_page,
  author_posts,
  count,
  next,
  previous,
}) {
  const { device } = useMobile();

  let params = useParams();
  let currentPage = params.currentPage;

  if (currentPage) {
  } else {
    currentPage = 1;
  }
  const dispatch = useDispatch();

  const handleDeleteOpenModal = (slug) => {
    dispatch({
      type: ADD_DELETE_POST_MODAL,
      payload: {
        showModal: true,
        message: `Estas seguro que quieres eliminar la publicación "${slug}"`,
        slug: slug,
        element: "post",
      },
    });
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);

    get_author_blog_list();
    //  get_author_blog_list_page(currentPage);
    // Selecciona el elemento .sidebar a
  }, [get_author_blog_list, get_author_blog_list_page, currentPage]);

  return (
    <AdminLayout>
      <div className="flex box-xxl column padding-ms gap-s">
        <h2>Blog posts</h2>
        <div className="flex column f-width-ml gap-xs">
          <a href="/create_post" className="btn-large">
            <h3>Create post</h3>
          </a>
        </div>
        {isAuthenticated ? (
          <div className="flex wrap box-xxl j-center third-color gap-m">
            {author_posts &&
              author_posts.map((post) => (
                <div
                  key={post.id}
                  className={`flex wrap relative f-width-xxxxl ${
                    device > 1 ? "f-height-l" : "f-height-xxl"
                  } third-bg border-radius-xs hidden`}
                >
                  <div
                    className={`${
                      device > 1 ? "box-s" : "box-xxl f-height-ml"
                    } hidden`}
                  >
                    <img
                      className="fit-cover zoom-in-xs"
                      src={`${process.env.REACT_APP_API_URL}/${post.thumbnail}`}
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
                        {post.title.length > 150
                          ? post.title.slice(0, 149)
                          : post.title}
                      </h2>
                      <h4 className="second-color">
                        {moment(post.published).format("LL")}
                      </h4>
                      <h4 className="second-color">
                        {post.time_read} min read
                      </h4>
                      <h5 className="base-color">
                        {post.description.length > 200
                          ? post.description.slice(0, 199) + "..."
                          : post.description}
                      </h5>
                    </div>

                    <div className="flex box-xxl gap-m a-end j-end">
                      <Link
                        className="zoom-out-xs"
                        onClick={() => handleDeleteOpenModal(post.slug)}
                      >
                        <h2>
                          <FaRegTrashAlt />
                        </h2>
                      </Link>
                      <Link
                        className="zoom-out-xs"
                        to={`/author_blog/${post.slug}`}
                      >
                        <h2>
                          <FaEdit />
                        </h2>
                      </Link>
                      <Link className="zoom-out-xs" to={`/blog/${post.slug}`}>
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
        <SmallSetPagination
          list_page={get_author_blog_list_page}
          list={author_posts}
          count={count}
        />
      </div>
    </AdminLayout>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  author_posts: state.blog.author_posts,
  count: state.blog.count,
  next: state.blog.next,
  previous: state.blog.previous,
});

export default connect(mapStateToProps, {
  get_author_blog_list,
  get_author_blog_list_page,
})(AuthorPostList);
