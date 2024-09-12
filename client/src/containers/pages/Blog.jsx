import Layout from "hocs/layouts/Layout";
import { Helmet } from "react-helmet-async";
import { connect, useDispatch } from "react-redux";
import CategoriesHeader from "components/blog/CategoriesHeader";
import PostBody from "components/blog/PostsBody";

import {
  GET_BLOG_FILTER_FAIL,
  GET_BLOG_FILTER_SUCCESS,
} from "redux/actions/blog/types";
import { useState } from "react";

function Blog({ categories, blog_list, posts }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    category: "all",
    search: "",
  });

  const { category, search } = formData;

  const dispatch = useDispatch();

  const onSubmit = (name, value) => {
    setLoading(true);

    let data = null;

    if (name === "category") {
      setFormData({ ...formData, category: value });
      data = {
        category: value,
        search: search,
      };
    }

    if (name === "search") {
      setFormData({ ...formData, search: value });
      data = {
        category: category,
        search: value,
      };
    }

    console.log("c: ", data.category);
    console.log("s: ", data.search);

    if (!posts) {
      dispatch({
        type: GET_BLOG_FILTER_FAIL,
        payload: [],
      });
      setLoading(false);
      return;
    }

    const fetchFilterData = async () => {
      let res = undefined;

      if (data.category === "all") {
        res = posts;
      } else if (data.category !== "all") {
        res = posts.filter((p) => p.category.slug === data.category);
      }

      if (data.search.length > 0) {
        res = res.filter((p) =>
          p.title.toLowerCase().includes(data.search.toLowerCase())
        );
      }
      dispatch({
        type: GET_BLOG_FILTER_SUCCESS,
        payload: res,
      });

      setLoading(false);
      console.log("Filtered Posts: ", res);
    };

    fetchFilterData();
  };

  return (
    <Layout>
      <Helmet>
        <title>Name | Blog</title>
      </Helmet>

      <CategoriesHeader
        category={category}
        search={search}
        categories={categories && categories}
        onSubmit={onSubmit}
      />

      <section
        className="flex column a-start j-start navbar-m-m four-bg third-color"
        id="blog"
      >
        <div className="flex gap-s margin-b-m">
          <h1>All</h1>
          <h1 className="second-color">Posts</h1>
        </div>

        <PostBody loading={loading} blog_list={blog_list} />
      </section>
    </Layout>
  );
}
const mapStateToProps = (state) => ({
  categories: state.categories.categories,
  blog_list: state.blog.blog_list,
  posts: state.blog.posts,
});
export default connect(mapStateToProps, {})(Blog);
