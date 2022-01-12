import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

// import Custom Components
import Header from './common/header/header';
import Footer from './common/footer';

import MobileMenu from './common/mobile-menu';

function App( props ) {
    const [ container, setContainer ] = useState( "container" );
    const [ prevPath, setPrevPath ] = useState( '' );

   


    useEffect( () => {
        setTimeout( () => {
            document.querySelector( 'body' ).classList.add( "loaded" );
            document.querySelector( "#root" ).classList.add( "loaded" );
        }, 200 );
    } )

    return (
        <div>
            <div className="page-wrapper">               
                <Header container={ container } urls={ prevPath } />



                {
                    props.children
                }

                 <Footer container={ container } /> 

                <ToastContainer autoClose={ 3000 } className="toast-container" />
            </div>

            <MobileMenu />

        </div>
    );
}

export default App;

