import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Helmet } from 'react-helmet';

// import Custom Components
import OwlCarousel from '../features/owl-carousel';
import IntroSlider from './intro_slider';
import { introSlider } from '../settings';
import style from './style.scss';

import { marcaActions } from '@actions';
import { connect } from 'react-redux';



function HomePage( props ) {
    const {getAllMarcasWithPathImgAndActive , selectedMarca , removeSelectedMarca} = props
    const [marcas,setMarcas] = useState([]) 
    

   

    const data =  
    [
        {
            "image": "assets/images/home/sliders/slide-8.jpg"
            
        },
        {
            "image": "assets/images/home/sliders/slide-2.jpg"
        },
        {
            "image": "assets/images/home/sliders/slide-7.jpg"
        },
       
        {
            "image": "assets/images/home/sliders/slide-9.jpg"
        },
        {
            "image": "assets/images/home/sliders/slide-10.jpg"
        },
       
        {
            "image": "assets/images/home/sliders/slide-11.jpg"
        }
    ]



    
    
    useEffect( () => {
        document.getElementById( "menu-home" ).classList.add( "active" );
  
        
        style.use();
        
        removeSelectedMarca();

        return ( () => {
            document.getElementById( "menu-home" ).classList.remove( "active" );
            style.unuse();
           
        } )
    }, [] )
    
   
    

    useEffect(() => {
        async function funcionAsync() {
            await getAllMarcasWithPathImgAndActive().then(x => setMarcas(x))
        }
        funcionAsync();
      }, []);


    function onLinkClick(_marca) {
        selectedMarca(_marca);
    }


    return (
        <div>
          

            <Helmet>
                <title>Encendido Alsina</title>
            </Helmet>

            <h1 className="d-none">Encendido Alsina</h1>

            <div className="main">
                <div className="intro-slider-container">
                    <OwlCarousel adClass="intro-slider owl-simple owl-nav-inside" data-toggle="owl" carouselOptions={ introSlider } >
                        { data.map( ( slider, index ) =>
                            <IntroSlider slider={ slider } key={ `introSlider_${index}` }  />
                        ) }
                    </OwlCarousel>

                    <span className="slider-loader"></span>
                </div>

                <div className="mb-4"></div>

                <div className="container">
                    <h2 className="title text-center mb-2">Marcas</h2>

                    <div className="cat-blocks-container">
                        <div className="row">
                            { marcas.map( ( _marca, index ) =>  

                           
                                <div className="col-6 col-sm-4 col-lg-2" key={ `popular_${index}` } >
                                    <div className="cat-block">
                                        <div className="position-relative">
                                            <div className="lazy-overlay bg-3"></div>

                                            
                                            <Link  
                                                to={{pathname: `${process.env.PUBLIC_URL}/catalogo/list`}}
                                                onClick={() => onLinkClick(_marca)}
                                            >
                                                {/*     
                                                    _marca.label -> hace referencia al texto que hay dentro de tabla (marca) columna (pathImg)
                                                    esta puesto asi porque getAllMarcasWithPathImgAndActive devuelve un objeto creado por mi:
                                                    que contiene    {
                                                                        label -> texto que hay en tabla (marca) columna (pathImg) , 
                                                                        campo -> de que campo de tabla (marca) sale el texto? de pathImg
                                                                    }
                                                */}
                                                <LazyLoadImage
                                                    src={ `${process.env.PUBLIC_URL}/assets/images/home/cats/${_marca.label}.jpg` + '?' + Date.now() }
                                                    alt="marca"
                                                    width={ 100 }
                                                    height={ 100 }
                                                    effect="blur"
                                                />
                                            </Link>
                                        </div>
                                      
                                    </div>
                                </div>
                            
                            ) }
                        </div>
                    </div>
                </div>

               
              
              
            </div>


        </div>
    )
}



const actionCreators = {
    getAllMarcasWithPathImgAndActive: marcaActions.getAllWithPathImgAndActive,
    selectedMarca: marcaActions.selectedMarca,
    removeSelectedMarca: marcaActions.removeSelectedMarca
  }
  
  export default connect(null, actionCreators)(HomePage);