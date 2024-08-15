import { connect, useDispatch } from "react-redux"
import { Link, Navigate,  useParams } from "react-router-dom";
import { get_author_blog_list, get_author_blog_list_page } from "redux/actions/blog/blog";
import React, { useState } from "react";
import Sidebar from "components/navigation/Sidebar";
import moment from "moment";
import SmallSetPagination from "components/pagination/SmallSetPagination";
import axios from "axios";
import { ADD_DELETE_POST_MODAL } from "redux/actions/modal/types";
import AdminLayout from "hocs/layouts/AdminLayout";

function AuthorPostList({
    isAuthenticated,
    get_author_blog_list,
    get_author_blog_list_page,
    author_posts,
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
                message: `Estas seguro que quieres eliminar la publicación "${slug}"`,
                slug: slug,
                element: 'post',
            }
        });
    };

    React.useEffect(() => {
        window.scrollTo(0, 0);    

        get_author_blog_list();
        get_author_blog_list_page(currentPage);
        // Selecciona el elemento .sidebar a
    }, [get_author_blog_list, get_author_blog_list_page, currentPage]);

    
    return (
        <AdminLayout>
            <div className="admin-container"> 
                <Sidebar />
                <div className="blog-container">
                    
                    <h2 className="heading">Publicaciones</h2> <Link to="/create_post" className="btn">Crear nueva</Link>
                    {
                        isAuthenticated ?
                        <>
                        {
                            author_posts&&author_posts.map(post => (
                            <div key={post.id} className="blog-box">
                                
                                <span to={`/blog/${post.slug}`} className="img-box" >
                                        <img src={`${post.thumbnail}`} alt="post img" />
                                </span>
                                
                                <div className="blog-content">
                                    <h2>{post.title.length > 150 ? post.title.slice(0,149): post.title}</h2>
                                    {
                                        post.status === 'published' ?
                                        <span>Publicado</span>
                                        :
                                        <span>En espera</span>
                                    }
                                    <span>{post.category.name}</span>
                                    <span>{moment(post.published).format('LL')}</span>
                                    <span>{post.time_read} min read</span>
                                    <p>{post.description.length  > 200 ? post.description.slice(0,199) + '...': post.description}</p>
                                </div>

                                <div className="blog-layer">
                                    <Link to={`/blog/${post.slug}`}><i className='bx bx-link-external'></i></Link>
                                    <Link to={`/author_blog/${post.slug}`} ><i className='bx bx-edit-alt'></i></Link>
                                    <Link onClick={()=>handleDeleteOpenModal(post.slug)} ><i className='bx bx-trash-alt' ></i></Link>
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
                <SmallSetPagination list_page={get_author_blog_list_page} list={author_posts} count={count} />
            </div>

        </div>
        </AdminLayout>
            
    )
}

const mapStateToProps=state=>({
    isAuthenticated: state.auth.isAuthenticated,
    author_posts: state.blog.author_posts,
    count: state.blog.count,
    next: state.blog.next,
    previous: state.blog.previous,
})

export default connect(mapStateToProps, {
    get_author_blog_list,
    get_author_blog_list_page
}) (AuthorPostList)