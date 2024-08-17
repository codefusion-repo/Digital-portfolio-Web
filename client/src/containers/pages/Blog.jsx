import Layout from "hocs/layouts/Layout";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { get_categories } from "redux/actions/categories/categories";
import { get_blog_list, get_blog_list_page } from "redux/actions/blog/blog";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import CategoriesHeader from "components/blog/CategoriesHeader";
import PostBody from "components/blog/PostsBody";

function Blog({
  get_categories,
  get_blog_list,
  get_blog_list_page,
  categories,
  posts,
  count,
  next,
  previous,
}) {
  let params = useParams();
  let currentPage = params.currentPage;

  if (currentPage) {
  } else {
    currentPage = 1;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    get_categories();
    get_blog_list();
    // get_blog_list_page(currentPage);
  }, [get_categories, get_blog_list, get_blog_list_page, currentPage]);

  return (
    <Layout>
      <Helmet>
        <title>Name | Blog</title>
      </Helmet>

      <CategoriesHeader categories={categories && categories} />

      <section
        className="flex column a-start j-start navbar-m-m four-bg third-color"
        id="blog"
      >
        <div className="flex gap-s margin-b-m">
          <h1>All</h1>
          <h1 className="second-color">Posts</h1>
        </div>

        <PostBody posts={posts && posts} />
      </section>
    </Layout>
  );
}
const mapStateToProps = (state) => ({
  categories: state.categories.categories,
  posts: state.blog.blog_list,
  count: state.blog.count,
  next: state.blog.next,
  previous: state.blog.previous,
});
export default connect(mapStateToProps, {
  get_categories,
  get_blog_list,
  get_blog_list_page,
})(Blog);
