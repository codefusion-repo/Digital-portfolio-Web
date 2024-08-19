import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { get_project_detail } from "redux/actions/portfolio/portfolio";
import { Editor } from "@tinymce/tinymce-react";
import AdminLayout from "hocs/layouts/AdminLayout";
import { useMobile } from "context/mobile/mobileContext";
import { ADD_MSJ_MODAL } from "redux/actions/modal/types";

function EditProject({ isAuthenticated, get_project_detail, project }) {
  const params = useParams();
  const slug = params.slug;

  const [previewThumbnail, setPreviewThumbnail] = useState();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    content: "",
    category: "",
    status: "",
  });

  const { title, description, thumbnail, content, category, status } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onChangeImg = (e) => {
    try {
      const file = e.target.files[0];
      setFormData({ ...formData, [e.target.name]: file });
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = (e) => {
        setPreviewThumbnail(reader.result);
      };
    } catch {
      setPreviewThumbnail(null);
      console.log("Cancelled");
    }
  };

  const handleEditorChange = (e, editor) => {
    setFormData({ ...formData, content: e });
  };

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();
    formData.append("id", project.id);
    formData.append("title", title ? title : project.title);
    formData.append(
      "description",
      description ? description : project.description
    );

    console.log("thumbnail: ", thumbnail);
    formData.append("thumbnail", thumbnail ? thumbnail : "");
    formData.append("content", content ? content : project.content);
    formData.append("category", category ? category : project.category);
    formData.append("status", status ? status : project.status);

    const fetchData = async () => {
      const config = {
        headers: {
          Authorization: `JWT ${localStorage.getItem("access")}`,
          Accept: "application/json",
        },
      };

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/portfolio/edit_project`,
        formData,
        config
      );

      if (res.status === 200) {
        setLoading(false);
        setPreviewThumbnail(null);

        console.log("res.data.project: ", res.data.project);

        if (project.slug !== res.data.project.slug) {
          navigate(`/author_portfolio/${res.data.project.slug}`);
        } else {
          get_project_detail(res.data.project.slug);
        }

        dispatch({
          type: ADD_MSJ_MODAL,
          payload: {
            showModal: true,
            message: "Project edited",
          },
        });
      } else {
        setLoading(false);
        setPreviewThumbnail(null);
        dispatch({
          type: ADD_MSJ_MODAL,
          payload: {
            showModal: true,
            message: "Error when editing project",
          },
        });
      }
    };

    fetchData();
  };

  useEffect(() => {
    get_project_detail(slug);
    // eslint-disable-next-line
  }, [slug]);

  useEffect(() => {
    if (project) {
      setFormData({
        ...formData,
        category: project.category,
        status: project.status,
      });
    }
    // eslint-disable-next-line
  }, [project]);

  const editorConfig = {
    //file_picker_callback: handleFilePicker,
    plugins: [
      "table",
      "save",
      "autosave",
      "link",
      "image",
      "lists",
      "preview",
      "hr",
      "anchor",
      "pagebreak",
      "searchreplace",
      "wordcount",
      "visualblocks",
      "visualchars",
      "code",
      "fullscreen",
      "insertdatetime",
      "media",
      "nonbreaking",
      "contextmenu",
      "directionality",
      "emoticons",
      "template",
      "paste",
      "textcolor",
      "code",
      "visualchars",
      "charmap",
      "colorpicker",
      "textpattern",
      "fullpage",
      "help",
      "autosave",
    ],
    toolbar1:
      "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | table | preview media fullscreen | forecolor backcolor | code",
    toolbar2:
      "visualblocks visualchars | template pagebreak charmap | hr nonbreaking anchor | searchreplace | visualchars | fullpage | help",
    contextmenu: "undo redo | cut copy paste pastetext | selectall",
    menubar: true,
    statusbar: true,
    forced_root_block: false,
    resize: true,
  };

  const { device } = useMobile();

  return (
    <AdminLayout>
      <form
        onSubmit={(e) => onSubmit(e)}
        className="flex column box-xxl gap-m margin-t-xs padding-l-m padding-r-m padding-t-xxs"
        method="POST"
        action="#"
        encType="multipart/form-data"
      >
        {isAuthenticated && project && project && !loading ? (
          <>
            <h2>Edit project {project.title}</h2>
            <div className="flex box-xxl column gap-xxs">
              <h3>Title</h3>
              <input
                onChange={(e) => onChange(e)}
                className="input-large"
                type="text"
                id="title"
                name="title"
                value={title}
                placeholder={project.title}
              />
            </div>
            <div className="flex box-xxl column gap-xxs">
              <h3>Description</h3>
              <textarea
                onChange={(e) => onChange(e)}
                className="textarea-large padding-xs"
                type="text"
                id="description"
                name="description"
                value={description}
                placeholder={project.description}
              ></textarea>
            </div>
            <div className="flex box-xxl column gap-xxs">
              <h3>Thumbnail</h3>

              {project.thumbnail && project.thumbnail ? (
                <div className="flex box-xxl column">
                  <h3>Current thumbnail</h3>
                  <img
                    className="f-height-s f-width-s fit-cover"
                    src={`${project.thumbnail}`}
                    alt="post img"
                  />
                </div>
              ) : (
                <></>
              )}
              <h4>Change thumbnail (The current one will be deleted)</h4>

              <input
                onChange={(e) => onChangeImg(e)}
                className={`input-large ${
                  device > 2 ? "padding-xs" : "padding-xxs"
                }`}
                type="file"
                id="thumbnail"
                name="thumbnail"
                accept="image/"
              />
              {previewThumbnail && previewThumbnail ? (
                <div className="flex box-xxl column">
                  <h3>Preview</h3>
                  <img
                    className="f-height-s f-width-s fit-cover"
                    src={`${previewThumbnail}`}
                    alt="post img"
                  />
                </div>
              ) : (
                <></>
              )}
            </div>

            <div className="flex box-xxl column gap-xxs z-index-xxs">
              <h3>Content</h3>
              <Editor
                apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                initialValue={project.content}
                init={editorConfig}
                onEditorChange={(e) => handleEditorChange(e)}
              />
            </div>

            <div className="flex box-xxl column gap-xxs">
              <h3>Category</h3>
              <select
                className="select-large"
                onChange={(e) => onChange(e)}
                name="category"
                id="category"
                defaultValue={project.category}
                value={category}
              >
                <option value="sp-1">Sample category 1</option>
                <option value="sp-2">Sample category 2</option>
                <option value="sp-3">Sample category 3</option>
                <option value="sp-4">Sample category 4</option>
              </select>
            </div>

            <div className="flex box-xxl column gap-xxs">
              <h3>State</h3>
              <select
                onChange={(e) => onChange(e)}
                className="select-large"
                type="select"
                id="status"
                name="status"
                defaultValue={project.status}
                value={status}
              >
                <option value="drafted">Draft</option>
                <option value="pre_production">Pre-production</option>
                <option value="production">Production</option>
                <option value="constant_updates">Updating</option>
                <option value="finished">Finished</option>
              </select>
            </div>

            {!loading ? (
              <div className="flex j-space a-center gap-ms">
                <a href="/author_portfolio" className="btn-small third-color">
                  <h2>
                    <i className="bx bx-x"></i>
                  </h2>
                  <h3>Back</h3>
                </a>
                <button type="submit" className="btn-small third-color">
                  <h2>
                    <i className="bx bx-save"></i>
                  </h2>
                  <h3>Save</h3>
                </button>
              </div>
            ) : (
              <div className={`flex box-xxl j-end a-center gap-ms`}>
                <h3>Loading</h3>
              </div>
            )}
          </>
        ) : (
          <h3>Loading</h3>
        )}
      </form>
    </AdminLayout>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  project: state.portfolio.project,
});

export default connect(mapStateToProps, {
  get_project_detail,
})(EditProject);
