import { connect, useDispatch } from "react-redux"
import { Link, Navigate,  useParams } from "react-router-dom";
import { get_author_portfolio_list, get_author_portfolio_list_page } from "redux/actions/portfolio/portfolio";
import React, { useState } from "react";
import Sidebar from "components/navigation/Sidebar";
import moment from "moment";
import SmallSetPagination from "components/pagination/SmallSetPagination";
import axios from "axios";
import { ADD_DELETE_POST_MODAL } from "redux/actions/modal/types";
import AdminLayout from "hocs/layouts/AdminLayout";

function AuthorProjectList({
    isAuthenticated,
    get_author_portfolio_list,
    get_author_portfolio_list_page,
    author_projects,
    count,
    next,
    previous
}){

    let params = useParams();
    let currentPage = params.currentPage;

    if (currentPage){

    }else{
        currentPage = 1
    }
    const dispatch = useDispatch();

    const handleDeleteOpenModal =(slug)=> {
        dispatch({
            type: ADD_DELETE_POST_MODAL,
            payload: {
                showModal: true,
                message: `Estas seguro que quieres eliminar el proyecto "${slug}"`,
                slug: slug,
                element: 'project',
            }
        });
    };

    React.useEffect(() => {
        window.scrollTo(0, 0);    

        get_author_portfolio_list();
        get_author_portfolio_list_page(currentPage);
        // Selecciona el elemento .sidebar a
    }, [get_author_portfolio_list, get_author_portfolio_list_page, currentPage]);

    
    return (
        <AdminLayout>
            <div className="admin-container"> 
                <Sidebar />
                <div className="blog-container">
                    
                    <h2 className="heading">Proyectos</h2> <Link to="/create_project" className="btn">Crear nuevo</Link>
                    {
                        isAuthenticated ?
                        <>
                        {
                            author_projects&&author_projects.map(project => (
                                <div key={project.id} className="blog-box">
                                    
                                    <span to={`/blog/${project.slug}`} className="img-box" >
                                            <img src={`${project.thumbnail}`} alt="post img" />
                                    </span>
                                    
                                    <div className="blog-content">
                                        <h2>{project.title.length > 150 ? project.title.slice(0,149): project.title}</h2>
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
                                        
                                        <span>{project.category}</span>
                                        <span>{moment(project.published).format('LL')}</span>
                                        
                                        <p>{project.description.length  > 200 ? project.description.slice(0,199) + '...': project.description}</p>
                                    </div>
    
                                    <div className="blog-layer">
                                        <Link to={`/portfolio/${project.slug}`}><i className='bx bx-link-external'></i></Link>
                                        <Link to={`/author_portfolio/${project.slug}`} ><i className='bx bx-edit-alt'></i></Link>
                                        <Link onClick={()=>handleDeleteOpenModal(project.slug)} ><i className='bx bx-trash-alt' ></i></Link>
                                    </div>
    
                                </div>
                            ))
                        }
                        </>
                        :
                        <>
                        <h3>Loading</h3>
                        </>
                    }
                <SmallSetPagination list_page={get_author_portfolio_list_page} list={author_projects} count={count} />
            </div>

        </div>
        </AdminLayout>
            
    )
}

const mapStateToProps=state=>({
    isAuthenticated: state.auth.isAuthenticated,
    author_projects: state.portfolio.author_projects,
    count: state.portfolio.count,
    next: state.portfolio.next,
    previous: state.portfolio.previous,
})

export default connect(mapStateToProps, {
    get_author_portfolio_list,
    get_author_portfolio_list_page
}) (AuthorProjectList)