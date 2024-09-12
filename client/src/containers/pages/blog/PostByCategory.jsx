import Layout from "hocs/layouts/Layout";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { get_categories } from "redux/actions/categories/categories";
import { get_blog_list_by_category } from "redux/actions/blog/blog";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import CategoriesHeader from "components/blog/CategoriesHeader";
import PostBody from "components/blog/PostsBody";

function PostByCategory({ categories, blog_list }) {
  const [posts, setPosts] = useState(undefined);
  const params = useParams();
  const slug = params.slug;
  const slug_ = slug.replace(/-/g, " ");
  const slug__ = slug_.charAt(0).toUpperCase() + slug_.slice(1);

  useEffect(() => {
    if (blog_list && !posts && slug) {
      setPosts(blog_list.filter((p) => p.category.slug === slug));
    }
  }, [blog_list, posts, slug]);

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
  blog_list: state.blog.blog_list,
});
export default connect(mapStateToProps, {})(PostByCategory);
