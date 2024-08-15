import Sidebar from "components/navigation/Sidebar";
import AdminLayout from "hocs/layouts/AdminLayout";

import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import CreatePost from "./CreatePost";
import CreateProject from "./CreateProject";

function Dashboard({
    isAuthenticated
}) {
    return (
        <AdminLayout>
        <div className="admin-container">
        <Helmet>
        <title>Firu Dev | Dashboard</title>
        </Helmet>
            <Sidebar />

            <section className="dashboard-box">
                <div>
                    <CreatePost />
                </div>
                <div>
                    <CreateProject />
                </div>
            </section>
        </div>
        </AdminLayout>
    )
}
const mapStateToProps=state=>({
    isAuthenticated: state.auth.isAuthenticated
})
export default connect(mapStateToProps, {
}) (Dashboard)