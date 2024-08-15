import axios from "axios";
import React from 'react';
import Sidebar from "components/navigation/Sidebar";
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import {  Navigate, useParams, useNavigate } from "react-router-dom"
import { get_project_detail } from "redux/actions/portfolio/portfolio";
import DOMPurify from 'dompurify';
import { Editor } from '@tinymce/tinymce-react';
import { get_categories } from "redux/actions/categories/categories";
import slugify from 'slugify';
import AdminLayout from "hocs/layouts/AdminLayout";

function EditProject({
    isAuthenticated,
    get_project_detail,
    project,
}) {
    const params = useParams();
    const slug = params.slug
    const slug_ = slug.replace(/-/g, ' ')
    const slug__ = slug_.charAt(0).toUpperCase() + slug_.slice(1)

    const [updateTitle, setUpdateTitle] = useState(false);
    const [updateDescription, setUpdateDescription] = useState(false);
    const [updateThumbnail, setUpdateThumbnail] = useState(false);
    const [previewThumbnail, setPreviewThumbnail] = useState();
    const [updateContent, setUpdateContent] = useState(false);
    const [showHiddenContent, setShowHiddenContent] = useState(false);
    const [updateCategory, setUpdateCategory] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(false);

    function adjustSize(){
        const iframe = document.querySelector('iframe')

        if (iframe){
            var screenWidth = window.innerWidth;
            var screenHeight = window.innerHeight;
        
            if (screenWidth >= 1316) {
                iframe.width = '600';
                iframe.height = '350';
            } else if (screenWidth >= 820) {
                iframe.width = '350';
                iframe.height = '280';
            } else if (screenWidth >= 617) {
                iframe.width = '200';
                iframe.height = '150';
            }else if (screenWidth >= 474){
                iframe.width = '100';
                iframe.height = '200';
            }else if (screenWidth >= 316){
                iframe.width = '50';
                iframe.height = '175';
            }else{
                iframe.width = '35';
                iframe.height = '150';
            }
            
        };
    };
    adjustSize()
    window.addEventListener('resize', adjustSize);

    const [formData, setFormData] = useState({
            title: '',
            description: '',
            thumbnail: '',
            content: '',
            category: '',
            status: '',
            new_slug: '',
    });

    const {
        title,
        description,
        thumbnail,
        content,
        category,
        status,
        new_slug,
    } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value }); 

    };
    
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
        setFormData({ ...formData, new_slug: t_slug });
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
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/portfolio/upload/`, formData, {
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

    const onSubmit = (e) => {
        e.preventDefault();

        const config = {
            headers: {
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json',
            }
        };
        
        const formData = new FormData()
        formData.append('slug', slug)
        if(updateTitle){
            formData.append('title', title)
            formData.append('new_slug', new_slug)
        }else{
            formData.append('title', '')
            formData.append('new_slug', '')
        }
        if(updateDescription){
            formData.append('description', description)
        }else{
            formData.append('description', '')
        }
        if(updateThumbnail){
            formData.append('thumbnail', thumbnail)
        }else{
            formData.append('thumbnail', '')
        }
        if(updateContent){
            formData.append('content', content)
        }else{
            formData.append('content', '')
        }
        if(updateCategory){
            formData.append('category', category)
        }else{
            formData.append('category', '')
        }
        if(updateStatus){
            if (status!=='default'){
                formData.append('status', status)
            }else{
                formData.append('status', '')
            }
        }else{
            formData.append('status', '')
        }

        const fetchData = async()=>{
            setLoading(true);
            try {

                const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/portfolio/edit_project`,
                formData, 
                config
                )

                if(res.status===200){
                    setLoading(false);
                    if(res.data.new_slug){
                        navigate(`/author_portfolio/${res.data.new_slug}`)
                    }else{
                        get_project_detail(slug);
                    }
                    
                    default_set()
                }else{
                    setLoading(false);
                    alert('Error al editar')
                    default_set() 
                }

            }catch(err){
                setLoading(false);
                alert('Error al enviar')
                default_set()
            }
        }
        fetchData();
    };


    useEffect(()=>{
        get_project_detail(slug);
        
    }, [get_project_detail, slug]);

    const [selectedOption, setSelectedOption] = useState('');

    if (selectedOption === '' ){
        setTimeout(()=>{
            setSelectedOption(project&&project ? String(project.category) : '');
        }, 500);
    };
    if (formData.title === '' ){
        setTimeout(()=>{
            setFormData({ ...formData, title: project && project ? project.title : '' });
            
        }, 500);
    };
    if (formData.description === '' ){
        setTimeout(()=>{
            setFormData({ ...formData, description: project && project ? project.description : '' });
        }, 500);
    };

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

    function default_set(){
        setUpdateTitle(false);
        setUpdateDescription(false);
        setUpdateThumbnail(false);
        setUpdateContent(false);
        setUpdateCategory(false);
        setUpdateStatus(false); 
        setSelectedOption(project&&project ? String(project.category) : '');
        setPreviewThumbnail(); 
    };

    return (
        <AdminLayout>
        <div className="admin-container">

            <Sidebar />
            
            <div className="author_blog">
                    <h2 className="heading">Editar proyecto</h2>
                    <form onSubmit={e=>onSubmit(e)} className="form-box" method="POST" action="#" encType="multipart/form-data" >
                    {
                        isAuthenticated&&project&&project&&!loading ?
                        <>
                            <h3>Titulo</h3>
                            <div className="form-item">
                                {
                                    updateTitle ?
                                    <>
                                        <input onChange={e=>onChange(e)} type="text" id="title" name="title" value={title} placeholder={project.title} required />
                                        <div className="edit-categories-list-box" >
                                            <button onClick={(e)=>handleSlugChange(e)} type="submit" className="btn button-blog"><i className='bx bx-save' ></i></button>
                                            <div onClick={()=>{setUpdateTitle(false);}}  className="btn"><i className='bx bx-x' ></i></div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <span>{project.title} </span>
                                        <div className="edit-categories-list-box" >
                                            <div onClick={()=>{default_set(); setUpdateTitle(true);}} className="btn"><i className='bx bx-edit-alt'></i></div>
                                        </div>
                                    </>

                                }
                            </div>
                            <h3>Descripción</h3>
                            <div className="form-item">
                                {
                                    updateDescription ?
                                    <>
                                        <textarea onChange={e=>onChange(e)} type="text" id="description" name="description" value={description} placeholder={project.description} required ></textarea>
                                        <div className="edit-categories-list-box" >
                                            <button type="submit" className="btn button-blog"><i className='bx bx-save' ></i></button>
                                            <div onClick={()=>setUpdateDescription(false)}  className="btn"><i className='bx bx-x' ></i></div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <span>{project.description} </span>
                                        <div className="edit-categories-list-box" >
                                            <div onClick={()=>{default_set(); setUpdateDescription(true);}} className="btn"><i className='bx bx-edit-alt'></i></div>
                                        </div>
                                    </>

                                }
                            </div>
                            <h3>Portada</h3>
                            <div className="form-item">
                                {
                                    updateThumbnail ?
                                    <>
                                        <span>Cambiar Portada (Se eliminará la actual)</span>
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
                                        <div className="edit-categories-list-box" >
                                            <button type="submit" onClick={()=>setPreviewThumbnail()} className="btn button-blog"><i className='bx bx-save' ></i></button>
                                            <div onClick={()=>{setUpdateThumbnail(false); setPreviewThumbnail();}}  className="btn"><i className='bx bx-x' ></i></div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <img className="img-p" src={`${project.thumbnail}`}  alt="post img" />
                                        <div className="edit-categories-list-box" >
                                            <div onClick={()=>{default_set(); setUpdateThumbnail(true);}} className="btn "><i className='bx bx-edit-alt'></i></div>
                                        </div> 
                                    </>

                                }
                            </div>
                            <h3>Contenido</h3>
                            <div id="content-i" >
                                {
                                    updateContent ?
                                    <div className="content-item">
                                        <Editor 
                                        apiKey= {process.env.REACT_APP_TINYMCE_API_KEY}
                                        initialValue={project.content}
                                        init={editorConfig}
                                        onEditorChange={e=>handleEditorChange(e)}
                                        />

                                    <div className="form-item">
                                        <button type="submit" className="btn button-blog"><i className='bx bx-save' ></i></button>
                                        <div onClick={()=>setUpdateContent(false)}  className="btn"><i className='bx bx-x' ></i></div>
                                        </div>
                                    </div>
                                    :
                                    <>
                                    {
                                        showHiddenContent ?
                                        <>
                                        <div className="form-item">
                                            <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(project.content, {
                                                ADD_TAGS: ['iframe'],
                                                ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src'],
                                                ADD_URI_SAFE_ATTR: ['src'],
                                                FORBID_TAGS: ['script'],
                                            })}} /> 
                                            <div onClick={()=>{
                                                default_set()
                                                setUpdateContent(true); 
                                                setSelectedOption(project&&project ? String(project.category.id) : '');
                                            }} className="btn"><i className='bx bx-edit-alt'></i></div>
                                        </div>
                                        <button className="btn" onClick={()=>setShowHiddenContent(false)}>Mostrar menos...</button>
                                        </>
                                        :
                                        <>
                                        <div className="form-item">
                                            <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(project.content.length  > 400 ? project.content.slice(0,399) + '...': project.content, {
                                                ADD_TAGS: ['iframe'],
                                                ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src'],
                                                ADD_URI_SAFE_ATTR: ['src'],
                                                FORBID_TAGS: ['script'],
                                            })}} /> 
                                            <div onClick={()=>{
                                                default_set();
                                                setUpdateContent(true); 
                                            }} className="btn"><i className='bx bx-edit-alt'></i></div>
                                        </div>
                                        <button className="btn" onClick={()=>setShowHiddenContent(true)}>Mostrar todo...</button>
                                        </>
                                    }
                                    </>
                                }
                            </div>
                            <h3>Categoría</h3>
                            <div className="form-item">
                                {
                                    updateCategory ?
                                    <>
                                    <div className="edit-categories-list">
                                        <div className="edit-categories-list-box" >
                                            <h1>Páginas web</h1>
                                            <input style={{transform: 'scale(0.7)'}} type="radio" value='websites' id='websites' name="category" checked={selectedOption === 'websites' ? true : false } onChange={e=>handleOptionChange(e)} required />
                                            <h1>Videojuegos</h1>
                                            <input style={{transform: 'scale(0.7)'}} type="radio" value='videogames' id='videogames' name="category" checked={selectedOption === 'videogames' ? true : false } onChange={e=>handleOptionChange(e)} required />
                                        </div>
        
                                        </div>
                                        <div className="edit-categories-list-box" >
                                            <button type="submit" className="btn button-blog"><i className='bx bx-save' ></i></button>
                                            <div onClick={()=>{setUpdateCategory(false); setSelectedOption(project&&project ? String(project.category) : '');}}  className="btn"><i className='bx bx-x' ></i></div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <span>{project.category}</span>
                                        <div className="edit-categories-list-box" >
                                            <div onClick={()=>{default_set(); setUpdateCategory(true);}} className="btn "><i className='bx bx-edit-alt'></i></div>
                                        </div>
                                    </>

                                }
                            </div>
                            <h3>Estado</h3>
                            <div className="form-item">
                                {
                                    updateStatus ?
                                    <>
                                        <select onChange={e=>onChange(e)} type="select" id="status" name="status" defaultValue='default' value={status} required >
                                            <option value="default">Selecciona una opción</option>
                                            <option value="drafted">Draftear</option>
                                            <option value="pre_production">Pre producción</option>
                                            <option value="production">Producción</option>
                                            <option value="constant_updates">Actualizando</option>
                                            <option value="finished">Finalizado</option>
                                        </select>
                                        <div className="edit-categories-list-box" >
                                            <button type="submit" className="btn button-blog"><i className='bx bx-save' ></i></button>
                                            <div onClick={()=>{setUpdateStatus(false); }}  className="btn"><i className='bx bx-x' ></i></div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        {
                                            project.status === 'drafted' ?
                                            <span>En espera</span>
                                            :
                                            project.status === 'pre_production' ?
                                            <span>Pre producción</span>
                                            :
                                            project.status === 'production' ?
                                            <span>Producción</span>
                                            :
                                            project.status === 'constant_updates' ?
                                            <span>Actualizando</span>
                                            :
                                            project.status === 'finished' ?
                                            <span>Finalizado</span>
                                            :
                                            <span>Sin estado</span>
                                        }
                                        <div className="edit-categories-list-box" >
                                            <div onClick={()=>{default_set(); setUpdateStatus(true);}} className="btn "><i className='bx bx-edit-alt'></i></div>
                                        </div>
                                    </>

                                }
                            </div>
                        </>
                        :
                        <h3>Cargando...</h3>
                    }
                    </form>
            </div>

        </div>
        </AdminLayout>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    project: state.portfolio.project,
})

export default connect(mapStateToProps, {
    get_project_detail,
})(EditProject)