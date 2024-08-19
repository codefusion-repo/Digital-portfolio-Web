import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { get_categories } from "redux/actions/categories/categories";
import slugify from "slugify";
import { ADD_MSJ_MODAL } from "redux/actions/modal/types";
import { useMobile } from "context/mobile/mobileContext";

function CreatePost({ isAuthenticated, get_categories, categories }) {
  const [previewThumbnail, setPreviewThumbnail] = useState();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    content: "",
    category: "",
    time_read: "",
    status: "",
    slug: "",
  });

  const {
    title,
    description,
    thumbnail,
    content,
    category,
    time_read,
    status,
    slug,
  } = formData;

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
      console.log("Cancelled");
    }
  };
  const handleSlugChange = (e) => {
    const options = {
      replacement: "-", // Reemplaza los espacios en blanco por guiones
      lower: true, // Convierte el slug a minúsculas
      strict: true, // Remueve caracteres especiales
    };
    const t_slug = slugify(title.substring(0, 255), options);
    setFormData({ ...formData, slug: t_slug });
  };
  const handleOptionChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (e, editor) => {
    setFormData({ ...formData, content: e });
  };

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!category || category.length === 0 || category === "default") {
      handleOpenModal("Select the category of your publication");
      setLoading(false);
      return;
    }
    if (!status || status.length === 0 || status === "default") {
      handleOpenModal("Select the status of your publication");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("thumbnail", thumbnail);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("time_read", time_read);
    formData.append("status", status);
    formData.append("slug", slug);

    const fetchData = async () => {
      const config = {
        headers: {
          Authorization: `JWT ${localStorage.getItem("access")}`,
          Accept: "application/json",
        },
      };

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/blog/create_post`,
          formData,
          config
        );

        if (res.status === 200) {
          if (res.data.success) {
            setLoading(false);
            handleOpenModal(res.data.success);
            navigate("/author_blog");
          }
          if (res.data.error) {
            handleOpenModal(res.data.error);
          }
        } else {
          setLoading(false);
          handleOpenModal("Error creating the publication");
        }
      } catch (err) {
        setLoading(false);
        handleOpenModal("Error creating the publication");
      }
    };
    fetchData();
  };

  const dispatch = useDispatch();

  function handleOpenModal(msj) {
    dispatch({
      type: ADD_MSJ_MODAL,
      payload: {
        showModal: true,
        message: msj,
      },
    });
  }

  useEffect(() => {
    get_categories();
  }, [get_categories]);

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
  const location = useLocation();
  return (
    <>
      <h2>Create post</h2>
      <form
        onSubmit={(e) => onSubmit(e)}
        className="flex column box-xxl gap-m margin-t-xs padding-l-m padding-r-m"
        action="#"
        encType="multipart/form-data"
      >
        {isAuthenticated ? (
          <>
            <div className="flex box-xxl column gap-xxs">
              <h3>Title</h3>
              <input
                onChange={(e) => onChange(e)}
                className="input-large"
                type="text"
                id="title"
                name="title"
                value={title}
                placeholder="Enter title here"
                required
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
                placeholder="Enter description here"
                required
              ></textarea>
            </div>

            <div className="flex box-xxl column gap-xxs">
              <h3>Thumbnail</h3>
              <input
                onChange={(e) => onChangeImg(e)}
                className={`input-large ${
                  device > 2 ? "padding-xs" : "padding-xxs"
                }`}
                type="file"
                id="thumbnail"
                name="thumbnail"
                accept="image/"
                required
              />

              {previewThumbnail && previewThumbnail ? (
                <div className="flex box-xxl column">
                  <h3>Preview</h3>
                  <img
                    className="f-height-s f-width-s fit-cover"
                    src={previewThumbnail}
                    alt="post img"
                  />
                </div>
              ) : (
                <></>
              )}
            </div>

            <div className="flex box-xxl column gap-xxs">
              <h3>Content</h3>
              <Editor
                apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                initialValue="Enter content here"
                init={editorConfig}
                onEditorChange={(e) => handleEditorChange(e)}
              />
            </div>

            <div className="flex box-xxl column gap-xxs">
              <h3>Category</h3>
              <select
                className="select-large"
                onChange={(e) => handleOptionChange(e)}
                name="category"
                defaultValue="default"
                id="category"
              >
                <option value="default">Select an option</option>
                {categories &&
                  categories.map((category) => (
                    <option value={category.id}>{category.name}</option>
                  ))}
              </select>
            </div>
            <div className="flex box-xxl column gap-xxs">
              <h3>Read time</h3>
              <input
                onChange={(e) => onChange(e)}
                className="input-large"
                type="number"
                id="time_read"
                name="time_read"
                value={parseInt(time_read, 10)}
                placeholder={0}
                required
              />
            </div>

            <div className="flex box-xxl column gap-xxs">
              <h3>State</h3>
              <select
                onChange={(e) => onChange(e)}
                className="select-large"
                type="select"
                id="status"
                name="status"
                defaultValue="default"
                required
              >
                <option value="default">Select an option</option>
                <option value="draft">Draft</option>
                <option value="published">Publish</option>
              </select>
            </div>

            {!loading ? (
              <div
                className={`flex box-xxl ${
                  location.pathname.includes("/create_post")
                    ? "j-space"
                    : "j-end"
                } a-center gap-ms`}
              >
                {location.pathname.includes("/create_post") && (
                  <a href="/author_blog" className="btn-small third-color">
                    <h2>
                      <i className="bx bx-x"></i>
                    </h2>
                    <h3>Back</h3>
                  </a>
                )}

                <button
                  type="submit"
                  onClick={() => handleSlugChange({ title })}
                  className="btn-small third-color"
                >
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
    </>
  );
}

const mapStateToProps = (state) => ({
  categories: state.categories.categories,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  get_categories,
})(CreatePost);
