import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";

import Error404 from "containers/errors/Error404";
import Home from "containers/pages/Home";
import About from "containers/pages/About";
import Services from "containers/pages/Services";
import Portfolio from "containers/pages/Portfolio";
import Blog from "containers/pages/Blog";
import Contact from "containers/pages/Contact";

import { AnimatePresence } from "framer-motion";
import PostByCategory from "containers/pages/blog/PostByCategory";
import Search from "containers/pages/blog/Search";
import PostDetail from "containers/pages/blog/PostDetail";
import Dashboard from "containers/pages/admin/Dashboard";
import Login from "containers/pages/auth/Login";
import ResetPassword from "containers/pages/auth/ResetPassword";
import ResetPasswordConfirm from "containers/pages/auth/ResetPasswordConfirm";
import AuthorPostList from "containers/pages/admin/AuthorPostList";
import EditPost from "containers/pages/admin/EditPost";
import ProjectDetail from "containers/pages/portfolio/ProjectDetail";
import AuthorProjectList from "containers/pages/admin/AuthorProjectList";
import EditProject from "containers/pages/admin/EditProject";
import CreatePostPage from "containers/pages/admin/CreatePostPage";
import CreateProjectPage from "containers/pages/admin/CreateProjectPage";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        {/* Error Display */}
        <Route path="*" element={<Error404 />} />
        {/* Redirect to home */}
        <Route path="/" element={<Navigate to="/home" />} />
        {/* Home Display */}
        <Route path="/home" element={<Home />} />
        {/* About Display */}
        <Route path="/about" element={<About />} />
        {/* About Display */}
        <Route path="/services" element={<Services />} />
        {/* Portfolio Display */}
        <Route path="/portfolio" element={<Portfolio />} />
        {/* Project Display */}
        <Route path="/portfolio/:slug" element={<ProjectDetail />} />
        {/* Blog Display */}
        <Route path="/blog" element={<Blog />} />
        {/* Post Display */}
        <Route path="/blog/:slug" element={<PostDetail />} />
        {/* Search Display */}
        <Route path="/search/:term" element={<Search />} />
        {/* Category Display */}
        <Route path="/category/:slug" element={<PostByCategory />} />
        {/* Contact Display */}
        <Route path="/contact" element={<Contact />} />

        {/* Login Display */}
        <Route path="/login" element={<Login />} />
        {/* ResetPassword Display */}
        <Route path="/reset_password" element={<ResetPassword />} />
        {/* ResetPasswordConfirm Display */}
        <Route
          path="/password/reset/confirm/:uid/:token"
          element={<ResetPasswordConfirm />}
        />
        {/* Dashboard Display */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Author Blog Display */}
        <Route path="/author_blog" element={<AuthorPostList />} />
        {/* Crear Post Display */}
        <Route path="/create_post" element={<CreatePostPage />} />
        {/* Author Blog Display */}
        <Route path="/author_blog/:slug" element={<EditPost />} />

        {/* Author Portfolio Display */}
        <Route path="/author_portfolio" element={<AuthorProjectList />} />
        {/* Crear proyecto Display */}
        <Route path="/create_project" element={<CreateProjectPage />} />
        {/* Author Portfolio Display */}
        <Route path="/author_portfolio/:slug" element={<EditProject />} />
      </Routes>
    </AnimatePresence>
  );
}
export default AnimatedRoutes;
