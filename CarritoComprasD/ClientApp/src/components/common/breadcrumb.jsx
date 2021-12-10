import React from 'react';
import { Link } from 'react-router-dom';


function Breadcrumb( props ) {
    const { title,  adClass, container = "container", ...parent } = props;
    let path = [];
    let x

    for ( x in parent ) {
        if ( 'function' !== typeof parent[ x ] )
            path.push( parent[ x ] );
    }

    
    return (
        <nav aria-label="breadcrumb" className={ `breadcrumb-nav ${adClass}` }>
 
                <div className={ container }>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to={ `${process.env.PUBLIC_URL}` }>Inicio</Link></li>
                        { path.map( item => (
                            <li className="breadcrumb-item" key={ item[ 0 ] }>
                                <Link to={ `${process.env.PUBLIC_URL}/${item[ 1 ]}` }>{ item[ 0 ] }</Link>
                            </li>
                        ) ) }
                        <li className="breadcrumb-item active" aria-current="page">{ title }</li>
                    </ol>
                </div>
        </nav>
    );
}


export default  Breadcrumb ;