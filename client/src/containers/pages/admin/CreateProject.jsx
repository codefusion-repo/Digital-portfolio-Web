import axios from "axios";
import React from "react";
import Sidebar from "components/navigation/Sidebar";
import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import slugify from "slugify";
import { ADD_MSJ_MODAL } from "redux/actions/modal/types";
import AdminLayout from "hocs/layouts/AdminLayout";
import { useMobile } from "context/mobile/mobileContext";

function CreateProject({ isAuthenticated }) {
  const [previewThumbnail, setPreviewThumbnail] = useState();

  const [selectedOption, setSelectedOption] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    content: "",
    category: "",
    status: "",
    slug: "",
  });

  const { title, description, thumbnail, content, category, status, slug } =
    formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onChangeImg = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, [e.target.name]: file });
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (e) => {
      setPreviewThumbnail(reader.result);
    };
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
    setSelectedOption(e.target.value);
  };

  const handleEditorChange = (e, editor) => {
    setFormData({ ...formData, content: e });
  };

  const handleFilePicker = (callback, value, meta) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        // Subir la imagen al servidor
        uploadImage(file)
          .then((imageUrl) => {
            // Llamamos al callback con la URL de la imagen y otros metadatos (si es necesario)
            callback(imageUrl, {
              alt: file.name,
            });
          })
          .catch((error) => {
            console.error("Error al cargar la imagen:", error);
            // Llamamos al callback de error si ocurre un error al subir la imagen
            callback("", {});
          });
      };

      reader.readAsDataURL(file);
    };

    input.click();
  };

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/blog/upload/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const imageUrl = `${process.env.REACT_APP_API_URL}/${response.data.location}`;
        return imageUrl;
      } else {
        throw new Error("Error al cargar la imagen");
      }
    } catch (error) {
      throw new Error("Error al cargar la imagen");
    }
  };

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("thumbnail", thumbnail);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("status", status);
    formData.append("slug", slug);

    if (status !== "default" && category !== "default") {
      const fetchData = async () => {
        const config = {
          headers: {
            Authorization: `JWT ${localStorage.getItem("access")}`,
            Accept: "application/json",
          },
        };
        try {
          const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/portfolio/create_project`,
            formData,
            config
          );

          if (res.status === 200) {
            if (res.data.success) {
              setLoading(false);
              handleOpenModal(res.data.success);
            }
          } else {
            setLoading(false);
            alert("Error al crear la proyecto.");
          }
        } catch (err) {
          setLoading(false);
          alert("Error al crear la proyecto.");
        }
      };
      fetchData();
    } else {
      alert("Selecciona el estado de tu proyecto.");
    }
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

    navigate("/author_portfolio");
  }

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
      <h2>Create project</h2>
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
              <h3>Contenido</h3>
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
                id="category"
                defaultValue="sp-1"
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
                defaultValue="drafted"
                required
              >
                <option value="drafted">Draft</option>
                <option value="pre_production">Pre-production</option>
                <option value="production">Production</option>
                <option value="constant_updates">Updating</option>
                <option value="finished">Finished</option>
              </select>
            </div>

            <div
              className={`flex box-xxl ${
                location.pathname.includes("/create_project")
                  ? "j-space"
                  : "j-end"
              } a-center gap-ms`}
            >
              {location.pathname.includes("/create_project") && (
                <a href="/author_portfolio" className="btn-small third-color">
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
          </>
        ) : (
          <>
            <h3>Loading</h3>
          </>
        )}
      </form>
    </>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {})(CreateProject);
