import { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

function SmallSetPagination({list_page, list, count}){
    const [active, setActive] = useState(1)
    const [listingsPerPage, ] = useState(12)
    const [currentPage, setCurrentPage] = useState(1)

    const location = useLocation()
    const params = useParams()
    const slug = params.slug
    const term = params.term

    if (location.pathname === '/blog' || location.pathname === `/author_blog`){

        var visitPage = (page) => {
            window.scrollTo(0, 0);  
            setCurrentPage(page);
            setActive(page);
            list_page(page);
        }
    
    
        var previous_number = () => {
            if (currentPage !== 1){
                window.scrollTo(0, 0);  
                setCurrentPage(currentPage-1);
                setActive(currentPage-1);
                list_page(currentPage-1);
            }
        };
    
        var next_number = () => {
            if (currentPage !== Math.ceil(list.length/3)){
                window.scrollTo(0, 0);  
                setCurrentPage(currentPage+1);
                setActive(currentPage+1);
                list_page(currentPage+1);
            }
        };
    }
    if (location.pathname === `/category/${slug}`){

        var visitPage = (page) => {
            window.scrollTo(0, 0); 
            setCurrentPage(page);
            setActive(page);
            list_page(slug, page);
        }
    
    
        var previous_number = () => {
            if (currentPage !== 1){
                window.scrollTo(0, 0); 
                setCurrentPage(currentPage-1);
                setActive(currentPage-1);
                list_page(slug, currentPage-1);
            }
        };
    
        var next_number = () => {
            if (currentPage !== Math.ceil(list.length/3)){
                window.scrollTo(0, 0); 
                setCurrentPage(currentPage+1);
                setActive(currentPage+1);
                list_page(slug, currentPage+1);
            }
        };
    }
    if (location.pathname === `/search/${term}`){

        var visitPage = (page) => {
            window.scrollTo(0, 0); 
            setCurrentPage(page);
            setActive(page);
            list_page(term, page);
        }
    
    
        var previous_number = () => {
            if (currentPage !== 1){
                window.scrollTo(0, 0); 
                setCurrentPage(currentPage-1);
                setActive(currentPage-1);
                list_page(term, currentPage-1);
            }
        };
    
        var next_number = () => {
            if (currentPage !== Math.ceil(list.length/3)){
                window.scrollTo(0, 0); 
                setCurrentPage(currentPage+1);
                setActive(currentPage+1);
                list_page(term, currentPage+1);
            }
        };
    }

    let numbers = [];

    const getNumbers = () => {
        let itemsPerPage = listingsPerPage;
        let pageNumber = 1;

        for(let i = 0; i < count; i += itemsPerPage){
            const page = pageNumber;
            let content = null;
            if (active === page){
                content = (
                    <div key={i} className='btn-small btn-active'>
                        <a >{pageNumber}</a>
                    </div>
                );
            }else{
                content = (
                    <div key={i} className='btn-small'>
                    <a onClick={() => {visitPage(page)}} >{pageNumber}</a>
                </div>
                );
            }

            numbers.push(
                content
            );
            pageNumber++;
        }
        return numbers;
    };
    return(
        <nav className='pagination'>
            {
                currentPage !== 1 ? 
                <div className='btn-small'>
                    <a onClick={() =>{previous_number()}}><i className='bx bx-left-arrow-alt' ></i></a>
                </div>
                :
                <div>

                </div>
            }
            {getNumbers()}
            {
                numbers.length === 0 || currentPage === numbers.length ? 
                <div>
                    
                </div>
                :
                <div className='btn-small'>
                    <a onClick={() =>{next_number()}}><i className='bx bx-right-arrow-alt' ></i></a>
                </div>
            }
        </nav>
    )
}

export default SmallSetPagination