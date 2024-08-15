import { connect } from 'react-redux';
import { motion } from "framer-motion";
import { useEffect } from 'react';
import { check_authenticated, load_user, refresh } from 'redux/actions/auth/auth';
import Modal from "components/Modal";

function AdminLayout({
    children,
    check_authenticated,
    refresh,
    load_user,
    user_loading,
    isAuthenticated,
    user,
}){
    
    useEffect(() =>{ 
        isAuthenticated ? 
        <>
        </>
        :
        <>
            {check_authenticated()}
            {refresh()}
            {load_user()}
            
        </>
    }, [isAuthenticated, check_authenticated, refresh, load_user]);

    return (

        <motion.div
            initial={{opacity: 0, transition: {duration: 0.1}}}
            animate={{opacity: 1}}
            exit={{opacity: 0, transition: {duration: 0.1}}}>
            <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
            
            {
                isAuthenticated&&isAuthenticated ?
                <>{children}</>
                :
                <section>
                    <h3>No Autenticado.</h3>
                </section>
            }
            

            <Modal />
        </motion.div>
        
    )
}

const mapStateToProps = state => ({
    user_loading: state.auth.user_loading,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
})

export default connect(mapStateToProps, {
    check_authenticated,
    refresh,
    load_user,
}) (AdminLayout)