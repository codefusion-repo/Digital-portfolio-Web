import CategoriesHeader from "components/blog/CategoriesHeader";
import PostBody from "components/blog/PostsBody";
import Layout from "hocs/layouts/Layout";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { get_search_blog, get_search_blog_page } from "redux/actions/blog/blog";
import { get_categories } from "redux/actions/categories/categories";

function Search({
  get_categories,
  get_search_blog,
  get_search_blog_page,
  categories,
  posts,
  count,
  next,
  previous,
}) {
  const params = useParams();
  const term = params.term;

  let currentPage = params.currentPage;

  if (currentPage) {
  } else {
    currentPage = 1;
  }
  useEffect(() => {
    window.scrollTo(0, 0);
    get_categories();
    get_search_blog(term);
    // get_search_blog_page(term, currentPage)
  }, [
    get_categories,
    get_search_blog,
    get_search_blog_page,
    term,
    currentPage,
  ]);
  return (
    <Layout>
      <Helmet>
        <title>Name | Search </title>
      </Helmet>

      <CategoriesHeader categories={categories && categories} />

      <section
        className="flex column relative a-start j-start navbar-m-m four-bg third-color"
        id="blog"
      >
        <div className="flex gap-s margin-b-xs">
          <h1>Posts</h1>
          <h1 className="second-color">Found</h1>
        </div>
        <div className="flex gap-s margin-b-m padding-l-xs">
          <h2>Search: </h2>
          <h2 className="second-color">{term}</h2>
        </div>

        <Link to="/blog" className="absolute f-right f-top btn-middle margin-m">
          <h2>exit</h2>
        </Link>

        <PostBody posts={posts && posts} />
      </section>
    </Layout>
  );
}
const mapStateToProps = (state) => ({
  categories: state.categories.categories,
  posts: state.blog.filtered_posts,
  count: state.blog.count,
  next: state.blog.next,
  previous: state.blog.previous,
});
export default connect(mapStateToProps, {
  get_categories,
  get_search_blog,
  get_search_blog_page,
})(Search);
