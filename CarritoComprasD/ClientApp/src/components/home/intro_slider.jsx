import React from 'react';


export default function Slider( props ) {
    const { slider } = props;
    let image = process.env.PUBLIC_URL + '/' + slider.image;

    return (
        <div className="intro-slide" style={{ backgroundImage: `url(${image})`, backgroundSize: '100% 100%'}  } key={ slider.image }>
            <div className="container intro-content">
                <div className="row">
                    <div className="col-auto offset-lg-3 intro-col">

                    </div>
                </div>
            </div>
        </div>
    )
}