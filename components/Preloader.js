import React from 'react';


export default function Preloader() {

    return (
        <div className="rizanova-preloader">
            {/* <i className="fa fa-spinner rotating fa-3x text-black"></i> */}
            <div className="loader">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
        </div>
    );
}