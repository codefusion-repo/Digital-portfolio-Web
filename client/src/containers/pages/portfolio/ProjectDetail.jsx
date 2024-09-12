import { connect } from "react-redux";
import Layout from "hocs/layouts/Layout";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import DOMPurify from "dompurify";
import { useMobile } from "context/mobile/mobileContext";

function ProjectDetail({ projects }) {
  const { device } = useMobile();
  const [project, setProject] = useState(undefined);

  const params = useParams();
  const slug = params.slug;

  useEffect(() => {
    if (projects && !project && slug) {
      setProject(projects.find((p) => p.slug === slug));
    }
  }, [projects, project, slug]);

  return (
    <Layout>
      <div className="flex box-xxl m-height-full navbar-m-s j-center four-bg padding-l-l padding-r-l">
        {project && project ? (
          <div
            className={`flex ${
              device > 2 ? "box-xxl-m" : "box-xxl"
            } column third-color`}
          >
            <div className="box-xxl f-height-ml second-border-b">
              <img src={`${project.thumbnail}`} alt="post img" />
            </div>

            <div
              className={`flex ${
                device > 2 ? "box-xxl-m" : "box-xxl"
              } margin-center column margin-t-m gap-xxs padding-l-s padding-r-s`}
            >
              <h2>{project.title}</h2>
              <h4>
                {project.category.charAt(0).toUpperCase() +
                  project.category.slice(1)}
              </h4>
              <h4>{moment(project.published).format("LL")}</h4>
              <h5>{project.description}</h5>
            </div>

            <div
              className={`flex ${
                device > 2 ? "box-xxl-m" : "box-xxl"
              } margin-center column margin-t-m gap-xxs padding-l-m padding-r-m`}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(project.content, {
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
              />{" "}
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
  projects: state.portfolio.projects,
});

export default connect(mapStateToProps, {})(ProjectDetail);
