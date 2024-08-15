import axios from 'axios';
import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { get_author_blog_list, get_author_blog_list_page } from 'redux/actions/blog/blog';
import { get_author_portfolio_list, get_author_portfolio_list_page } from 'redux/actions/portfolio/portfolio';
import { ADD_DELETE_POST_MODAL, ADD_MSJ_MODAL, REMOVE_MODAL } from 'redux/actions/modal/types';

function Modal({
    showModal,
    message, 
    slug,
    element,
    get_author_blog_list,
    get_author_blog_list_page,
    get_author_portfolio_list,
    get_author_portfolio_list_page
}) {
    const dispatch = useDispatch();

    function handleOpenModal(msj) {
        dispatch({
            type: ADD_MSJ_MODAL,
            payload: {
                showModal: true,
                message: msj
            }
        });
    };
    const handleCloseModal = () => {
        dispatch({
            type: REMOVE_MODAL,
        });
    };
    const handleConfirm = () => {
        if (slug!==null) {
            if(element!==null){
                if(element === 'project'){
                    deleteProject(slug)
                }
                if(element === 'post'){
                    deletePost(slug)
                }
            }
            
        } else {
            dispatch({
                type: REMOVE_MODAL,
            });
        }
    };
    function deletePost(slug){
        
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        };

        const fetchDelete = async(slug)=>{
            try {
                const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/blog/delete/${slug}`, config);

                if(res.status === 200){
                    handleOpenModal(res.data.success)

                    get_author_blog_list()
                    get_author_blog_list_page(1)
                }else{
                    alert('Error al borrar la publicación.')
                }

            }catch(err){
                alert('Error al borrar la publicación.')
            }
        };
        fetchDelete(slug)
    };

    function deleteProject(slug){
        
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        };

        const fetchDelete = async(slug)=>{
            try {
                const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/portfolio/delete/${slug}`, config);

                if(res.status === 200){
                    handleOpenModal(res.data.success)

                    get_author_portfolio_list()
                    get_author_portfolio_list_page(1)
                }else{
                    alert('Error al borrar el proyecto.')
                }

            }catch(err){
                alert('Error al borrar el proyecto.')
            }
        };
        fetchDelete(slug)
    };

    return (
        <>
            {
                showModal&&showModal ? 
                <>
                <section className="modal">
                    <div className="modal-content">
                            {
                                message&&message ?
                                <h4>{message}</h4>
                                :
                                <h4>Cargando...</h4>
                            }
                        <button className="btn btn-c" onClick={()=>handleConfirm()}>
                            {
                                slug != null ?
                                <>Confirmar</>
                                :
                                <>Ok</>
                            }
                            </button>
                        <div className="modal-close" >
                            <button className="btn" onClick={()=>handleCloseModal()}>Cerrar</button>
                        </div>

                    </div>
                </section>
                </>
                :
                <></>
            }
        </>
    );
};
const mapStateToProps =state=>({
    showModal: state.modal.showModal,
    message: state.modal.message,
    slug: state.modal.slug,
    element: state.modal.element
})
export default connect(mapStateToProps,{
    get_author_blog_list,
    get_author_blog_list_page,
    get_author_portfolio_list,
    get_author_portfolio_list_page,
}) (Modal);
