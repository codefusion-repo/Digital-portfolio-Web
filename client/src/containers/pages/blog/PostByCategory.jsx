import Layout from "hocs/layouts/Layout";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { get_categories } from "redux/actions/categories/categories";
import { get_blog_list_by_category } from "redux/actions/blog/blog";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import CategoriesHeader from "components/blog/CategoriesHeader";
import PostBody from "components/blog/PostsBody";

function PostByCategory({
  get_categories,
  get_blog_list_by_category,
  categories,
  posts,
}) {
  const params = useParams();
  const slug = params.slug;
  const slug_ = slug.replace(/-/g, " ");
  const slug__ = slug_.charAt(0).toUpperCase() + slug_.slice(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    get_categories();
    get_blog_list_by_category(slug);
  }, [get_categories, get_blog_list_by_category, slug]);
  return (
    <Layout>
      <Helmet>
        <title>Name | Category: {slug__} </title>
      </Helmet>

      <CategoriesHeader categories={categories && categories} />

      <section
        className="flex column a-start j-start navbar-m-m four-bg third-color"
        id="blog"
      >
        <div className="flex gap-s margin-b-m">
          <h1>{slug__}</h1>
          <h1 className="second-color">Posts</h1>
        </div>
        <PostBody posts={posts && posts} />
      </section>
    </Layout>
  );
}
const mapStateToProps = (state) => ({
  categories: state.categories.categories,
  posts: state.blog.blog_list_by_category,
});
export default connect(mapStateToProps, {
  get_categories,
  get_blog_list_by_category,
})(PostByCategory);
