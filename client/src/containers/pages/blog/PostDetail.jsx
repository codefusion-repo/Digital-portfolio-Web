import { connect } from "react-redux";
import Layout from "hocs/layouts/Layout";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { get_blog } from "redux/actions/blog/blog";
import moment from "moment";
import DOMPurify from "dompurify";
import { useMobile } from "context/mobile/mobileContext";

function PostDetail({ get_blog, post }) {
  const { device } = useMobile();

  const params = useParams();
  const slug = params.slug;

  useEffect(() => {
    window.scrollTo(0, 0);
    get_blog(slug);
  }, [get_blog, slug]);

  return (
    <Layout>
      <div className="flex box-xxl m-height-full navbar-m-s j-center four-bg padding-l-l padding-r-l">
        {post && post ? (
          <div
            className={`flex ${
              device > 2 ? "box-xxl-m" : "box-xxl"
            } column third-color`}
          >
            <div className="box-xxl f-height-ml second-border-b">
              <img src={`${post.thumbnail}`} alt="post img" />
            </div>
            <div
              className={`flex ${
                device > 2 ? "box-xxl-m" : "box-xxl"
              } margin-center column margin-t-m gap-xxs padding-l-s padding-r-s`}
            >
              <h2>{post.title}</h2>

              <Link to={`/category/${post.category.slug}`}>
                <h4>{post.category.name}</h4>
              </Link>
              <h4>{moment(post.published).format("LL")}</h4>
              <h4>{post.time_read} min read</h4>
              <h5>{post.description}</h5>
            </div>

            <div
              className={`flex ${
                device > 2 ? "box-xxl-m" : "box-xxl"
              } margin-center column margin-t-m gap-xxs padding-l-m padding-r-m`}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(post.content, {
                    ADD_TAGS: ["iframe"],
                    ADD_ATTR: [
                      "allow",
                      "allowfullscreen",
                      "frameborder",
                      "scrolling",
                      "src",
                    ],
                    ADD_URI_SAFE_ATTR: ["src"],
                    FORBID_TAGS: ["script"],
                  }),
                }}
              />
            </div>
          </div>
        ) : (
          <h3>Loading...</h3>
        )}
      </div>
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  post: state.blog.post,
});

export default connect(mapStateToProps, {
  get_blog,
})(PostDetail);
