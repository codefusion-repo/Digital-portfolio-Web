import axios from "axios";
import React from 'react';
import Sidebar from "components/navigation/Sidebar";
import { useEffect, useState } from "react"
import { connect, useDispatch } from "react-redux"
import {  Navigate, useNavigate } from "react-router-dom"
import { Editor } from '@tinymce/tinymce-react';
import { get_categories } from "redux/actions/categories/categories";
import slugify from 'slugify';
import { ADD_MSJ_MODAL } from "redux/actions/modal/types";
import AdminLayout from "hocs/layouts/AdminLayout";

function CreatePost({
    isAuthenticated,
    get_categories,
    categories
}) {

    const [previewThumbnail, setPreviewThumbnail] = useState();

    const [selectedOption, setSelectedOption] = useState('');

    const [formData, setFormData] = useState({
            title: '',
            description: '',
            thumbnail: '',
            content: '',
            category: 'default',
            time_read: '',
            status: 'default',
            slug: '',
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

    const onChange = e => {setFormData({ ...formData, [e.target.name]: e.target.value }); };

    const onChangeImg = e =>{
        const file = e.target.files[0]
        setFormData({ ...formData, [e.target.name]: file });
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = (e) => {
            setPreviewThumbnail(reader.result);
        }
    };
    const handleSlugChange = (e) => {
        const options = {
            replacement: '-',  // Reemplaza los espacios en blanco por guiones
            lower: true,  // Convierte el slug a minúsculas
            strict: true,  // Remueve caracteres especiales
        };
        const t_slug = slugify(title.substring(0, 255), options);
        setFormData({ ...formData, slug: t_slug });
    };
    const handleOptionChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setSelectedOption(e.target.value);
    };

    const handleEditorChange = (e, editor) => {
        setFormData({ ...formData, content: e})
    };

    const handleFilePicker = (callback, value, meta) => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
    
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
                    console.error('Error al cargar la imagen:', error);
                    // Llamamos al callback de error si ocurre un error al subir la imagen
                    callback('', {});
                });
            };
        
            reader.readAsDataURL(file);
            };
        
            input.click();
    };
        
    const uploadImage = async (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/blog/upload/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                },
            });
    
        if (response.status === 200) {
            const imageUrl = `${process.env.REACT_APP_API_URL}/${response.data.location}`;
            return imageUrl;
        } else {
            throw new Error('Error al cargar la imagen');
            }
        } catch (error) {
            throw new Error('Error al cargar la imagen');
        }
    };

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const onSubmit = e => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        formData.append('thumbnail', thumbnail)
        formData.append('content', content)
        formData.append('category', category)
        formData.append('time_read', time_read)
        formData.append('status', status)
        formData.append('slug', slug)

        if(status!=='default' && category!=='default'){
            const fetchData = async()=>{
                const config = {
                    headers: {
                        'Authorization': `JWT ${localStorage.getItem('access')}`,
                        'Accept': 'application/json',
                    }
                };
                
                try {
    
                    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/blog/create_post`,
                    formData, 
                    config
                    )

                    if(res.status===200){
                        if(res.data.success){
                            setLoading(false);
                            handleOpenModal(res.data.success);
                        }
                        if(res.data.error){
                            handleOpenModal(res.data.error)
                        }
                    }else{
                        setLoading(false);
                        alert('Error al crear la publicación.');
                    }
    
                }catch(err){
                    setLoading(false);
                    alert('Error al crear la publicación.');
                }
            }
            fetchData();
        }else{
            alert('Selecciona el estado de tu publicación.');
        };

    };

    const dispatch = useDispatch();

    function handleOpenModal(msj) {
        dispatch({
            type: ADD_MSJ_MODAL,
            payload: {
                showModal: true,
                message: msj
            }
        });

        navigate('/author_blog')
    };

    useEffect(()=>{
        get_categories();
    }, [get_categories]);


    const editorConfig = {
        //file_picker_callback: handleFilePicker,
        plugins: [
            'table', 'save', 'autosave', 'link', 'image', 'lists', 'preview', 'hr', 'anchor', 'pagebreak',
            'searchreplace', 'wordcount', 'visualblocks', 'visualchars', 'code', 'fullscreen', 'insertdatetime', 'media', 'nonbreaking',
            'contextmenu', 'directionality', 'emoticons', 'template', 'paste', 'textcolor', 'code', 'visualchars', 'charmap', 'colorpicker',
            'textpattern', 'fullpage', 'help','autosave'
            ],
        toolbar1: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | table | preview media fullscreen | forecolor backcolor | code',
        toolbar2: 'visualblocks visualchars | template pagebreak charmap | hr nonbreaking anchor | searchreplace | visualchars | fullpage | help',
        contextmenu: 'undo redo | cut copy paste pastetext | selectall',
        menubar: true,
        statusbar: true,
        forced_root_block: false,
        resize: true
    };

    return (
        <AdminLayout>
        <div className="admin-container">

            <Sidebar />
            
            <div className="author_blog">
                    <h2 className="heading">Crear publicación</h2>
                    <form onSubmit={e=>onSubmit(e)} className="form-box" action="#" encType="multipart/form-data" >
                    {
                        isAuthenticated ?
                        <>
                        <h3>Titulo</h3>
                        <div className="form-item">
                            <input onChange={e=>onChange(e)} type="text" id="title" name="title" value={title} placeholder="Escribe el titulo aqui..." required />
                        </div>
                        <h3>Descripción</h3>
                        <div className="form-item">
                        <textarea onChange={e=>onChange(e)} type="text" id="description" name="description" value={description} placeholder="Escribe la descripción aqui..." required ></textarea>
                        </div>
                        <h3>Portada</h3>
                        <div className="form-item">
                        {
                            previewThumbnail&&previewThumbnail ?
                            <>
                                                    <span>Vista previa
                                <img className="img-p" src={previewThumbnail}  alt="post img" /></span>
                            </>
                            :
                            <></>
                        }
                        <input onChange={e=>onChangeImg(e)} type="file" id="thumbnail" name="thumbnail"  accept="image/" required />
                        </div>
                        <h3>Contenido</h3>
                        <div className="form-item">
                        <Editor 
                            apiKey= {process.env.REACT_APP_TINYMCE_API_KEY}
                            initialValue="Escribe el contenido aqui..."
                            init={editorConfig}
                            onEditorChange={e=>handleEditorChange(e)}
                        />
                        </div>
                        <h3>Categoría</h3>
                        <div className="form-item">
                        <div className="edit-categories-list">
                            {
                                categories&&categories.map(category=>{
                                    return (
                                        <div key={category.id} className="edit-categories-list-box" >
                                            <h1>{category.name}</h1>
                                            <input style={{transform: 'scale(0.7)'}} type="radio" value={category.id} id={category.id} name="category" onChange={e=>handleOptionChange(e)} required />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        </div>
                        <h3>Tiempo de lectura</h3>
                        <div className="form-item">
                        <input onChange={e=>onChange(e)} type="number" id="time_read" name="time_read" value={parseInt(time_read, 10)} placeholder={0} required />
                        </div>
                        <h3>Estado</h3>    
                        <div className="form-item ">
                        <select onChange={e=>onChange(e)} type="select" id="status" name="status" defaultValue="default" required >
                            <option value="default">Selecciona una opción</option>
                            <option value="draft">Draftear</option>
                            <option value="published">Publicar</option>
                        </select>
                        </div>
                        <button type="submit" onClick={()=>handleSlugChange({title})} className="btn button-blog"><i className='bx bx-save' ></i></button>
                        </>
                        :
                        <>
                        <h3>Loading</h3>
                        </>
                    }
                    </form>
            </div>
            
        </div>
        </AdminLayout>
    )
}

const mapStateToProps = state => ({
    categories: state.categories.categories,
    isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps, {
    get_categories
})(CreatePost)