import { BrowserRouter as Router } from "react-router-dom";
import store from './store';
import { Provider } from 'react-redux';

import { Helmet, HelmetProvider } from "react-helmet-async";
import AnimatedRoutes from "AnimatedRoutes";

function App() {

  return (
    <HelmetProvider>
      <Helmet>
        <title>Digital portfolio web</title>
        <meta name="description" content="Agencia de software. Servicio de diseño y desarrollo de videojuegos y paginas web."></meta>
        <meta name="keywords" content="firudev, software, developer, agencia de software, agencia de diseño, creación de pagina web, creación de videojuegos"></meta>
        <meta name="robots" content="all"></meta>
        <link rel="icon" href={`static/media/logo.png`} />
        <link rel="apple-touch-icon" href={`static/media/logo.png`} />
        <link rel="canonical" href="https://www.FiruDev.com"></link>
        <meta name="author" content="FiruDev"></meta>
        <meta name="publisher" content="FiruDev"></meta>

        <meta property="og:title" content='Firu Dev | Software Development' />
        <meta property="og:description" content='Agencia de software. Servicio de diseño y desarrollo de videojuegos y paginas web.' />
        <meta property="og:url" content="https://www.FiruDev.com" />
        <meta property="og:image" content={`static/media/logo.png`} />

        <meta name="twitter:title" content='Firu Dev | Software Development' />
        <meta
            name="twitter:description"
            content='Agencia de software. Servicio de diseño y desarrollo de videojuegos y paginas web.'
        />
        <meta name="twitter:image" content={`static/media/logo.png`} />
        <meta name="twitter:card" content="summary_large_image" />
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
