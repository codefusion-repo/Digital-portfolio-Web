import { connect } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import logo from 'assets/img/sampleBusinessImage.jpeg';
import { logout } from "redux/actions/auth/auth";
import { useState } from 'react';

function Sidebar({
    logout
}) {
    const navigate = useNavigate()
    function handleLogout() {
        logout()
        setTimeout(() => {
            navigate('/login')
        }, 1500);
    };

    const location = useLocation();

    const [openSidebar, setOpenSidebar] = useState(false)

    const handleSidebar =()=>{
        const sidebar = document.getElementsByClassName('sidebar');
        
        if (openSidebar){
            sidebar.removeAttribute('class', 'open')
        }else{
            sidebar.addAttribute('class', 'open')
        }
    }

    return (
        <> 
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
        <nav className={`sidebar ${openSidebar ? 'open' : ''}`}>
        <button onClick={openSidebar ? ()=>{setOpenSidebar(false)}:()=>{setOpenSidebar(true)}} className='menu-icon'><i className={`bx ${openSidebar ? 'bx-x':'bx-menu-alt-left'}`}></i></button>
            
            <NavLink to="/dashboard" className={`logo-s ${location.pathname === '/dashboard' ? "active-item-sidebar":""}`} >
                <img src={logo} alt="logo img" />
                <span >Firu Dev Admin</span>
            </NavLink>
            <ul>
                <li className="top">
                    <NavLink to="/dashboard " className={`${location.pathname === '/dashboard' ? "active-item-sidebar":""}`} >
                        <i className='bx bx-home-alt'></i>
                        <span className="nav-item">Dashboard</span>
                    </NavLink>
                </li>
                <li><NavLink to="/author_blog" className={`${location.pathname.includes('/author_blog') ? "active-item-sidebar":""}`} >
                        <i className='bx bx-user' ></i>
                        <span className="nav-item">Blog</span>
                    </NavLink></li>
                <li><NavLink to="/author_portfolio" className={`${location.pathname.includes('/author_portfolio') ? "active-item-sidebar":""}`} >
                        <i className='bx bx-folder-open' ></i>
                        <span className="nav-item">Portafolio</span>
                    </NavLink></li>
                <li className="logout"><NavLink onClick={()=>handleLogout()} >
                        <i className='bx bx-log-out' ></i>
                        <span className="nav-item">Log out</span>
                    </NavLink></li>
            </ul>
        </nav>
        </>
    )
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps, {
    logout
}) (Sidebar)