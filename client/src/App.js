import { BrowserRouter as Router } from "react-router-dom";
import store from "./store";
import { Provider } from "react-redux";

import { Helmet, HelmetProvider } from "react-helmet-async";
import AnimatedRoutes from "AnimatedRoutes";

import icon from "assets/favicon-32x32.png";
import apple from "assets/apple-touch-icon.png";

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Digital portfolio web</title>
        <meta name="description" content=""></meta>
        <meta name="keywords" content=""></meta>
        <meta name="robots" content="all"></meta>
        <link rel="canonical" href=""></link>
        <meta name="author" content=""></meta>
        <meta name="publisher" content=""></meta>

        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
        <meta property="og:url" content="" />
        <meta property="og:image" content="" />

        <meta name="twitter:title" content="" />
        <meta name="twitter:description" content="" />
        <meta name="twitter:image" content="" />
        <meta name="twitter:card" content="summary_large_image" />

        <link rel="icon" href={icon} />
        <link rel="apple-touch-icon" href={apple} />
      </Helmet>
      <Provider store={store}>
        <Router>
          <AnimatedRoutes />
        </Router>
      </Provider>
    </HelmetProvider>
  );
}

export default App;
