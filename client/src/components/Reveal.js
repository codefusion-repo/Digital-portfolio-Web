import React from 'react';
import ScrollReveal from 'scrollreveal'

function Reveal(){

    return (
        React.useEffect(() => {
            ScrollReveal({ 
                reset: false,
                distance: '80px',
                duration: 2000,
                delay: 200
            });
        
            ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
            ScrollReveal().reveal('.home-img, .services-container, .portfolio-box, .contact form', { origin: 'bottom' });
            ScrollReveal().reveal('.home-content h1, .about-img', { origin: 'left' });
            ScrollReveal().reveal('.home-content p, .about-content', { origin: 'right' });
        })
    )

}

export default Reveal